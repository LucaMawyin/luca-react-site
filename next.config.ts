import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    async rewrites() {
        return [
            {
                source: "/resume",
                destination: "/resume/resume.pdf",
            },
        ];
    },
};


export default nextConfig;