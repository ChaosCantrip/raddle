import "@/styles/global/master.css";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "RaDdle",
    description: "RaDdle by ChaosCantrip",
};

export default function RootLayout({ children }: { children: React.ReactNode }) 
{
    return (
        <html lang="en">
            <body>
                <main>
                    {children}
                </main>
            </body>
        </html>
    );
}
