import { Box, Button, HStack, Icon, Input, Stack, Text, VStack, InputGroup, Flex, CloseButton } from 'bako-ui';
import { CustomSkeleton, RemoveIcon, AddIcon, SearchIcon, Dialog } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { TabState, UseAPITokenReturn } from '@/modules/cli/hooks';
import { useRemoveAPIToken } from '@/modules/cli/hooks/APIToken/remove';
import { APIToken } from '@/modules/cli/services';
import { formatCreatedDate } from "@/utils/format-date-full";
import { useState, useMemo } from "react";
import { AlertIcon } from "@/components";

interface APITokenCardProps {
  apiToken: APIToken;
  onRemove: () => void;
}

const APITokenCard = (props: APITokenCardProps) => {
  const { apiToken,onRemove } = props;

  return (
    <VStack
      w="full"
      h="auto"
      maxH={200}
      minH="94px"
      bg="gray.600"
      p={3}
      borderColor="gray.600"
      alignItems="start"
      borderWidth={1}
      borderRadius={8}
      display="flex"
      flexDirection="column"
    >
      <Box w="full" display="flex" justifyContent="space-between">
        <Text fontSize="xs" color="gray.100">
          {apiToken.name}
        </Text>
        <Box display="flex" gap={3}>
          <Icon
            as={RemoveIcon}
            w="12px"
            color="gray.200"
            cursor="pointer"
            onClick={onRemove}
          />
        </Box>
      </Box>
      <Stack spacing={0} gap={0}>
          <Text fontSize="xs" color="gray.300" wordBreak="break-all">
            {`Transaction name: ${apiToken.config?.transactionTitle}`}
          </Text>
        <Text fontSize="xs" color="gray.300" wordBreak="break-all">
          {`Created: ${formatCreatedDate({ date: new Date(apiToken.createdAt) })}`}
        </Text>
      </Stack>
    </VStack>
  );
};

interface DoubleCheckoutProps {
  token: APIToken | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  loading: boolean;
}

const DoubleCheckout = ({ token, onClose, onConfirm, loading }: DoubleCheckoutProps) => {
  if (!token) return null;

  return (
    <Dialog.Modal
      open={true}
      onOpenChange={onClose}
      closeOnInteractOutside={false}
      trapFocus={false}
      modalContentProps={{ maxW: { base: '100%', sm: '480px' }, p: { base: 4, sm: 0 } }}
      size={{
        base: 'full',
        md: 'md',
      }}
    >
      <Stack w="100%" maxW={{ base: '100%', sm: '480px' }} pt={{ base: 4, sm: 6 }} px={{ base: 4, sm: 6 }}>
        <Flex w="100%" justify="end">
          <CloseButton size="2xs" onClick={onClose} />
        </Flex>
      </Stack>

      <Dialog.Body w="full" h="full" maxW={{ base: '100%', sm: '480px' }}>
        <Box>
          <VStack p={4} pt="52px" pb={0} h="full" gap={{ base: 4, sm: 3 }}>
            <VStack gap={1}>
              <Icon mb={5} color="red.100" boxSize={{ base: '40px', sm: '48px' }} as={AlertIcon} />
              <Text fontWeight={700} fontSize={{ base: 14, sm: 16 }} color="red.100">
                Double check it!
              </Text>
            </VStack>
            <HStack wrap="wrap" justify="center" gap={{ base: 1, sm: 2 }}>
              <Text fontWeight="normal" color="gray.400" fontSize={{ base: 12, sm: 14 }} textAlign="center">
                Delete
              </Text>
              <Text fontWeight={500} fontSize={{ base: 12, sm: 14 }} color="gray.50">
                {token.name}
              </Text>
              <Text fontWeight="normal" color="gray.400" fontSize={{ base: 12, sm: 14 }} textAlign="center">
                from your API tokens?
              </Text>
            </HStack>
          </VStack>
          <HStack justifyContent="center" mt={{ base: 4, sm: 6 }}>
            <Dialog.Actions
              p={{ base: 4, sm: 6 }}
              maxW={{ base: '100%', sm: '244px' }}
              gap={2}
              flexDirection={{ base: 'column', sm: 'row' }}
            >
              <Dialog.SecondaryAction
                bg="gray.600"
                w="100%"
                onClick={onClose}
                disabled={loading}
                _hover={{ bg: 'gray.500' }}
                order={{ base: 1, sm: 0 }}
              >
                Cancel
              </Dialog.SecondaryAction>

              <Dialog.PrimaryAction
                bg="red.100"
                w="100%"
                onClick={() => onConfirm(token.id)}
                loading={loading}
                _hover={{ bg: 'red.50' }}
                order={{ base: 0, sm: 1 }}
              >
                Yes, remove it!
              </Dialog.PrimaryAction>
            </Dialog.Actions>
          </HStack>
        </Box>
      </Dialog.Body>
    </Dialog.Modal>
  )
}

