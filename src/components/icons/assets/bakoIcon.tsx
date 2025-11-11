import { createIcon } from 'bako-ui';

const BakoIcon = createIcon({
  displayName: 'BakoIcon',
  viewBox: '0 0 30 30', // Set the correct viewBox
  path: (
    <g
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <linearGradient
          id="linear0"
          gradientUnits="userSpaceOnUse"
          x1="5"
          y1="4"
          x2="30.1667"
          y2="27.7645"
          gradientTransform="matrix(0.9375,0,0,0.9375,0,0)"
        >
          <stop
            offset="0"
            style={{
              stopColor: 'rgb(100%,75.294118%,6.27451%)',
              stopOpacity: 1,
            }}
          />
          <stop
            offset="0.177259"
            style={{
              stopColor: 'rgb(92.156863%,63.921569%,7.058824%)',
              stopOpacity: 1,
            }}
          />
          <stop
            offset="0.711419"
            style={{
              stopColor: 'rgb(82.745098%,50.196078%,8.235294%)',
              stopOpacity: 1,
            }}
          />
          <stop
            offset="0.99"
            style={{
              stopColor: 'rgb(69.803922%,30.980392%,9.411765%)',
              stopOpacity: 1,
            }}
          />
        </linearGradient>
        <filter
          id="alpha"
          filterUnits="objectBoundingBox"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
        >
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          />
        </filter>
        <mask id="mask0">
          <g filter="url(#alpha)">
            <rect
              x="0"
              y="0"
              width="30"
              height="30"
              style={{ fill: 'black', fillOpacity: 0.501961 }}
            />
          </g>
        </mask>
        <clipPath id="clip1">
          <rect x="0" y="0" width="30" height="30" />
        </clipPath>
      </defs>
      <g clipPath="url(#clip1)">
        <path
          fillRule="evenodd"
          fill="rgb(96.470588%,96.078431%,96.078431%)"
          d="M 8.195312 15.539062 L 8.753906 15.214844 L 15 11.609375 L 15 18.390625 L 14.5 18.679688 Z"
        />
      </g>
      <g id="surface1">
        <path
          fill="url(#linear0)"
          d="M 15 0 C 23.285156 0 30 6.714844 30 15 C 30 23.285156 23.285156 30 15 30 C 6.714844 30 0 23.285156 0 15 C 0 6.714844 6.714844 0 15 0 Z"
        />
        <path
          fill="rgb(96.470588%,96.078431%,96.078431%)"
          d="M 20.042969 13.441406 L 15 10.53125 L 15 3.75 L 8.195312 7.679688 L 8.195312 15.539062 L 15 11.609375 L 15 18.390625 L 8.195312 22.320312 L 15 26.25 L 21.808594 22.320312 L 21.808594 16.496094 C 21.808594 15.238281 21.136719 14.070312 20.042969 13.441406 Z"
        />
        <use xlinkHref="#surface5" mask="url(#mask0)" />
      </g>
    </g>
  ),
});

export { BakoIcon };
