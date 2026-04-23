const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://nexgen-studio-np4p.vercel.app/auth/callback",
    },
  });

  if (error) {
    console.error(error.message);
  }
};