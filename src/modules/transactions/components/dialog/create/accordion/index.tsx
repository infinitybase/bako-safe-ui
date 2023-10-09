import {
  AccordionActions,
  AccordionConfirmAction,
  AccordionDeleteAction,
  AccordionEditAction,
} from './actions';
import { AccordionItem } from './item';

const TransactionAccordion = {
  Item: AccordionItem,
  Actions: AccordionActions,
  EditAction: AccordionEditAction,
  ConfirmAction: AccordionConfirmAction,
  DeleteAction: AccordionDeleteAction,
};

export { TransactionAccordion };
