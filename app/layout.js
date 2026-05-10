export const metadata = {
  title: "Capit24 Terminal",
  description: "Terminal financiero en tiempo real",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
