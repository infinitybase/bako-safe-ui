import { Flex, Loader, VStackProps } from 'bako-ui';

export const Loading = (props: VStackProps) => {
  return (
    <Flex alignItems="center" justifyContent="center" w="100%" {...props}>
      <Loader color="textPrimary" />
    </Flex>
  );
};
