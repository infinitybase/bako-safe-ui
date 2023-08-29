type ParamsObject = Record<string, string | number>;

function searchStringify(query?: Record<string, string>): string {
  if (!query) return '';
  const queryParams = new URLSearchParams(query);
  return queryParams.toString();
}

function pageRoute<P extends ParamsObject = ParamsObject>(path: string) {
  return function parse(params?: P, query?: Record<string, string>): string {
    /* *
     * Split route in parts:
     *  path = /example/:id
     *  result = ['example', ':id']
     * */
    const split = path.split('/');

    /* *
     * Set parameters in route
     * */
    const parsed = split
      .map((str) => {
        if (str.startsWith(':')) {
          const paramKey = str.slice(1);
          return params && paramKey in params ? params[paramKey] : str;
        }
        return str;
      })
      .join('/');

    /* convert queryString object in string */
    const queryString = searchStringify(query);

    return `${parsed}${queryString ? '?' + queryString : ''}`;
  };
}

export { pageRoute, searchStringify };
export type { ParamsObject };
