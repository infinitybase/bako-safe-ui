import { Box, Text } from 'bako-ui';
import { addHours, differenceInHours } from 'date-fns';
import React, { useEffect, useState } from 'react';

interface TransactionExpireProps {
  progress?: number;
  progressColor?: string;
  children?: string;
  callBack?: () => void;
  validAt?: string;
  startTime: number;
}

const TransactionExpire = ({
  progress,
  progressColor,
  children,
  callBack,
  validAt,
  startTime,
}: TransactionExpireProps) => {
  const [timerEnded, setTimerEnded] = useState(false);

  const diff = differenceInHours(new Date(), new Date(validAt!));
  const endTimePlusThreeHours = addHours(new Date(validAt!), diff).getTime();

  const [defaultProgress, setDefaultProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTime = endTimePlusThreeHours - Date.now();
      const elapsedTime = Date.now() - startTime;
      setDefaultProgress(
        (elapsedTime / (endTimePlusThreeHours - startTime)) * 100,
      );

      if (remainingTime <= 0) {
        setTimerEnded(true);
        clearInterval(interval);
      }
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, [validAt]);

  const remainingMinutes = Math.floor(
    (endTimePlusThreeHours - Date.now()) / 60000,
  );
  const remainingSeconds =
    Math.floor((endTimePlusThreeHours - Date.now()) / 1000) % 60;

  useEffect(() => {
    if (timerEnded && callBack) {
      callBack();
    }
  }, [timerEnded, callBack]);

  const timerDisplay = `${remainingMinutes}:${
    remainingSeconds < 10 ? '0' : ''
  }${remainingSeconds}`;

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
        bg={progressColor || 'primary.main'}
        transition="width .5s ease"
        h="inherit"
      />
    </Box>
  );
};

export { TransactionExpire };
