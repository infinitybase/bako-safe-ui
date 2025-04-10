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
import { FaEye, FaEyeSlash, FaPlus } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';

import { CustomSkeleton, HomeIcon, VaultIcon } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { AddressBookIcon } from '@/components/icons/address-book';
import { TransactionsIcon } from '@/components/icons/transactions';
import { Pages, PermissionRoles } from '@/modules/core';
import { ActionCard } from '@/modules/home/components/ActionCard';
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
      filter: { value, change },
    },
    screenSizes: { isSmall, isExtraSmall },
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
            leftIcon={
              <Box mr={-1}>
                <IoChevronBack size={22} />
              </Box>
            }
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
      <HStack w="full" justifyContent="space-between" pb={2}>
        <Text color="white" fontWeight="semibold" fontSize="md">
          Vaults
        </Text>
        <HStack spacing={2}>
          {value ? (
            <Button
              color="grey.75"
              variant="txFilterType"
              alignSelf={{ base: 'stretch', sm: 'flex-end' }}
              rightIcon={
                <Icon
                  as={() => <FaEyeSlash color="grey.75" />}
                  fontSize="lg"
                  ml={isSmall ? -1 : 0}
                  className="btn-icon"
                />
              }
              onClick={() => change(false)}
              px={isExtraSmall ? 3 : 4}
            >
              Hide Inactives
            </Button>
          ) : (
            <Button
              color="grey.75"
              variant="txFilterType"
              alignSelf={{ base: 'stretch', sm: 'flex-end' }}
              rightIcon={
                <Icon
                  as={() => <FaEye color="grey.75" />}
                  fontSize="lg"
                  ml={isSmall ? -1 : 0}
                  className="btn-icon"
                />
              }
              onClick={() => change(true)}
              px={isExtraSmall ? 3 : 4}
            >
              Show Inactives
            </Button>
          )}

          <Button
            color="grey.75"
            variant="txFilterType"
            alignSelf={{ base: 'stretch', sm: 'flex-end' }}
            rightIcon={
              <Icon
                as={() => <FaPlus color="grey.75" />}
                fontSize="lg"
                ml={isSmall ? -1 : 0}
                className="btn-icon"
              />
            }
            onClick={onOpen}
            px={isExtraSmall ? 3 : 4}
          >
            Create vault
          </Button>
        </HStack>
      </HStack>

      {!vaults?.length &&
        !isLoading &&
        (!value ? (
          <CustomSkeleton isLoaded={!isLoading}>
            <VStack
              w="full"
              h="full"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              borderWidth="1px"
              borderRadius="md"
              borderColor="gray.700"
              p={8}
              bg="blackAlpha.300"
            >
              <Text fontSize="lg" fontWeight="semibold">
                No vaults visible
              </Text>
              <Text fontSize="sm" color="gray.400" textAlign="center">
                You&apos;ve hidden all your vaults. <br />
                Update your visibility settings to see them again.
              </Text>
            </VStack>
          </CustomSkeleton>
        ) : (
          <CustomSkeleton isLoaded={!isLoading}>
            <EmptyState
              bg="red"
              showAction={hasPermission([OWNER, MANAGER, ADMIN])}
              title="Let's Begin!"
              subTitle="Your vaults are entirely free on Fuel. Let's create your very first one?"
              buttonActionTitle="Create my first vault"
              buttonAction={onOpen}
            />
          </CustomSkeleton>
        ))}

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
              ({
                id,
                name,
                workspace,
                members,
                description,
                owner,
                isHidden,
                predicateAddress,
              }) => {
                return (
                  <CustomSkeleton isLoaded={!isLoading} key={id} maxH="180px">
                    <GridItem>
                      <VaultCard
                        ownerId={owner.id}
                        name={name}
                        workspace={workspace}
                        title={description}
                        members={members!}
                        isHidden={isHidden}
                        onClick={() =>
                          handleWorkspaceSelection(
                            workspace.id,
                            Pages.detailsVault({
                              workspaceId: workspace.id,
                              vaultId: id,
                            }),
                          )
                        }
                        address={predicateAddress}
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
