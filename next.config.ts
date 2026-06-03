import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    rewrites() {
        return [
            {
            source: "/resume",
            destination: "/resume/resume.pdf",
            },
        ];
    }
};


export default nextConfig;