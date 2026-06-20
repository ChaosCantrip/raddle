import type { Metadata } from "next";

import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"

import { Footer, PageContainer } from "@/components";
import Header from "@/components/Header";

config.autoAddCss = false;

import "@/styles/global/master.css";

export const metadata: Metadata = {
    title: "RaDdle",
    description: "The Destiny 2 RaD Encounter Guessing Game",
    openGraph: {
        title: "RaDdle",
        description: "The Destiny 2 RaD Encounter Guessing Game",
        url: "https://raddle.online",
        siteName: "RaDdle",
        images: [
            {
                url: "https://raddle.online/banner.webp",
                width: 999,
                height: 300,
                alt: "RaDdle"
            }
        ],
        type: "website"
    },
    twitter: {
        card: "summary_large_image"
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) 
{
    return (
        <html lang="en">
            <body>
                <PageContainer>
                    <Header />
                    <main>
                        {children}
                    </main>
                    <Footer />
                </PageContainer>
            </body>
        </html>
    );
}
