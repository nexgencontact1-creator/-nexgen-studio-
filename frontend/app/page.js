const redirectUrl =
  typeof window !== "undefined" ? window.location.origin : "";

await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: redirectUrl,
  },
});