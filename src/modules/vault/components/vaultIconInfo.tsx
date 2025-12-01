import { IconButton, IconButtonProps, Tooltip } from 'bako-ui';

interface VaultIconInfoProps {
  children: React.ReactNode;
  onClick?: IconButtonProps['onClick'];
  tooltipContent: React.ReactNode;
  disabled?: boolean;
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
  disabled,
  placement = 'right',
  onClick,
}: VaultIconInfoProps) => {
  return (
    <Tooltip
      content={tooltipContent}
      contentProps={{
        bg: 'bg.muted',
        color: 'textPrimary',
        borderRadius: 'lg',
      }}
      positioning={{ placement }}
      showArrow={false}
    >
      <IconButton
        variant="solid"
        bg="bg.muted"
        _hover={{
          bg: 'gray.550',
        }}
        size="xs"
        boxSize="20px"
        minW="20px"
        rounded="sm"
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
};
