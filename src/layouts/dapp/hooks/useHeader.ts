import { useVerifyBrowserType } from "@/modules/dapp/hooks";

export const useHeader = () => {
  const { isSafariBrowser } = useVerifyBrowserType();
  return { renderCloseIcon: isSafariBrowser };
}
