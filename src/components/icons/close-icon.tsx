import { createIcon } from '@chakra-ui/icons';
import React from 'react';

const CloseIcon = createIcon({
  viewBox: '0 0 20 20',
  path: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.0003 18.3337C5.39783 18.3337 1.66699 14.6028 1.66699 10.0003C1.66699 5.39783 5.39783 1.66699 10.0003 1.66699C14.6028 1.66699 18.3337 5.39783 18.3337 10.0003C18.3337 14.6028 14.6028 18.3337 10.0003 18.3337ZM10.0003 16.667C11.7684 16.667 13.4641 15.9646 14.7144 14.7144C15.9646 13.4641 16.667 11.7684 16.667 10.0003C16.667 8.23222 15.9646 6.53652 14.7144 5.28628C13.4641 4.03604 11.7684 3.33366 10.0003 3.33366C8.23222 3.33366 6.53652 4.03604 5.28628 5.28628C4.03604 6.53652 3.33366 8.23222 3.33366 10.0003C3.33366 11.7684 4.03604 13.4641 5.28628 14.7144C6.53652 15.9646 8.23222 16.667 10.0003 16.667ZM10.0003 8.82199L12.357 6.46449L13.5362 7.64366L11.1787 10.0003L13.5362 12.357L12.357 13.5362L10.0003 11.1787L7.64366 13.5362L6.46449 12.357L8.82199 10.0003L6.46449 7.64366L7.64366 6.46449L10.0003 8.82199Z"
        fill="#C5C5C5"
      />
    </svg>
  ),
});

export { CloseIcon };
