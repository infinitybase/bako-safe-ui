enum OperationTitle {
  FROM = 'From',
  TO = 'To',
}

interface OperationProps {
  title: OperationTitle;
}

const Operation = ({}: OperationProps) => {};

export { Operation };
