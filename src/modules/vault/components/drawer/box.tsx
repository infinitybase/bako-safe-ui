import { Icon } from '@chakra-ui/icons';
import { Avatar, Box, HStack, Text, VStack } from '@chakra-ui/react';

import { Card, CardProps } from '@/components';
import { HandbagIcon } from '@/components/icons/handbag';
import { Workspace } from '@/modules/core';

interface VaultDrawerBoxProps extends CardProps {
  isActive?: boolean;
  name: string;
  address: string;
  description?: string;
  workspace?: Workspace;
  isSingleWorkspace?: boolean;
}

const VaultDrawerBox = (props: VaultDrawerBoxProps) => {
  const { isActive, name, description, workspace, isSingleWorkspace, ...rest } =
    props;

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
          {!isSingleWorkspace && (
            <HStack>
              <Icon as={HandbagIcon} fontSize={14} color="grey.200" />
              <Text maxW={48} color="grey.200" fontSize="sm" isTruncated>
                {workspace?.name}
              </Text>
            </HStack>
          )}
          <Text variant="subtitle" isTruncated maxW={{ base: 120, xs: 250 }}>
            {name}
          </Text>
        </VStack>
      </HStack>
      <Box>
        <Text variant="description" isTruncated maxW={{ base: 120, xs: 200 }}>
          {description ?? ''}
        </Text>
      </Box>
    </Card>
  );
};

export { VaultDrawerBox };
