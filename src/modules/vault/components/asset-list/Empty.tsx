import { Text, VStackProps } from 'bako-ui';

interface EmptyProps extends VStackProps {
  emptyMessage?: string;
}

export const Empty = ({
  emptyMessage = 'No assets found',
  ...props
}: EmptyProps) => {
  return (
    <Text fontSize="xs" {...props}>
      {emptyMessage}
    </Text>
  );
};
