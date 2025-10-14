import { createIcon } from 'bako-ui';

const DoneIcon = createIcon({
  displayName: 'DoneIcon',
  viewBox: '0 0 96 97',
  path: (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_19045_617612)">
        <rect
          x="8"
          width="80"
          height="80"
          rx="8"
          fill="url(#paint0_linear_19045_617612)"
          fillOpacity="0.1"
          shapeRendering="crispEdges"
        />
        <rect
          x="8.5"
          y="0.5"
          width="79"
          height="79"
          rx="7.5"
          stroke="url(#paint1_linear_19045_617612)"
          shapeRendering="crispEdges"
        />
        <g clipPath="url(#clip0_19045_617612)">
          <path
            d="M45.5075 50L63.1825 32.3225L59.6475 28.7875L45.5075 42.93L38.435 35.8575L34.9 39.3925L45.5075 50Z"
            fill="url(#paint2_linear_19045_617612)"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_19045_617612"
          x="0"
          y="0"
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
            result="effect1_dropShadow_19045_617612"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_19045_617612"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_19045_617612"
          x1="8"
          y1="0"
          x2="91.7257"
          y2="75.8896"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC010" />
          <stop offset="0.48" stopColor="#EBA312" />
          <stop offset="0.71" stopColor="#D38015" />
          <stop offset="0.99" stopColor="#B24F18" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_19045_617612"
          x1="8"
          y1="0"
          x2="91.7257"
          y2="75.8896"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC010" />
          <stop offset="0.48" stopColor="#EBA312" />
          <stop offset="0.71" stopColor="#D38015" />
          <stop offset="0.99" stopColor="#B24F18" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_19045_617612"
          x1="23"
          y1="15"
          x2="75.3285"
          y2="62.431"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC010" />
          <stop offset="0.48" stopColor="#EBA312" />
          <stop offset="0.71" stopColor="#D38015" />
          <stop offset="0.99" stopColor="#B24F18" />
        </linearGradient>
        <clipPath id="clip0_19045_617612">
          <rect
            width="36"
            height="36"
            fill="white"
            transform="translate(30 22)"
          />
        </clipPath>
      </defs>
    </svg>
  ),
});

export { DoneIcon };
