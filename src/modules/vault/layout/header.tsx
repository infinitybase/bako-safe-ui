import { Box, Flex, Icon, IconButton } from 'bako-ui';
import { motion, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';

import { MenuIcon } from '@/components/icons/menu';
import { Drawer } from '@/layouts/dashboard/drawer';
import { UserBox } from '@/layouts/dashboard/header';
import { useScreenSize } from '@/modules';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';

const MotionBox = motion(Box);

export const VaultLayoutHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const menuDrawer = useDisclosure();
  const { vaultRequiredSizeToColumnLayout } = useScreenSize();

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
        px={{
          base: 3,
          sm: 6,
        }}
        justifyContent={
          vaultRequiredSizeToColumnLayout ? 'space-between' : 'flex-end'
        }
      >
        <Box display={vaultRequiredSizeToColumnLayout ? 'block' : 'none'}>
          <IconButton
            variant="ghost"
            aria-label="Open menu"
            size="xs"
            onClick={menuDrawer.onOpen}
          >
            <Icon as={MenuIcon} w={4} color="gray.200" />
          </IconButton>

          <Drawer
            open={menuDrawer.isOpen}
            onOpenChange={menuDrawer.onOpenChange}
          />
        </Box>
        <UserBox />
      </Flex>
    </MotionBox>
  );
};
