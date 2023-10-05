import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Skeleton,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { CgList } from 'react-icons/cg';
import { FaRegPlusSquare } from 'react-icons/fa';
import { GoArrowSwitch } from 'react-icons/go';

import { HomeIcon, VaultIcon } from '@/components';
import { ExtraVaultCard, VaultCard } from '@/modules/vault';

import { useHome } from '..';
import { ActionCard } from '../components/ActionCard';

const HomePage = () => {
  const {
    vaultsRequest: {
      vaults: { recentVaults, extraCount, vaultsMax },
      isLoading: loadingRecentVaults,
    },
    navigate,
  } = useHome();

  return (
    <VStack w="full" spacing={6}>
      <HStack w="full" h="10" justifyContent="space-between">
        <HStack>
          <Icon as={HomeIcon} fontSize="lg" color="grey.200" />
          <Text color="grey.200" fontWeight="semibold">
            Home
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
        <ActionCard.Container onClick={() => navigate('/predicate')}>
          <ActionCard.Icon icon={VaultIcon} />
          <Box>
            <ActionCard.Title>Vaults</ActionCard.Title>
            <ActionCard.Description>
              Setting Sail on a Journey to Unlock the Potential of User-Centered
              Design.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>

        <ActionCard.Container onClick={() => navigate('/transaction')}>
          <ActionCard.Icon icon={GoArrowSwitch} />
          <Box>
            <ActionCard.Title>Transactions</ActionCard.Title>
            <ActionCard.Description>
              Setting Sail on a Journey to Unlock the Potential of User-Centered
              Design.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>

        <ActionCard.Container isUpcoming={true}>
          <ActionCard.Icon icon={CgList} isUpcoming={true} />
          <Box>
            <ActionCard.Title isUpcoming={true}>Address book</ActionCard.Title>
            <ActionCard.Description>
              Setting Sail on a Journey to Unlock the Potential of User-Centered
              Design.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>
      </HStack>

      <Box mt={4} alignSelf="flex-start">
        <Heading variant="title-xl">Recently used vaults</Heading>
      </Box>
      <Wrap w="full" justifyContent="flex-start" spacing={0}>
        {recentVaults?.map(
          ({ id, name, predicateAddress, addresses }, index) => {
            const lastCard = index === vaultsMax - 1;
            const hasMore = extraCount > 0;

            return (
              <WrapItem w="25%" key={id}>
                <Skeleton
                  speed={1}
                  startColor="dark.200"
                  endColor="dark.500"
                  isLoaded={!loadingRecentVaults}
                  w="100%"
                  borderRadius={10}
                >
                  {lastCard && hasMore ? (
                    <ExtraVaultCard
                      extra={extraCount}
                      onClick={() => navigate('/predicate')}
                    />
                  ) : (
                    <VaultCard
                      name={name}
                      address={predicateAddress}
                      members={addresses}
                      onClick={() => navigate(`/predicate/${id}`)}
                    />
                  )}
                </Skeleton>
              </WrapItem>
            );
          },
        )}
      </Wrap>
    </VStack>
  );
};

export { HomePage };
