export const config = (() => {
  const raw = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  if (!raw) {
    throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not set");
  }
  // remove trailing slashes
  const backendApiUrl = raw.replace(/\/+$/, "");
  return { backendApiUrl };
})();
