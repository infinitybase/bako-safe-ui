import { SearchIcon } from '@chakra-ui/icons';
import {
  Badge,
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
  List,
  ListItem,
  Stack,
  Text,
} from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';

import { Dialog } from '@/components';
import { Header } from '@/layouts/dashboard/header';
import { IQuote } from '@/modules/core/models/meld';

interface SelectQuoteModalProps {
  open: boolean;
  onClose: () => void;
  quotes: (IQuote & {
    providerLogo?: string;
  })[];
  currentProvider?: string;
  onChangeProvider: (provider: string) => void;
  bestProviderQuote?: string;
}

export const SelectQuoteModal = ({
  onClose,
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
        title="Suppliers"
        description="Select the supplier you want to use."
        mt={3}
        mb={3}
        px={4}
        onClose={onClose}
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
              <FormLabel>Search supplier</FormLabel>
            </InputGroup>
          </FormControl>

          <Divider borderColor="grey.950" />

          <List
            maxH={{
              base: 'full',
              sm: '300px',
            }}
            overflowY={{
              base: 'auto',
              sm: 'scroll',
            }}
            spacing={2}
            px={4}
            sx={{
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'grey.300',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
              },
            }}
          >
            {filteredQuotes.length === 0 && (
              <ListItem
                border="1px solid"
                p={3}
                borderRadius="lg"
                borderColor="grey.950"
              >
                <Text>No suppliers found</Text>
              </ListItem>
            )}
            {filteredQuotes.map((quote) => (
              <ListItem
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
                        variant="blue"
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
              </ListItem>
            ))}
          </List>
        </Stack>
      </Dialog.Body>
    </Dialog.Modal>
  );
};
