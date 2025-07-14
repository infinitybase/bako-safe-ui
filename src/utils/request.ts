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

    if (!fetchResponse.ok) {
      return null;
    }

    const data = await fetchResponse.json();
    return data as T;
  } catch {
    return null;
  }
};

export default request;
