import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, hasFirebaseConfig } from "../lib/firebaseClient";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const [status, setStatus] = useState<"loading" | "in" | "out">("loading");

  useEffect(() => {
    if (!hasFirebaseConfig) {
      setStatus("out");
      return;
    }
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStatus("out");
        return;
      }
      try {
        const snap = await getDoc(doc(db, "admins", user.uid));
        setStatus(snap.exists() ? "in" : "out");
      } catch {
        setStatus("out");
      }
    });
    return unsub;
  }, []);

  if (status === "loading")
    return <div className="container mono">carregando…</div>;
  if (status === "out") return <Navigate to="/login" replace />;
  return children;
}
