import { validateSession } from "@/lib/auth";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata = {
    title: "Luca Mawyin",
    icons : {
      icon : "/icon.svg",
    },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await validateSession();

  return (
    <html lang="en">
      <body>
        <NavBar isLoggedIn={!!session} />
        {children}
      </body>
    </html>
  );
}
