import { useDebounce } from "@/modules";
import { useMemo } from "react";
import { APIToken } from "@/modules/cli/services";

interface UseFilteredTokensProps {
  tokens: APIToken[] | undefined;
  searchValue: string;
  debounceMs?: number;
}

export const useFilteredTokens = ({ tokens, searchValue }: UseFilteredTokensProps) => {
  return useMemo(() => {
    if (!tokens) return [];
    const search = (searchValue || '').toLowerCase();
    if (!search) return tokens;
    return tokens.filter((token) =>
      String(token?.name || '').toLowerCase().includes(search)
    );
  }, [tokens, searchValue]);
};

