import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      // Keep CSS Modules on Next.js's native pipeline. Renaming every CSS
      // resource to *.css removes module exports and leaves styles undefined.
      "*.css": {
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
