import { Heading, HStack, Icon, Text, VStack } from 'bako-ui';

import { IconTooltipButton, LineCloseIcon } from '@/components';
import { EyeCloseIcon } from '@/components/icons/eye-close';
import { EyeOpenIcon } from '@/components/icons/eye-open';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { useHeader } from './hooks/useHeader';

interface HeaderProps {
  title: string;
  description?: string;
  onClose?: () => void;
  hiddenBalance?: boolean;
}

const Header = ({
  title,
  description,
  onClose = window.close,
  hiddenBalance = false,
}: HeaderProps) => {
  const { renderCloseIcon } = useHeader();
  const {
    workspaceInfos: {
      infos: { visibleBalance },
      handlers: { setVisibleBalance },
    },
  } = useWorkspaceContext();

  const EyeIcon = visibleBalance ? EyeOpenIcon : EyeCloseIcon;

  const handleToggleBalanceVisibility = () => {
    setVisibleBalance(!visibleBalance);
  };

  return (
    <HStack w="full" justifyContent="space-between" alignItems="center" py={4}>
      <HStack gap={4} align="center" justify="space-between" w="full">
        <VStack align="start">
          <Heading
            fontSize={14}
            fontWeight={600}
            lineHeight="10px"
            color="gray.100"
          >
            {title}
          </Heading>

          {description && (
            <Text fontWeight={400} color="gray.400" fontSize="xs" mt="10px">
              {description}
            </Text>
          )}
        </VStack>

        {hiddenBalance && (
          <IconTooltipButton
            tooltipContent={visibleBalance ? 'Hide Balance' : 'Show Balance'}
            buttonProps={{
              boxSize: '32px',
              minW: '32px',
              borderRadius: '6px',
              bg: 'gray.700',
            }}
            onClick={handleToggleBalanceVisibility}
          >
            <Icon
              as={EyeIcon}
              color="gray.200"
              w={visibleBalance ? '16px' : '12px'}
            />
          </IconTooltipButton>
        )}
      </HStack>
      {renderCloseIcon && (
        <LineCloseIcon
          mr={2}
          onClick={onClose}
          cursor="pointer"
          fontSize="24px"
          aria-label="Close window"
        />
      )}
    </HStack>
  );
};

export { Header };
