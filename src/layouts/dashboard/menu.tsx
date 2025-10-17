import {
  Badge as ChakraBadge,
  BadgeProps,
  Box,
  Flex,
  FlexProps,
  Icon as ChakraIcon,
  IconProps,
  Text,
  TextProps,
  VStack,
} from 'bako-ui';

const Container = ({
  children,
  isActive,
  ...props
}: FlexProps & { isActive?: boolean }) => (
  <Box
    p={3}
    w="full"
    cursor="pointer"
    rounded="lg"
    bg={isActive ? 'bg.muted' : 'transparent'}
    data-active={isActive ? 'true' : 'false'}
    border="1px solid"
    borderColor="transparent"
    transition="all 0.2s ease"
    _hover={{
      borderColor: 'bg.muted',
      '& .menuTitle, .menuIcon': { color: 'gray.50' },
    }}
  >
    <Flex
      css={{
        w: '100%',
        justifyContent: 'flex-start',
        gap: 3,
        alignItems: 'center',
      }}
      {...props}
    >
      {children}
    </Flex>
  </Box>
);

const Icon = ({ isActive, ...props }: IconProps & { isActive?: boolean }) => (
  <ChakraIcon
    w={4}
    {...props}
    color={isActive ? 'gray.50' : 'textSecondary'}
    transition="all 0.2s ease"
    className="menuIcon"
  />
);

const Title = ({ isActive, ...props }: TextProps & { isActive?: boolean }) => (
  <Text
    fontSize="xs"
    fontWeight={isActive ? 'semibold' : 'medium'}
    color={isActive ? 'gray.50' : 'textSecondary'}
    lineHeight="normal"
    transition="all 0.2s ease"
    className="menuTitle"
    {...props}
  />
);

const Badge = (props: BadgeProps) => (
  <ChakraBadge colorPalette="warning" fontWeight="normal" {...props} />
);

const SidebarMenu = {
  Icon,
  Title,
  Badge,
  Container,
  List: VStack,
};

export { SidebarMenu };
