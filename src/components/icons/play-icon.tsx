import { createIcon } from 'bako-ui';

const PlayIcon = createIcon({
  displayName: 'PlayIcon',
  viewBox: '0 0 30 30',
  path: (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="29" height="29" rx="4.5" fill="#201F1D" />
      <rect x="0.5" y="0.5" width="29" height="29" rx="4.5" stroke="#2B2927" />
      <path
        d="M21.5 14.134C22.1667 14.5189 22.1667 15.4811 21.5 15.866L12.5 21.0622C11.8333 21.4471 11 20.966 11 20.1962L11 9.80385C11 9.03405 11.8333 8.55292 12.5 8.93782L21.5 14.134Z"
        fill="#AAA6A1"
      />
    </svg>
  ),
});

export { PlayIcon };
