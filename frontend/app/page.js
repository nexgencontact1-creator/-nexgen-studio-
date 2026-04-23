"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function HomePage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Erreur getSession:", error.message);
      }

      if (mounted) {
        setSession(session ?? null);
        setLoading(false);
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/`
        : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error("Erreur Google login:", error.message);
      alert("Impossible de se connecter avec Google.");
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erreur logout:", error.message);
      alert("Impossible de se déconnecter.");
    }
  };

  const user = session?.user;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background:
          "linear-gradient(135deg, #0b1020 0%, #111933 50%, #0f172a 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          background: "rgba(255, 255, 255, 0.06)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "20px",
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
          backdropFilter: "blur(10px)",
          color: "#fff",
        }}
      >
        <p
          style={{
            margin: "0 0 8px 0",
            fontSize: "14px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#93c5fd",
          }}
        >
          NexGen Studio
        </p>

        <h1
          style={{
            margin: "0 0 12px 0",
            fontSize: "32px",
            lineHeight: 1.15,
          }}
        >
          Google Login via Supabase
        </h1>

        <p
          style={{
            margin: "0 0 24px 0",
            fontSize: "16px",
            lineHeight: 1.6,
            color: "#dbeafe",
          }}
        >
          Vérification rapide de l’authentification Google sur Vercel.
        </p>

        <div
          style={{
            padding: "20px",
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            marginBottom: "20px",
          }}
        >
          {loading ? (
            <p style={{ margin: 0, color: "#cbd5e1" }}>
              Vérification de la session...
            </p>
          ) : user ? (
            <>
              <p style={{ margin: "0 0 10px 0", fontWeight: 700 }}>
                Connecté ✅
              </p>
              <p style={{ margin: "0 0 6px 0", color: "#e2e8f0" }}>
                <strong>Email :</strong> {user.email}
              </p>
              <p style={{ margin: 0, color: "#e2e8f0" }}>
                <strong>ID :</strong> {user.id}
              </p>
            </>
          ) : (
            <>
              <p style={{ margin: "0 0 10px 0", fontWeight: 700 }}>
                Non connecté
              </p>
              <p style={{ margin: 0, color: "#cbd5e1" }}>
                Clique sur le bouton Google pour tester l’auth.
              </p>
            </>
          )}
        </div>

        {!loading && !user ? (
          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "12px",
              padding: "14px 18px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              background: "#ffffff",
              color: "#0f172a",
            }}
          >
            Continuer avec Google
          </button>
        ) : null}

        {!loading && user ? (
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: "12px",
              padding: "14px 18px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              background: "transparent",
              color: "#ffffff",
            }}
          >
            Se déconnecter
          </button>
        ) : null}
      </div>
    </main>
  );
}