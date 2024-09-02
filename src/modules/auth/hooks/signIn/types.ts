import { UseDappSignIn } from './useDappSignIn';
import { UseWebSignIn } from './useWebSignIn';

export enum SignInOrigin {
  DAPP = 'DAPP',
  WEB = 'WEB',
}

export interface ISignInRedirect {
  redirect: () => string;
}

export type SignInFactory = UseDappSignIn | UseWebSignIn;
