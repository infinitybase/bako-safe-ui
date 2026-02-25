import { createIcon } from 'bako-ui';

const TransactionsIcon = createIcon({
  displayName: 'TransactionsIcon',
  viewBox: '0 0 40 40',
  defaultProps: {
    fontSize: 26,
  },
  path: (
    <>
      <g opacity="0.7" clipPath="url(#clip0_11266_11081)">
        <path
          d="M14.25 4L16.6067 6.35667L12.38 10.5833H34.3333V13.9167H12.38L16.6067 18.1433L14.25 20.5L6 12.25L14.25 4Z"
          fill="url(#paint0_linear_11266_11081)"
        />
        <path
          d="M26.0833 20L34.3333 28.25L26.0833 36.5L23.7267 34.1433L27.9533 29.915L6 29.9167V26.5833H27.9533L23.7267 22.3567L26.0833 20Z"
          fill="url(#paint1_linear_11266_11081)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_11266_11081"
          x1="6"
          y1="4"
          x2="21.782"
          y2="28.564"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC010" />
          <stop offset="0.48" stopColor="#EBA312" />
          <stop offset="0.71" stopColor="#D38015" />
          <stop offset="0.99" stopColor="#B24F18" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_11266_11081"
          x1="6"
          y1="20"
          x2="21.782"
          y2="44.564"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC010" />
          <stop offset="0.48" stopColor="#EBA312" />
          <stop offset="0.71" stopColor="#D38015" />
          <stop offset="0.99" stopColor="#B24F18" />
        </linearGradient>
        <clipPath id="clip0_11266_11081">
          <rect width="40" height="40" fill="white" />
        </clipPath>
      </defs>
    </>
  ),
});
export { TransactionsIcon };
