import { BRAZIL_UFS, normalizeSearchResult, type SearchQuery, type SearchResponse } from "../src/lib/prospectSearch.js";
import { validCommercialPhone } from "../src/lib/prospects.js";
import { SearchError } from "./searchError.js";

const ATTRIBUTION = { text: "© OpenStreetMap contributors", url: "https://www.openstreetmap.org/copyright" };
type OsmElement = { type?: string; id?: number; tags?: Record<string, string> };
type OsmResponse = { elements: OsmElement[]; remark?: string };
type Stage = "municipality" | "leads";
const municipalityCaches = new WeakMap<typeof fetch, Map<string, { id: number; expires: number }>>();

function location(query: SearchQuery) {
  const combined = query.city.match(/^(.*?),\s*([A-Za-z]{2})$/);
  const city = (combined?.[1] || query.city).trim();
  const uf = (query.uf || combined?.[2] || "").toUpperCase();
  if (!city || !BRAZIL_UFS.includes(uf) || (combined && query.uf && combined[2].toUpperCase() !== uf)) {
    throw new SearchError(400, "Informe cidade e UF válidas, por exemplo Luziânia, GO, ou preencha o campo UF.");
  }
  return { city, uf };
}

export function buildMunicipalityQuery(query: SearchQuery) {
  if (!/^barbearias?$/i.test(query.niche.trim())) throw new SearchError(400, "O piloto OpenStreetMap suporta o nicho barbearias.");
  const place = location(query);
  const cityPattern = "^" + place.city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$";
  return [
    "[out:json][timeout:8][maxsize:16777216];",
    'rel["boundary"="administrative"]["admin_level"="8"]["name"~' + JSON.stringify(cityPattern) + ',i]->.named;',
    'area["ISO3166-2"="BR-' + place.uf + '"]["admin_level"="4"]->.state;',
    'rel.named(area.state)->.municipality;', '.municipality out tags;',
  ].join("\n");
}

export function buildOverpassQuery(query: SearchQuery, municipalityId?: number) {
  const municipalityQuery = buildMunicipalityQuery(query);
  if (municipalityId !== undefined && (!Number.isSafeInteger(municipalityId) || municipalityId <= 0 || !Number.isSafeInteger(3600000000 + municipalityId))) throw new SearchError(502, "Identificador municipal inválido na fonte.");
  return [
    municipalityId === undefined ? municipalityQuery + '\n.municipality map_to_area->.city;' : '[out:json][timeout:12][maxsize:16777216];\narea(' + (3600000000 + municipalityId) + ')->.city;',
    'nwr(area.city)["shop"="hairdresser"]["name"]->.hairdressers;',
    '(',
    'nwr.hairdressers["hairdresser"="barber"];',
    'nwr.hairdressers["male"="yes"]["female"!="yes"];',
    'nwr.hairdressers["name"~"barbear|barber|barbeiro",i];',
    'nwr(area.city)["shop"="barber"]["name"];',
    ');', 'out tags ' + query.limit + ';',
  ].join("\n");
}

async function requestOverpass(query: string, stage: Stage, fetcher: typeof fetch): Promise<OsmResponse> {
  const started = performance.now();
  const label = stage === "municipality" ? "localizar o município" : "buscar barbearias no município";
  const fail = (status: number, message: string, cause: string, httpStatus?: number) => new SearchError(status, message + " Busca não concluída; isso não significa zero resultados.", {
    stage, cause, elapsedMs: Math.round(performance.now() - started), ...(httpStatus ? { sourceHttpStatus: httpStatus } : {}),
  });
  try {
    const response = await fetcher("https://overpass-api.de/api/interpreter", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json", "User-Agent": "PedroDEV-local-pilot/1.0" },
      // A fila pública pode consumir 15s antes de iniciar os 8s/12s de execução.
      body: new URLSearchParams({ data: query }).toString(), signal: AbortSignal.timeout(stage === "municipality" ? 28000 : 32000),
    });
    if ([408, 504].includes(response.status)) throw fail(504, "O Overpass excedeu o tempo da fonte ao " + label + ".", "source-timeout", response.status);
    if (!response.ok) throw fail(503, "O serviço Overpass/OpenStreetMap está indisponível ou ocupado ao " + label + " (HTTP " + response.status + "). Tente novamente mais tarde.", "source-unavailable", response.status);
    const data = await response.json() as OsmResponse;
    if (!data || !Array.isArray(data.elements)) throw fail(502, "A fonte retornou uma resposta inválida ou inesperada ao " + label + ".", "invalid-response");
    if (data.remark) {
      if (/timed?\s*out|timeout/i.test(data.remark)) throw fail(504, "O Overpass excedeu o tempo da fonte ao " + label + "; resultados parciais descartados.", "source-timeout");
      throw fail(503, "A fonte não concluiu a consulta ao " + label + "; resultados parciais descartados.", "partial-response");
    }
    return data;
  } catch (error) {
    if (error instanceof SearchError) throw error;
    if (error instanceof Error && ["TimeoutError", "AbortError"].includes(error.name)) throw fail(504, "O tempo de espera local foi excedido ao " + label + ". Tente novamente mais tarde.", "local-timeout");
    if (error instanceof SyntaxError) throw fail(502, "A fonte retornou uma resposta inválida ao " + label + ".", "invalid-response");
    throw fail(503, "O serviço Overpass/OpenStreetMap está indisponível ao " + label + ". Confira a conexão e tente novamente mais tarde.", "connection-failure");
  }
}