interface APITokensListProps {
  tabs: UseAPITokenReturn['tabs'];
  request: UseAPITokenReturn['list']['request'];
}

const APITokensList = (props: APITokensListProps) => {
  const { tabs, request: listRequest } = props;

  const [tokenToRemove, setTokenToRemove] = useState<APIToken | null>(null);
  const { handler, request: removeRequest } = useRemoveAPIToken();
  const [searchValue, setSearchValue] = useState('');

  const filteredTokens = useMemo(() => {
    if (!listRequest.data) return [];
    return listRequest.data.filter((token) =>
      token.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [listRequest.data, searchValue]);

  const handleAddMoreAPITokens = () => {
    tabs.set(TabState.CREATE);
  };

  return (
    <Box px={6} display="flex" flexDirection="column" flex={1} minH="full">
      <VStack pb={6} w="full" display="flex" flexDirection="row">
        <Button
          bg="gray.600"
          variant="subtle"
          cursor="pointer"
          onClick={handleAddMoreAPITokens}
          w="48px"
          h="48px"
          _hover={{ bg: 'gray.500' }}
        >
          <Icon
            as={AddIcon}
            w="16px"
          />
        </Button>
        <InputGroup
          position="relative"
          bg="gray.600"
          rounded="8px"
          startElement={<SearchIcon w="16px" />}
        >
          <Input
            h="48px"
            border="none"
            placeholder="Search by name"
            value={searchValue}
            outline="none"
            fontSize="14px"
            fontWeight="400"
            _placeholder={{
              color: 'textSecondary',
              fontSize: '14px',
              fontWeight: '400'
            }}
            onChange={(e) => setSearchValue(e.target.value)}
            pl="40px"
          />
        </InputGroup>
      </VStack>
      <VStack gap={{ base: 3, sm: 3 }} pt={{ base: 2, sm: 0 }} flex={1}>
        <CustomSkeleton loading={listRequest.isLoading} flex={1} display="flex">
          {filteredTokens.length > 0 ? (
            <VStack
              gap={{ base: 3, sm: 3 }}
              w="full"
              maxH={{
                base: 'calc(100vh - 210px)',
                sm: 'calc(100vh - 320px)',
                md: '510px',
              }}

              minH={300}
              flex={1}
              alignSelf="stretch"
              overflowY="scroll"
              css={{
                '&::-webkit-scrollbar': {
                  display: 'none',
                  width: '5px',
                  backgroundColor: '#2B2927',
                },
                '&::-webkit-scrollbar-thumb': {
                  display: 'none',
                  backgroundColor: 'grey.250',
                  borderRadius: '30px',
                  height: '10px' /* Adjust the height of the scrollbar thumb */,
                },
              }}
            >
              {filteredTokens.map((apiToken) => (
                <APITokenCard key={apiToken.id} apiToken={apiToken} onRemove={() => setTokenToRemove(apiToken)} />
              ))}
            </VStack>
          ) : (
            <EmptyState
              showAction={false}
              title="No API Tokens"
              subTitle="Tap the + button to add a new API token."
              gap={0}
            />
          )}
        </CustomSkeleton>
        <DoubleCheckout
          token={tokenToRemove}
          loading={removeRequest.isLoading}
          onClose={() => setTokenToRemove(null)}
          onConfirm={async (id) => {
            try {
              await handler(id);
              setTokenToRemove(null);
            } catch (error) {
              console.error('Failed to delete token:', error);
            }
          }}
        />
      </VStack>
    </Box>
  );
};

export { APITokensList };
