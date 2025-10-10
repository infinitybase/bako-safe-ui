import { Dialog, DialogRootProps, Portal } from '@chakra-ui/react';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

export interface DialogModalProps extends Omit<DialogRootProps, 'children'> {
  contentPadding?: number;
  modalContentProps?: Dialog.ContentProps;
  modalBodyProps?: Dialog.BodyProps;
  xsBreakPointPy?: number;
  overlayProps?: Dialog.BackdropProps;
  children?: React.ReactNode;
}

const DialogModal = (props: DialogModalProps) => {
  const { children, ...rest } = props;
  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  return (
    <Dialog.Root
      size={{ base: 'full', sm: 'xl' }}
      placement="center"
      motionPreset={isMobile ? 'slide-in-bottom' : 'scale'}
      {...rest}
    >
      <Portal>
        <Dialog.Backdrop {...props.overlayProps} />
        <Dialog.Positioner>
          <Dialog.Content
            rounded="3xl"
            bg="dark.950"
            py={{ base: 2, sm: props.xsBreakPointPy ?? 8 }}
            minH="auto"
            {...props.modalContentProps}
          >
            <Dialog.Body
              overflowY="auto"
              // zIndex={400}
              css={{
                '&::-webkit-scrollbar': {
                  display: 'none',
                  width: '5px',
                  maxHeight: '330px',
                  backgroundColor: 'transparent',
                  borderRadius: '30px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#2C2C2C',
                  borderRadius: '30px',
                  height: '10px',
                },
              }}
              w="full"
              display="flex"
              alignItems="center"
              flexDirection="column"
              p={0}
              {...rest.modalBodyProps}
            >
              {children}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export { DialogModal };
