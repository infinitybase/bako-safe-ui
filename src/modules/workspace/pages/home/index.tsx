import { Icon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Divider,
  Grid,
  GridItem,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { CgList } from 'react-icons/cg';
import { FaRegPlusSquare } from 'react-icons/fa';
import { GoArrowSwitch } from 'react-icons/go';
import { IoChevronBack } from 'react-icons/io5';

import {
  Card,
  CustomSkeleton,
  HomeIcon,
  SettingsIcon,
  VaultIcon,
} from '@/components';
import { Pages } from '@/modules/core';
import { ActionCard } from '@/modules/home/components/ActionCard';
import { EmptyVault } from '@/modules/home/components/EmptyCard/Vault';
import { ExtraVaultCard, VaultCard } from '@/modules/vault';

import { useWorkspace } from '../../hooks';

const WorkspacePage = () => {
  const {
    navigate,
    currentWorkspace,
    workspaceVaults: { vaultsMax, extraCount, recentVaults },
  } = useWorkspace();

  const loadingWorkspaceVaults = false;
  const hasVaults = recentVaults.length;

  return (
    <VStack w="full" spacing={6}>
      <HStack w="full" h="10" justifyContent="space-between" my={2}>
        <HStack>
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
            onClick={() => navigate(Pages.home())}
          >
            Back home
          </Button>

          <Breadcrumb ml={8}>
            <BreadcrumbItem>
              <Icon mr={2} as={HomeIcon} fontSize="sm" color="grey.200" />
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() => navigate(Pages.home())}
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() =>
                  navigate(
                    Pages.workspace({ workspaceId: currentWorkspace.id }),
                  )
                }
              >
                {currentWorkspace.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </HStack>

        <HStack spacing={3}>
          <Button
            variant="primary"
            fontWeight="semibold"
            fontSize={15}
            leftIcon={<SettingsIcon fontSize={18} />}
            px={3}
            bg="dark.100"
            color="grey.200"
            onClick={() => navigate(Pages.home())}
          >
            Settings
          </Button>
          <Button
            variant="primary"
            fontWeight="bold"
            leftIcon={<FaRegPlusSquare />}
            onClick={() => navigate(Pages.createVault())}
          >
            Create vault
          </Button>
        </HStack>
      </HStack>

      <HStack w="full" spacing={6}>
        {/* WORKSPACE OVERVIEW */}
        <Card w="full" h="full" p={8} bg="dark.200" borderColor="dark.100">
          <VStack h="full" w="full" alignItems="flex-start">
            <HStack spacing={6} w="full">
              <Avatar
                variant="roundedSquare"
                name={currentWorkspace.name}
                bg="grey.900"
                color="white"
                size={'lg'}
                p={10}
              />
              <Box>
                <Heading mb={1} variant="title-xl" isTruncated maxW={600}>
                  {currentWorkspace.name}
                </Heading>
                <Box maxW={420}>
                  <Text variant="description">
                    {currentWorkspace?.description}
                  </Text>
                </Box>
              </Box>
            </HStack>

            <Divider borderColor="dark.100" mt={4} mb={3} />

            <VStack h="full" alignItems="flex-start" spacing={4}>
              <Text
                fontWeight="semibold"
                color="grey.200"
              >{`Workspace's balance breakdown`}</Text>
              <Card
                h="full"
                w={200}
                p={8}
                bg="dark.200"
                borderColor="dark.100"
              ></Card>
            </VStack>
          </VStack>
        </Card>

        {/* ACTION CARDS */}
        <VStack w="full" maxH={380} spacing={4}>
          {/* TODO: Fix redirection path */}
          <ActionCard.Container
            w="full"
            onClick={() => navigate(Pages.userVaults())}
          >
            <ActionCard.Icon icon={VaultIcon} />
            <Box w="full">
              <ActionCard.Title>Vaults</ActionCard.Title>
              <ActionCard.Description maxWidth={{}}>
                Access and Manage All Your Vaults in One Place.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>

          <ActionCard.Container
            // isUpcoming={hasTransactions ? false : true}
            //  TODO: Replace with dynamic data
            isUpcoming={false}
            // onClick={() => {
            //   return hasTransactions
            //     ? navigate(Pages.userTransactions())
            //     : null;
            // }}
          >
            <ActionCard.Icon
              icon={GoArrowSwitch}
              // isUpcoming={hasTransactions ? false : true}
              // TODO: Replace with dynamic data
              isUpcoming={false}
            />
            <Box>
              <ActionCard.Title>Transactions</ActionCard.Title>
              <ActionCard.Description maxWidth={{}}>
                Manage Transactions Across All Vaults in One Place.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>

          <ActionCard.Container onClick={() => navigate(Pages.addressBook())}>
            <ActionCard.Icon icon={CgList} />
            <Box>
              <ActionCard.Title>Address book</ActionCard.Title>
              <ActionCard.Description maxWidth={{}}>
                Access and Manage Your Contacts for Easy Transfers and Vault
                Creation.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>
        </VStack>
      </HStack>

      {/* WORKSPACE VAULTS */}
      <Box mt={4} mb={-2} alignSelf="flex-start">
        <Text
          variant="subtitle"
          fontWeight="semibold"
          fontSize="xl"
          color="grey.200"
        >
          {`Workspace's vaults`}
        </Text>
      </Box>

      {!hasVaults ? (
        <CustomSkeleton isLoaded={!loadingWorkspaceVaults}>
          <EmptyVault
            title="Anything to show here."
            description="It seems like this workspace has no vaults. Would you like to make one now?"
          />
        </CustomSkeleton>
      ) : (
        <Grid w="full" templateColumns="repeat(4, 1fr)" gap={6} pb={28}>
          {recentVaults?.map(
            ({ id, name, predicateAddress, members, description }, index) => {
              const lastCard = index === vaultsMax - 1;
              const hasMore = extraCount > 0;

              return (
                <GridItem key={id}>
                  <CustomSkeleton isLoaded={!loadingWorkspaceVaults}>
                    {lastCard && hasMore ? (
                      <ExtraVaultCard
                        extra={extraCount}
                        onClick={() => navigate(Pages.userVaults())}
                      />
                    ) : (
                      <VaultCard
                        name={name}
                        title={description}
                        address={predicateAddress}
                        members={members!}
                        onClick={() =>
                          navigate(Pages.detailsVault({ vaultId: id }))
                        }
                      />
                    )}
                  </CustomSkeleton>
                </GridItem>
              );
            },
          )}
        </Grid>
      )}
    </VStack>
  );
};

export { WorkspacePage };
