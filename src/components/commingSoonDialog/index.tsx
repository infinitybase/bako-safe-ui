import { Dialog } from '@/components';
import { Heading, Icon, Text, VStack } from '@chakra-ui/react';
import { NotifyIcon } from '@/components';

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
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      size={{
        base: 'full',
        sm: 'sm',
      }}
    >
      <Dialog.Header
        title=""
        onClose={onClose}
        description=""
        hidden={false}
        mb={0}
        mt={{ base: 4, xs: 0 }}
        maxW={385}
        h={6}
        px={4}
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
        <VStack w="full" spacing={10}>
          <Icon as={NotifyIcon} w="full" h="80px" />

          <VStack spacing={6}>
            <Heading fontSize="xl" color="grey.75">
              {title}
            </Heading>
            <Text variant="description" color="grey.250" fontSize="xs">
              {description}
            </Text>
          </VStack>
        </VStack>
      </Dialog.Body>

      <Dialog.Actions
        w="full"
        maxW={385}
        dividerBorderColor="grey.425"
        position="relative"
        hideDivider
        px={4}
        mb={4}
      >
        <Dialog.PrimaryAction
          flex={3}
          hidden={false}
          variant="emptyState"
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
