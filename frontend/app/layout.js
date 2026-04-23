export const metadata = {
  title: "NexGen Studio",
  description: "NexGen Studio auth app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          background: "#0b1020",
          color: "#ffffff",
        }}
      >
        {children}
      </body>
    </html>
  );
}