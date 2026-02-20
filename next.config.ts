import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co", // Useful for mock data/placeholders
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // If using unsplash as placeholders
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com", // Used for channel icons
      },
    ],
  },
};

export default nextConfig;
