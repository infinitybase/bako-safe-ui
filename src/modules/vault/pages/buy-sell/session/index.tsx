import { Box, Breadcrumb, Flex, HStack, Icon, Stack, Text } from 'bako-ui';
import { RiMenuUnfoldLine } from 'react-icons/ri';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { HomeIcon } from '@/components';
import { Drawer } from '@/layouts/dashboard/drawer';
import { Pages } from '@/modules/core';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useGetWidgetUrl, useVaultInfosContext } from '@/modules/vault/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

export const VaultBuySellSessionPage = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const menuDrawer = useDisclosure();
  const { vault } = useVaultInfosContext();
  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: { goHome },
    },
    screenSizes: { vaultRequiredSizeToColumnLayout },
  } = useWorkspaceContext();
  const { data, error } = useGetWidgetUrl(sessionId ?? '');

  return (
    <Flex w="full" direction="column">
      <Drawer isOpen={menuDrawer.isOpen} onClose={menuDrawer.onClose} />

      <HStack mb={8} w="full" justifyContent="space-between">
        {vaultRequiredSizeToColumnLayout ? (
          <HStack gap={1.5} onClick={menuDrawer.onOpen}>
            <Icon as={RiMenuUnfoldLine} fontSize="xl" color="grey.200" />
            <Text fontSize="sm" fontWeight="normal" color="grey.100">
              Menu
            </Text>
          </HStack>
        ) : (
          <Breadcrumb.Root>
            <Breadcrumb.Item>
              <Breadcrumb.Link
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() => goHome()}
              >
                <Icon mr={2} as={HomeIcon} fontSize="sm" color="grey.200" />
                Home
              </Breadcrumb.Link>
            </Breadcrumb.Item>

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
            <Breadcrumb.Item>
              <Breadcrumb.Link
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() =>
                  navigate(
                    Pages.detailsVault({
                      vaultId: vault?.data?.id,
                      workspaceId: userInfos.workspace?.id ?? '',
                    }),
                  )
                }
                truncate
                maxW={640}
              >
                {vault.data?.name}
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Breadcrumb.Link
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() =>
                  navigate(
                    Pages.vaultBuySell({
                      vaultId: vault?.data?.id,
                      workspaceId: userInfos.workspace?.id ?? '',
                    }),
                  )
                }
                truncate
              >
                Buy & Sell
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb.Root>
        )}
      </HStack>

      <Box w="full" flex={1} display="flex">
        {data?.widgetUrl && (
          <iframe
            src={data.widgetUrl}
            style={{ flex: 1, borderRadius: '4px' }}
            width="100%"
            height="100%"
            title="Buy & Sell Session"
          />
        )}
        {error && (
          <Stack w="full" alignItems="center" justifyContent="center" mt={8}>
            <Text color="red.500" fontSize="md">
              An error occurred while getting the widget URL. Please try again
              later.
            </Text>
            <Link to={'../'}>Back</Link>
          </Stack>
        )}
      </Box>
    </Flex>
  );
};
