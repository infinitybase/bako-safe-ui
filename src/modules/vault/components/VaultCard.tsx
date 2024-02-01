import { Icon } from '@chakra-ui/icons';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  CardProps,
  Divider,
  Heading,
  HStack,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Card } from '@/components';
import { HandbagIcon } from '@/components/icons/handbag';
import { PredicateMember } from '@/modules/core/models/predicate';
import { PermissionRoles } from '@/modules/core/models/workspace';
import { WorkspacePermissionUtils } from '@/modules/workspace/utils';
// import { useNotification } from '@/modules/notification';

interface VaultCardProps extends CardProps {
  name: string;
  // address: string;
  role: PermissionRoles;
  members: PredicateMember[];
}

export const VaultCard = ({
  name,
  // address,
  role,
  members,
  ...rest
}: VaultCardProps) => {
  const permissions = WorkspacePermissionUtils.permissions[role ?? 'VIEWER'];

  return (
    <Card bg="dark.300" w="100%" cursor="pointer" zIndex={100} {...rest}>
      <VStack alignItems="flex-start">
        <HStack w="100%" justifyContent="space-between" mb={1}>
          <HStack>
            <Avatar
              variant="roundedSquare"
              name={name}
              color="white"
              bg="grey.900"
            />
            <VStack ml={2} alignItems="flex-start" spacing={1}>
              <HStack>
                <Icon as={HandbagIcon} fontSize="md" color="grey.200" />
                <Text color="grey.200" fontSize="sm">
                  Workspace Name
                </Text>
              </HStack>

              <Heading
                maxW={{ sm: 28, md: 28, lg: 28, xl: 130, '2xl': 180 }}
                variant="title-md"
                color="grey.200"
                isTruncated
              >
                {name}
              </Heading>
            </VStack>
          </HStack>
        </HStack>

        <Divider borderColor="dark.100" my={1} />

        <HStack w="full">
          <Box>
            <Text variant="description">Members</Text>
            <AvatarGroup
              variant="roundedSquare"
              max={5}
              mt={1}
              size="sm"
              spacing={-2}
            >
              {members.map(({ avatar, address }) => (
                <Avatar variant="roundedSquare" src={avatar} key={address} />
              ))}
            </AvatarGroup>
          </Box>

          <Spacer />

          <VStack spacing={1} alignItems="flex-end">
            <Text variant="description">Role</Text>
            <Badge h={6} variant={permissions.variant}>
              {permissions.title}
            </Badge>
          </VStack>
        </HStack>
      </VStack>
    </Card>
  );
};
