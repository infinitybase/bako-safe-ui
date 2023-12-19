import { useEffect, useState } from 'react';

const useLoadImage = (src: string) => {
  const [imageState, setImageState] = useState({
    isLoading: true,
    isError: false,
  });

  useEffect(() => {
    if (src) {
      const image = new Image();
      image.onload = () => setImageState({ isLoading: false, isError: false });
      // image.onerror = () => setImageState({ isLoading: false, isError: true });
      image.src = src;
    }
  }, [src]);

  return imageState;
};

export { useLoadImage };
