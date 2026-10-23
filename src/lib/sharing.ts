import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  writeBatch,
  arrayUnion,
} from "firebase/firestore";
import { db } from "./firebaseClient";

// Documentos públicos contêm apenas os dados necessários ao destinatário.
// O identificador opaco no link funciona como uma chave de compartilhamento.
export function quoteView(data: Record<string, any>) {
  return {
    clientName: data.clientName || "",
    clientCompany: data.clientCompany || "",
    service: data.service || "",
    items: data.items || [],
    value: data.value || 0,
    deadlineDays: data.deadlineDays || 0,
    paymentTerms: data.paymentTerms || "",
    notes: data.notes || "",
    clientSlug: data.clientSlug || "",
    status: data.status || "pendente",
  };
}
export function contractView(data: Record<string, any>) {
  return {
    ...quoteView(data),
    clientDocument: data.clientDocument || "",
    clientAddress: data.clientAddress || "",
    status: data.status || "pendente",
  };
}
export async function publicStatus(
  kind: "quotes" | "contracts",
  data: Record<string, any>,
) {
  if (!data.slug) return data.status || "pendente";
  const snap = await getDoc(
    doc(db, kind === "quotes" ? "publicQuotes" : "publicContracts", data.slug),
  );
  return snap.exists() ? snap.data().status : data.status || "pendente";
}
function sharedDocument(kind: "quotes" | "contracts", data: Record<string, any>) {
  return { kind, slug: data.slug, service: data.service || "Projeto" };
}
export async function publishClient(clientId: string) {
  const client = await getDoc(doc(db, "clients", clientId));
  if (!client.exists() || !client.data().slug) return;
  const [projects, quotes, contracts] = await Promise.all(
    ["projects", "quotes", "contracts"].map(kind => getDocs(
      query(collection(db, kind), where("clientId", "==", clientId)),
    )),
  );
  const c = client.data();
  await setDoc(doc(db, "publicClients", c.slug), {
    name: c.name,
    company: c.company || "",
    documents: [
      ...quotes.docs.filter(d => d.data().slug).map(d => sharedDocument("quotes", d.data())),
      ...contracts.docs.filter(d => d.data().slug).map(d => sharedDocument("contracts", d.data())),
    ],
    projects: projects.docs
      .filter((p) => p.data().clientId === clientId)
      .map((p) => ({
        name: p.data().name,
        status: p.data().status,
        deadline: p.data().deadline || "",
      })),
  });
}
export async function publishAllLinks() {
  const clients = await getDocs(collection(db, "clients"));
  for (const client of clients.docs) await publishClient(client.id);
  for (const kind of ["quotes", "contracts"] as const) {
    const docs = await getDocs(collection(db, kind));
    for (const item of docs.docs) {
      const data = item.data();
      if (!data.slug) continue;
      const ref = doc(
        db,
        kind === "quotes" ? "publicQuotes" : "publicContracts",
        data.slug,
      );
      const existing = await getDoc(ref);
      // Re-publicar nunca apaga uma decisão já registrada pelo cliente.
      if (!existing.exists())
        await setDoc(
          ref,
          kind === "quotes" ? quoteView(data) : contractView(data),
        );
    }
  }
}
export async function createShared(
  kind: "quotes" | "contracts",
  data: Record<string, any>,
) {
  const client = await getDoc(doc(db, "clients", data.clientId));
  if (!client.exists() || !client.data().slug) throw new Error("Cliente sem área pública. Prepare os links no dashboard.");
  data = { ...data, clientSlug: client.data().slug };
  const privateRef = doc(collection(db, kind));
  const batch = writeBatch(db);
  batch.set(privateRef, data);
  batch.set(
    doc(db, kind === "quotes" ? "publicQuotes" : "publicContracts", data.slug),
    kind === "quotes" ? quoteView(data) : contractView(data),
  );
  batch.set(doc(db, "publicClients", client.data().slug), {
    name: client.data().name,
    company: client.data().company || "",
    documents: arrayUnion(sharedDocument(kind, data)),
  }, { merge: true });
  await batch.commit();
}

export async function createClient(data: Record<string, any>) {
  const ref = doc(collection(db, "clients"));
  const batch = writeBatch(db);
  batch.set(ref, data);
  batch.set(doc(db, "publicClients", data.slug), {
    name: data.name,
    company: data.company || "",
    documents: [],
    projects: [],
  });
  await batch.commit();
  return ref;
}
