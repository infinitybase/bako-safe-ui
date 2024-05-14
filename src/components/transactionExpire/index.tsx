import { Box, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

interface TransactionExpireProps {
  progress?: number;
  progressColor?: string;
  children?: string;
  callBack?: () => void;
  validAt?: string;
}

const TransactionExpire = ({
  progress,
  progressColor,
  children,
  callBack,
  validAt,
}: TransactionExpireProps) => {
  const [timerEnded, setTimerEnded] = useState(false);
  const [startTime] = useState(Date.now());

  const endTimePlusThreeHours = new Date(String(validAt));
  const correctEndTime = endTimePlusThreeHours.setHours(
    endTimePlusThreeHours.getHours(), // - 3,
  );

  const [defaultProgress, setDefaultProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTime = correctEndTime - Date.now();
      const elapsedTime = Date.now() - startTime;
      setDefaultProgress((elapsedTime / (correctEndTime - startTime)) * 100);

      if (remainingTime <= 0) {
        //setTimerEnded(true);
        clearInterval(interval);
      }
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, [validAt]);

  const remainingMinutes = Math.floor((correctEndTime - Date.now()) / 60000);
  const remainingSeconds =
    Math.floor((correctEndTime - Date.now()) / 1000) % 60;

  useEffect(() => {
    if (timerEnded && callBack) {
      callBack();
    }
  }, [timerEnded, callBack]);

  const timerDisplay = `${remainingMinutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;

  if (!validAt) return null;

  return (
    <Box
      h="20px"
      w="full"
      position="relative"
      bg="grey.825"
      overflow="hidden"
      dropShadow="2px 0px 1px 0px rgba(0, 0, 0, 0.25)"
    >
      <Text
        zIndex={1}
        fontSize={12}
        fontWeight={500}
        textAlign="center"
        color="grey.50"
        position="relative"
        letterSpacing="1px"
      >
        {children ??
          `Transaction expire time: ${timerEnded ? 0 : timerDisplay}`}
      </Text>

      <Box
        position="absolute"
        top={0}
        left={0}
        w={`${progress ?? defaultProgress}%`}
        bg={progressColor || 'brand.800'}
        transition="width .5s ease"
        h="inherit"
      />
    </Box>
  );
};

export { TransactionExpire };
