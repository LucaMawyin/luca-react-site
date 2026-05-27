import { validateSession } from "@/lib/auth";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "Luca Mawyin",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await validateSession();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body>
        <NavBar isLoggedIn={!!session} />
        {children}
      </body>
    </html>
  );
}
