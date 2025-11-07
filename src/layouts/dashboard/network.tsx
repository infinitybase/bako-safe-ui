import { HStack, Icon, Popover, Text, VStack } from 'bako-ui';
import { memo, useCallback } from 'react';

import { ChevronDownIcon, FuelIcon, PlusIcon, UnknownIcon } from '@/components';
import { NetworkIcon } from '@/components/icons/network';
import { useNetworks } from '@/modules/network/hooks';
import { NetworkService, NetworkType } from '@/modules/network/services';

interface NetworkSelectProps {
  onSelectNetwork: (url: string) => void;
  onCreateNetwork: () => void;
}

const NetworkSelect = memo(
  ({ onSelectNetwork, onCreateNetwork }: NetworkSelectProps) => {
    const { networks, currentNetwork, handleSelectNetwork } = useNetworks();

    const handleNetworkChange = useCallback(
      (url: string) => {
        handleSelectNetwork(url);
        onSelectNetwork(url);
      },
      [handleSelectNetwork, onSelectNetwork],
    );

    const isMainnet = useCallback(
      (url: string) => url?.includes(NetworkType.MAINNET),
      [],
    );

    return (
      <HStack w="full" justifyContent="space-between">
        <HStack gap={4}>
          <Icon color="textPrimary" w={4} h={4} as={NetworkIcon} />
          <Text color="textPrimary" fontSize="xs">
            Network
          </Text>
        </HStack>

        <Popover.Root>
          <Popover.Trigger asChild>
            <HStack alignItems="center" gap={4}>
              <Icon
                as={isMainnet(currentNetwork.url) ? FuelIcon : UnknownIcon}
                rounded="full"
                w={4}
              />
              <Text fontSize="xs" color="gray.200" truncate lineClamp={1}>
                {NetworkService.getName(currentNetwork.url)}
              </Text>

              <Icon color="gray.200" w={4} h={4} as={ChevronDownIcon} />
            </HStack>
          </Popover.Trigger>
          <Popover.Positioner>
            <Popover.Content bg="bg.muted" rounded="2xl" shadow="md">
              <Popover.Body p={0}>
                <VStack alignItems="start" gap={0}>
                  {networks?.map((network) => (
                    <VStack
                      w="full"
                      key={network.url}
                      cursor="pointer"
                      alignItems="start"
                      justifyContent="center"
                      borderBottom="1px solid"
                      borderColor="gray.550"
                      p={4}
                      onClick={() => handleNetworkChange(network.url)}
                    >
                      <HStack gap={4}>
                        <Icon
                          as={isMainnet(network.url) ? FuelIcon : UnknownIcon}
                          rounded="full"
                          w={4}
                        />
                        <Text
                          color="gray.200"
                          fontSize="xs"
                          lineHeight="shorter"
                        >
                          {network.name}
                        </Text>
                      </HStack>
                    </VStack>
                  ))}

                  <VStack
                    w="full"
                    cursor="pointer"
                    alignItems="start"
                    justifyContent="center"
                    p={4}
                    onClick={onCreateNetwork}
                  >
                    <HStack gap={4}>
                      <Icon as={PlusIcon} w={4} color="gray.200" />
                      <Text color="gray.200" fontSize="xs">
                        Add new network
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Popover.Root>
      </HStack>
    );
  },
);

NetworkSelect.displayName = 'NetworkSelect';

export default NetworkSelect;
