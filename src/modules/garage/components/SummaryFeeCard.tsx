import {
  Divider,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useMemo } from 'react';

import FuelLogo from '@/assets/fuel-token-logo.png';
import { Card, QuestionIcon } from '@/components';

import { removeRightZeros } from '../utils/remove-right-zeros';

interface SummaryFeeCardProps {
  currentValue: number;
  currentFee: string;
  assetSymbol: string;
  valueToReceive: string;
  currentReceiveAmountInUsd: string;
  isFuelToken: boolean;
}

export default function SummaryFeeCard({
  assetSymbol,
  currentFee,
  currentValue,
  currentReceiveAmountInUsd,
  valueToReceive,
  isFuelToken,
}: SummaryFeeCardProps) {
  const feePercentage = useMemo(() => Number(currentFee) / 100, [currentFee]);
  const formattedFee = useMemo(
    () => removeRightZeros(feePercentage.toFixed(2)),
    [feePercentage],
  );

  return (
    <Card p={4} pb={1}>
      <Stack spacing={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="xs" color="section.500">
            Price
          </Text>
          <Text fontSize="xs" color="grey.100">
            {currentValue} {assetSymbol}
          </Text>
        </Flex>

        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="xs" color="section.500">
            Bako fee
            <Tooltip
              hasArrow
              gutter={90}
              arrowSize={30}
              bg="stroke.500"
              placement="left"
              minW="330px"
              label={
                <Stack spacing={4} rounded="md" p={4}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading fontSize="md">Save on fees with FUEL</Heading>
                    <Image
                      ml={2}
                      boxSize="20px"
                      src={FuelLogo}
                      alt="FUEL logo"
                    />
                  </Flex>
                  <Stack spacing={0}>
                    <Text fontSize="xs" opacity={0.75}>
                      FUEL with Handle: no fee
                    </Text>
                    <Text fontSize="xs" opacity={0.75}>
                      FUEL without Handle: 1% fee
                    </Text>
                    <Text fontSize="xs" opacity={0.75}>
                      Other tokens 3-4% fee
                    </Text>
                  </Stack>
                </Stack>
              }
            >
              <QuestionIcon ml={1} fontSize="md" />
            </Tooltip>
          </Text>
          <Text fontSize="xs" color={isFuelToken ? '#8CEEB3' : 'grey.100'}>
            {isFuelToken && (
              <Text
                as="span"
                color="section.500"
                textDecoration="line-through"
                mr={2}
              >
                4%
              </Text>
            )}
            {`${formattedFee}%`}
          </Text>
        </Flex>

        <Divider />

        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="xs" color="section.500" alignSelf="flex-start">
            You will receive
          </Text>
          <Stack gap={0} alignItems="flex-end">
            <Text fontSize="xs" color="grey.100">
              {Number(valueToReceive) || '0'} {assetSymbol}
            </Text>
            <Text fontSize="2xs" color="section.500">
              {currentReceiveAmountInUsd}
            </Text>
          </Stack>
        </Flex>
      </Stack>
    </Card>
  );
}
