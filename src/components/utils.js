/** Constructs the attribution string from the data given in the manifest */
const getAttributionString = (requiredStatement) => {
  if (!requiredStatement.length) {
    return null;
  }
  const initial = requiredStatement.shift();
  return requiredStatement.reduce(
    (acc, current) => `${acc}, ${current.values.join(", ")}`,
    initial.values.join(", "),
  );
};

const getFacebookLink = (text, imageUrl) => {
  const url = new URL("/sharer/sharer.php", "https://www.facebook.com");
  url.searchParams.set("title", text);
  url.searchParams.set("u", imageUrl);
  return url.toString();
};

const getPinterestLink = (text, imageUrl, thumbnailUrl) => {
  const url = new URL("/pin/create/bookmarklet", "https://pinterest.com");
  url.searchParams.set("description", text);
  url.searchParams.set("url", imageUrl);
  url.searchParams.set("media", thumbnailUrl);
  return url.toString();
};

const getXLink = (text, imageUrl) => {
  const url = new URL("/intent/post", "https://x.com");
  url.searchParams.set(
    "text",
    text.length > 60 ? `${text.substring(0, 60)}...` : text,
  );
  url.searchParams.set("url", imageUrl);
  url.searchParams.set("hashtags", "iiif");
  return url.toString();
};

/** Constructs a share link for the given content and provider */
const getShareLink = (attribution, imageUrl, label, provider, thumbnailUrl) => {
  let text = label;
  if (attribution) {
    text += ` (${attribution})`;
  }
  switch (provider) {
    case "envelope":
      return `mailto:?subject=${text}&body=${text}: ${imageUrl}`;
    case "facebook":
      return getFacebookLink(text, imageUrl);
    case "pinterest":
      return getPinterestLink(text, imageUrl, thumbnailUrl);
    case "whatsapp":
      return `whatsapp://send?text=${text}: ${imageUrl}`;
    case "x":
      return getXLink(text, imageUrl);
    default:
      return null;
  }
};

export { getAttributionString, getShareLink };
