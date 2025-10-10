import {
  Badge,
  Box,
  DialogOpenChangeDetails,
  Flex,
  Icon,
  Image,
  Input,
  InputGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';
import { FiSearch as SearchIcon } from 'react-icons/fi';

import { Dialog } from '@/components';
import { Header } from '@/layouts/dashboard/header';
import { IQuote } from '@/modules/core/models/meld';

interface SelectQuoteModalProps {
  open: boolean;
  onOpenChange: (open: DialogOpenChangeDetails) => void;
  quotes: (IQuote & {
    providerLogo?: string;
  })[];
  currentProvider?: string;
  onChangeProvider: (provider: string) => void;
  bestProviderQuote?: string;
}

export const SelectQuoteModal = ({
  onOpenChange,
  open,
  quotes,
  currentProvider,
  onChangeProvider,
  bestProviderQuote,
}: SelectQuoteModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useCallback(
    // eslint-disable-next-line react-compiler/react-compiler
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    }, 400),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const filteredQuotes = quotes.filter((quote) =>
    quote.serviceProvider.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
        title="Suppliers"
        description="Select the supplier you want to use."
        mt={3}
        mb={3}
        px={4}
        onClose={() => onOpenChange({ open: false })}
      />
      <Dialog.Body py={{ base: 0, sm: 2 }}>
        <Stack gap={4}>
          <Box px={4} position="relative">
            <InputGroup endElement={<Icon as={SearchIcon} color="grey.500" />}>
              <Input
                bg="dark.950"
                onChange={(e) => debouncedSearch(e)}
                placeholder="Search supplier"
              />
            </InputGroup>
          </Box>

          <Box height="1px" bg="grey.950" />

          <Stack
            maxH={{
              base: 'full',
              sm: '300px',
            }}
            overflowY={{
              base: 'auto',
              sm: 'scroll',
            }}
            gap={2}
            px={4}
            css={{
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'var(--chakra-colors-grey-300)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
              },
            }}
          >
            {filteredQuotes.length === 0 && (
              <Box
                border="1px solid"
                p={3}
                borderRadius="lg"
                borderColor="grey.950"
              >
                <Text>No suppliers found</Text>
              </Box>
            )}
            {filteredQuotes.map((quote) => (
              <Box
                key={quote.serviceProvider}
                border="1px solid"
                p={3}
                borderRadius="lg"
                borderColor={
                  quote.serviceProvider === currentProvider
                    ? 'grey.200'
                    : 'grey.950'
                }
                _hover={{
                  borderColor: 'grey.200',
                }}
                cursor="pointer"
                onClick={() => {
                  onChangeProvider(quote.serviceProvider);
                  setSearchQuery('');
                }}
              >
                <Flex alignItems="center" gap={2}>
                  <Image
                    src={quote.providerLogo}
                    alt={quote.serviceProvider}
                    boxSize="32px"
                    borderRadius="full"
                  />
                  <Stack gap={2}>
                    <Text fontSize="sm">{quote.serviceProvider}</Text>
                    {bestProviderQuote === quote.serviceProvider && (
                      <Badge
                        colorPalette="blue"
                        py={1}
                        px={2}
                        shadow="none"
                        fontSize="2xs"
                      >
                        Best Rate
                      </Badge>
                    )}
                  </Stack>
                  <Flex ml="auto" direction="column">
                    <Flex alignItems="center" gap={1}>
                      <Text ml="auto" fontSize="sm">
                        {quote.destinationAmount}
                      </Text>
                      <Text ml="auto" fontSize="sm">
                        {quote.destinationCurrencyCode}
                      </Text>
                    </Flex>
                    <Text color="section.500" textAlign="right" fontSize="xs">
                      {Intl.NumberFormat(quote.sourceCurrencyCode, {
                        style: 'currency',
                        currency: quote.sourceCurrencyCode,
                      }).format(quote.sourceAmount)}
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Dialog.Body>
    </Dialog.Modal>
  );
};
