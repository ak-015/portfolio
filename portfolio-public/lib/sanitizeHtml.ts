import sanitizeHtml from "sanitize-html";

// Sanitizes rich-text HTML before it's rendered with
// dangerouslySetInnerHTML. contentHtml is written exclusively through the
// admin panel today, but it still passes through this before reaching
// visitors' browsers: it costs nothing when the input is already clean,
// and it's the difference between a contained bug and a site-wide stored
// XSS if the editor ever accepts pasted/imported markup, the admin
// session is ever compromised, or a future contributor adds another way
// to write this field.
export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "hr",
      "h1", "h2", "h3", "h4",
      "strong", "b", "em", "i", "u", "s", "code", "pre", "blockquote",
      "ul", "ol", "li",
      "a", "img",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      // Any author-provided link opens safely regardless of what's set.
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
    },
  });
}
