import { Card, QrCode } from 'bako-ui';

interface SettingsQrCodeProps {
  address: string;
}

export const SettingsQrCode = ({ address }: SettingsQrCodeProps) => {
  return (
    <Card.Root variant="subtle" rounded="2xl" bg="bg.panel">
      <Card.Body>
        <QrCode.Root value={address} size="lg">
          <QrCode.Frame fill="textPrimary">
            <QrCode.Pattern />
          </QrCode.Frame>
        </QrCode.Root>
      </Card.Body>
    </Card.Root>
  );
};
