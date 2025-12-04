import { Badge, Card, Heading, Icon, IconProps, Text, VStack } from 'bako-ui';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface IWelcomeCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<IconProps>;
  onClick?: () => void;
  iconSize?: string;
  commingSoon?: boolean;
}

const MotionVStack = motion(VStack);
const MotionText = motion(Text);
const MotionBadge = motion(Badge);

const WelcomeCard = ({
  description,
  icon,
  title,
  onClick,
  iconSize,
  commingSoon,
}: IWelcomeCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card.Root
      w="full"
      h="full"
      minH={104}
      variant="subtle"
      bg="bg.muted"
      borderRadius="lg"
      onClick={onClick}
      opacity={0.6}
      _hover={{
        opacity: 1,
        bg: 'gray.550',
      }}
      cursor={commingSoon ? 'auto' : 'pointer'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card.Body
        w="full"
        display="flex"
        flexDirection="column"
        gap={2}
        p={4}
        py={2}
        alignItems="center"
        justifyContent="center"
        position="relative"
        overflow="hidden"
      >
        <MotionVStack
          layout
          alignItems="center"
          w="full"
          gap={2}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 25,
          }}
        >
          <Icon as={icon} color="textPrimary" w={iconSize} />
          <Heading
            fontSize="2xs"
            color="textPrimary"
            textAlign="center"
            lineHeight="short"
          >
            {title}
          </Heading>
        </MotionVStack>

        <MotionText
          fontSize="xs"
          color="textSecondary"
          textAlign="center"
          lineHeight="short"
          initial={{ opacity: 0 }}
          hidden={!isHovered}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{
            opacity: { duration: 0.2, ease: 'easeInOut' },
            y: {
              type: 'spring',
              stiffness: 200,
              damping: 25,
            },
          }}
        >
          {description}
        </MotionText>

        {commingSoon && (
          <MotionBadge
            variant="solid"
            colorPalette="yellow"
            position="absolute"
            top={2}
            right={2}
            size="xs"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{
              opacity: { duration: 0.2, ease: 'easeInOut', delay: 0.05 },
            }}
          >
            Coming soon
          </MotionBadge>
        )}
      </Card.Body>
    </Card.Root>
  );
};

export default WelcomeCard;
