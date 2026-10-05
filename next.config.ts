import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["three", "@react-three/drei", "gsap", "motion"],
  },
  // Preserve inbound links and search equity from the legacy URL structure.
  async redirects() {
    return [
      { source: "/integrated", destination: "/construction", permanent: true },
      { source: "/engineering_excellence", destination: "/engineering", permanent: true },
      { source: "/power_transmission", destination: "/transmission", permanent: true },
      { source: "/intelligence", destination: "/technologies", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
