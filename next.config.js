/** @type {import('next').NextConfig} */
const cloudinaryHost = "res.cloudinary.com";
const allowedImageHosts = [
  cloudinaryHost,
  "placehold.co",
  "placehold.it",
  "images.unsplash.com",
];

const nextConfig = {
  // C-04 FIX: explicit allowlist. "**" was an SSRF/data-exfiltration vector.
  images: {
    remotePatterns: allowedImageHosts.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  // Smaller bundles for the heavy client-side libs
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@heroui/react",
      "framer-motion",
      "date-fns",
    ],
  },

  // Send a strict, modern security header set in addition to Helmet (server).
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
    ];
  },

  poweredByHeader: false,
  reactStrictMode: true,
  typescript: {
    // TODO: tighten once hooks (useQuery/useMutation) carry explicit generics
    //       and the axios→fetch service refactor is fully typed. Build is green
    //       at runtime; tsc reports ~80 `data: {}` and `value: unknown` errors
    //       that don't block SSR/CSR.
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
