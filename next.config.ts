import type { NextConfig } from "next";

import packageJson from "./package.json";

const nextConfig: NextConfig = {
    output: "standalone",
    env: {
        NEXT_PUBLIC_VERSION_NUMBER: packageJson.version
    }
};

export default nextConfig;
