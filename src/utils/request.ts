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

/**
 * Utility function to make HTTP requests with error handling and abort with timeout.
 * Returns null if the request fails or if the response is not ok.
 *
 * @param url - The URL to fetch.
 * @param timeoutMs - The timeout in milliseconds for the request (default is 2000ms).
 * @param options - Optional fetch options.
 * @returns A promise that resolves to the response data or null.
 */
const requestWithTimeout = async <T = unknown>(
  url: string,
  timeoutMs: number = 2000,
  options?: RequestInit,
): Promise<T | null> => {
  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: abort.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    clearTimeout(timeout);
    return null;
  }
};

const getWithoutPreflight = async <T = unknown>(url: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data as T;
};

export { getWithoutPreflight, request, requestWithTimeout };
