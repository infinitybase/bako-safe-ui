import { Box, Image, Text } from '@chakra-ui/react';

interface WithdrawlItemProps {
  image: string;
  title: string;
  description: string;
}

export function ItemWithdrawals({
  image,
  title,
  description,
}: WithdrawlItemProps) {
  return (
    <Box
      width={{ base: 'full', md: 300 }}
      marginY={4}
      marginX={{ base: 4, md: 0 }}
      display="flex"
      flexDirection={{ base: 'row', md: 'column' }}
      justifyContent={{ base: 'flex-start', md: 'center' }}
      alignItems={{ base: 'flex-start', md: 'center' }}
    >
      <Image
        src={image}
        maxWidth={{ base: '48px', md: '80px' }}
        alt={title}
        borderRadius={8}
        marginBottom={{ base: 0, md: 12 }}
      />
      <Box display={{ base: 'row' }} marginLeft={{ base: 4, md: 0 }}>
        <Text
          fontSize={16}
          fontWeight={700}
          marginBottom={{ base: 0, md: 6 }}
          align={{ base: 'left', md: 'center' }}
        >
          {title}
        </Text>
        <Text
          fontWeight={{ base: 'normal', md: 600 }}
          fontSize={12}
          color={'#868079'}
          align={{ base: 'left', md: 'center' }}
        >
          {description}
        </Text>
      </Box>
    </Box>
  );
}
