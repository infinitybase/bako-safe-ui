import { createIcon } from '@chakra-ui/react';

const PlusIcon = createIcon({
  displayName: 'CopyIcon',
  viewBox: '0 0 18 18',
  path: (
    <path
      d="M1 0H17C17.2652 0 17.5196 0.105357 17.7071 0.292893C17.8946 0.48043 18 0.734784 18 1V17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18H1C0.734784 18 0.48043 17.8946 0.292893 17.7071C0.105357 17.5196 0 17.2652 0 17V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0ZM2 2V16H16V2H2ZM8 8V4H10V8H14V10H10V14H8V10H4V8H8Z"
      fill="#CFCCC9"
    />
  ),
});

export { PlusIcon };
