import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Card, HomeIcon } from '@/components';

import { StatusFilter, useTransactionList } from '../../hooks';

const TransactionsVaultPage = () => {
  const {
    transactionRequest,
    vaultRequest,
    navigate,
    params,
    vaultAssets,
    filter,
    inView,
  } = useTransactionList();

  return (
    <Box maxW={1000} w="full">
      {/* BREADCRUMB */}
      <Box mb={10}>
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
              Transactions
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>

      {/* TITLE */}
      <Box mb={7}>
        <Heading variant="title-xl" color="grey.200">
          Transactions
        </Heading>
      </Box>

      {/* FILTER */}
      <HStack spacing={7} mb={7}>
        <Text
          color={filter.value === StatusFilter.ALL ? 'brand.500' : 'grey.200'}
          onClick={() => filter.set(StatusFilter.ALL)}
          fontWeight="medium"
          cursor="pointer"
        >
          All
        </Text>
        <Text
          color={
            filter.value === StatusFilter.COMPLETED ? 'brand.500' : 'grey.200'
          }
          onClick={() => filter.set(StatusFilter.COMPLETED)}
          fontWeight="medium"
          cursor="pointer"
        >
          Completed
        </Text>
        <Text
          color={
            filter.value === StatusFilter.DECLINED ? 'brand.500' : 'grey.200'
          }
          onClick={() => filter.set(StatusFilter.DECLINED)}
          fontWeight="medium"
          cursor="pointer"
        >
          Declined
        </Text>
        <Text
          color={
            filter.value === StatusFilter.PENDING ? 'brand.500' : 'grey.200'
          }
          onClick={() => filter.set(StatusFilter.PENDING)}
          fontWeight="medium"
          cursor="pointer"
        >
          Pending
        </Text>
      </HStack>

      {/* TRANSACTION LIST */}
      <VStack spacing={3} w="full" alignItems="flex-start">
        <Card w="full">ok</Card>
        <Card w="full">ok</Card>
        <Card w="full">ok</Card>
        <Card w="full">ok</Card>
        <Card w="full">ok</Card>
        <Card w="full">ok</Card>
        <Card w="full">ok</Card>
        <Card w="full">ok</Card>
        <Card w="full">ok</Card>
        <Card w="full">ok</Card>
        <Card w="full">ok</Card>
        <Card w="full">ok</Card>
        <Card w="full">ok</Card>
        <Card w="full">ok</Card>
        <Card w="full">ok</Card>
        <Card w="full">ok</Card>
        <Card w="full">ok</Card>
      </VStack>
    </Box>
  );
};

export { TransactionsVaultPage };
