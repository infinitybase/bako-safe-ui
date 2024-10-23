import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import { IoChevronBack } from 'react-icons/io5';

import { CustomSkeleton, HomeIcon } from '@ui/components';
import { EmptyState } from '@/components/emptyState';
import { AssetsBalanceList } from '@/modules/core';

import { useWorkspaceContext } from '../../WorkspaceProvider';

const WorkspaceBalancePage = () => {
  const {
    // authDetails: {
    //   userInfos
    // },
    workspaceInfos: {
      handlers: {
        // handleWorkspaceSelection,
        goHome,
      },
      requests: { workspaceBalance },
    },
  } = useWorkspaceContext();

  // const workspaceId = userInfos.workspace?.id ?? '';

  return (
    <Flex w="full" direction="column">
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
            onClick={() => goHome()}
          >
            Back home
          </Button>

          <Breadcrumb display={{ base: 'none', sm: 'initial' }} ml={8}>
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

            {/* <BreadcrumbItem>
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
              >
                {limitCharacters(userInfos.workspace?.name ?? '', 10)}
              </BreadcrumbLink>
            </BreadcrumbItem> */}

            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                href="#"
              >
                Balance
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </HStack>
      </HStack>

      <Flex w="full" direction="column" flex={1} mt={4}>
        <Box mb={5} w="full">
          <Text color="grey.200" fontWeight="semibold" fontSize="20px">
            Balance
          </Text>
        </Box>

        <CustomSkeleton isLoaded={!workspaceBalance.isLoading} flex={1}>
          {workspaceBalance.balance.assetsBalance.length > 0 ? (
            <AssetsBalanceList
              assets={{ ...workspaceBalance.balance.assetsBalance }}
            />
          ) : (
            <EmptyState
              showAction={false}
              title="No Data available"
              subTitle="Currently, there is no available data to display in this section."
              h="full"
            />
          )}
        </CustomSkeleton>
      </Flex>
    </Flex>
  );
};

export { WorkspaceBalancePage };
