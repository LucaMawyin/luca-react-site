import { validateSession } from "@/lib/auth";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Luca Mawyin",
  description: "Full-Stack Developer and Computer Science Student",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
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
