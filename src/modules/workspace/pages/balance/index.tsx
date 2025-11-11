import { Box, Breadcrumb, Button, Flex, HStack, Icon, Text } from 'bako-ui';
import { IoChevronBack } from 'react-icons/io5';

import { CustomSkeleton, HomeIcon } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { AssetsBalanceList } from '@/modules/core';

import { useWorkspaceContext } from '../../hooks';

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
            colorPalette="primary"
            fontWeight="semibold"
            fontSize={15}
            px={3}
            bg="dark.100"
            color="grey.200"
            onClick={() => goHome()}
          >
            <IoChevronBack size={22} />
            Back home
          </Button>

          <Breadcrumb.Root display={{ base: 'none', sm: 'initial' }} ml={8}>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  onClick={() => goHome()}
                >
                  <Icon mr={2} as={HomeIcon} w={6} color="grey.200" />
                  Home
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />

              {/* Commented out code to temporarily disable workspaces. */}

              {/* <Breadcrumb.Item>
              <Breadcrumb.Link
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
              </Breadcrumb.Link>
            </Breadcrumb.Item> */}

              <Breadcrumb.Item>
                <Breadcrumb.Link
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  href="#"
                >
                  Balance
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </HStack>
      </HStack>

      <Flex w="full" direction="column" flex={1} mt={4}>
        <Box mb={5} w="full">
          <Text color="grey.200" fontWeight="semibold" fontSize="20px">
            Balance
          </Text>
        </Box>

        <CustomSkeleton loading={workspaceBalance.isLoading} flex={1}>
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
