import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Heading,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import React from 'react';

import { Card, HomeIcon, NotFoundIcon, SquarePlusIcon } from '@/components';
import { Pages } from '@/modules';
import { useVaultDetails } from '@/modules/vault/hooks';

import { AmountDetails } from '../../components/AmountDetails';
import { CardDetails } from '../../components/CardDetails';
import { SignersDetails } from '../../components/SignersDetails';

const VaultDetailsPage = () => {
  const { vault, store, assets, navigate } = useVaultDetails();

  if (!vault) return null;

  return (
    <Box w="full">
      <HStack mb={9} w="full" justifyContent="space-between">
        <Breadcrumb>
          <BreadcrumbItem>
            <Icon mr={2} as={HomeIcon} fontSize="sm" color="grey.200" />
            <BreadcrumbLink
              fontSize="sm"
              color="grey.200"
              fontWeight="semibold"
              href="#"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink
              fontSize="sm"
              color="grey.200"
              fontWeight="semibold"
              href="#"
            >
              Vaults
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink
              fontSize="sm"
              color="grey.200"
              fontWeight="semibold"
              href="#"
            >
              {vault.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Button variant="secondary" bgColor="dark.100" border="none">
          Set as template
        </Button>
      </HStack>

      <HStack mb={14} alignItems="flex-start" w="full" spacing={5}>
        <CardDetails vault={vault} store={store} />
        <AmountDetails vaultAddress={vault.predicateAddress!} assets={assets} />
        <SignersDetails vault={vault} />
      </HStack>

      <Card
        w="full"
        p={20}
        bgColor="dark.300"
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
      >
        <Box mb={6}>
          <NotFoundIcon w={100} h={100} />
        </Box>
        <Box mb={5}>
          <Heading color="brand.500" fontSize="4xl">
            Anything to show here.
          </Heading>
        </Box>
        <Box maxW={400} mb={8}>
          <Text
            color="white"
            fontSize="md"
            textAlign="center"
            fontWeight="bold"
          >
            It seems like you {"haven't"} made any transactions yet. Would you
            like to make one now?
          </Text>
        </Box>
        <Button
          leftIcon={<SquarePlusIcon />}
          variant="primary"
          onClick={() =>
            navigate(
              Pages.createTransaction({ vaultId: vault.predicateAddress! }),
            )
          }
        >
          Create transaction
        </Button>
      </Card>
    </Box>
  );
};

export { VaultDetailsPage };
