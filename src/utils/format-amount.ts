import { bn, BNInput, FormatConfig } from 'fuels';

function formatAmount({
  amount,
  options,
}: {
  amount?: BNInput;
  options?: FormatConfig;
}) {
  const formatParams = {
    precision: 9,
    ...(options ?? {}),
  };

  const isZeroUnits = !options?.units;
  if (isZeroUnits) {
    const amountZeroUnits = bn(amount).mul(10);
    formatParams.units = 1;
    formatParams.precision = 0;
    return amountZeroUnits.format(formatParams);
  }

  return bn(amount).format(formatParams);
}

export { formatAmount };
