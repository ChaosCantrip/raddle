import type { NextConfig } from "next";

import packageJson from "./package.json";

const getDevRewrites = () =>
{
    if (process.env.NODE_ENV !== "production") 
    {
        return [
            {
                source: "/api/:path*",
                destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`
            }
        ]
    }
    return [];
}

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
    async rewrites() 
    {
        return getDevRewrites();
    },
    transpilePackages: [
        "@raddle/types",
        "@raddle/common"
    ]
};

export default nextConfig;
