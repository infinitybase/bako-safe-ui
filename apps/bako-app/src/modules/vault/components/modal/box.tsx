import type { PredicateWorkspace } from '@bako-safe/services';
import { Card, type CardProps } from '@bako-safe/ui';
import { Avatar, Badge, HStack, Text, VStack } from '@chakra-ui/react';

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
  const { isActive, name, members, root, ...rest } = props;

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
      p={4}
    >
      <HStack width="100%" alignItems="center" spacing={2} h="32px">
        <HStack flex={1} alignItems="center" h="full" spacing={4}>
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
      </HStack>
    </Card>
  );
};

export { VaultItemBox };
