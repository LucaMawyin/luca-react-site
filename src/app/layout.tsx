import { validateSession } from "@/lib/auth";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { Metadata } from "next";
import Footer from "@/components/Footer";


export const dynamic = "force-dynamic";

const description = "Luca Mawyin is a developer and McMaster Computer Science student focused on building clean, intuitive web applications"
const siteUrl = "https://lucamawyin.com"

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: "Luca Mawyin",
    icons: {
        icon: [
            {
                url: "/favicon.svg",
                type: "image/svg+xml",
            },
        ],
    },
    description,
    keywords: [
        "Luca Mawyin",
        "Software Developer",
        "Software Engineer",
        "Web Developer",
        "Frontend Developer",
        "Full Stack Developer",

        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Node.js",
        "PHP",
        "MySQL",

        "Web Applications",
        "UI Development",
        "API Development",
        "Developer Portfolio",

        "McMaster University",
        "Computer Science"
    ],
    authors:[
        {
            name: "Luca Mawyin",
            url: siteUrl,
        }
    ],
    creator: "Luca Mawyin",
    alternates:{
        canonical: "/",
    },
    openGraph: {
        type: "website",
        title: "Luca Mawyin · Software Developer",
        description,
        siteName: "Luca Mawyin",
        images: [
            {
                url: "/og-image.png",
                width:800,
                height:800,
                alt:"Luca Mawyin - Computer Science student and software developer"
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Luca Mawyin · Software Developer",
        description,
        images: ["/og-image.png"],
    }
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await validateSession();

    return (
        <html lang="en">
            <body className={`
                min-h-screen 
                flex 
                flex-col 
                justify-between
                ${GeistMono.className}
            `}>
                <NavBar isLoggedIn={!!session} />
                {children}
                <Footer/>
            </body>
        </html>
    );
}
