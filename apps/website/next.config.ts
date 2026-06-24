import type { NextConfig } from "next";

import packageJson from "./package.json";

const nextConfig: NextConfig = {
    output: "standalone",
    env: {
        NEXT_PUBLIC_VERSION_NUMBER: packageJson.version
    },
    async headers() 
    {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "X-Clacks-Overhead",
                        value: "GNU Terry Pratchett"
                    }
                ]
            }
        ];
    },
    transpilePackages: ["@raddle/types"]
};

export default nextConfig;
