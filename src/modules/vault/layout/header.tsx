import { Box, Flex } from 'bako-ui';
import { motion, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';

import { UserBox } from '@/layouts/dashboard/header';

const MotionBox = motion(Box);

export const VaultLayoutHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 20);
    });

    return () => unsubscribe();
  }, [scrollY]);

  return (
    <MotionBox
      as="header"
      display="flex"
      justifyContent="end"
      alignItems="center"
      minH="107px"
      w="full"
      position="sticky"
      top={0}
      zIndex={10}
      py={3}
      px={8}
      mb={4}
      style={{
        background: isScrolled
          ? 'linear-gradient(180deg, #0D0D0C 0%, rgba(13, 13, 12, 0.6) 60%, rgba(13, 13, 12, 0) 100%)'
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(8px)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <Flex
        position="relative"
        zIndex={1}
        maxW="1500px"
        w="full"
        mx="auto"
        justifyContent="flex-end"
      >
        <UserBox />
      </Flex>
    </MotionBox>
  );
};
