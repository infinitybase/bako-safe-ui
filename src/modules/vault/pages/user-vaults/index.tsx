import { Box, Button, Grid, GridItem, HStack, Icon, VStack } from 'bako-ui';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { RiLockLine } from 'react-icons/ri';

import { CustomSkeleton, HomeIcon } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { Pages, PermissionRoles } from '@/modules/core';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useCheckUserBalances } from '@/modules/home/hooks';
import { useBalanceOutdatedSocketListener } from '@/modules/home/hooks/events';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { CreateVaultDialog, VaultCard } from '../../components';

const UserVaultsPage = () => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  const { MANAGER, OWNER, ADMIN } = PermissionRoles;

  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: { hasPermission, handleWorkspaceSelection, goHome },
    },
    userVaults: {
      request: { vaults, isLoading },
      inView,
      filter: { value, change },
    },
    screenSizes: { isSmall, isExtraSmall },
  } = useWorkspaceContext();

  const workspaceId = userInfos?.workspace?.id ?? '';
  const noVaults = !vaults?.length;
  const showHiddenMessage = noVaults && !isLoading && !value;
  const showEmptyState = noVaults && !isLoading && value;
  const showVaultGrid = !!vaults?.length;

  useCheckUserBalances();
  useBalanceOutdatedSocketListener();

  return (
    <VStack w="full" gap={6} p={{ base: 1, sm: 1 }} px={{ base: 0, sm: 8 }}>
      <CreateVaultDialog open={isOpen} onOpenChange={onOpenChange} />

      <HStack
        w="full"
        justifyContent="space-between"
        pb={2}
        flexDirection={{ base: 'column', md: 'row' }}
        align={{ base: 'flex-start', md: 'center' }}
      >
        <HStack w={isExtraSmall ? 'full' : 'unset'} gap={2}>
          <Button
            fontWeight="semibold"
            fontSize="2xs"
            size="xs"
            bgColor="gray.600"
            color="gray.200"
            _hover={{
              bg: 'gray.550',
              color: 'textPrimary',
            }}
            gap={2}
            p={2}
            onClick={() =>
              userInfos.onSingleWorkspace
                ? goHome()
                : handleWorkspaceSelection(
                    workspaceId,
                    Pages.workspace({
                      workspaceId,
                    }),
                  )
            }
          >
            <HomeIcon w={5} color="gray.200" />
            {isSmall ? '' : 'HOME'}
          </Button>

          <Button
            flex={isExtraSmall ? 1 : 'unset'}
            fontWeight="semibold"
            fontSize="2xs"
            size="xs"
            bgColor="gray.550"
            color="gray.200"
            cursor="default"
            gap={2}
            p={2}
          >
            <Icon w={4} h={4} color="gray.200" as={RiLockLine} />
            ACCOUNTS
          </Button>
        </HStack>

        <HStack gap={2}>
          {value ? (
            <Button
              variant="subtle"
              alignSelf={{ base: 'stretch', sm: 'flex-end' }}
              onClick={() => change(false)}
              px={isExtraSmall ? 3 : 4}
            >
              <Icon
                as={() => <FaEyeSlash color="grey.75" />}
                fontSize="lg"
                ml={isSmall ? -1 : 0}
                className="btn-icon"
              />
              Hide Inactives
            </Button>
          ) : (
            <Button
              variant="subtle"
              alignSelf={{ base: 'stretch', sm: 'flex-end' }}
              onClick={() => change(true)}
              px={isExtraSmall ? 3 : 4}
            >
              <Icon
                as={() => <FaEye color="grey.75" />}
                fontSize="lg"
                ml={isSmall ? -1 : 0}
                className="btn-icon"
              />
              Show Inactives
            </Button>
          )}

          <Button
            variant="subtle"
            onClick={onOpen}
            disabled={!hasPermission([OWNER, MANAGER, ADMIN])}
          >
            Create new Account
          </Button>
        </HStack>
      </HStack>

      {showEmptyState ||
        (showHiddenMessage && (
          <CustomSkeleton loading={isLoading}>
            <EmptyState
              showAction={hasPermission([OWNER, MANAGER, ADMIN])}
              title="Let's Begin!"
              subTitle="Your vaults are entirely free on Fuel. Let's create your very first one?"
              buttonActionTitle="Create my first vault"
              buttonAction={onOpen}
            />
          </CustomSkeleton>
        ))}

      {showVaultGrid && (
        <Box
          key={`vaults-${value}`}
          w="full"
          minH="60vh"
          maxH="79vh"
          mt={-2}
          pb={{ base: 8, sm: 0 }}
          pt={{ base: '25px', sm: 0 }}
          overflowY="scroll"
          overflowX="hidden"
          scrollBehavior="smooth"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
              width: '5px',
              maxHeight: '330px',
              backgroundColor: 'grey.200',
              borderRadius: '30px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#2C2C2C',
              borderRadius: '30px',
              height: '10px',
            },
          }}
        >
          <Grid
            mt={{ base: -6, sm: 0 }}
            w="full"
            maxW="full"
            gap={{ base: 4, sm: 6 }}
            templateColumns={{
              base: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              '2xl': 'repeat(4, 1fr)',
            }}
          >
            {vaults?.map((vault) => (
              <CustomSkeleton loading={isLoading} key={vault.id} maxH="180px">
                <GridItem>
                  <VaultCard
                    id={vault.id}
                    name={vault.name}
                    workspaceId={vault.workspace.id}
                    title={vault.description}
                    isHidden={vault.isHidden}
                    showHideButton
                    onClick={() =>
                      handleWorkspaceSelection(
                        vault.workspace.id,
                        Pages.detailsVault({
                          workspaceId: vault.workspace.id,
                          vaultId: vault.id,
                        }),
                      )
                    }
                    address={vault.predicateAddress}
                  />
                </GridItem>
              </CustomSkeleton>
            ))}
          </Grid>
          <Box ref={inView.ref} />
        </Box>
      )}
    </VStack>
  );
};

export { UserVaultsPage };
