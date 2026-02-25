import { createIcon } from 'bako-ui';

const ErrorIcon = createIcon({
  displayName: 'ErrorIcon',
  viewBox: '0 0 20 20',
  defaultProps: {
    fontSize: 'sm',
  },
  path: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.99935 18.3327C5.39685 18.3327 1.66602 14.6018 1.66602 9.99935C1.66602 5.39685 5.39685 1.66602 9.99935 1.66602C14.6018 1.66602 18.3327 5.39685 18.3327 9.99935C18.3327 14.6018 14.6018 18.3327 9.99935 18.3327ZM9.99935 8.82102L7.64268 6.46352L6.46352 7.64268L8.82102 9.99935L6.46352 12.356L7.64268 13.5352L9.99935 11.1777L12.356 13.5352L13.5352 12.356L11.1777 9.99935L13.5352 7.64268L12.356 6.46352L9.99935 8.82102Z"
        fill="#F05D48"
      />
    </svg>
  ),
});

export { ErrorIcon };
