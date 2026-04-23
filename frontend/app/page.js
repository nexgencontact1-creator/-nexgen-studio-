"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        setError(error.message);
      } else {
        setUser(session?.user ?? null);
      }

      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    setError("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      return;
    }

    setUser(null);
  };

  return (
    <main style={{ padding: 36, color: "white" }}>
      <h1>Génère des scripts TikTok</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : user ? (
        <div>
          <p>
            ✅ Connecté en tant que <strong>{user.email}</strong>
          </p>

          <button
            onClick={handleLogout}
            style={{
              marginTop: 12,
              padding: "10px 16px",
              background: "#e74c3c",
              border: "none",
              borderRadius: 8,
              color: "white",
              cursor: "pointer",
            }}
          >
            Se déconnecter
          </button>
        </div>
      ) : (
        <div>
          <p>Connecte-toi avec Google :</p>

          <button
            onClick={handleGoogleLogin}
            style={{
              marginTop: 12,
              padding: "12px 18px",
              background: "#7c5cff",
              border: "none",
              borderRadius: 10,
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🔐 Se connecter avec Google
          </button>
        </div>
      )}

      {error && <p style={{ color: "#ff6b6b", marginTop: 18 }}>{error}</p>}
    </main>
  );
}