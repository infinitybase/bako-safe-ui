export const shortenUrl = async (longUrl: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`,
    );
    if (response.ok) {
      return await response.text();
    }
  } catch {
    return longUrl;
  }

  return longUrl;
};
