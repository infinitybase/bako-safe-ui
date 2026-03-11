import {
  createListCollection,
  HStack,
  Icon,
  Select,
  Separator,
  Text,
  useSelectContext,
  VStack,
} from 'bako-ui';
import { memo, useCallback } from 'react';

import { FuelIcon, PlusIcon, UnknownIcon } from '@/components';
import { useNetworks } from '@/modules/network/hooks';
import { NetworkService, NetworkType } from '@/modules/network/services';

interface NetworkSelectProps {
  onSelectNetwork?: (url: string) => void;
  onCreateNetwork: () => void;
}

interface NetworkSelectOption {
  value: string;
  name: string;
  icon: 'fuel' | 'unknown';
}

const NetworkSelectValue = ({
  placeholder = ' ',
}: {
  placeholder?: string;
}) => {
  const select = useSelectContext();
  const items = select.selectedItems as NetworkSelectOption[];
  const name = items?.[0]?.name;
  const icon = items?.[0]?.icon;

  if (!name) {
    return <Select.ValueText color="textSecondary" placeholder={placeholder} />;
  }

  return (
    <Select.ValueText placeholder={placeholder}>
      <HStack gap={2}>
        <Icon
          as={icon === 'fuel' ? FuelIcon : UnknownIcon}
          rounded="full"
          w={4}
          h={4}
          flexShrink={0}
        />
        <Text
          fontSize="xs"
          color="textPrimary"
          lineHeight="shorter"
          truncate
          lineClamp={1}
        >
          {name}
        </Text>
      </HStack>
    </Select.ValueText>
  );
};

const NetworkSelect = memo(
  ({ onSelectNetwork, onCreateNetwork }: NetworkSelectProps) => {
    const { networks, currentNetwork, handleSelectNetwork } = useNetworks();

    const isMainnet = useCallback(
      (url: string) => url?.includes(NetworkType.MAINNET),
      [],
    );

    const getNetworkOptions = useCallback((): NetworkSelectOption[] => {
      if (!networks?.length) return [];

      return networks.map((network) => ({
        value: network.url,
        name: network.name,
        icon: isMainnet(network.url) ? ('fuel' as const) : ('unknown' as const),
      }));
    }, [networks, isMainnet]);

    const currentNetworkValue = useCallback(() => {
      const icon = isMainnet(currentNetwork?.url)
        ? ('fuel' as const)
        : ('unknown' as const);

      return {
        value: currentNetwork?.url ?? '',
        name: NetworkService.getName(currentNetwork?.url ?? ''),
        icon,
      };
    }, [currentNetwork?.url, isMainnet]);

    const handleNetworkChange = useCallback(
      (url: string) => {
        handleSelectNetwork(url);
        onSelectNetwork?.(url);
      },
      [handleSelectNetwork, onSelectNetwork],
    );

    const options = getNetworkOptions();
    const collection = createListCollection({
      items: options,
      itemToValue: (item) => item.value,
      itemToString: (item) => item.name,
    });

    return (
      <Select.Root
        collection={collection}
        variant="subtle"
        w="220px"
        size="xs"
        value={[currentNetworkValue().value]}
        onValueChange={(e) => handleNetworkChange(e.value[0])}
        positioning={{
          sameWidth: true,
          strategy: 'fixed',
          hideWhenDetached: true,
        }}
        display={{ base: 'none', sm: 'flex' }}
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger bg="bg.muted" px={3} py={2}>
            <NetworkSelectValue />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator color="textPrimary" />
          </Select.IndicatorGroup>
        </Select.Control>
        <Select.Portal>
          <Select.Positioner>
            <Select.Content
              w="full"
              borderRadius="lg"
              bg="bg.muted"
              p={0}
              gap={0}
            >
              <VStack w="full" gap={0}>
                {options.map((option, index) => (
                  <VStack key={option.value} w="full" gap={0}>
                    <Select.Item
                      item={option}
                      w="full"
                      p={3}
                      cursor="pointer"
                      _selected={{ bg: 'inherit' }}
                      _highlighted={{ bg: 'inherit' }}
                    >
                      <HStack gap={3} w="full" flex={1} alignItems="center">
                        <Icon
                          as={option.icon === 'fuel' ? FuelIcon : UnknownIcon}
                          rounded="full"
                          w={4}
                          h={4}
                          flexShrink={0}
                        />
                        <Text fontSize="xs" lineClamp={1}>
                          {option.name}
                        </Text>
                      </HStack>
                    </Select.Item>
                    {index < options.length - 1 && (
                      <Separator borderColor="gray.550" w="full" />
                    )}
                  </VStack>
                ))}
              </VStack>

              <Separator borderColor="gray.550" w="full" />

              <HStack
                w="full"
                cursor="pointer"
                alignItems="center"
                justifyContent="flex-start"
                p={3}
                onClick={onCreateNetwork}
                gap={3}
              >
                <Icon as={PlusIcon} w={4} h={4} color="textPrimary" />
                <Text fontSize="xs">Add new network</Text>
              </HStack>
            </Select.Content>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    );
  },
);

NetworkSelect.displayName = 'NetworkSelect';

export { NetworkSelect };
