'use client';

import { createToaster, Loader, Portal, Stack, Toast } from 'bako-ui';

export const toaster = createToaster({
  placement: 'top-end',
  pauseOnPageIdle: true,
  offsets: { top: '100px', right: '1rem', left: '1rem', bottom: '1rem' },
});

export const Toaster = () => {
  return (
    <Portal>
      <Toast.Toaster toaster={toaster} insetInline={{ mdDown: '4' }}>
        {(toast) => (
          <Toast.Root width={{ md: 'sm' }}>
            {toast.type === 'loading' ? (
              <Loader size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </Toast.Toaster>
    </Portal>
  );
};
