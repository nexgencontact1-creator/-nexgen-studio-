"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [error, setError] = useState(null);

  // 🔐 LOGIN GOOGLE
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          "https://silver-fortnight-5gwvp6p66666f79g-3000.app.github.dev",
      },
    });

    if (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  // 🔁 SESSION (ANTI-BOUCLE)
  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setUser(session?.user ?? null);
      setLoadingAuth(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 🚪 LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <main style={{ padding: 40, color: "white" }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        Génère des scripts TikTok
      </h1>

      {loadingAuth ? (
        <p>Connexion en cours...</p>
      ) : !user ? (
        <div>
          <p>Connecte-toi avec Google :</p>
          <button
            onClick={handleGoogleLogin}
            style={{
              padding: "10px 20px",
              background: "#6c5ce7",
              border: "none",
              borderRadius: 8,
              color: "white",
              cursor: "pointer",
            }}
          >
            🔐 Se connecter avec Google
          </button>
        </div>
      ) : (
        <div>
          <p>
            ✅ Connecté en tant que <strong>{user.email}</strong>
          </p>

          <button
            onClick={handleLogout}
            style={{
              marginTop: 10,
              padding: "8px 16px",
              background: "#e74c3c",
              border: "none",
              borderRadius: 8,
              color: "white",
              cursor: "pointer",
            }}
          >
            Se déconnecter
          </button>

          {/* TON APP ICI */}
          <div style={{ marginTop: 30 }}>
            <p>🚀 Ton app peut commencer ici</p>
          </div>
        </div>
      )}

      {error && (
        <p style={{ color: "red", marginTop: 20 }}>{error}</p>
      )}
    </main>
  );
}