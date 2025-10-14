import { useMutation } from '@tanstack/react-query';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Card,
  CardRootProps,
  Heading,
  HStack,
  Loader,
  Separator,
  Spacer,
  Text,
  VStack,
} from 'bako-ui';
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { usePermissions } from '@/modules/core/hooks/usePermissions';
import { PredicateMember } from '@/modules/core/models/predicate';
import {
  PermissionDetails,
  WorkspacePermissionUtils,
} from '@/modules/workspace/utils';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { PredicateWorkspace, VaultService } from '../services';
import VaultCardMemberAvatar from './VaultCardMemberAvatar';

interface VaultCardProps extends CardRootProps {
  ownerId: string;
  name: string;
  members: PredicateMember[];
  workspace: PredicateWorkspace;
  inHome?: boolean;
  isHidden?: boolean;
  address: string;
}
export const VaultCard = ({
  ownerId,
  name,
  workspace,
  members,
  inHome,
  isHidden,
  address,
  ...rest
}: VaultCardProps) => {
  const { role } = usePermissions(ownerId);
  const {
    screenSizes: { isExtraSmall },
    userVaults,
    workspaceInfos: {
      requests: { latestPredicates },
    },
  } = useWorkspaceContext();

  const { mutate: toogleVisibility, isPending } = useMutation({
    mutationFn: VaultService.toggleVisibility,
    onSuccess: () => {
      userVaults.request.refetch();
      latestPredicates.refetch();
    },
  });
  const [localHidden, setLocalHidden] = useState(isHidden);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalHidden((prev) => !prev);
    toogleVisibility(address);
  };

  useEffect(() => {
    setLocalHidden(isHidden);
  }, [isHidden]);

  if (inHome && isHidden) return null;

  return (
    <Card.Root
      borderColor="gradients.transaction-border"
      bg="gradients.transaction-card"
      borderWidth={1}
      backdropFilter="blur(16px)"
      dropShadow="0px 8px 6px 0px #00000026"
      w="100%"
      maxW={isExtraSmall ? 272 : 'full'}
      my={{ base: 6, sm: 0 }}
      cursor="pointer"
      zIndex={20}
      {...rest}
      position="relative"
      opacity={!localHidden ? 1 : 0.5}
      transition="opacity 0.3s ease-in-out, background 0.3s ease"
    >
      {inHome ?? (
        <Box
          position="absolute"
          top={3}
          right={3}
          cursor={isPending ? 'not-allowed' : 'pointer'}
          zIndex={10}
          bg="#F5F5F50D"
          borderRadius="6px"
          boxSize={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={isPending ? undefined : handleToggle}
        >
          {isPending ? (
            <Loader
              size="xs"
              color="grey.400"
              borderWidth="2px"
              animationDuration="0.5s"
            />
          ) : localHidden ? (
            <FaEyeSlash size={16} color="#fff" />
          ) : (
            <FaEye size={16} color="#fff" />
          )}
        </Box>
      )}
      <VStack alignItems="flex-start">
        <HStack maxW="80%" justifyContent="space-between" mb={1}>
          <HStack maxW="full">
            <Avatar shape="rounded" name={name} color="white" bg="grey.600" />
            <VStack ml={2} maxW="full" alignItems="flex-start" gap={1}>
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
                // variant="title-md"
                color="grey.200"
                truncate
              >
                {name}
              </Heading>
            </VStack>
          </HStack>
        </HStack>

        <Separator borderColor="grey.600" my={1} />

        <HStack w="full">
          <Box>
            <Text>Signers</Text>
            <AvatarGroup
              // shape="rounded"
              mt={1}
              // size="sm"
              gap={-2}
              css={{
                '&>span': {
                  height: '38px',
                  width: '38px',
                },
              }}
            >
              {members.map((member) => (
                <VaultCardMemberAvatar member={member} key={member.id} />
              ))}
            </AvatarGroup>
          </Box>

          <Spacer />

          <VStack gap={1} alignItems="flex-end">
            <Text>Role</Text>
            <Badge
              h={6}
              rounded="full"
              variant="outline"
              colorPalette={
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
    </Card.Root>
  );
};
