import { useEffect, useState } from 'react';

const useAddToAddressBook = (visible: boolean) => {
  const [visibleDelayed, setVisibleDelayed] = useState<boolean>(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (visible) {
      timer = setTimeout(() => {
        setVisibleDelayed(true);
      }, 500);
    } else {
      setVisibleDelayed(false);
    }

    return () => clearTimeout(timer);
  }, [visible]);

  return {
    visibleDelayed,
  };
};

export { useAddToAddressBook };
