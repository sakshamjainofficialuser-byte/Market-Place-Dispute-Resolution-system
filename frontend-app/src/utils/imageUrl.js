export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // If it's already an absolute URL or special protocol
  if (imagePath.startsWith("http") || imagePath.startsWith("data:") || imagePath.startsWith("blob:")) {
    // Upgrade http to https for our backend domain to avoid Mixed Content
    if (imagePath.includes("onrender.com") && imagePath.startsWith("http://")) {
      return imagePath.replace("http://", "https://");
    }
    return imagePath;
  }

  // If it's a relative path (e.g., uploads/filename.jpg)
  // Clean backslashes and double slashes
  const cleanPath = imagePath.replace(/\\/g, "/");
  
  // Ensure we don't have double slashes if API_BASE_URL ends with / or cleanPath starts with /
  const baseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const path = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

  return `${baseUrl}${path}`;
};
