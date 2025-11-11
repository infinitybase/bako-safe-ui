import { createIcon } from 'bako-ui';

const PendingIcon = createIcon({
  displayName: 'PendingIcon',
  viewBox: '0 0 14 14',
  defaultProps: {
    fontSize: 'sm',
  },
  path: (
    <path
      d="M7 14C3.14008 14 0 10.8599 0 7C0 3.14008 3.14008 0 7 0C10.8599 0 14 3.14008 14 7C14 10.8599 10.8599 14 7 14ZM9.91667 6.41667H7.58333V2.91667H6.41667V7.58333H9.91667V6.41667Z"
      fill="currentColor"
    />
  ),
});

export { PendingIcon };