function registeredWebsite(value: string | undefined) {
  const raw = (value || "").trim();
  if (!raw) return "";
  // OSM por vezes registra o domínio sem protocolo. Não converter esquemas inseguros.
  return /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : "https://" + raw;
}

export async function searchOpenStreetMap(query: SearchQuery, fetcher: typeof fetch): Promise<SearchResponse> {
  const started = performance.now();
  const municipalityQuery = buildMunicipalityQuery(query);
  const place = location(query);
  const diagnostics = { municipalityMs: 0, leadsMs: 0, totalMs: 0, municipalityCached: false };
  let cache = municipalityCaches.get(fetcher);
  if (!cache) { cache = new Map(); municipalityCaches.set(fetcher, cache); }
  const key = place.city.normalize("NFC").toLocaleLowerCase("pt-BR") + "|" + place.uf;
  const cached = cache.get(key);
  let municipalityId = cached && cached.expires > Date.now() ? cached.id : undefined;
  let data: OsmResponse;
  try {
    if (municipalityId === undefined) {
      const before = performance.now();
      const municipality = await requestOverpass(municipalityQuery, "municipality", fetcher);
      diagnostics.municipalityMs = Math.round(performance.now() - before);
      municipalityId = municipality.elements.find(item => item?.type === "relation" && Number.isSafeInteger(item.id) && item.id! > 0 && item.tags?.boundary === "administrative" && item.tags?.admin_level === "8")?.id;
      if (municipalityId === undefined) return {
        provider: "openstreetmap", isTestData: false, attribution: ATTRIBUTION, results: [], outcome: "municipality-not-found",
        diagnostics: { ...diagnostics, totalMs: Math.round(performance.now() - started) },
        message: "O município não foi localizado na UF informada no OpenStreetMap. Confira o nome oficial da cidade e a UF; a busca de empresas não foi executada.",
      };
      if (cache.size >= 100) cache.delete(cache.keys().next().value!);
      cache.set(key, { id: municipalityId, expires: Date.now() + 30 * 60 * 1000 });
    } else diagnostics.municipalityCached = true;
    const before = performance.now();
    data = await requestOverpass(buildOverpassQuery(query, municipalityId), "leads", fetcher);
    diagnostics.leadsMs = Math.round(performance.now() - before);
  } catch (error) {
    if (error instanceof SearchError && error.details) {
      const failedMs = typeof error.details.elapsedMs === "number" ? error.details.elapsedMs : 0;
      if (error.details.stage === "municipality") diagnostics.municipalityMs = failedMs;
      else diagnostics.leadsMs = failedMs;
      error.details = { ...diagnostics, ...error.details, totalMs: Math.round(performance.now() - started) };
    }
    throw error;
  }
  const seen = new Set<string>();
  const results = data.elements.filter(item => {
    const tags = item.tags;
    if (!tags || !["node", "way", "relation"].includes(item.type || "") || !Number.isSafeInteger(item.id) || !tags.name?.trim()) return false;
    const barber = tags.shop === "barber" || (tags.shop === "hairdresser" && (tags.hairdresser === "barber" || (tags.male === "yes" && tags.female !== "yes") || /barbear|barber|barbeiro/i.test(tags.name)));
    const id = item.type + "/" + item.id;
    if (!barber || seen.has(id)) return false;
    seen.add(id);
    return true;
  }).slice(0, query.limit).map(item => {
    const tags = item.tags!;
    const phones = [tags["contact:phone"], tags.phone, tags["contact:mobile"], tags.mobile].filter(Boolean).flatMap(value => value.split(";"));
    const result = normalizeSearchResult({
      provider: "openstreetmap", externalId: item.type + "/" + item.id, company: tags.name,
      phone: phones.find(validCommercialPhone), email: tags["contact:email"] || tags.email,
      website: registeredWebsite(tags["contact:website"] || tags.website), websiteChecked: false,
      sources: ["https://www.openstreetmap.org/" + item.type + "/" + item.id],
      address: [tags["addr:street"], tags["addr:housenumber"], tags["addr:suburb"]].filter(Boolean).join(", "),
      city: place.city + ", " + place.uf, niche: "barbearias",
    });
    return { ...result, attribution: ATTRIBUTION, sourcePhone: phones[0]?.trim() || "" };
  });
  return {
    provider: "openstreetmap", isTestData: false, attribution: ATTRIBUTION, results, outcome: "completed",
    diagnostics: { ...diagnostics, totalMs: Math.round(performance.now() - started) },
    ...(results.length ? {} : { message: "Nenhuma barbearia com nome foi localizada no OpenStreetMap para este município. Busca concluída sem resultados na fonte; o cadastro pode estar incompleto." }),
  };
}
