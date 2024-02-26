import { Box } from '@chakra-ui/react';

const SigninContainerBackground = () => {
  return (
    <Box
      zIndex="0"
      w="100vw"
      h="100vh"
      display="flex"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      backgroundImage="url('backgroundHome.png')"
      backgroundSize="cover"
      backgroundPosition="unset"
      style={{ filter: 'blur(12px)' }} // Adicionando o desfoque aqui
    />
  );
};

export { SigninContainerBackground };
