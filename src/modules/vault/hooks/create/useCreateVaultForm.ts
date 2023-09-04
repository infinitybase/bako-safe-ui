import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { AddressUtils } from '@/modules';

function validateUniqueAddresses(addresses: string[]) {
  const uniqueAddresses = new Set(addresses);
  return uniqueAddresses.size === addresses.length;
}

const schema = z
  .object({
    name: z.string(),
    description: z.string().optional(),
    quantity: z.number(),
    destiny: z.string(),
    amount: z.string(),
    addresses: z
      .array(
        z.object({
          value: z.string().refine((address) => AddressUtils.isValid(address), {
            message: 'Not valid address.',
          }),
        }),
      )
      .refine(
        (addresses) =>
          validateUniqueAddresses(addresses.map((address) => address.value)),
        {
          message: 'Address registered.',
        },
      ),
    minSigners: z.string().transform(Number),
    required: z.string().transform(Number),
  })
  .refine((values) => values.addresses.length >= values.minSigners, {
    message:
      'The number of required signatures must be less than or equal to the number of addresses.',
  });

export type UseCreateVaultFormFields = z.infer<typeof schema>;

const useCreateVaultForm = () => {
  const form = useForm<UseCreateVaultFormFields>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const addressesFieldArray = useFieldArray<UseCreateVaultFormFields>({
    name: 'addresses',
    control: form.control,
  });

  return {
    form,
    addressesFieldArray,
  };
};

export { useCreateVaultForm };
