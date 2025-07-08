/**
 * Utility function to make HTTP requests with error handling.
 * Returns null if the request fails or if the response is not ok.
 *
 * @param url - The URL to fetch.
 * @param options - Optional fetch options.
 * @returns A promise that resolves to the response data or null.
 */
const request = async <T = unknown>(
  url: string,
  options?: RequestInit,
): Promise<T | null> => {
  try {
    const fetchResponse = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await fetchResponse.json();

    if (!fetchResponse.ok) {
      return null;
    }
    return data as T;
  } catch {
    return null;
  }
};

export default request;
