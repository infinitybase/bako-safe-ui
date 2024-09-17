import { UseDappSignIn } from './useDappSignIn';
import { UseWebSignIn } from './useWebSignIn';

export enum SignInOrigin {
  DAPP = 'DAPP',
  WEB = 'WEB',
}

export interface ISignInRedirect {
  redirect: (vaultId?: string, workspaceId?: string) => string;
}

export type SignInFactory = UseDappSignIn | UseWebSignIn;
