import {
  Badge,
  Card,
  Heading,
  Icon,
  IconProps,
  Stack,
  Text,
  VStack,
} from 'bako-ui';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface IWelcomeCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<IconProps>;
  onClick?: () => void;
  iconSize?: string;
  commingSoon?: boolean;
  isMobile?: boolean;
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
  isMobile,
}: IWelcomeCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card.Root
      w="full"
      h="full"
      minH={isMobile ? 'unset' : 104}
      variant="subtle"
      bg={isMobile ? 'unset' : 'bg.muted'}
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
        flexDirection={isMobile ? 'row' : 'column'}
        gap={isMobile ? 6 : 2}
        p={4}
        py={isMobile ? 4 : 2}
        alignItems="center"
        justifyContent={isMobile ? 'flex-start' : 'center'}
        position="relative"
        overflow="hidden"
      >
        <MotionVStack
          layout
          alignItems="center"
          w={isMobile ? 'unset' : 'full'}
          minW={isMobile ? '60px' : 'unset'}
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
            letterSpacing="8%"
          >
            {title}
          </Heading>
        </MotionVStack>

        <Stack gap={0}>
          <MotionText
            fontSize="xs"
            color="textSecondary"
            textAlign={isMobile ? 'unset' : 'center'}
            lineHeight="short"
            initial={!isMobile ? { opacity: 0 } : undefined}
            display={isMobile ? 'block' : !isHovered ? 'none' : 'block'}
            animate={
              !isMobile
                ? {
                    opacity: isHovered ? 1 : 0,
                  }
                : undefined
            }
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
              position={isMobile ? 'relative' : 'absolute'}
              top={2}
              right={2}
              size="xs"
              alignSelf="flex-start"
              initial={!isMobile ? { opacity: 0 } : undefined}
              animate={
                !isMobile
                  ? {
                      opacity: isHovered ? 1 : 0,
                    }
                  : undefined
              }
              transition={{
                opacity: { duration: 0.2, ease: 'easeInOut', delay: 0.05 },
              }}
            >
              Coming soon
            </MotionBadge>
          )}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};

export default WelcomeCard;
