import { createIcon } from '@chakra-ui/icons';

const DoneIcon = createIcon({
  displayName: 'DoneIcon',
  viewBox: '0 0 96 97',
  path: (
    <svg
      width="96"
      height="97"
      viewBox="0 0 96 97"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_15492_94103)">
        <rect x="8" y="0.5" width="80" height="80" rx="10" fill="#151413" />
        <rect
          x="8.5"
          y="1"
          width="79"
          height="79"
          rx="9.5"
          stroke="url(#paint0_linear_15492_94103)"
        />
        <g clipPath="url(#clip0_15492_94103)">
          <path
            d="M45.5075 50.5L63.1825 32.8225L59.6475 29.2875L45.5075 43.43L38.435 36.3575L34.9 39.8925L45.5075 50.5Z"
            fill="url(#paint1_linear_15492_94103)"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_15492_94103"
          x="0"
          y="0.5"
          width="96"
          height="96"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="8" />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_15492_94103"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_15492_94103"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_15492_94103"
          x1="8"
          y1="0.5"
          x2="91.7257"
          y2="76.3896"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC010" />
          <stop offset="0.48" stopColor="#EBA312" />
          <stop offset="0.71" stopColor="#D38015" />
          <stop offset="0.99" stopColor="#B24F18" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_15492_94103"
          x1="23"
          y1="15.5"
          x2="75.3285"
          y2="62.931"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC010" />
          <stop offset="0.48" stopColor="#EBA312" />
          <stop offset="0.71" stopColor="#D38015" />
          <stop offset="0.99" stopColor="#B24F18" />
        </linearGradient>
        <clipPath id="clip0_15492_94103">
          <rect
            width="36"
            height="36"
            fill="white"
            transform="translate(30 22.5)"
          />
        </clipPath>
      </defs>
    </svg>
  ),
});

export { DoneIcon };
