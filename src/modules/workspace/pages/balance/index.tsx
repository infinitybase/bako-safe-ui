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

import { CustomSkeleton, HomeIcon } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { useAuth } from '@/modules/auth';
import { AssetsBalanceList } from '@/modules/core';
import { useHome } from '@/modules/home';
import { limitCharacters } from '@/utils';

import { useWorkspace } from '../../hooks';

const WorkspaceBalancePage = () => {
  const { goHome } = useHome();
  const {
    currentWorkspace: { workspace: currentWorkspace },
    goWorkspace,
    worksapceBalance,
  } = useWorkspace();
  const {
    workspaces: { current },
  } = useAuth();

  const workspaceId = current ?? '';

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
            <BreadcrumbItem>
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() => goWorkspace(workspaceId)}
              >
                {limitCharacters(currentWorkspace?.name ?? '', 10)}
              </BreadcrumbLink>
            </BreadcrumbItem>
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

        <CustomSkeleton isLoaded={!worksapceBalance.isLoading} flex={1}>
          {worksapceBalance.balance.assetsBalance.length > 0 ? (
            <AssetsBalanceList
              assets={worksapceBalance.balance.assetsBalance}
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
