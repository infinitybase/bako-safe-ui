import { Avatar, Box, HStack, Text, VStack } from '@chakra-ui/react';

import { Card, CardProps } from '@/components';
import { AddressUtils } from '@/modules/core';

interface VaultDrawerBoxProps extends CardProps {
  isActive?: boolean;
  name: string;
  address: string;
  description?: string;
}

const VaultDrawerBox = (props: VaultDrawerBoxProps) => {
  const { isActive, name, address, description, ...rest } = props;

  return (
    <Card
      {...rest}
      w="100%"
      bgColor="dark.300"
      cursor="pointer"
      borderColor={isActive ? 'brand.500' : 'dark.100'}
      borderWidth={isActive ? '2px' : '1px'}
    >
      <HStack
        width="100%"
        alignItems="center"
        spacing={4}
        mb={description ? 4 : 0}
      >
        <Avatar
          variant="roundedSquare"
          color="white"
          bgColor="dark.150"
          name={name}
        />
        <VStack alignItems="flex-start" spacing={0}>
          <Text variant="subtitle">{name}</Text>
          <Text variant="description">{AddressUtils.format(address)}</Text>
        </VStack>
      </HStack>
      <Box>
        <Text variant="description" noOfLines={2}>
          {description ?? ''}
        </Text>
      </Box>
    </Card>
  );
};

export { VaultDrawerBox };
