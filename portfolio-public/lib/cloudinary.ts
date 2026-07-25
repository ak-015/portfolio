// The public site never uploads — it only ever renders Cloudinary URLs
// that the admin panel already wrote to the database. This helper just
// gives a couple of small helpers for building transformed delivery URLs
// on top of a stored secure_url, without needing the Cloudinary SDK's
// upload/auth features.

export function cldTransform(url: string | null | undefined, transform: string): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com")) return url;
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  return url.slice(0, idx + marker.length) + transform + "/" + url.slice(idx + marker.length);
}

export function cldThumb(url: string | null | undefined, width = 600): string {
  return cldTransform(url, `f_auto,q_auto,w_${width}`);
}
