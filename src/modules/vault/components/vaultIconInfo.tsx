import { IconButton, IconButtonProps, Tooltip } from 'bako-ui';

interface VaultIconInfoProps {
  children: React.ReactNode;
  onClick?: IconButtonProps['onClick'];
  tooltipContent: string;
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'right-start'
    | 'right-end'
    | 'left-start'
    | 'left-end';
}

export const VaultIconInfo = ({
  children,
  tooltipContent,
  placement = 'right',
  onClick,
}: VaultIconInfoProps) => {
  return (
    <Tooltip
      content={tooltipContent}
      contentProps={{
        bg: 'bg.muted',
        color: 'textPrimary',
      }}
      positioning={{ placement }}
      showArrow={false}
    >
      <IconButton variant="ghost" size="xs" onClick={onClick}>
        {children}
      </IconButton>
    </Tooltip>
  );
};
