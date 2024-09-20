import { Avatar, HStack, Text, VStack } from '@chakra-ui/react';

import { Card, CardProps } from '@/components';
import { Workspace } from '@/modules/core';

interface VaultDrawerBoxProps extends CardProps {
  isActive?: boolean;
  name: string;
  address: string;
  workspace?: Workspace;
  isSingleWorkspace?: boolean;
  isInDapp?: boolean;
  members?: number;
}

const VaultItemBox = (props: VaultDrawerBoxProps) => {
  const { isActive, name, members, ...rest } = props;

  const hasMultipleMembers = members && members >= 2;

  return (
    <Card
      {...rest}
      w="100%"
      cursor="pointer"
      borderColor={isActive ? 'brand.500' : 'dark.100'}
      borderWidth="1px"
      h="64px"
      display="flex"
      flexDir="column"
      justifyContent="center"
    >
      <HStack width="100%" alignItems="center" spacing={4} h="32px">
        <Avatar
          variant="roundedSquare"
          color="grey.250"
          bgColor="grey.950"
          name={name}
          size="sm"
        />
        <VStack alignItems="flex-start" spacing={0}>
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
            lineHeight="14.52px"
          >
            {name}
          </Text>
          {members && (
            <Text
              variant="subtitle"
              isTruncated
              maxW={{ base: 120, xs: 250 }}
              color="grey.550"
              fontSize="xs"
              lineHeight="14.52px"
            >
              {`${members} ${hasMultipleMembers ? 'members' : 'member'}`}
            </Text>
          )}
        </VStack>
      </HStack>
    </Card>
  );
};

export { VaultItemBox };
