import { normalizeSearchResult, searchCityLabel, validateSearchQuery, type SearchResponse } from "../src/lib/prospectSearch.js";
import { searchOpenStreetMap } from "./openstreetmap.js";
import { SearchError } from "./searchError.js";
export { SearchError } from "./searchError.js";

export type SearchEnvironment = Record<string, string | undefined>;
type Place = { id?: string; displayName?: { text?: string }; internationalPhoneNumber?: string; nationalPhoneNumber?: string; websiteUri?: string; googleMapsUri?: string; formattedAddress?: string };

export async function searchProspects(input: unknown, env: SearchEnvironment, fetcher: typeof fetch = fetch): Promise<SearchResponse> {
  const query = validateSearchQuery(input);
  const city = searchCityLabel(query);
  const provider = env.PROSPECT_SEARCH_PROVIDER || "google-places";
  if (provider === "openstreetmap") return searchOpenStreetMap(query, fetcher);
  if (provider === "fixture") {
    const results = [
      { externalId: "example-a", company: "Empresa Exemplo A — TESTE", phone: "62999990001", website: "https://example.com/demo-a", websiteChecked: true },
      { externalId: "example-b", company: "Empresa Exemplo B — TESTE", phone: "62999990002", websiteChecked: true },
      { externalId: "example-c", company: "Empresa Exemplo C — TESTE", websiteChecked: false },
    ].slice(0, query.limit).map((item, index) => normalizeSearchResult({
      ...item, externalId: `${city.toLowerCase()}:${item.externalId}`, provider,
      sources: [`https://example.com/pesquisa-teste/${encodeURIComponent(city)}/${index + 1}`], city, niche: query.niche,
    }));
    return { provider, isTestData: true, results };
  }
  if (provider !== "google-places") throw new SearchError(503, "Fonte desconhecida. Configure PROSPECT_SEARCH_PROVIDER como openstreetmap, google-places ou fixture.");
  if (!env.GOOGLE_PLACES_API_KEY) throw new SearchError(503, "Configure GOOGLE_PLACES_API_KEY no servidor local para usar a fonte Google Places. Nenhuma busca real foi executada.");
  let response: Response;
  try {
    response = await fetcher("https://places.googleapis.com/v1/places:searchText", {
      method: "POST", signal: AbortSignal.timeout(15000),
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.internationalPhoneNumber,places.nationalPhoneNumber,places.websiteUri,places.googleMapsUri" },
      body: JSON.stringify({ textQuery: `${query.niche} em ${city}, Brasil`, pageSize: query.limit, languageCode: "pt-BR", regionCode: "BR" }),
    });
  } catch { throw new SearchError(502, "Não foi possível consultar a fonte. Tente novamente mais tarde."); }
  if (!response.ok) throw new SearchError(502, `A fonte Google Places recusou a consulta (HTTP ${response.status}). Confira a chave, a API habilitada e a cota no servidor.`);
  const data = await response.json() as { places?: Place[] };
  if (data.places !== undefined && !Array.isArray(data.places)) throw new SearchError(502, "A fonte retornou um formato inesperado.");
  const results = (data.places || []).slice(0, query.limit).filter(item => item.id && item.displayName?.text).map(item => normalizeSearchResult({
    provider, externalId: item.id, company: item.displayName?.text, phone: item.internationalPhoneNumber || item.nationalPhoneNumber,
    website: item.websiteUri, sources: item.googleMapsUri ? [item.googleMapsUri] : [], websiteChecked: true,
    address: item.formattedAddress, city, niche: query.niche,
  }));
  return { provider, isTestData: false, results };
}
