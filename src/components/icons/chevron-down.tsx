import { createIcon } from 'bako-ui';

const ChevronDownIcon = createIcon({
  displayName: 'ChevronDownIcon',
  viewBox: '0 0 22 22',
  path: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_19791_16812)">
        <g clipPath="url(#clip1_19791_16812)">
          <path
            d="M10.0014 10.9766L14.1264 6.85156L15.3047 8.0299L10.0014 13.3332L4.69802 8.0299L5.87635 6.85156L10.0014 10.9766Z"
            fill={'currentColor'}
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_19791_16812">
          <rect width="20" height="20" fill="white" />
        </clipPath>
        <clipPath id="clip1_19791_16812">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="matrix(0 1 -1 0 20 0)"
          />
        </clipPath>
      </defs>
    </svg>
  ),
});

export { ChevronDownIcon };
