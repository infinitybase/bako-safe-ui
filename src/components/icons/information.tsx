import { createIcon } from 'bako-ui';

const InformationIcon = createIcon({
  displayName: 'InformationIcon',
  defaultProps: {
    fill: 'none',
  },
  viewBox: '0 0 20 21',
  path: (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.0013 18.8332C5.3988 18.8332 1.66797 15.1023 1.66797 10.4998C1.66797 5.89734 5.3988 2.1665 10.0013 2.1665C14.6038 2.1665 18.3346 5.89734 18.3346 10.4998C18.3346 15.1023 14.6038 18.8332 10.0013 18.8332ZM9.16797 9.6665V14.6665H10.8346V9.6665H9.16797ZM9.16797 6.33317V7.99984H10.8346V6.33317H9.16797Z"
        fill="#008EF4"
      />
    </svg>
  ),
});

export { InformationIcon };
