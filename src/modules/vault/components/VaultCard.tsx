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
import { useScreenSize } from '@/modules/core';
import { usePermissions } from '@/modules/core/hooks/usePermissions';
import { PredicateMember } from '@/modules/core/models/predicate';
import { Workspace } from '@/modules/core/models/workspace';
import { WorkspacePermissionUtils } from '@/modules/workspace/utils';

interface VaultCardProps extends CardProps {
  id: string;
  name: string;
  members: PredicateMember[];
  workspace: Workspace;
}
export const VaultCard = ({
  id,
  name,
  workspace,
  members,
  ...rest
}: VaultCardProps) => {
  const { role } = usePermissions({ id, workspace });
  const { isExtraSmall } = useScreenSize();

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
      _hover={{
        transform: 'scale(1.03)',
        transition: 'ease .3s',
      }}
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
              {!workspace.single && (
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
              )}
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
              variant={
                WorkspacePermissionUtils.permissions[role].variant ?? 'warning'
              }
            >
              {WorkspacePermissionUtils.permissions[role]?.title ?? ''}
            </Badge>
          </VStack>
        </HStack>
      </VStack>
    </Card>
  );
};
