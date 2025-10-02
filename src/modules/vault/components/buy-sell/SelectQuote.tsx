import {
  Badge,
  Flex,
  Icon,
  Image,
  Skeleton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { LeftAndRightArrow } from '@/components';
import { ICreateWidgetPayload, IQuote } from '@/modules/core/models/meld';

import { useListMeldProviders } from '../../hooks';
import { CardRoot } from './CardRoot';
import { SelectQuoteModal } from './SelectQuoteModal';

export const SelectQuote = ({
  quotes,
  bestProviderQuote,
  isLoadingQuotes = false,
}: {
  quotes: IQuote[];
  bestProviderQuote?: string;
  isLoadingQuotes?: boolean;
}) => {
  const { control, watch, setValue } = useFormContext<ICreateWidgetPayload>();
  const { providers, isLoading: isLoadingProviders } = useListMeldProviders();
  const currentProvider = watch('serviceProvider');
  const quoteModal = useDisclosure();

  const quoteWithProvider = useMemo(
    () =>
      quotes.map((quote) => {
        const provider = providers.find(
          (provider) => provider.serviceProvider === quote.serviceProvider,
        );
        return { ...quote, providerLogo: provider?.logos?.lightShort || '' };
      }),
    [providers, quotes],
  );
  const currentQuote = useMemo(
    () =>
      quoteWithProvider.find(
        (quote) => quote.serviceProvider === currentProvider,
      ),
    [currentProvider, quoteWithProvider],
  );

  const handleChangeProvider = (provider: string) => {
    setValue('serviceProvider', provider);
    quoteModal.onClose();
  };

  const isEmptyQuotes = useMemo(() => quotes.length === 0, [quotes]);

  const handleOpenQuoteModal = () => {
    if (!isEmptyQuotes) {
      quoteModal.onOpen();
    }
  };

  return (
    <Skeleton isLoaded={!isLoadingProviders && !isLoadingQuotes} w="full">
      <CardRoot
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex gap={4} alignItems="center">
          <Text color="section.500" fontSize="sm">
            Quote by
          </Text>
          {bestProviderQuote === currentProvider && (
            <Badge variant="blue" py={1} px={2} shadow="none" fontSize="2xs">
              Best Rate
            </Badge>
          )}
        </Flex>
        <Flex gap={2} alignItems="center">
          <Controller
            control={control}
            name="serviceProvider"
            defaultValue=""
            render={() => (
              <Flex
                alignItems="center"
                justifyContent="space-between"
                gap={2}
                role="combobox"
                aria-haspopup="listbox"
                cursor="pointer"
                onClick={handleOpenQuoteModal}
              >
                {currentQuote && (
                  <>
                    <Image
                      src={currentQuote?.providerLogo}
                      alt={currentQuote?.serviceProvider}
                      boxSize="16px"
                      rounded="lg"
                    />

                    <Text color="section.200" fontSize="sm">
                      {currentQuote?.serviceProvider}
                    </Text>
                  </>
                )}
                {!currentQuote && (
                  <Text color="section.200" fontSize="sm">
                    {isEmptyQuotes
                      ? 'No quotes available'
                      : 'Select a provider'}
                  </Text>
                )}

                <Icon as={LeftAndRightArrow} color="grey.75" />
              </Flex>
            )}
          />
          <SelectQuoteModal
            open={quoteModal.isOpen}
            onClose={quoteModal.onClose}
            quotes={quoteWithProvider}
            onChangeProvider={handleChangeProvider}
            currentProvider={currentProvider}
            bestProviderQuote={bestProviderQuote}
          />
        </Flex>
      </CardRoot>
    </Skeleton>
  );
};
