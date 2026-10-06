/** @type {import('next').NextConfig} */

// Hosts that ship with the product (product imagery, stock photos). A store
// owner using their own CDN or Cloudinary account adds theirs via
// NEXT_PUBLIC_IMAGE_HOSTS, so white-labelling does not require a code change.
const allowedImageHosts = [
  "res.cloudinary.com",
  "ik.imagekit.io",
  "images.unsplash.com",
  "img.freepik.com",
  "encrypted-tbn0.gstatic.com",
  "placehold.co",
  "placehold.it",
  "media.licdn.com",
  ...(process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean),
];

const nextConfig = {
  // Produces .next/standalone with only the modules actually imported, which is
  // what keeps the production Docker image small enough to ship.
  output: "standalone",

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
};

module.exports = nextConfig;