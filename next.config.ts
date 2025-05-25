import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env:{
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  }
};

export default nextConfig;
