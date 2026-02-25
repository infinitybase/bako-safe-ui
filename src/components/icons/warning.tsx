import { createIcon } from 'bako-ui';

const WarningIcon = createIcon({
  displayName: 'WarningIcon',
  defaultProps: {
    fill: 'none',
  },
  viewBox: '0 0 97 96',
  path: (
    <>
      <g filter="url(#filter0_d_22141_97377)">
        <rect
          x="8.5"
          width="80"
          height="80"
          rx="8"
          fill="url(#paint0_linear_22141_97377)"
          fillOpacity="0.1"
          shapeRendering="crispEdges"
        />
        <rect
          x="9"
          y="0.5"
          width="79"
          height="79"
          rx="7.5"
          stroke="url(#paint1_linear_22141_97377)"
          shapeRendering="crispEdges"
        />
        <path
          d="M49.3361 25.6262L64.022 51.0637C64.1573 51.2981 64.2285 51.5639 64.2285 51.8346C64.2285 52.1052 64.1573 52.371 64.022 52.6054C63.8867 52.8397 63.6921 53.0344 63.4577 53.1697C63.2234 53.305 62.9575 53.3762 62.6869 53.3762H33.3151C33.0444 53.3762 32.7786 53.305 32.5442 53.1697C32.3099 53.0344 32.1153 52.8397 31.98 52.6054C31.8447 52.371 31.7734 52.1052 31.7734 51.8346C31.7734 51.5639 31.8447 51.2981 31.98 51.0637L46.6659 25.6262C46.8012 25.3919 46.9958 25.1973 47.2302 25.062C47.4645 24.9267 47.7304 24.8555 48.001 24.8555C48.2716 24.8555 48.5374 24.9267 48.7718 25.062C49.0061 25.1973 49.2008 25.3919 49.3361 25.6262ZM35.9852 50.2929H60.0167L48.001 29.4804L35.9852 50.2929ZM46.4593 45.6679H49.5426V48.7512H46.4593V45.6679ZM46.4593 34.8762H49.5426V42.5846H46.4593V34.8762Z"
          fill="url(#paint2_linear_22141_97377)"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_22141_97377"
          x="0.5"
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
            result="effect1_dropShadow_22141_97377"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_22141_97377"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_22141_97377"
          x1="8.5"
          y1="0"
          x2="92.2257"
          y2="75.8896"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC010" />
          <stop offset="0.48" stopColor="#EBA312" />
          <stop offset="0.71" stopColor="#D38015" />
          <stop offset="0.99" stopColor="#B24F18" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_22141_97377"
          x1="8.5"
          y1="0"
          x2="92.2257"
          y2="75.8896"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC010" />
          <stop offset="0.48" stopColor="#EBA312" />
          <stop offset="0.71" stopColor="#D38015" />
          <stop offset="0.99" stopColor="#B24F18" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_22141_97377"
          x1="31.7734"
          y1="24.8555"
          x2="61.7523"
          y2="55.777"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC010" />
          <stop offset="0.48" stopColor="#EBA312" />
          <stop offset="0.71" stopColor="#D38015" />
          <stop offset="0.99" stopColor="#B24F18" />
        </linearGradient>
      </defs>
    </>
  ),
});

export { WarningIcon };
