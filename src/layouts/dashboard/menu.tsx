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
    px={4}
    w="full"
    cursor="pointer"
    borderBottomWidth={1}
    borderColor={isActive ? 'brand.500' : 'transparent'}
  >
    <Flex
      css={{
        w: '100%',
        justifyContent: 'flex-start',
        gap: 4,
        alignItems: 'center',
        pb: 5,
        pt: 5,
      }}
      {...props}
    >
      {children}
    </Flex>
  </Box>
);

const Icon = ({ isActive, ...props }: IconProps & { isActive?: boolean }) => (
  <ChakraIcon w={6} {...props} color={isActive ? 'grey.50' : 'grey.425'} />
);

const Title = ({ isActive, ...props }: TextProps & { isActive?: boolean }) => (
  <Text
    // variant="subtitle"
    fontSize="sm"
    fontWeight={600}
    color={isActive ? 'grey.50' : 'grey.425'}
    lineHeight="16.94px"
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
