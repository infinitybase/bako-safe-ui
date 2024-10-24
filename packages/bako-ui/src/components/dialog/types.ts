// types.ts
import { DialogModalProps } from "./modal";
import { DialogHeaderProps } from "./header";
import { DialogBodyProps } from "./body";

export interface DialogComponents {
  Header: React.FC<DialogHeaderProps>;
  Modal: React.FC<DialogModalProps>;
  Body: React.FC<DialogBodyProps>;
  Actions: React.FC;
  PrimaryAction: React.FC;
  SecondaryAction: React.FC;
  TertiaryAction: React.FC;
  Section: React.FC;
}
