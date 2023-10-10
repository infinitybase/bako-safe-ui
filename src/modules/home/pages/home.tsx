import {
  Box,
  Button,
  HStack,
  Icon,
  Text,
  VStack,
  // Wrap,
  // WrapItem,
} from '@chakra-ui/react';
import { CgList } from 'react-icons/cg';
import { FaRegPlusSquare } from 'react-icons/fa';
import { GoArrowSwitch } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';

import { HomeIcon, VaultIcon } from '@/components';
import { Pages } from '@/modules';

import { ActionCard } from '../components/ActionCard';

const HomePage = () => {
  const navigate = useNavigate();

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
            onClick={() => navigate(Pages.createVault())}
          >
            Create vault
          </Button>
        </Box>
      </HStack>
      <HStack spacing={6}>
        <ActionCard.Container navigateTo="/predicate">
          <ActionCard.Icon icon={VaultIcon} />
          <Box>
            <ActionCard.Title>Vaults</ActionCard.Title>
            <ActionCard.Description>
              Setting Sail on a Journey to Unlock the Potential of User-Centered
              Design.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>
        <ActionCard.Container navigateTo="/transaction">
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
    </VStack>
  );
};

export { HomePage };
