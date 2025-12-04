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
  isMobile: boolean;
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
      minH={{ sm: 140 }}
      variant="subtle"
      onClick={onClick}
      opacity={0.6}
      _hover={{
        opacity: 1,
      }}
      cursor={commingSoon ? 'auto' : 'pointer'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card.Body
        w="full"
        display="flex"
        flexDirection={{ base: 'row', sm: 'column' }}
        gap={{ sm: 2, base: 6 }}
        p={4}
        alignItems="center"
        justifyContent={{ sm: 'center', base: 'flex-start' }}
        position="relative"
        overflow="hidden"
      >
        <MotionVStack
          alignItems="center"
          w={{ sm: 'full' }}
          minW={{ base: '60px', sm: 'unset' }}
          gap={2}
          animate={
            !isMobile ? { y: isHovered ? -10 : 0 } : undefined
          }
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 25,
          }}
        >
          <Icon as={icon} color="textPrimary" w={iconSize} />
          <Heading
            fontSize="xs"
            color="textPrimary"
            textAlign="center"
            lineHeight="short"
          >
            {title}
          </Heading>
        </MotionVStack>

        <Stack gap={0}>
          <MotionText
            fontSize="xs"
            color="textSecondary"
            textAlign={{ sm: 'center' }}
            lineHeight="short"
            initial={!isMobile ? { opacity: 0, y: -10 } : undefined}
            display={{ base: 'block', sm: !isHovered ? 'none' : 'block' }}
            animate={
              !isMobile && {
                opacity: isHovered ? 1 : 0,
                y: isHovered ? -10 : 0,
              }
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
              position={{ base: 'relative', sm: 'absolute' }}
              top={2}
              right={2}
              size="xs"
              alignSelf="flex-start"
              initial={!isMobile && { opacity: 0 }}
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
