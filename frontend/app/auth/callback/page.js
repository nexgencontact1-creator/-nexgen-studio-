"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      await supabase.auth.getSession();
      router.push("/");
    };

    getSession();
  }, []);

  return <p>Connexion en cours...</p>;
}