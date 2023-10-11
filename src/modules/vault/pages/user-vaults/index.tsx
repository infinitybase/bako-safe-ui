import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { CgList } from 'react-icons/cg';
import { FaRegPlusSquare } from 'react-icons/fa';
import { GoArrowSwitch } from 'react-icons/go';
import { IoChevronBack } from 'react-icons/io5';

import { HomeIcon, VaultIcon } from '@/components';
import { Pages } from '@/modules/core';
import { ActionCard } from '@/modules/home/components/ActionCard';

import { VaultCard } from '../../components';
import { useUserVaults } from '../../hooks/user-vaults';

const UserVaults = () => {
  const {
    navigate,
    vaultsRequest: { vaults },
  } = useUserVaults();
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
          <Box ml={10} mr={1}>
            <Icon as={HomeIcon} fontSize="lg" color="grey.200" />
          </Box>
          <Text color="grey.200" fontWeight="semibold" mt={0.5}>
            Home / Vaults
          </Text>
        </HStack>

        <Box>
          <Button
            variant="primary"
            fontWeight="bold"
            leftIcon={<FaRegPlusSquare />}
            onClick={() => alert('ok')}
          >
            Create vault
          </Button>
        </Box>
      </HStack>

      <HStack spacing={6}>
        <ActionCard.Container onClick={() => navigate('/vault/me')}>
          <ActionCard.Icon icon={VaultIcon} />
          <Box>
            <ActionCard.Title>Vaults</ActionCard.Title>
            <ActionCard.Description>
              Access and Manage All Your Vaults in One Place.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>

        <ActionCard.Container onClick={() => navigate('/transaction')}>
          <ActionCard.Icon icon={GoArrowSwitch} />
          <Box>
            <ActionCard.Title>Transactions</ActionCard.Title>
            <ActionCard.Description>
              Manage Transactions Across All Vaults in One Place.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>

        <ActionCard.Container isUpcoming={true}>
          <ActionCard.Icon icon={CgList} isUpcoming={true} />
          <Box>
            <ActionCard.Title isUpcoming={true}>Address book</ActionCard.Title>
            <ActionCard.Description>
              Access and Manage Your Contacts for Easy Transfers and Vault
              Creation.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>
      </HStack>

      {/* USER VAULTS */}
      <Box mt={4} mb={-2} alignSelf="flex-start">
        <Text
          variant="subtitle"
          fontWeight="semibold"
          fontSize="xl"
          color="grey.200"
        >
          Vaults
        </Text>
      </Box>
      <Grid w="full" templateColumns="repeat(4, 1fr)" gap={6} mb={20}>
        {vaults?.map(({ id, name, predicateAddress, addresses }) => {
          return (
            <GridItem key={id}>
              <VaultCard
                name={name}
                address={predicateAddress}
                members={addresses}
                onClick={() => navigate(`/vault/${id}`)}
              />
            </GridItem>
          );
        })}
      </Grid>
    </VStack>
  );
};

export { UserVaults };
