import { Heading, Text, VStack } from 'bako-ui';

import { Dialog, NotifyIcon } from '@/components';

interface CommingSoonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  notifyHandler: () => void;
}

const CommingSoonDialog = ({
  description,
  isOpen,
  notifyHandler,
  onClose,
  title,
}: CommingSoonDialogProps) => {
  return (
    <Dialog.Modal
      id="coming-soon-toast"
      open={isOpen}
      onOpenChange={onClose}
      closeOnInteractOutside={false}
      size={{
        base: 'full',
        sm: 'sm',
      }}
      xsBreakPointPy={6}
    >
      <Dialog.Header
        title=""
        onClose={onClose}
        description=""
        hidden={false}
        mb={0}
        mt={{ base: 4, sm: 0 }}
        maxW={385}
        h={6}
      />

      <Dialog.Body
        w="full"
        maxW={385}
        h="248px"
        display="flex"
        alignItems="center"
        px={4}
        mb="18px"
        mt={{ base: 40, sm: '2px' }}
      >
        <VStack w="full" gap={8}>
          <NotifyIcon w={24} h={24} />

          <VStack gap={6}>
            <Heading fontSize="xl" color="grey.75">
              {title}
            </Heading>
            <Text
              // variant="description"
              color="grey.250"
              fontSize="xs"
              textAlign="center"
            >
              {description}
            </Text>
          </VStack>
        </VStack>
      </Dialog.Body>

      <Dialog.Actions w="full" maxW={385} position="relative" px={4} mb={4}>
        <Dialog.PrimaryAction
          flex={3}
          hidden={false}
          // variant="emptyState"
          onClick={notifyHandler}
          _hover={{
            opacity: 0.8,
          }}
        >
          Notify me when available
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};
export { CommingSoonDialog };
