
import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";
const backendApiOrigin = (
  process.env.BACKEND_API_ORIGIN || "http://127.0.0.1:5000"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  ...(isDevelopment
    ? {}
    : {
        output: "export" as const,
        basePath: "/MediCare-Hospital-Management-System",
      }),
  trailingSlash: true,

  images: {
    unoptimized: true,
  },

  ...(isDevelopment
    ? {
        async rewrites() {
          return [
            {
              source: "/api/:path*",
              destination: `${backendApiOrigin}/api/:path*`,
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
