import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

const DialogLink = (props: LinkProps) => {
  const location = useLocation();

  return (
    <ChakraLink as={Link} state={{ from: location }} {...props}></ChakraLink>
  );
};

export { DialogLink };
