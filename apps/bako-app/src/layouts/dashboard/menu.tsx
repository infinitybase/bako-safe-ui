import {
  Badge as ChakraBadge,
  type BadgeProps,
  Box,
  chakra,
  Flex,
  type FlexProps,
  Icon as ChakraIcon,
  type IconProps,
  type MergeWithAs,
  Text,
  type TextProps,
  VStack,
} from '@chakra-ui/react';

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
      w="100%"
      justifyContent="flex-start"
      gap={4}
      alignItems="center"
      py={5}
      {...props}
    >
      {children}
    </Flex>
  </Box>
);

const Icon = ({
  isActive,
  ...props
}: MergeWithAs<IconProps, never> & { isActive?: boolean }) => (
  <ChakraIcon
    fontSize="lg"
    {...props}
    color={isActive ? 'grey.50' : 'grey.425'}
  />
);

const Title = ({ isActive, ...props }: TextProps & { isActive?: boolean }) => (
  <Text
    variant="subtitle"
    fontSize="sm"
    fontWeight={600}
    color={isActive ? 'grey.50' : 'grey.425'}
    lineHeight="16.94px"
    {...props}
  />
);

const Badge = (props: BadgeProps) => (
  <ChakraBadge variant="warning" fontWeight="normal" {...props} />
);

const SidebarMenu = {
  Icon,
  Title,
  Badge,
  Container,
  List: chakra(VStack),
};

export { SidebarMenu };
