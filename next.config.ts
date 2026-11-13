import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The preview runner can point generated artifacts at a writable workspace
  // folder when the checkout's existing .next directory is read-only.
  distDir: process.env.NEXT_DEV_DIST_DIR ?? ".next",
  images: {
    // 90 keeps small UI text in project screenshots crisp.
    qualities: [75, 90],
  },
};

export default nextConfig;
