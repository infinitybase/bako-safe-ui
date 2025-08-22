export const constructUrl = (
    baseUrl: string,
    params: Record<string, string | number | string[] | undefined>
) => {
    const url = new URL(baseUrl);

    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
            if (Array.isArray(value)) {
                for (const v of value) {
                    url.searchParams.append(key, String(v));
                }
            } else {
                url.searchParams.append(key, String(value));
            }
        }
    }

    return url.toString();
};
