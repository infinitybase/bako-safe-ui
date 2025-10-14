import { Icon } from 'bako-ui';
import { ComponentWithAs, HStack, IconProps, Text, VStack } from 'bako-ui';

interface AlertsBrigdeProps {
  title?: string;
  description: string;
  icon: ComponentWithAs<'svg', IconProps>;
  type: 'info' | 'warning';
}

export function AlertsBrigde({
  title,
  description,
  icon,
  type,
}: AlertsBrigdeProps) {
  return (
    <HStack
      w="full"
      align="center"
      marginY={3}
      bgColor={
        type === 'info' ? 'rgba(0, 127, 219, 0.1)' : 'rgba(255, 192, 16, 0.1)'
      }
      p={2}
      borderRadius={8}
      border={'1px solid'}
      backdropFilter="blur(6px)"
      borderColor={
        type === 'info' ? 'rgba(0, 127, 219, 0.3)' : 'rgba(255, 192, 16, 0.3)'
      }
    >
      <Icon as={icon} fontSize="18px" />
      <VStack w="full" align="start" gap={0}>
        {title && (
          <Text
            fontSize={14}
            fontWeight={600}
            color={type === 'info' ? 'info.300' : 'brand.500'}
          >
            {title}
          </Text>
        )}
        <Text fontSize={12} color={type === 'info' ? 'info.300' : 'brand.400'}>
          {description}
        </Text>
      </VStack>
    </HStack>
  );
}
