import {
  Box,
  DialogOpenChangeDetails,
  Field,
  Flex,
  Image,
  Input,
  InputGroup,
  Separator,
  Stack,
  Text,
} from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import { useMemo, useState } from 'react';
import { FiSearch as SearchIcon } from 'react-icons/fi';

import { Dialog } from '@/components';
import { Header } from '@/layouts/dashboard/header';
import { CurrencyList } from '@/modules/core/components/currencyList';

interface CurrencyOptionsModalProps {
  open: boolean;
  onOpenChange?: (e: DialogOpenChangeDetails) => void;
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
  onOpenChange,
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
      open={open}
      onOpenChange={onOpenChange}
      trapFocus={false}
      modalContentProps={{
        padding: 0,
      }}
    >
      <Box display={{ base: 'block', sm: 'none' }} w="full">
        <Header />
      </Box>
      <Dialog.Header
        title={title}
        description={description}
        mt={3}
        mb={3}
        onClose={() => onOpenChange?.({ open: false })}
        px={4}
      />
      <Dialog.Body py={{ base: 0, sm: 2 }}>
        <Stack gap={4}>
          <Field.Root px={4}>
            <InputGroup
              position="relative"
              endElement={<SearchIcon color="grey.500" />}
            >
              <Input
                bg="dark.950"
                onChange={(e) => debouncedSearch(e)}
                placeholder=" "
              />
            </InputGroup>
            <Field.Label>Search asset</Field.Label>
          </Field.Root>

          <Separator borderColor="grey.950" />

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
