import { readFile } from "node:fs/promises";
import { after, before, test } from "node:test";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
let env;
before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-pedrodev",
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: await readFile("firestore.rules", "utf8"),
    },
  });
  await env.withSecurityRulesDisabled(async (c) => {
    const db = c.firestore();
    await Promise.all([
      setDoc(doc(db, "admins", "owner"), { name: "Administrador de teste" }),
      setDoc(doc(db, "clients", "private"), {
        name: "Cliente de teste",
        document: "privado",
      }),
      setDoc(doc(db, "publicClients", "client-token"), {
        name: "Cliente",
        projects: [],
      }),
      setDoc(doc(db, "publicQuotes", "quote-token"), {
        service: "Site",
        value: 797,
        status: "pendente",
      }),
      setDoc(doc(db, "publicContracts", "contract-token"), {
        service: "Site",
        value: 797,
        status: "pendente",
      }),
    ]);
  });
});
after(async () => {
  await env?.cleanup();
});
test("visitante não acessa clientes privados nem lista links", async () => {
  const db = env.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(db, "clients", "private")));
  await assertFails(getDocs(collection(db, "publicClients")));
  await assertFails(getDocs(collection(db, "publicQuotes")));
  await assertFails(getDocs(collection(db, "publicContracts")));
  await assertSucceeds(getDoc(doc(db, "publicClients", "client-token")));
});
test("conta autenticada comum não é administrador", async () => {
  const db = env.authenticatedContext("visitor").firestore();
  await assertFails(getDoc(doc(db, "clients", "private")));
  await assertFails(setDoc(doc(db, "admins", "visitor"), { role: "admin" }));
  await assertFails(setDoc(doc(db, "payments", "fake"), { value: 100 }));
});
test("administrador cadastrado acessa cadastros e financeiro", async () => {
  const db = env.authenticatedContext("owner").firestore();
  await assertSucceeds(getDoc(doc(db, "clients", "private")));
  await assertSucceeds(setDoc(doc(db, "payments", "valid"), { value: 100 }));
});
test("decisão pública não altera valor e só ocorre uma vez", async () => {
  const db = env.unauthenticatedContext().firestore();
  const ref = doc(db, "publicQuotes", "quote-token");
  await assertFails(
    updateDoc(ref, {
      value: 1,
      status: "aprovado",
      statusUpdatedAt: serverTimestamp(),
    }),
  );
  await assertSucceeds(
    updateDoc(ref, { status: "aprovado", statusUpdatedAt: serverTimestamp() }),
  );
  await assertFails(
    updateDoc(ref, { status: "recusado", statusUpdatedAt: serverTimestamp() }),
  );
});
test("aceite de contrato preserva o documento e não permite reverter", async () => {
  const db = env.unauthenticatedContext().firestore();
  const ref = doc(db, "publicContracts", "contract-token");
  await assertFails(
    updateDoc(ref, {
      service: "Outro",
      status: "aceito",
      acceptedAt: serverTimestamp(),
    }),
  );
  await assertSucceeds(
    updateDoc(ref, { status: "aceito", acceptedAt: serverTimestamp() }),
  );
  await assertFails(
    updateDoc(ref, { status: "pendente", acceptedAt: serverTimestamp() }),
  );
});
test("briefing válido é aceito sem revelar respostas e rejeita links inexistentes", async () => {
  const db = env.unauthenticatedContext().firestore();
  const data = {
    clientSlug: "client-token",
    answers: {
      negocio: "Empresa",
      publico: "Público",
      objetivo: "Site",
      cores: "",
      referencias: "",
    },
    createdAt: serverTimestamp(),
  };
  await assertSucceeds(
    setDoc(doc(db, "formSubmissions", "briefing-valid"), data),
  );
  await assertFails(getDoc(doc(db, "formSubmissions", "briefing-valid")));
  await assertFails(
    setDoc(doc(db, "formSubmissions", "briefing-invalid"), {
      ...data,
      clientSlug: "missing",
    }),
  );
  await assertFails(
    setDoc(doc(db, "formSubmissions", "briefing-extra"), {
      ...data,
      injected: true,
    }),
  );
});
