import {
  AddressBookIcon,
  CustomSkeleton,
  EmptyState,
  HomeIcon,
  TransactionsIcon,
  VaultIcon,
} from '@bako-safe/ui/components';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Grid,
  GridItem,
  HStack,
  Icon,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

import { Pages } from '@/modules/core';
import { ActionCard } from '@/modules/home/components/ActionCard';
import { PermissionRoles } from '@/modules/workspace/types';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { CreateVaultDialog, VaultCard } from '../../components';

const UserVaultsPage = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { MANAGER, OWNER, ADMIN } = PermissionRoles;

  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: { hasPermission, handleWorkspaceSelection, goHome },
      requests: { latestPredicates },
    },
    userVaults: {
      request: { vaults, isLoading },
      handlers: { navigate },
      inView,
    },
  } = useWorkspaceContext();
  const workspaceId = userInfos?.workspace?.id ?? '';

  return (
    <VStack
      w="full"
      spacing={6}
      p={{ base: 1, sm: 1 }}
      px={{ base: 'auto', sm: 8 }}
    >
      <CreateVaultDialog isOpen={isOpen} onClose={onClose} />
      <HStack
        h="10"
        w="full"
        justifyContent={{ base: 'flex-end', sm: 'space-between' }}
        maxW="full"
      >
        <HStack visibility={{ base: 'hidden', sm: 'visible' }}>
          <Button
            variant="primary"
            fontWeight="semibold"
            fontSize={15}
            leftIcon={<Box mr={-1}>{/* <IoChevronBack size={22} /> */}</Box>}
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
            Back home
          </Button>
          <Breadcrumb ml={8}>
            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() => goHome()}
              >
                <Icon mr={2} as={HomeIcon} fontSize="sm" color="grey.200" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>

            {/* Commented out code to temporarily disable workspaces. */}

            {/* {!userInfos.onSingleWorkspace && (
              <BreadcrumbItem>
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
                </BreadcrumbLink>
              </BreadcrumbItem>
            )} */}

            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                href="#"
              >
                Vaults
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </HStack>
        <Box>
          <Button
            variant="primary"
            fontWeight="bold"
            // leftIcon={<FaRegPlusSquare />}
            isDisabled={!hasPermission([OWNER, MANAGER, ADMIN])}
            onClick={onOpen}
          >
            Create vault
          </Button>
        </Box>
      </HStack>

      <CustomSkeleton display="flex" isLoaded={!latestPredicates.isLoading}>
        <Stack w="full" direction={{ base: 'column', md: 'row' }} spacing={6}>
          <ActionCard.Container
            flex={1}
            onClick={() =>
              navigate(
                Pages.userVaults({
                  workspaceId: userInfos.workspace?.id,
                }),
              )
            }
          >
            <ActionCard.Icon icon={VaultIcon} />
            <Box>
              <ActionCard.Title>Vaults</ActionCard.Title>
              <ActionCard.Description>
                Access and Manage All Your Vaults in One Place.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>

          <ActionCard.Container
            flex={1}
            onClick={() => {
              navigate(
                Pages.userTransactions({
                  workspaceId: userInfos.workspace?.id,
                }),
              );
            }}
          >
            <ActionCard.Icon icon={TransactionsIcon} />
            <Box>
              <ActionCard.Title>Transactions</ActionCard.Title>
              <ActionCard.Description>
                Manage Transactions Across All Vaults in One Place.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>

          <ActionCard.Container
            flex={1}
            onClick={() =>
              navigate(
                Pages.addressBook({
                  workspaceId: userInfos.workspace?.id,
                }),
              )
            }
          >
            <ActionCard.Icon icon={AddressBookIcon} />
            <Box>
              <ActionCard.Title>Address book</ActionCard.Title>
              <ActionCard.Description>
                Access and Manage Your Contacts for Easy Transfers and Vault
                Creation.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>
        </Stack>
      </CustomSkeleton>

      {/* USER VAULTS */}
      <Box mt={4} mb={-2} alignSelf="flex-start">
        <Text variant="subtitle" fontWeight="semibold" color="grey.75">
          Vaults
        </Text>
      </Box>

      {!vaults?.length && !isLoading && (
        <CustomSkeleton isLoaded={!isLoading}>
          <EmptyState
            bg={'red'}
            showAction={hasPermission([OWNER, MANAGER, ADMIN])}
            title={`Let's Begin!`}
            subTitle={`Your vaults are entirely free on Fuel. Let's create your very first one?`}
            buttonActionTitle="Create my first vault"
            buttonAction={onOpen}
          />
        </CustomSkeleton>
      )}
      {vaults?.length && (
        <Box
          w="full"
          minH="60vh"
          maxH="79vh"
          mt={-2}
          pb={{ base: 8, sm: 0 }}
          overflowY="scroll"
          overflowX="hidden"
          scrollBehavior="smooth"
          sx={{
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
              xs: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              '2xl': 'repeat(4, 1fr)',
            }}
          >
            {vaults?.map(
              ({ id, name, workspace, members, description, owner }) => {
                return (
                  <CustomSkeleton isLoaded={!isLoading} key={id} maxH="180px">
                    <GridItem>
                      <VaultCard
                        ownerId={owner.id}
                        name={name}
                        workspace={workspace}
                        title={description}
                        members={members!}
                        onClick={() =>
                          handleWorkspaceSelection(
                            workspace.id,
                            Pages.detailsVault({
                              workspaceId: workspace.id,
                              vaultId: id,
                            }),
                          )
                        }
                      />
                    </GridItem>
                  </CustomSkeleton>
                );
              },
            )}
          </Grid>
          <Box ref={inView.ref} />
        </Box>
      )}
    </VStack>
  );
};

export { UserVaultsPage };
