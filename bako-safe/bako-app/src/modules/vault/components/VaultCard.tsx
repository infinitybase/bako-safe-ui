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
import { PredicateWorkspace } from '@services/modules/vault';
import { Card } from '@ui/components';

import { usePermissions } from '@/modules/core/hooks/usePermissions';
import { PredicateMember } from '@/modules/core/models/predicate';
import {
  PermissionDetails,
  WorkspacePermissionUtils,
} from '@/modules/workspace/utils';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface VaultCardProps extends CardProps {
  ownerId: string;
  name: string;
  members: PredicateMember[];
  workspace: PredicateWorkspace;
}
export const VaultCard = ({
  ownerId,
  name,
  workspace,
  members,
  ...rest
}: VaultCardProps) => {
  const { role } = usePermissions(ownerId);
  const {
    screenSizes: { isExtraSmall },
  } = useWorkspaceContext();

  return (
    <Card
      borderColor="gradients.transaction-border"
      bg="gradients.transaction-card"
      borderWidth={1}
      backdropFilter="blur(16px)"
      dropShadow="0px 8px 6px 0px #00000026"
      w="100%"
      maxW={isExtraSmall ? 272 : 'full'}
      my={{ base: 6, sm: 0 }}
      cursor="pointer"
      zIndex={100}
      {...rest}
    >
      <VStack alignItems="flex-start">
        <HStack maxW="80%" justifyContent="space-between" mb={1}>
          <HStack maxW="full">
            <Avatar
              variant="roundedSquare"
              name={name}
              color="white"
              bg="grey.600"
            />
            <VStack ml={2} maxW="full" alignItems="flex-start" spacing={1}>
              {/* Commented out code to temporarily disable workspaces. */}

              {/* {!workspace.single && (
                <HStack>
                  <Icon
                    w={4}
                    h={4}
                    as={HandbagIcon}
                    fontSize={14}
                    color="grey.200"
                  />
                  <Text
                    color="grey.400"
                    fontSize="sm"
                    isTruncated
                    maxW={{
                      base: 150,
                      sm: 130,
                      lg: 200,
                    }}
                  >
                    {workspace?.name}
                  </Text>
                </HStack>
              )} */}
              <Heading
                maxW={{
                  base: 150,
                  lg: !workspace.single ? 140 : 200,
                }}
                variant="title-md"
                color="grey.200"
                isTruncated
              >
                {name}
              </Heading>
            </VStack>
          </HStack>
        </HStack>

        <Divider borderColor="grey.600" my={1} />

        <HStack w="full">
          <Box>
            <Text variant="description">Signers</Text>
            <AvatarGroup
              variant="roundedSquare"
              max={5}
              mt={1}
              size="sm"
              spacing={-2}
              sx={{
                '&>span': {
                  height: '38px',
                  width: '38px',
                },
              }}
            >
              {members.map(({ avatar, address }) => (
                <Avatar
                  variant="roundedSquare"
                  borderRadius={8}
                  src={avatar}
                  key={address}
                  border="none"
                  sx={{
                    '&>img': {
                      border: '1px solid #CFCCC9',
                      boxShadow: '4px 0px 4px 0px #2B2827E5',
                    },
                  }}
                />
              ))}
            </AvatarGroup>
          </Box>

          <Spacer />

          <VStack spacing={1} alignItems="flex-end">
            <Text variant="description">Role</Text>
            <Badge
              h={6}
              rounded="full"
              variant={
                WorkspacePermissionUtils.permissions[
                  role as keyof PermissionDetails
                ].variant ?? 'warning'
              }
            >
              {WorkspacePermissionUtils.permissions[
                role as keyof PermissionDetails
              ]?.title ?? ''}
            </Badge>
          </VStack>
        </HStack>
      </VStack>
    </Card>
  );
};
