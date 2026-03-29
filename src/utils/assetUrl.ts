const baseUrl = import.meta.env.BASE_URL;

export const assetUrl = (path: string) =>
  `${baseUrl}${path.startsWith('/') ? path.slice(1) : path}`;
