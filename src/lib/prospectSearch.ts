import { safeDemoUrl, validCommercialPhone } from "./prospects.js";

export const BRAZIL_UFS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
export type SearchQuery = { niche: string; city: string; uf?: string; limit: number };
export type SourceAttribution = { text: string; url: string };
export type SearchLead = {
  provider: string; externalId: string; company: string; contactName: string;
  phone: string; email: string; sources: string[]; website: string;
  siteSituation: string; evidenceNote: string; address: string; city: string; niche: string;
  attribution?: SourceAttribution;
  sourcePhone?: string;
};
export type SearchResponse = {
  provider: string; isTestData: boolean; results: SearchLead[]; attribution?: SourceAttribution; message?: string;
  outcome?: "completed" | "municipality-not-found";
  diagnostics?: { municipalityMs: number; leadsMs: number; totalMs: number; municipalityCached: boolean };
};
type RawResult = Partial<SearchLead> & { websiteChecked?: boolean };

export function validateSearchQuery(input: unknown): SearchQuery {
  if (!input || typeof input !== "object") throw new Error("Informe nicho, cidade e limite.");
  const { niche, city, uf, limit } = input as Partial<SearchQuery>;
  if (typeof niche !== "string" || !niche.trim() || niche.length > 100) throw new Error("Informe um nicho de até 100 caracteres.");
  if (typeof city !== "string" || !city.trim() || city.length > 100) throw new Error("Informe uma cidade de até 100 caracteres.");
  if (typeof limit !== "number" || !Number.isInteger(limit) || limit < 1 || limit > 20) throw new Error("O limite deve ser um inteiro entre 1 e 20.");
  if (uf !== undefined && (typeof uf !== "string" || !BRAZIL_UFS.includes(uf.trim().toUpperCase()))) throw new Error("Informe uma UF válida.");
  return { niche: niche.trim(), city: city.trim(), limit, ...(uf ? { uf: uf.trim().toUpperCase() } : {}) };
}

export function searchCityLabel(query: SearchQuery): string {
  return query.uf && !/,\s*[A-Za-z]{2}$/.test(query.city) ? `${query.city}, ${query.uf}` : query.city;
}

function text(value: unknown) { return typeof value === "string" ? value.trim() : ""; }
export function normalizeSearchResult(raw: RawResult): SearchLead {
  const sources = Array.isArray(raw.sources) ? [...new Set(raw.sources.map(value => typeof value === "string" ? safeDemoUrl(value) : "").filter(Boolean))] : [];
  const website = safeDemoUrl(text(raw.website));
  const social = website && /(^|\.)(instagram\.com|facebook\.com|fb\.com|wa\.me|whatsapp\.com|linktr\.ee|tiktok\.com)$/i.test(new URL(website).hostname);
  const officialWebsite = website && !social ? website : "";
  if (website && !sources.includes(website)) sources.push(website);
  const enoughEvidence = Boolean(text(raw.company) && sources.length);
  const siteSituation = enoughEvidence && officialWebsite ? "Site existente" : enoughEvidence && raw.websiteChecked === true ? "Site não localizado" : "Não verificado";
  const phone = text(raw.phone);
  return {
    provider: text(raw.provider), externalId: text(raw.externalId), company: text(raw.company),
    contactName: text(raw.contactName), phone: validCommercialPhone(phone) ? phone.replace(/\D/g, "") : "",
    email: text(raw.email), sources, website: officialWebsite, siteSituation,
    evidenceNote: siteSituation === "Site não localizado" ? "A fonte consultada não retornou site oficial. Isso não comprova que a empresa não tenha site."
      : siteSituation === "Não verificado" ? "Dados insuficientes para avaliar o site." : "Site informado pela fonte; funcionamento e qualidade não avaliados.",
    address: text(raw.address), city: text(raw.city), niche: text(raw.niche),
  };
}

type IdentityInput = { company: string; city?: string; phone?: string; sources?: string[]; provider?: string; externalId?: string; identityKeys?: string[] };
function normalized(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
export function prospectIdentityKeys(lead: IdentityInput): string[] {
  const keys = [...(lead.identityKeys || [])];
  if (lead.provider && lead.externalId) keys.push(`source:${lead.provider}:${lead.externalId}`);
  const phone = (lead.phone || "").replace(/\D/g, "");
  if (validCommercialPhone(phone)) keys.push(`phone:${phone.length <= 11 ? `55${phone}` : phone}`);
  if (normalized(lead.company)) keys.push(`business:${normalized(lead.company)}|${normalized(lead.city || "")}`);
  for (const source of lead.sources || []) {
    const url = safeDemoUrl(source);
    // Fontes genéricas compartilhadas não identificam uma empresa.
    if (url && (new URL(url).search || new URL(url).pathname !== "/")) keys.push(`url:${url.replace(/\/$/, "")}`);
  }
  return [...new Set(keys)];
}

export function isProspectDuplicate(a: IdentityInput, b: IdentityInput): boolean {
  const keys = new Set(prospectIdentityKeys(a));
  if (prospectIdentityKeys(b).some(key => keys.has(key))) return true;
  if (!normalized(a.company) || normalized(a.company) !== normalized(b.company)) return false;
  // Fontes antigas podem não ter UF. Não duplicar um cadastro só por essa ausência.
  const municipality = (value: string | undefined) => {
    const match = (value || "").match(/^(.*?),\s*([A-Za-z]{2})$/);
    return { name: normalized(match?.[1] || value || ""), uf: match?.[2].toUpperCase() || "" };
  };
  const first = municipality(a.city);
  const second = municipality(b.city);
  return !first.name || !second.name || (first.name === second.name && (!first.uf || !second.uf || first.uf === second.uf));
}
