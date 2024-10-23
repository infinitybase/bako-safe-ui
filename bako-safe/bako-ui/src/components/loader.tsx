import { CardBody, Flex, Spinner } from "@chakra-ui/react";

interface Props {
  h: number;
  w: number;
}

function Loader({ h, w }: Props) {
  return (
    <CardBody>
      <Flex
        w="100%"
        justifyContent="center"
        alignItems="center"
        minH={h}
        minW={w}
      >
        <Spinner color="brand.500" size="xl" />
      </Flex>
    </CardBody>
  );
}

export { Loader };
