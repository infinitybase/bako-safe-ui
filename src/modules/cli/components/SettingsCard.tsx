import { Card, CardRootProps, Icon, Text } from 'bako-ui';
import { ElementType, useCallback } from 'react';

interface CLISettingsCardProps extends CardRootProps {
  label: string;
  icon: ElementType;
  disabled?: boolean;
  onClick: () => void;
}

const CLISettingsCard = ({
  label,
  icon,
  disabled,
  onClick,
  ...rest
}: CLISettingsCardProps) => {
  const handleClick = useCallback(() => {
    if (disabled) return;
    onClick();
  }, [disabled, onClick]);

  return (
    <Card.Root
      onClick={handleClick}
      variant="subtle"
      rounded="lg"
      w="full"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      minH="104px"
      bg="bg.panel"
      opacity={0.8}
      _hover={{
        bg: 'bg.muted',
        opacity: !disabled ? 1 : 0.6,
      }}
      {...rest}
    >
      <Card.Body gap={2} alignItems="center" justifyContent="center">
        <Icon as={icon} w={5} color="gray.50" />
        <Text
          fontSize="2xs"
          fontWeight={600}
          textTransform="uppercase"
          letterSpacing="widest"
          color="gray.50"
        >
          {label}
        </Text>
      </Card.Body>
    </Card.Root>
  );
};

export { CLISettingsCard };
