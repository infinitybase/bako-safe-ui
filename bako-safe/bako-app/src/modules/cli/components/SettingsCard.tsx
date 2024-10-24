import { Card, CardProps, HStack, Icon, Text } from '@chakra-ui/react';
import { ElementType, useCallback } from 'react';

interface CLISettingsCardProps extends CardProps {
  label: string;
  icon: ElementType;
  disabled?: boolean;
  onClick: () => void;
}

const CLISettingsCard = (props: CLISettingsCardProps) => {
  const { label, icon, disabled, onClick, ...rest } = props;

  const handleClick = useCallback(() => {
    if (disabled) return;
    onClick();
  }, [disabled, onClick]);

  return (
    <Card
      onClick={handleClick}
      w="full"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      p={3}
      bg={disabled ? 'dark.225' : 'gradients.transaction-card'}
      backdropFilter="blur(6px)"
      borderRadius={10}
      borderWidth={1}
      borderColor={disabled ? 'grey.800' : 'gradients.transaction-border'}
      textColor={disabled ? 'grey.400' : 'grey.250'}
      _hover={
        !disabled
          ? {
              bg: 'gradients.transaction-card-hover',
              borderColor: 'grey.50',
              textColor: 'grey.50',
            }
          : {}
      }
      boxShadow="lg"
      {...rest}
    >
      <HStack spacing={2}>
        <Icon as={icon} fontSize="xl" />
        <Text fontSize="sm" fontWeight={500}>
          {label}
        </Text>
      </HStack>
    </Card>
  );
};

export { CLISettingsCard };
