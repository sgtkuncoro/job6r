// Vite asset URL imports for embedded fonts.
declare module "*.woff?url" {
  const src: string;
  export default src;
}
declare module "*.woff2?url" {
  const src: string;
  export default src;
}
declare module "*.ttf?url" {
  const src: string;
  export default src;
}

// Raw text imports (e.g. the canonical resume markdown).
declare module "*.md?raw" {
  const content: string;
  export default content;
}
