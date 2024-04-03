import withMDX from "@next/mdx";

const applyMDX = withMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Add raw-loader to txt files
  webpack(config, options) {
    config.module.rules.push({
      test: /\.mls$/,
      use: "raw-loader",
    });
    return config;
  }
};

export default applyMDX(nextConfig);
