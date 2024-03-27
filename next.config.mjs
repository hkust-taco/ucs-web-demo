import withMDX from "@next/mdx";

const applyMDX = withMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
};

export default applyMDX(nextConfig);
