import "./globals.css";

export const metadata = {
  title: "AI TikTok Machine",
  description: "Générateur de scripts TikTok IA"
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}