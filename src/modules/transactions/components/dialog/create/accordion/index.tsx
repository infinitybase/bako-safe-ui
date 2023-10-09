import {
  AccordionActions,
  AccordionDeleteAction,
  AccordionEditAction,
} from './actions';
import { AccordionItem } from './item';

const TransactionAccordion = {
  Item: AccordionItem,
  Actions: AccordionActions,
  EditAction: AccordionEditAction,
  DeleteAction: AccordionDeleteAction,
};

export { TransactionAccordion };
