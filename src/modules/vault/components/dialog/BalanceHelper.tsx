import { Heading, Text } from 'bako-ui';

import { Dialog, DialogModalProps } from '@/components';

interface BalanceHelperProps extends Omit<DialogModalProps, 'children'> {}

const BalanceHelperDialog = (props: BalanceHelperProps) => {
  const { onClose, isOpen } = props;
  return (
    <Dialog.Modal
      onClose={onClose}
      isOpen={isOpen}
      size="md"
      modalContentProps={{ px: '32px', py: '30px' }}
      overlayProps={{
        bg: 'overlay',
        backdropFilter: 'auto',
        backdropBlur: '2px',
      }}
    >
      <Dialog.Header
        title="Help"
        description=""
        mt={0}
        titleSxProps={{ fontSize: '16px' }}
        borderBottomWidth={1}
        borderColor="grey.425"
        pb={3}
        mb={6}
        onClose={onClose}
      />
      <Dialog.Body>
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
      </Dialog.Body>
    </Dialog.Modal>
  );
};

export default BalanceHelperDialog;
