import {
  Button,
  EmptyState as BakoEmptyState,
  EmptyStateRootProps,
} from 'bako-ui';

interface EmptyStateProps extends EmptyStateRootProps {
  isDisabled?: boolean;
  buttonAction?: () => void;
  showAction?: boolean;
  title?: string;
  subTitle?: string;
  buttonActionTitle?: string;
}

const EmptyState = ({
  isDisabled,
  buttonAction,
  showAction = true,
  title = 'No Data available',
  subTitle = 'Currently, there is no available data to display in this section.',
  buttonActionTitle,
  ...rest
}: EmptyStateProps) => {
  return (
    <BakoEmptyState.Root
      bg="bg.panel"
      rounded="2xl"
      p={6}
      w="full"
      minH="230px"
      display="flex"
      {...rest}
    >
      <BakoEmptyState.Content gap={6} alignItems="center" w="full">
        <BakoEmptyState.Title
          fontSize="xs"
          color="textPrimary"
          textAlign="center"
        >
          {title}
        </BakoEmptyState.Title>
        <BakoEmptyState.Description
          color="textSecondary"
          textAlign="center"
          fontSize="xs"
        >
          {subTitle}
        </BakoEmptyState.Description>
        {showAction && (
          <Button mt={10} disabled={isDisabled} onClick={buttonAction} w="full">
            {buttonActionTitle ?? 'Create transaction'}
          </Button>
        )}
      </BakoEmptyState.Content>
    </BakoEmptyState.Root>
  );
};
export { EmptyState };
