import { Card, Flex, Loader as BakoLoader } from 'bako-ui';

interface Props {
  h: number;
  w: number;
}

function Loader({ h, w }: Props) {
  return (
    <Card.Body>
      <Flex
        w="100%"
        justifyContent="center"
        alignItems="center"
        minH={h}
        minW={w}
      >
        <BakoLoader color="brand.500" size="xl" />
      </Flex>
    </Card.Body>
  );
}

export { Loader };
