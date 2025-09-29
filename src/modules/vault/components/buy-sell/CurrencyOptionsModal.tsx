import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import { useMemo, useState } from 'react';

import { Dialog } from '@/components';
import { Header } from '@/layouts/dashboard/header';
import { CurrencyList } from '@/modules/core/components/currencyList';

interface CurrencyOptionsModalProps {
  open: boolean;
  onClose: () => void;
  onCurrencyChange: (currencyCode: string) => void;
  currentCurrencyCode: string;
  currencies: {
    label: string;
    value: string;
    imageUrl?: string;
  }[];
  isLoading?: boolean;
  title: string;
  description: string;
}

export const CurrencyOptionsModal = ({
  open,
  onClose,
  onCurrencyChange,
  currentCurrencyCode,
  currencies,
  isLoading = false,
  title,
  description,
}: CurrencyOptionsModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCurrencies = useMemo(
    () =>
      currencies.filter(
        (currency) =>
          currency.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          currency.value.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [currencies, searchQuery],
  );

  const debouncedSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, 400);

  return (
    <Dialog.Modal
      isOpen={open}
      onClose={onClose}
      trapFocus={false}
      modalContentProps={{
        padding: 0,
      }}
    >
      <Box display={{ base: 'block', xs: 'none' }} w="full">
        <Header />
      </Box>
      <Dialog.Header
        title={title}
        description={description}
        mt={3}
        mb={3}
        onClose={onClose}
        px={4}
      />
      <Dialog.Body py={{ base: 0, xs: 2 }}>
        <Stack gap={4}>
          <FormControl px={4}>
            <InputGroup position="relative">
              <InputRightElement
                position="absolute"
                right={4}
                top="50%"
                transform="translateY(-50%)"
              >
                <Icon as={SearchIcon} color="grey.500" />
              </InputRightElement>
              <Input
                bg="dark.950"
                onChange={(e) => debouncedSearch(e)}
                placeholder=" "
              />
              <FormLabel>Search asset</FormLabel>
            </InputGroup>
          </FormControl>

          <Divider borderColor="grey.950" />

          <CurrencyList.Root px={4}>
            {isLoading && <CurrencyList.Loading />}

            {!isLoading && filteredCurrencies.length === 0 && (
              <CurrencyList.Empty />
            )}

            {!isLoading &&
              filteredCurrencies.map((currency) => (
                <CurrencyList.Item
                  key={currency.value}
                  isSelected={currency.value === currentCurrencyCode}
                  value={currency.value}
                  onSelect={(value) => {
                    onCurrencyChange(value);
                    setSearchQuery('');
                  }}
                >
                  <Flex alignItems="center" gap={2}>
                    <Image
                      src={currency.imageUrl}
                      alt={currency.label}
                      boxSize="24px"
                      borderRadius="full"
                    />
                    <Text>{currency.label}</Text>
                    <Text ml="auto">{currency.value}</Text>
                  </Flex>
                </CurrencyList.Item>
              ))}
          </CurrencyList.Root>
        </Stack>
      </Dialog.Body>
    </Dialog.Modal>
  );
};
