import {
  Box,
  HStack,
  Icon,
  StackProps,
  Text,
  useClipboard,
} from "@chakra-ui/react";

import { CopyIcon } from "../components/icons/copy";
// import { useNotification } from '@/modules/notification';

interface Props extends StackProps {
  address: string;
  addressToCopy: string;
  addressColor?: string;
}

function AddressCopy({
  address,
  addressToCopy,
  addressColor,
  ...rest
}: Props): JSX.Element | null {
  const clipboard = useClipboard(addressToCopy);
  // const toast = useNotification();

  const isValid = !!address && address.length > 0;

  if (!isValid) return null;

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
        window.alert("Copied to clipboard");
        // toast({
        //   position: 'top-right',
        //   duration: 3000,
        //   isClosable: false,
        //   title: 'Copied to clipboard',
        //   icon: <Icon fontSize="2xl" color="brand.500" as={CheckIcon} />,
        // });
      }}
      {...rest}
    >
      <Icon color="grey.200" fontSize="md" as={CopyIcon} />
      <Box maxWidth="145px" w="full">
        <Text noOfLines={1} color={addressColor ?? "grey.500"}>
          {address}
        </Text>
      </Box>
    </HStack>
  );
}

export { AddressCopy };
