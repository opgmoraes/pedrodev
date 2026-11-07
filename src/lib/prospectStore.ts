import { addDoc, collection, doc, getDocs, orderBy, query, runTransaction, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebaseClient";
import { confirmProspectContact, EMPTY_PROSPECT, prepareProspect, type Prospect, type ProspectForm } from "./prospects";
import { isProspectDuplicate, prospectIdentityKeys, type SearchLead } from "./prospectSearch";

export async function listProspects(): Promise<Prospect[]> {
  const snap = await getDocs(query(collection(db, "prospects"), orderBy("createdAt", "desc")));
  return snap.docs.map(item => ({ ...item.data(), id: item.id }) as Prospect);
}

export async function saveProspect(form: ProspectForm, existing?: Prospect): Promise<string> {
  const data = prepareProspect(form, existing?.status === "Contatado");
  if (existing) {
    await updateDoc(doc(db, "prospects", existing.id), { ...data, updatedAt: serverTimestamp() });
    return existing.id;
  }
  const ref = await addDoc(collection(db, "prospects"), {
    ...data, schemaVersion: 1, origin: "manual", createdAt: serverTimestamp(), updatedAt: serverTimestamp(), contactedAt: null,
  });
  return ref.id;
}

export async function markProspectContacted(id: string, confirmed: boolean) {
  const patch = confirmProspectContact(confirmed, serverTimestamp());
  if (patch) await updateDoc(doc(db, "prospects", id), patch);
}

async function identityHash(key: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function importSearchProspects(candidates: SearchLead[]): Promise<{ imported: number; skipped: number }> {
  if (!candidates.length || candidates.length > 20) throw new Error("Selecione entre 1 e 20 resultados.");
  // Valida todo o lote antes de gravar; não há importação parcial de dados inválidos.
  const plans = await Promise.all(candidates.map(async lead => {
    if (!lead.provider || !lead.externalId || !lead.city || !lead.sources.length) throw new Error("Resultado sem identidade, cidade ou fonte. Faça a busca novamente.");
    const data = prepareProspect({ ...EMPTY_PROSPECT, company: lead.company, contactName: lead.contactName,
      phone: lead.phone, email: lead.email, sources: lead.sources.join("\n"), siteSituation: lead.siteSituation,
      diagnosis: `Situação na revisão: ${lead.siteSituation}.\nObservação original da fonte: ${lead.evidenceNote}`,
    });
    const keys = prospectIdentityKeys(lead);
    const hashes = await Promise.all(keys.map(identityHash));
    return { lead, data, keys, hashes, id: `search_${hashes[0]}` };
  }));
  // Inclui cadastros legados sem createdAt, que uma consulta ordenada omitiria.
  const existingSnapshot = await getDocs(collection(db, "prospects"));
  const existing = existingSnapshot.docs.map(item => ({ ...item.data(), id: item.id }) as Prospect);
  const keyIds = [...new Set(plans.flatMap(plan => plan.hashes))];
  return runTransaction(db, async transaction => {
    // Todas as leituras precedem as escritas. O índice serializa importações concorrentes.
    const keyDocs = await Promise.all(keyIds.map(id => transaction.get(doc(db, "prospectImportKeys", id))));
    const registry = new Map(keyDocs.map(item => [item.id, item.data()?.prospectId as string | undefined]));
    const targetIds = [...new Set([...plans.map(plan => plan.id), ...Array.from(registry.values()).filter((id): id is string => Boolean(id))])];
    const targetDocs = await Promise.all(targetIds.map(id => transaction.get(doc(db, "prospects", id))));
    const present = new Set(targetDocs.filter(item => item.exists()).map(item => item.id));
    const seen = [...existing];
    let imported = 0;
    let skipped = 0;
    for (const plan of plans) {
      const registeredId = plan.hashes.map(hash => registry.get(hash)).find(id => id && present.has(id));
      const duplicate = seen.find(item => isProspectDuplicate(plan.lead, item));
      const duplicateId = registeredId || duplicate?.id || (present.has(plan.id) ? plan.id : undefined);
      const id = duplicateId || plan.id;
      if (duplicateId) skipped++;
      else {
        transaction.set(doc(db, "prospects", id), {
          ...plan.data, city: plan.lead.city, niche: plan.lead.niche, address: plan.lead.address,
          website: plan.lead.website, provider: plan.lead.provider, externalId: plan.lead.externalId,
          searchEvidenceNote: plan.lead.evidenceNote,
          ...(plan.lead.attribution ? { sourceAttribution: plan.lead.attribution } : {}),
          ...(plan.lead.sourcePhone ? { sourcePhone: plan.lead.sourcePhone } : {}),
          identityKeys: plan.keys, schemaVersion: 1, origin: `search:${plan.lead.provider}`,
          createdAt: serverTimestamp(), updatedAt: serverTimestamp(), contactedAt: null,
        });
        seen.push({ ...plan.data, id, city: plan.lead.city, identityKeys: plan.keys, schemaVersion: 1, origin: `search:${plan.lead.provider}` });
        present.add(id);
        imported++;
      }
      for (const hash of plan.hashes) {
        const previous = registry.get(hash);
        if (!previous || !present.has(previous)) {
          transaction.set(doc(db, "prospectImportKeys", hash), { prospectId: id });
          registry.set(hash, id);
        }
      }
    }
    return { imported, skipped };
  });
}
