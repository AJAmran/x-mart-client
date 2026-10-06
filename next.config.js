/** @type {import('next').NextConfig} */

const allowedImageHosts = [
  "res.cloudinary.com",
  "ik.imagekit.io",
  "images.unsplash.com",
  "img.freepik.com",
  "encrypted-tbn0.gstatic.com",
  "placehold.co",
  "placehold.it",
  "media.licdn.com"
];

const nextConfig = {
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
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;