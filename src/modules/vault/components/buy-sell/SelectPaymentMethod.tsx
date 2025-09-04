import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  FormControl,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { AssetSelect } from '@/components';
import { ICreateWidgetPayload } from '@/modules/core/models/meld';

import { useListPaymentMethods } from '../../hooks/buy-sell/useListPaymentMethods';
import { CardRoot } from './CardRoot';

export const SelectPaymentMethod = () => {
  const { control } = useFormContext<ICreateWidgetPayload>();
  const { paymentMethods } = useListPaymentMethods();

  const options = useMemo(
    () =>
      paymentMethods.map((method) => ({
        value: method.paymentMethod,
        name: method.name,
        image: method.logos.dark,
        symbol: null,
      })),
    [paymentMethods],
  );

  return (
    <CardRoot>
      <Text color="section.500" fontSize="sm">
        Funds via
      </Text>
      <Controller
        control={control}
        name="paymentMethodType"
        render={({ field }) => (
          <FormControl>
            <InputGroup position="relative">
              <AssetSelect {...field} options={options} />
              <InputRightElement
                position="absolute"
                right={4}
                top="50%"
                transform="translateY(-50%)"
              >
                <ChevronRightIcon color="grey.75" fontSize="lg" />
              </InputRightElement>
            </InputGroup>
          </FormControl>
        )}
      />
    </CardRoot>
  );
};
