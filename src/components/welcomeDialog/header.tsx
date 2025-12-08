import { Drawer, Text } from 'bako-ui';

import { Dialog } from '../dialog';

export const WelcomeHeader = ({
  isMobile,
  title,
  subtitle,
  onClose,
}: {
  isMobile: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
}) => {
  if (isMobile) {
    return (
      <Drawer.Header flexDir="column" alignItems="start" gap={3} p={6}>
        <Drawer.Title fontSize="sm" color="textPrimary" lineHeight="shorter">
          {title}
        </Drawer.Title>
        <Text fontSize="xs" color="textSecondary">
          {subtitle}
        </Text>
      </Drawer.Header>
    );
  }

  return (
    <Dialog.Header
      mt={0}
      mb={0}
      onClose={onClose}
      w="full"
      maxW={{ base: 480, sm: 'unset' }}
      title={title}
      description={subtitle}
      descriptionFontSize="12px"
      descriptionColor="textSecondary"
      titleSxProps={{
        fontSize: '14px',
        fontWeight: 600,
        lineHeight: '16px',
      }}
      pb={3}
    />
  );
};
