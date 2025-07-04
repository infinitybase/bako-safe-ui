import { SearchIcon } from '@chakra-ui/icons';
import {
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
}

export const CurrencyOptionsModal = ({
  open,
  onClose,
  onCurrencyChange,
  currentCurrencyCode,
  currencies,
  isLoading = false,
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
    <Dialog.Modal isOpen={open} onClose={onClose}>
      <Dialog.Header
        title="Select your currency"
        description="Set the currency you want to withdraw to."
        mt={3}
        mb={3}
        onClose={onClose}
      />
      <Dialog.Body py={2}>
        <Stack gap={4}>
          <FormControl>
            <InputGroup position="relative">
              <InputRightElement
                position="absolute"
                right={4}
                top="50%"
                transform="translateY(-50%)"
              >
                <Icon as={SearchIcon} color="grey.500" />
              </InputRightElement>
              <Input onChange={(e) => debouncedSearch(e)} placeholder=" " />
              <FormLabel>Search asset</FormLabel>
            </InputGroup>
          </FormControl>

          <Divider />

          <CurrencyList.Root>
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
