import { Button, Card, Clipboard, Flex, Heading, Icon, Text } from 'bako-ui';
import { Address } from 'fuels';
import { JSX } from 'react';
import { RiFileCopyFill } from 'react-icons/ri';

import { EditIcon2, UpRightArrow } from '@/components';
import { CopyTopMenuIcon } from '@/components/icons/copy-top-menu';
import { useWorkspaceContext } from '@/modules';
import { AddressUtils } from '@/modules/core';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { NetworkService } from '@/modules/network/services';

import { UseVaultDetailsReturn } from '../../hooks/details';
import { UpdateVaultDialog } from '../dialog/update';
import { VaultIconInfo } from '../vaultIconInfo';

export interface CardDetailsProps {
  assets: UseVaultDetailsReturn['assets'];
  vault: UseVaultDetailsReturn['vault'];
}

const SettingsOverview = ({
  vault,
  assets,
}: CardDetailsProps): JSX.Element | null => {
  const updateDialog = useDisclosure();
  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();
  const { balanceUSD, visibleBalance } = assets;
  const workspaceId = userInfos?.workspace.id || '';

  const redirectToNetwork = () =>
    window.open(
      `${NetworkService.getExplorer(vault?.data.provider)}/account/${vault?.data.predicateAddress}/assets`,
      '_BLANK',
    );

  if (!vault) return null;
  const predicateVersion = vault.data?.version;
  const predicateAddress = vault.data?.predicateAddress
    ? new Address(vault.data.predicateAddress).toString()
    : '';

  return (
    <Card.Root
      rounded="2xl"
      variant="subtle"
      bg="bg.panel"
      flex={1}
      alignSelf="stretch"
    >
      <Card.Header
        justifyContent="space-between"
        alignItems="center"
        flexDirection="row"
      >
        <Heading fontSize="sm" lineHeight="shorter">
          {vault.data?.name}
        </Heading>
        <Flex alignItems="center" gap={2}>
          <VaultIconInfo
            onClick={updateDialog.onOpen}
            tooltipContent="Update Account"
            placement="top"
          >
            <Icon as={EditIcon2} color="gray.200" w="12px" />
          </VaultIconInfo>
          <VaultIconInfo
            onClick={redirectToNetwork}
            tooltipContent="View on Explorer"
            placement="top"
          >
            <Icon as={UpRightArrow} color="gray.200" w="12px" />
          </VaultIconInfo>
        </Flex>
      </Card.Header>
      <Card.Body justifyContent="center">
        {visibleBalance && (
          <Heading color="gray.50" fontSize="3xl">
            <Text as="span" color="textSecondary">
              $
            </Text>{' '}
            {balanceUSD}
          </Heading>
        )}
        {!visibleBalance && (
          <Text color="gray.50" fontSize="3xl">
            -----
          </Text>
        )}
      </Card.Body>
      <Card.Footer gap={{ base: 2, md: 6 }} flexWrap={{ mdDown: 'wrap' }}>
        {/* Address */}
        <Clipboard.Root
          value={predicateAddress}
          w={{ base: 'full', md: '241px' }}
        >
          <Clipboard.Trigger asChild>
            <Button
              variant="subtle"
              size="xs"
              w="full"
              bg="bg.muted"
              justifyContent="space-between"
              alignItems="center"
              rounded="md"
            >
              <Text color="gray.400" fontSize="xs" lineHeight="shorter">
                Address
              </Text>
              <Text
                as="div"
                display="flex"
                alignItems="center"
                gap={1}
                color="gray.200"
                fontSize="xs"
                lineHeight="shorter"
              >
                {AddressUtils.format(predicateAddress || '', 4)}
                <Clipboard.Indicator
                  copied={<Icon as={RiFileCopyFill} w="12px" />}
                >
                  <CopyTopMenuIcon w="12px" />
                </Clipboard.Indicator>
              </Text>
            </Button>
          </Clipboard.Trigger>
        </Clipboard.Root>

        {/* Predicate */}
        <Clipboard.Root
          value={predicateVersion || ''}
          w={{ base: 'full', md: '241px' }}
        >
          <Clipboard.Trigger asChild>
            <Button
              variant="subtle"
              size="xs"
              w="full"
              bg="bg.muted"
              justifyContent="space-between"
              rounded="md"
              alignItems="center"
            >
              <Text color="gray.400" fontSize="xs" lineHeight="shorter">
                Predicate
              </Text>
              <Text
                as="div"
                display="flex"
                alignItems="center"
                gap={1}
                color="gray.200"
                fontSize="xs"
                lineHeight="shorter"
              >
                {AddressUtils.format(predicateVersion || '', 4)}
                <Clipboard.Indicator
                  copied={<Icon as={RiFileCopyFill} w="12px" />}
                >
                  <CopyTopMenuIcon w="12px" />
                </Clipboard.Indicator>
              </Text>
            </Button>
          </Clipboard.Trigger>
        </Clipboard.Root>
      </Card.Footer>

      {/* UPDATE ACCOUNT DIALOG */}
      <UpdateVaultDialog
        isOpen={updateDialog.isOpen}
        onClose={updateDialog.onClose}
        onOpenChange={updateDialog.onOpenChange}
        initialValues={{
          name: vault.data.name,
          description: vault.data.description,
          id: vault.data.id,
        }}
        workspaceId={workspaceId}
      />
    </Card.Root>
  );
};

export { SettingsOverview };
