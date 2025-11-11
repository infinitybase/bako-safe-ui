import { Field, InputGroup, Text } from 'bako-ui';
import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FiChevronRight as ChevronRightIcon } from 'react-icons/fi';

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
          <Field.Root>
            <InputGroup
              endElement={<ChevronRightIcon color="grey.75" fontSize="lg" />}
              position="relative"
            >
              <AssetSelect {...field} options={options} />
            </InputGroup>
          </Field.Root>
        )}
      />
    </CardRoot>
  );
};
