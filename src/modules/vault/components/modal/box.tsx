import { Avatar, Badge, HStack, Text, VStack } from '@chakra-ui/react';

import { Card, CardProps, UsersIcon } from '@/components';
import { AddressUtils } from '@/modules/core';

import { PredicateWorkspace } from '../../services';

interface VaultDrawerBoxProps extends CardProps {
  isActive?: boolean;
  name: string;
  address: string;
  workspace?: PredicateWorkspace;
  isSingleWorkspace?: boolean;
  isInDapp?: boolean;
  members?: number;
  root?: boolean;
}

const VaultItemBox = (props: VaultDrawerBoxProps) => {
  const { isActive, name, members, root, address, ...rest } = props;

  return (
    <Card
      {...rest}
      w="100%"
      cursor="pointer"
      borderColor={isActive ? 'brand.500' : 'dark.100'}
      borderWidth="1px"
      display="flex"
      flexDir="column"
      justifyContent="center"
      p={4}
    >
      <HStack width="100%" alignItems="center" spacing={2} h="48px">
        <HStack flex={1} alignItems="center" h="full" spacing={3}>
          <Avatar
            variant="roundedSquare"
            color="grey.250"
            bgColor="grey.950"
            name={name}
            size={'md'}
            sx={{
              '> div': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 'normal',
              },
            }}
          />
          <VStack
            alignItems="flex-start"
            spacing={1}
            justifyContent="center"
            h="full"
          >
            {/* Commented out this workspace logic */}
            {/* {!isSingleWorkspace && (
            <HStack>
              <Icon as={HandbagIcon} fontSize={14} color="grey.200" />
              <Text
                maxW={isExtraSmall ? 40 : 48}
                color="grey.75"
                fontSize="xs"
                isTruncated
              >
                {workspace?.name}
              </Text>
            </HStack>
          )} */}
            <Text
              variant="subtitle"
              isTruncated
              maxW={{ base: 120, xs: 250 }}
              color="grey.75"
              fontSize="xs"
              lineHeight="16px"
            >
              {name}
            </Text>
            <Text
              variant="subtitle"
              isTruncated
              maxW={{ base: 120, xs: 250 }}
              color="grey.550"
              fontSize={12}
              lineHeight="16px"
            >
              {AddressUtils.format(address ?? '', 4)}
            </Text>
          </VStack>
        </HStack>

        <VStack
          alignItems="center"
          justifyContent={'center'}
          h="full"
          spacing={0}
        >
          <HStack
            w={'full'}
            spacing={1}
            justifyContent="flex-end"
            alignItems="flex-start"
            paddingY={1}
            h={'full'}
          >
            <Text
              color="grey.250"
              fontWeight={500}
              fontSize={10}
              lineHeight="1.4"
              letterSpacing={'5%'}
            >
              {members}
            </Text>
            <UsersIcon fontSize={14} color={'grey.250'} />
          </HStack>
          {root && (
            <Badge
              variant="gray"
              fontSize="2xs"
              color="grey.75"
              h={5}
              borderRadius={20}
            >
              Personal
            </Badge>
          )}
        </VStack>
      </HStack>
    </Card>
  );
};

export { VaultItemBox };
