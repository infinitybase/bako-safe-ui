import { Button, Drawer, DrawerRootProps, Heading, Text } from 'bako-ui';

interface BalanceHelperDrawerProps extends Omit<DrawerRootProps, 'children'> {}

const BalanceHelperDrawer = (props: BalanceHelperDrawerProps) => {
  const { open, onOpenChange } = props;
  return (
    <Drawer.Root onOpenChange={onOpenChange} open={open} placement="bottom">
      <Drawer.Backdrop bg="overlay" backdropFilter="auto" />
      <Drawer.Content pt={2} bg="dark.950">
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

        <Drawer.ActionTrigger asChild>
          <Button
            borderColor="grey.75"
            w="full"
            mt={6}
            variant="outline"
            color="grey.75"
            fontSize="sm"
            fontWeight={500}
          >
            Close
          </Button>
        </Drawer.ActionTrigger>
      </Drawer.Content>
    </Drawer.Root>
  );
};

export default BalanceHelperDrawer;
