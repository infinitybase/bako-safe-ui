import {
  DialogActions,
  DialogPrimaryAction,
  DialogSecondaryAction,
} from './actions';
import { DialogBody } from './body';
import { DialogHeader } from './header';
import { DialogModal } from './modal';

const Dialog = {
  Header: DialogHeader,
  Modal: DialogModal,
  Body: DialogBody,
  Actions: DialogActions,
  PrimaryAction: DialogPrimaryAction,
  SecondaryAction: DialogSecondaryAction,
};

export { Dialog };
