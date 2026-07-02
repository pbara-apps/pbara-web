export function isVideoUrl(url: string): boolean {
  return (
    /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url) ||
    url.includes("/video/upload/")
  );
}

export function getCloudinaryVideoPoster(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "res.cloudinary.com") return null;
    if (!parsed.pathname.includes("/video/upload/")) return null;

    const posterPath = parsed.pathname
      .replace(
        "/video/upload/",
        "/video/upload/so_0,w_960,h_540,c_fill,q_auto/",
      )
      .replace(/\.(mp4|webm|mov|m4v)(\?.*)?$/i, ".jpg");

    return `${parsed.origin}${posterPath}`;
  } catch {
    return null;
  }
}
