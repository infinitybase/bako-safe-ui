const useVerifyBrowserType = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(
    navigator.userAgent,
  );

  return { isMobile, isSafariBrowser };
};

export { useVerifyBrowserType };
