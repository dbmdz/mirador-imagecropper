/** Constructs the attribution string from the data given in the manifest */
const getAttributionString = (requiredStatement) => {
  if (!requiredStatement.length) {
    return null;
  }
  const initial = requiredStatement.shift();
  return requiredStatement.reduce(
    (acc, current) => `${acc}, ${current.values.join(", ")}`,
    initial.values.join(", ")
  );
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
      return `https://www.facebook.com/sharer/sharer.php?title=${text}&u=${imageUrl}`;
    case "pinterest":
      return `http://pinterest.com/pin/create/bookmarklet/?url=${imageUrl}&description=${text}&media=${thumbnailUrl}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${
        text.length > 60 ? `${text.substring(0, 60)}...` : text
      }&url=${imageUrl}&hashtags=iiif`;
    case "whatsapp":
      return `whatsapp://send?text=${text}: ${imageUrl}`;
    default:
      return null;
  }
};

export { getAttributionString, getShareLink };
