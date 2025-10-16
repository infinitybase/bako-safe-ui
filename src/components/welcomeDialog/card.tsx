import { HStack, Icon, IconProps, Text, VStack } from 'bako-ui';

interface IWelcomeCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<IconProps>;
  onClick?: () => void;
  iconSize?: string;
  commingSoon?: boolean;
}

const WelcomeCard = ({
  description,
  icon,
  title,
  onClick,
  iconSize,
  commingSoon,
}: IWelcomeCardProps) => {
  return (
    <HStack
      w="full"
      gap={4}
      p={4}
      borderRadius="md"
      border="1px solid #35302F"
      boxShadow="0px 8px 6px 0px #00000026"
      background="linear-gradient(0deg, rgba(245, 245, 245, 0.03), rgba(245, 245, 245, 0.03)),linear-gradient(180deg, rgba(21, 20, 19, 0.0375) 0%, rgba(21, 20, 19, 0.0625) 28.5%, rgba(21, 20, 19, 0.125) 72%, rgba(21, 20, 19, 0.25) 100%)"
      onClick={onClick}
      opacity={commingSoon ? 0.5 : 'initial'}
      pointerEvents={commingSoon ? 'none' : 'auto'}
      cursor={commingSoon ? 'auto' : 'pointer'}
    >
      <Icon as={icon} color="grey.250" w={iconSize} />
      <VStack alignItems="start" w="full" gap={1}>
        <Text fontSize="sm" color="grey.250" lineHeight="15.85px">
          {title}
        </Text>
        <Text fontSize="xs" color="grey.250" lineHeight="13.58px">
          {description}
        </Text>
      </VStack>
      {commingSoon && (
        <Text
          fontSize="xs"
          color="grey.250"
          truncate
          minW="fit-content"
          p="4px 6px 4px 6px"
          borderRadius="xl"
          border="1px solid rgba(245, 245, 245, 0.25)"
          lineHeight="12.1px"
        >
          Comming soon
        </Text>
      )}
    </HStack>
  );
};

export default WelcomeCard;
