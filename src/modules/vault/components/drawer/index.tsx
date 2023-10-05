import {
  Avatar,
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Flex,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { Card, CardProps, ErrorIcon } from '@/components';
import { queryClient } from '@/config';
import { Pages, useVaultListRequest } from '@/modules';

// TODO: Move to utils or use one if wxists
const formatAddress = (address?: string) =>
  address
    ? `${String(address).slice(0, 15)}...${String(address).slice(-4)}`
    : '';

interface VaultDrawerBoxProps extends CardProps {
  isActive?: boolean;
  name: string;
  address: string;
  description?: string;
}

const VaultDrawerBox = (props: VaultDrawerBoxProps) => {
  const { isActive, name, address, description, ...rest } = props;

  return (
    <Card
      {...rest}
      w="100%"
      bgColor="dark.300"
      cursor="pointer"
      borderColor={isActive ? 'brand.500' : 'dark.100'}
      borderWidth={isActive ? '2px' : '1px'}
    >
      <HStack width="100%" alignItems="center" spacing={4} mb={5}>
        <Avatar bgColor="dark.150" name="Infinitybase" />
        <VStack alignItems="flex-start" spacing={1}>
          <Text variant="subtitle">{name}</Text>
          <Text variant="description">{formatAddress(address)}</Text>
        </VStack>
      </HStack>
      <Box>
        <Text variant="description">{description ?? ''}</Text>
      </Box>
    </Card>
  );
};

interface VaultDrawerProps extends Omit<DrawerProps, 'children'> {}

const VaultDrawer = (props: VaultDrawerProps) => {
  const navigate = useNavigate();

  const inView = useInView({
    delay: 300,
  });

  const [search, setSearch] = useState('');

  const { vaults, fetchNextPage, isLoading } = useVaultListRequest(
    {
      q: search,
    },
    props.isOpen,
  );

  const debouncedSearchHandler = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 300),
    [],
  );

  useEffect(() => {
    if (inView.inView && !isLoading) {
      fetchNextPage();
    }
  }, [inView.inView, isLoading, fetchNextPage]);

  const onSelectVault = (vaultId: string) => {
    props.onClose();
    navigate(Pages.detailsVault({ vaultId }));
  };

  const onCloseDrawer = () => {
    props.onClose();
    queryClient.invalidateQueries('vault/pagination');
    setSearch('');
  };

  return (
    <Drawer
      {...props}
      size="sm"
      onClose={onCloseDrawer}
      variant="glassmorphic"
      placement="left"
    >
      <DrawerOverlay />
      <DrawerContent>
        <Flex mb={5} w="full" justifyContent="flex-end">
          <HStack cursor="pointer" onClick={props.onClose} spacing={2}>
            <ErrorIcon />
            <Text fontWeight="semibold" color="white">
              Close
            </Text>
          </HStack>
        </Flex>

        <DrawerHeader mb={10}>
          <VStack alignItems="flex-start" spacing={5}>
            <Heading fontSize="xl" fontWeight="semibold" color="grey.200">
              Vault
            </Heading>
            <Text maxWidth={300} variant="description">
              Setting Sail on a Journey to Unlock the Potential of User-Centered
              Design.
            </Text>
          </VStack>
        </DrawerHeader>

        <Box w="100%" mb={8}>
          <Input
            onChange={(e) => debouncedSearchHandler(e.target.value)}
            placeholder="Search"
            variant="custom"
            colorScheme="dark"
          />
        </Box>

        <DrawerBody py={8} borderTop="1px" borderTopColor="dark.100">
          <VStack spacing={4}>
            {vaults?.map((vault) => (
              <VaultDrawerBox
                key={vault.id}
                name={vault.name}
                address={vault.predicateAddress}
                description={vault.description}
                onClick={() => onSelectVault(vault.id)}
              />
            ))}
            <Box ref={inView.ref} />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export { VaultDrawer };
