/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Keep the native SQLite driver out of the webpack bundle.
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
  // SQLite runs server-side only; exclude it from the browser bundle
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "better-sqlite3": false,
      };
    }
    return config;
  },
};

export default nextConfig;
