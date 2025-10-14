import { Link as ChakraLink, LinkProps } from 'bako-ui';
import { Link, useLocation } from 'react-router-dom';

const DialogLink = (props: LinkProps) => {
  const location = useLocation();

  return (
    // @ts-expect-error - TODO: fix this
    <ChakraLink as={Link} state={{ from: location }} {...props}></ChakraLink>
  );
};

export { DialogLink };
