import { useAuth } from '@/modules/auth';
import { useWorkspace } from '../useWorkspace';
import { useAddressBook } from '@/modules';
import { useEffect, useRef, useState } from 'react';
import { useTokensUSDAmountRequest } from '@/modules/home/hooks/useTokensUSDAmountRequest';
import { currentPath } from '@/utils';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import debounce from 'lodash.debounce';

const useWorkspaceDetails = () => {
  const [showWorkspace, setShowWorkspace] = useState(false);

  const { isSignInpage } = currentPath();

  const {
    homeTransactions: {
      request: { isLoading: isHomeRequestLoading },
    },
    meTransactions: {
      transactionsRequest: { isLoading: isMeTransactionsLoading },
    },
    transactionsPageList: {
      request: { isLoading: isTransactionsPageListLoading },
    },
  } = useTransactionsContext();

  const tokensUSD = useTokensUSDAmountRequest();
  const authDetails = useAuth();
  const {
    handlers: { hasPermission, ...handlersData },
    requests: { worksapceBalance, latestPredicates, ...requestsData },
    ...rest
  } = useWorkspace(authDetails.userInfos, setShowWorkspace);
  const addressBookInfos = useAddressBook(authDetails, hasPermission);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const gifDuration = 1500;

    if (timerRef.current !== null) {
      console.log('Clearing existing timer:', timerRef.current);
      clearTimeout(timerRef.current);
    }

    // Start the timer
    console.log('Setting new timer');
    timerRef.current = window.setTimeout(() => {
      console.log('Timeout finished, setting workspace to true');
      setShowWorkspace(true);
    }, gifDuration);

    return () => {
      if (timerRef.current !== null) {
        console.log('Clearing timer on cleanup:', timerRef.current);
        clearTimeout(timerRef.current);
      }
    };
  }, [authDetails.userInfos.isLoading, authDetails.userInfos.isFetching]);

  const isWorkspaceReady = isSignInpage
    ? true
    : !latestPredicates.isLoading &&
      !worksapceBalance.isLoading &&
      !addressBookInfos.requests.listContactsRequest.isLoading &&
      // The transactions laoding is commented out because it's trigged when use the filters
      // !isHomeRequestLoading &&
      // !isMeTransactionsLoading &&
      // !isTransactionsPageListLoading &&
      !authDetails.userInfos.isLoading &&
      showWorkspace;

  return {
    isWorkspaceReady,
    authDetails,
    workspaceInfos: {
      handlers: { hasPermission, ...handlersData },
      requests: { worksapceBalance, latestPredicates, ...requestsData },
      ...rest,
    },
    addressBookInfos,
    tokensUSD,
    setShowWorkspace,
  };
};

export { useWorkspaceDetails };
