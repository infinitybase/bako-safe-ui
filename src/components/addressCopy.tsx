import { CheckIcon } from '@chakra-ui/icons';
import {
  Box,
  HStack,
  Icon,
  StackProps,
  Text,
  useClipboard,
} from '@chakra-ui/react';

import { CopyIcon } from '@/components/icons';
import { useNotification } from '@/modules/notification';

interface Props extends StackProps {
  address: string;
}

function AddressCopy({ address, ...rest }: Props) {
  const clipboard = useClipboard(address);
  const toast = useNotification();

  const isValid = !!address && address.length > 0;

  if (!isValid) return;

  return (
    <HStack
      p={3}
      spacing={4}
      cursor="pointer"
      borderRadius={10}
      justifyContent="center"
      backgroundColor="dark.100"
      onClick={() => {
        clipboard.onCopy();
        toast({
          position: 'top-right',
          duration: 3000,
          isClosable: false,
          title: 'Copied to clipboard',
          icon: <Icon fontSize="2xl" color="brand.500" as={CheckIcon} />,
        });
      }}
      {...rest}
    >
      <Icon color="grey.200" fontSize="md" as={CopyIcon} />
      <Box maxWidth="145px" w="full">
        <Text noOfLines={1} color="grey.500">
          {address}
        </Text>
      </Box>
    </HStack>
  );
}

export { AddressCopy };
