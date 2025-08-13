import { Box, Image, Skeleton, Text } from '@chakra-ui/react';
import { memo, useState } from 'react';

interface WithdrawlItemProps {
  image: string;
  title: string;
  description: string;
}

export const ItemWithdrawals = memo(
  ({ image, title, description }: WithdrawlItemProps) => {
    const [isLoadingImage, setIsLoadingImage] = useState(true);

    const handleLoadImage = () => {
      setIsLoadingImage(false);
    };

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
        <Skeleton
          isLoaded={!isLoadingImage}
          maxWidth={{ base: '48px', md: '80px' }}
          marginBottom={{ base: 0, md: 12 }}
        >
          <Image
            onLoad={handleLoadImage}
            src={image}
            alt={title}
            borderRadius={8}
          />
        </Skeleton>
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
  },
);

ItemWithdrawals.displayName = 'ItemWithdrawals';
