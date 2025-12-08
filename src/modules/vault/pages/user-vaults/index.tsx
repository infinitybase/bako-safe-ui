import {
  Box,
  Breadcrumb,
  Button,
  Grid,
  GridItem,
  HStack,
  Icon,
  Text,
  VStack,
} from 'bako-ui';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';

import { CustomSkeleton, HomeIcon } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { Pages, PermissionRoles } from '@/modules/core';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { CreateVaultDialog, VaultCard } from '../../components';
import { getSignaturesCount } from '../../utils';

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

  return (
    <VStack
      w="full"
      gap={6}
      p={{ base: 1, sm: 1 }}
      px={{ base: 'auto', sm: 8 }}
    >
      <CreateVaultDialog open={isOpen} onOpenChange={onOpenChange} />
      <HStack
        h="10"
        w="full"
        justifyContent={{ base: 'flex-end', sm: 'space-between' }}
        maxW="full"
      >
        <HStack visibility={{ base: 'hidden', sm: 'visible' }}>
          <Button
            colorPalette="primary"
            fontWeight="semibold"
            fontSize={15}
            px={3}
            bg="dark.100"
            color="grey.200"
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
            <IoChevronBack size={22} />
            Back home
          </Button>
          <Breadcrumb.Root ml={8}>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  onClick={() => goHome()}
                >
                  <Icon mr={2} as={HomeIcon} w={3} color="grey.200" />
                  Home
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              {/* Commented out code to temporarily disable workspaces. */}
              {/* {!userInf.os.onSingleWorkspace && (
              <Breadcrumb.Item>
                <BreadcrumbLink
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  onClick={() =>
                    handleWorkspaceSelection(
                      workspaceId,
                      Pages.workspace({
                        workspaceId,
                      }),
                    )
                  }
                  maxW={40}
                  isTruncated
                >
                  {userInfos.workspace?.name}
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            )} */}
              <Breadcrumb.Item>
                <Breadcrumb.Link
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  href="#"
                >
                  Vaults
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </HStack>
      </HStack>

      <HStack w="full" justifyContent="space-between" pb={2}>
        <Text color="white" fontWeight="semibold" fontSize="md">
          Accounts
        </Text>
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
            gap={6}
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
                    requiredSigners={getSignaturesCount(vault)}
                    signersCount={vault?.members?.length || 1}
                    workspaceId={vault.workspace.id}
                    title={vault.description}
                    isHidden={vault.isHidden}
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
