import "@/styles/global/master.css";
import { Metadata } from "next";

import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageContainer from "@/components/Page";
config.autoAddCss = false;

export const metadata: Metadata = {
    title: "RaDdle",
    description: "RaDdle by ChaosCantrip",
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
