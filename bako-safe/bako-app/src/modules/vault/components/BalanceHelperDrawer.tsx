import {
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerProps,
  Heading,
  Text,
} from '@chakra-ui/react';

interface BalanceHelperDrawerProps extends Omit<DrawerProps, 'children'> {}

const BalanceHelperDrawer = (props: BalanceHelperDrawerProps) => {
  const { isOpen, onClose } = props;
  return (
    <Drawer onClose={onClose} isOpen={isOpen} placement="bottom">
      <DrawerOverlay bg="overlay" backdropFilter="auto" />
      <DrawerContent pt={2} bg="dark.950">
        <Heading
          color="grey.50"
          fontWeight={700}
          fontSize="16px"
          borderBottomWidth={1}
          borderColor="grey.425"
          pb={4}
          mb={6}
        >
          Help
        </Heading>
        <Heading mb={6} color="grey.75" fontWeight={700} fontSize="xs">
          Not enough balance
        </Heading>
        <Text
          color="grey.425"
          fontWeight={400}
          fontSize="xs"
          lineHeight="16.8px"
        >
          Your current ETH balance is insufficient to cover the transaction fees
          required for this operation. To proceed with the transaction, please
          add more ETH to your vault.
        </Text>

        <Button
          borderColor="grey.75"
          w="full"
          mt={6}
          variant="outline"
          color="grey.75"
          fontSize="sm"
          fontWeight={500}
          onClick={onClose}
        >
          Close
        </Button>
      </DrawerContent>
    </Drawer>
  );
};

export default BalanceHelperDrawer;
