/**
 * JamMonitor - Transaction Monitoring Service for Bako Safe
 *
 * This service integrates with Jam.dev to provide detailed debugging
 * and monitoring of all transaction-related events in the system.
 *
 * Events tracked:
 * - Transaction creation (start, success, error)
 * - Transaction signing (start, success, decline, error)
 * - Transaction sending/execution (start, success, error)
 * - Socket events (connection, transaction updates)
 * - API requests (transaction-related endpoints)
 * - Wallet interactions (signatures, connections)
 */

// Import directly from the model to avoid circular dependency
import { TransactionStatus } from '@/modules/core/models/transaction';

declare global {
  interface Window {
    jam?: {
      metadata: (data: Record<string, unknown>) => void;
      event: (name: string, data?: Record<string, unknown>) => void;
    };
  }
}

export enum JamEventType {
  // Transaction Lifecycle
  TX_CREATE_START = 'tx:create:start',
  TX_CREATE_SUCCESS = 'tx:create:success',
  TX_CREATE_ERROR = 'tx:create:error',

  TX_SIGN_START = 'tx:sign:start',
  TX_SIGN_SUCCESS = 'tx:sign:success',
  TX_SIGN_DECLINE = 'tx:sign:decline',
  TX_SIGN_ERROR = 'tx:sign:error',

  TX_SEND_START = 'tx:send:start',
  TX_SEND_SUCCESS = 'tx:send:success',
  TX_SEND_ERROR = 'tx:send:error',
  TX_SEND_PENDING = 'tx:send:pending',

  TX_CANCEL_START = 'tx:cancel:start',
  TX_CANCEL_SUCCESS = 'tx:cancel:success',
  TX_CANCEL_ERROR = 'tx:cancel:error',

  // Transaction Status Changes
  TX_STATUS_CHANGE = 'tx:status:change',

  // Socket Events
  SOCKET_CONNECTED = 'socket:connected',
  SOCKET_DISCONNECTED = 'socket:disconnected',
  SOCKET_TX_UPDATE = 'socket:tx:update',
  SOCKET_TX_CREATED = 'socket:tx:created',
  SOCKET_TX_SIGNED = 'socket:tx:signed',

  // API Events
  API_REQUEST_START = 'api:request:start',
  API_REQUEST_SUCCESS = 'api:request:success',
  API_REQUEST_ERROR = 'api:request:error',

  // Wallet Events
  WALLET_CONNECT = 'wallet:connect',
  WALLET_DISCONNECT = 'wallet:disconnect',
  WALLET_SIGN_MESSAGE = 'wallet:sign:message',
  WALLET_SIGN_ERROR = 'wallet:sign:error',

  // Vault Events
  VAULT_INSTANTIATE = 'vault:instantiate',
  VAULT_INSTANTIATE_ERROR = 'vault:instantiate:error',

  // Cost Calculation
  TX_COST_CALCULATE_START = 'tx:cost:calculate:start',
  TX_COST_CALCULATE_SUCCESS = 'tx:cost:calculate:success',
  TX_COST_CALCULATE_ERROR = 'tx:cost:calculate:error',

  // DApp Events
  DAPP_TX_REQUEST = 'dapp:tx:request',
  DAPP_TX_APPROVE = 'dapp:tx:approve',
  DAPP_TX_REJECT = 'dapp:tx:reject',

  // Asset API Events
  ASSET_FETCH_START = 'asset:fetch:start',
  ASSET_FETCH_SUCCESS = 'asset:fetch:success',
  ASSET_FETCH_ERROR = 'asset:fetch:error',
  ASSET_FETCH_CACHE_HIT = 'asset:fetch:cache_hit',

  // NFT Metadata Events
  NFT_METADATA_FETCH_START = 'nft:metadata:fetch:start',
  NFT_METADATA_FETCH_SUCCESS = 'nft:metadata:fetch:success',
  NFT_METADATA_FETCH_ERROR = 'nft:metadata:fetch:error',

  // React Query Events
  RQ_QUERY_START = 'rq:query:start',
  RQ_QUERY_SUCCESS = 'rq:query:success',
  RQ_QUERY_ERROR = 'rq:query:error',
  RQ_QUERY_DUPLICATE = 'rq:query:duplicate',
  RQ_MUTATION_START = 'rq:mutation:start',
  RQ_MUTATION_SUCCESS = 'rq:mutation:success',
  RQ_MUTATION_ERROR = 'rq:mutation:error',
  RQ_INVALIDATE = 'rq:invalidate',

  // API Interceptor Events
  API_CALL_START = 'api:call:start',
  API_CALL_SUCCESS = 'api:call:success',
  API_CALL_ERROR = 'api:call:error',
  API_CALL_DUPLICATE = 'api:call:duplicate',
}

export interface TransactionEventData {
  transactionId?: string;
  transactionHash?: string;
  transactionName?: string;
  predicateId?: string;
  predicateAddress?: string;
  workspaceId?: string;
  status?: TransactionStatus | string;
  previousStatus?: TransactionStatus | string;
  assets?: Array<{
    assetId: string;
    amount: string;
    to?: string;
  }>;
  fee?: string;
  gasUsed?: string;
  signers?: {
    total: number;
    signed: number;
    required: number;
  };
  error?: {
    message: string;
    code?: string;
    stack?: string;
  };
  duration?: number;
  metadata?: Record<string, unknown>;
}

export interface SocketEventData {
  event: string;
  sessionId?: string;
  transactionId?: string;
  type?: string;
  metadata?: Record<string, unknown>;
}

export interface ApiEventData {
  endpoint: string;
  method: string;
  status?: number;
  duration?: number;
  error?: string;
  requestId?: string;
}

export interface WalletEventData {
  walletType?: string;
  address?: string;
  action?: string;
  error?: string;
}

export interface AssetFetchEventData {
  assetId: string;
  chainId?: number;
  url?: string;
  source?: 'explorer' | 'cache' | 'ipfs';
  duration?: number;
  error?: {
    message: string;
    status?: number;
  };
  assetName?: string;
  assetSymbol?: string;
  isNFT?: boolean;
}

export interface ReactQueryEventData {
  queryKey: unknown[];
  queryKeyString?: string;
  status?: string;
  duration?: number;
  error?: string;
  staleTime?: number;
  cacheTime?: number;
  isStale?: boolean;
  isFetching?: boolean;
  callCount?: number;
  caller?: string;
  duplicateOf?: string;
}

export interface ApiCallEventData {
  method: string;
  url: string;
  endpoint: string;
  status?: number;
  duration?: number;
  error?: string;
  requestId: string;
  callCount?: number;
  isDuplicate?: boolean;
  caller?: string;
  params?: Record<string, unknown>;
  responseSize?: number;
}

class JamMonitorService {
  private isEnabled: boolean;
  private sessionStartTime: number;
  private eventBuffer: Array<{ type: string; data: unknown; timestamp: number }>;
  private userContext: Record<string, unknown>;

  // Track API calls for duplicate detection
  private apiCallTracker: Map<string, { count: number; lastCall: number; callers: string[] }>;
  private queryCallTracker: Map<string, { count: number; lastCall: number; callers: string[] }>;

  // Threshold for duplicate detection (ms)
  private duplicateThreshold = 1000; // Consider duplicate if called within 1 second

  constructor() {
    this.isEnabled = typeof window !== 'undefined' && !!window.jam;
    this.sessionStartTime = Date.now();
    this.eventBuffer = [];
    this.userContext = {};
    this.apiCallTracker = new Map();
    this.queryCallTracker = new Map();
  }

  /**
   * Get caller information from stack trace
   */
  private getCaller(): string {
    try {
      const stack = new Error().stack;
      if (!stack) return 'unknown';

      const lines = stack.split('\n');
      // Skip first 3 lines (Error, getCaller, logEvent/caller method)
      for (let i = 3; i < lines.length; i++) {
        const line = lines[i];
        // Skip internal lines
        if (
          line.includes('jamMonitor') ||
          line.includes('node_modules') ||
          line.includes('react-query') ||
          line.includes('axios')
        ) {
          continue;
        }

        // Extract file and line number
        const match = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/) ||
                      line.match(/at\s+(.+?):(\d+):(\d+)/);

        if (match) {
          const funcName = match[1] || 'anonymous';
          const file = match[2]?.split('/').pop() || match[1]?.split('/').pop() || '';
          const lineNum = match[3] || match[2];
          return `${funcName} (${file}:${lineNum})`;
        }
      }
      return 'unknown';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Generate a key for tracking API calls
   */
  private getApiCallKey(method: string, url: string): string {
    return `${method}:${url}`;
  }

  /**
   * Check if this is a duplicate call and track it
   */
  private trackApiCall(method: string, url: string): { isDuplicate: boolean; callCount: number; caller: string } {
    const key = this.getApiCallKey(method, url);
    const now = Date.now();
    const caller = this.getCaller();

    const existing = this.apiCallTracker.get(key);

    if (existing && (now - existing.lastCall) < this.duplicateThreshold) {
      existing.count++;
      existing.lastCall = now;
      existing.callers.push(caller);
      // Keep only last 5 callers
      if (existing.callers.length > 5) existing.callers.shift();

      return { isDuplicate: true, callCount: existing.count, caller };
    }

    this.apiCallTracker.set(key, { count: 1, lastCall: now, callers: [caller] });
    return { isDuplicate: false, callCount: 1, caller };
  }

  /**
   * Track React Query calls
   */
  private trackQueryCall(queryKey: string): { isDuplicate: boolean; callCount: number; caller: string } {
    const now = Date.now();
    const caller = this.getCaller();

    const existing = this.queryCallTracker.get(queryKey);

    if (existing && (now - existing.lastCall) < this.duplicateThreshold) {
      existing.count++;
      existing.lastCall = now;
      existing.callers.push(caller);
      if (existing.callers.length > 5) existing.callers.shift();

      return { isDuplicate: true, callCount: existing.count, caller };
    }

    this.queryCallTracker.set(queryKey, { count: 1, lastCall: now, callers: [caller] });
    return { isDuplicate: false, callCount: 1, caller };
  }

  /**
   * Check if Jam monitoring is available
   */
  get isAvailable(): boolean {
    return this.isEnabled && !!window.jam;
  }

  /**
   * Set user context for all subsequent events
   * This helps identify who is experiencing issues
   */
  setUserContext(context: {
    userId?: string;
    address?: string;
    workspaceId?: string;
    workspaceName?: string;
    environment?: string;
  }): void {
    this.userContext = { ...this.userContext, ...context };
    this.updateMetadata();
  }

  /**
   * Set current vault context
   */
  setVaultContext(context: {
    vaultId?: string;
    vaultName?: string;
    vaultAddress?: string;
    minSigners?: number;
    totalSigners?: number;
  }): void {
    this.userContext = { ...this.userContext, vault: context };
    this.updateMetadata();
  }

  /**
   * Update Jam metadata with current context
   */
  private updateMetadata(): void {
    if (!this.isAvailable) return;

    window.jam?.metadata({
      ...this.userContext,
      sessionDuration: Date.now() - this.sessionStartTime,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log a custom event to Jam
   * Events are logged to console in a structured format that Jam MCP can read
   */
  private logEvent(type: JamEventType | string, data?: Record<string, unknown>): void {
    const eventData = {
      type,
      data: {
        ...data,
        ...this.userContext,
        timestamp: new Date().toISOString(),
        sessionDuration: Date.now() - this.sessionStartTime,
      },
      timestamp: Date.now(),
    };

    // Always buffer events for debugging
    this.eventBuffer.push(eventData);
    if (this.eventBuffer.length > 100) {
      this.eventBuffer.shift();
    }

    // Always log to console - Jam MCP reads console logs from recordings
    // Format: [BakoSafe:EventType] JSON data
    // This structured format makes it easy for Jam MCP to parse and analyze
    console.log(
      `[BakoSafe:${type}]`,
      JSON.stringify(eventData.data, null, 0)
    );

    // Also log errors and warnings with appropriate console methods
    if (type.includes('error') || type.includes('ERROR')) {
      console.error(`[BakoSafe:${type}]`, eventData.data);
    } else if (type.includes('warning') || type.includes('decline')) {
      console.warn(`[BakoSafe:${type}]`, eventData.data);
    }

    // Send to Jam if available
    if (this.isAvailable) {
      window.jam?.event(type, eventData.data);
    }
  }

  // ==========================================
  // Transaction Creation Events
  // ==========================================

  txCreateStart(data: TransactionEventData): void {
    this.logEvent(JamEventType.TX_CREATE_START, {
      transactionName: data.transactionName,
      predicateId: data.predicateId,
      predicateAddress: data.predicateAddress,
      assets: data.assets,
      fee: data.fee,
    });
  }

  txCreateSuccess(data: TransactionEventData): void {
    this.logEvent(JamEventType.TX_CREATE_SUCCESS, {
      transactionId: data.transactionId,
      transactionHash: data.transactionHash,
      transactionName: data.transactionName,
      predicateId: data.predicateId,
      assets: data.assets,
      fee: data.fee,
      duration: data.duration,
    });
  }

  txCreateError(data: TransactionEventData): void {
    this.logEvent(JamEventType.TX_CREATE_ERROR, {
      transactionName: data.transactionName,
      predicateId: data.predicateId,
      assets: data.assets,
      error: data.error,
    });
  }

  // ==========================================
  // Transaction Signing Events
  // ==========================================

  txSignStart(data: TransactionEventData): void {
    this.logEvent(JamEventType.TX_SIGN_START, {
      transactionId: data.transactionId,
      transactionHash: data.transactionHash,
      predicateId: data.predicateId,
      signers: data.signers,
    });
  }

  txSignSuccess(data: TransactionEventData): void {
    this.logEvent(JamEventType.TX_SIGN_SUCCESS, {
      transactionId: data.transactionId,
      transactionHash: data.transactionHash,
      predicateId: data.predicateId,
      signers: data.signers,
      status: data.status,
      duration: data.duration,
    });
  }

  txSignDecline(data: TransactionEventData): void {
    this.logEvent(JamEventType.TX_SIGN_DECLINE, {
      transactionId: data.transactionId,
      transactionHash: data.transactionHash,
      predicateId: data.predicateId,
    });
  }

  txSignError(data: TransactionEventData): void {
    this.logEvent(JamEventType.TX_SIGN_ERROR, {
      transactionId: data.transactionId,
      transactionHash: data.transactionHash,
      error: data.error,
    });
  }

  // ==========================================
  // Transaction Send/Execute Events
  // ==========================================

  txSendStart(data: TransactionEventData): void {
    this.logEvent(JamEventType.TX_SEND_START, {
      transactionId: data.transactionId,
      transactionHash: data.transactionHash,
      predicateId: data.predicateId,
    });
  }

  txSendSuccess(data: TransactionEventData): void {
    this.logEvent(JamEventType.TX_SEND_SUCCESS, {
      transactionId: data.transactionId,
      transactionHash: data.transactionHash,
      status: data.status,
      gasUsed: data.gasUsed,
      duration: data.duration,
    });
  }

  txSendError(data: TransactionEventData): void {
    this.logEvent(JamEventType.TX_SEND_ERROR, {
      transactionId: data.transactionId,
      transactionHash: data.transactionHash,
      error: data.error,
    });
  }

  txSendPending(data: TransactionEventData): void {
    this.logEvent(JamEventType.TX_SEND_PENDING, {
      transactionId: data.transactionId,
      transactionHash: data.transactionHash,
      status: data.status,
    });
  }

  // ==========================================
  // Transaction Cancel Events
  // ==========================================

  txCancelStart(data: TransactionEventData): void {
    this.logEvent(JamEventType.TX_CANCEL_START, {
      transactionId: data.transactionId,
      transactionHash: data.transactionHash,
    });
  }

  txCancelSuccess(data: TransactionEventData): void {
    this.logEvent(JamEventType.TX_CANCEL_SUCCESS, {
      transactionId: data.transactionId,
      transactionHash: data.transactionHash,
      duration: data.duration,
    });
  }

  txCancelError(data: TransactionEventData): void {
    this.logEvent(JamEventType.TX_CANCEL_ERROR, {
      transactionId: data.transactionId,
      transactionHash: data.transactionHash,
      error: data.error,
    });
  }

  // ==========================================
  // Status Change Events
  // ==========================================

  txStatusChange(data: TransactionEventData): void {
    this.logEvent(JamEventType.TX_STATUS_CHANGE, {
      transactionId: data.transactionId,
      transactionHash: data.transactionHash,
      previousStatus: data.previousStatus,
      status: data.status,
    });
  }

  // ==========================================
  // Socket Events
  // ==========================================

  socketConnected(data: SocketEventData): void {
    this.logEvent(JamEventType.SOCKET_CONNECTED, {
      sessionId: data.sessionId,
    });
  }

  socketDisconnected(data: SocketEventData): void {
    this.logEvent(JamEventType.SOCKET_DISCONNECTED, {
      sessionId: data.sessionId,
    });
  }

  socketTxUpdate(data: SocketEventData): void {
    this.logEvent(JamEventType.SOCKET_TX_UPDATE, {
      event: data.event,
      transactionId: data.transactionId,
      type: data.type,
    });
  }

  socketTxCreated(data: SocketEventData): void {
    this.logEvent(JamEventType.SOCKET_TX_CREATED, {
      transactionId: data.transactionId,
    });
  }

  socketTxSigned(data: SocketEventData): void {
    this.logEvent(JamEventType.SOCKET_TX_SIGNED, {
      transactionId: data.transactionId,
    });
  }

  // ==========================================
  // API Events
  // ==========================================

  apiRequestStart(data: ApiEventData): void {
    this.logEvent(JamEventType.API_REQUEST_START, {
      endpoint: data.endpoint,
      method: data.method,
      requestId: data.requestId,
    });
  }

  apiRequestSuccess(data: ApiEventData): void {
    this.logEvent(JamEventType.API_REQUEST_SUCCESS, {
      endpoint: data.endpoint,
      method: data.method,
      status: data.status,
      duration: data.duration,
      requestId: data.requestId,
    });
  }

  apiRequestError(data: ApiEventData): void {
    this.logEvent(JamEventType.API_REQUEST_ERROR, {
      endpoint: data.endpoint,
      method: data.method,
      status: data.status,
      error: data.error,
      requestId: data.requestId,
    });
  }

  // ==========================================
  // Wallet Events
  // ==========================================

  walletConnect(data: WalletEventData): void {
    this.logEvent(JamEventType.WALLET_CONNECT, {
      walletType: data.walletType,
      address: data.address,
    });
  }

  walletDisconnect(data: WalletEventData): void {
    this.logEvent(JamEventType.WALLET_DISCONNECT, {
      walletType: data.walletType,
      address: data.address,
    });
  }

  walletSignMessage(data: WalletEventData): void {
    this.logEvent(JamEventType.WALLET_SIGN_MESSAGE, {
      walletType: data.walletType,
      address: data.address,
      action: data.action,
    });
  }

  walletSignError(data: WalletEventData): void {
    this.logEvent(JamEventType.WALLET_SIGN_ERROR, {
      walletType: data.walletType,
      address: data.address,
      error: data.error,
    });
  }

  // ==========================================
  // Vault Events
  // ==========================================

  vaultInstantiate(data: { vaultId: string; vaultAddress: string }): void {
    this.logEvent(JamEventType.VAULT_INSTANTIATE, data);
  }

  vaultInstantiateError(data: { vaultId?: string; error: string }): void {
    this.logEvent(JamEventType.VAULT_INSTANTIATE_ERROR, data);
  }

  // ==========================================
  // Cost Calculation Events
  // ==========================================

  txCostCalculateStart(data: TransactionEventData): void {
    this.logEvent(JamEventType.TX_COST_CALCULATE_START, {
      predicateId: data.predicateId,
      assets: data.assets,
    });
  }

  txCostCalculateSuccess(data: TransactionEventData): void {
    this.logEvent(JamEventType.TX_COST_CALCULATE_SUCCESS, {
      predicateId: data.predicateId,
      fee: data.fee,
      duration: data.duration,
    });
  }

  txCostCalculateError(data: TransactionEventData): void {
    this.logEvent(JamEventType.TX_COST_CALCULATE_ERROR, {
      predicateId: data.predicateId,
      error: data.error,
    });
  }

  // ==========================================
  // DApp Events
  // ==========================================

  dappTxRequest(data: TransactionEventData): void {
    this.logEvent(JamEventType.DAPP_TX_REQUEST, {
      transactionId: data.transactionId,
      predicateId: data.predicateId,
      assets: data.assets,
    });
  }

  dappTxApprove(data: TransactionEventData): void {
    this.logEvent(JamEventType.DAPP_TX_APPROVE, {
      transactionId: data.transactionId,
      transactionHash: data.transactionHash,
    });
  }

  dappTxReject(data: TransactionEventData): void {
    this.logEvent(JamEventType.DAPP_TX_REJECT, {
      transactionId: data.transactionId,
    });
  }

  // ==========================================
  // Asset Fetch Events
  // ==========================================

  assetFetchStart(data: AssetFetchEventData): void {
    this.logEvent(JamEventType.ASSET_FETCH_START, {
      assetId: data.assetId,
      chainId: data.chainId,
      url: data.url,
      source: data.source,
    });
  }

  assetFetchSuccess(data: AssetFetchEventData): void {
    this.logEvent(JamEventType.ASSET_FETCH_SUCCESS, {
      assetId: data.assetId,
      chainId: data.chainId,
      url: data.url,
      source: data.source,
      duration: data.duration,
      assetName: data.assetName,
      assetSymbol: data.assetSymbol,
      isNFT: data.isNFT,
    });
  }

  assetFetchError(data: AssetFetchEventData): void {
    this.logEvent(JamEventType.ASSET_FETCH_ERROR, {
      assetId: data.assetId,
      chainId: data.chainId,
      url: data.url,
      source: data.source,
      error: data.error,
    });
  }

  assetFetchCacheHit(data: AssetFetchEventData): void {
    this.logEvent(JamEventType.ASSET_FETCH_CACHE_HIT, {
      assetId: data.assetId,
      assetName: data.assetName,
      assetSymbol: data.assetSymbol,
    });
  }

  // ==========================================
  // NFT Metadata Events
  // ==========================================

  nftMetadataFetchStart(data: AssetFetchEventData): void {
    this.logEvent(JamEventType.NFT_METADATA_FETCH_START, {
      assetId: data.assetId,
      url: data.url,
    });
  }

  nftMetadataFetchSuccess(data: AssetFetchEventData): void {
    this.logEvent(JamEventType.NFT_METADATA_FETCH_SUCCESS, {
      assetId: data.assetId,
      url: data.url,
      duration: data.duration,
      assetName: data.assetName,
    });
  }

  nftMetadataFetchError(data: AssetFetchEventData): void {
    this.logEvent(JamEventType.NFT_METADATA_FETCH_ERROR, {
      assetId: data.assetId,
      url: data.url,
      error: data.error,
    });
  }

  // ==========================================
  // React Query Events
  // ==========================================

  rqQueryStart(data: ReactQueryEventData): void {
    const queryKeyString = JSON.stringify(data.queryKey);
    const tracking = this.trackQueryCall(queryKeyString);

    if (tracking.isDuplicate) {
      this.logEvent(JamEventType.RQ_QUERY_DUPLICATE, {
        queryKey: data.queryKey,
        queryKeyString,
        callCount: tracking.callCount,
        caller: tracking.caller,
        message: `Query called ${tracking.callCount} times within ${this.duplicateThreshold}ms`,
      });
    }

    this.logEvent(JamEventType.RQ_QUERY_START, {
      queryKey: data.queryKey,
      queryKeyString,
      caller: tracking.caller,
      callCount: tracking.callCount,
      isStale: data.isStale,
      isFetching: data.isFetching,
    });
  }

  rqQuerySuccess(data: ReactQueryEventData): void {
    this.logEvent(JamEventType.RQ_QUERY_SUCCESS, {
      queryKey: data.queryKey,
      queryKeyString: JSON.stringify(data.queryKey),
      duration: data.duration,
      status: data.status,
    });
  }

  rqQueryError(data: ReactQueryEventData): void {
    this.logEvent(JamEventType.RQ_QUERY_ERROR, {
      queryKey: data.queryKey,
      queryKeyString: JSON.stringify(data.queryKey),
      error: data.error,
      duration: data.duration,
    });
  }

  rqMutationStart(data: ReactQueryEventData): void {
    this.logEvent(JamEventType.RQ_MUTATION_START, {
      queryKey: data.queryKey,
      queryKeyString: JSON.stringify(data.queryKey),
      caller: this.getCaller(),
    });
  }

  rqMutationSuccess(data: ReactQueryEventData): void {
    this.logEvent(JamEventType.RQ_MUTATION_SUCCESS, {
      queryKey: data.queryKey,
      queryKeyString: JSON.stringify(data.queryKey),
      duration: data.duration,
    });
  }

  rqMutationError(data: ReactQueryEventData): void {
    this.logEvent(JamEventType.RQ_MUTATION_ERROR, {
      queryKey: data.queryKey,
      queryKeyString: JSON.stringify(data.queryKey),
      error: data.error,
      duration: data.duration,
    });
  }

  rqInvalidate(data: ReactQueryEventData): void {
    this.logEvent(JamEventType.RQ_INVALIDATE, {
      queryKey: data.queryKey,
      queryKeyString: JSON.stringify(data.queryKey),
      caller: this.getCaller(),
    });
  }

  // ==========================================
  // API Call Events (for axios interceptor)
  // ==========================================

  apiCallStart(data: ApiCallEventData): ApiCallEventData & { isDuplicate: boolean } {
    const tracking = this.trackApiCall(data.method, data.url);

    if (tracking.isDuplicate) {
      this.logEvent(JamEventType.API_CALL_DUPLICATE, {
        method: data.method,
        url: data.url,
        endpoint: data.endpoint,
        callCount: tracking.callCount,
        caller: tracking.caller,
        message: `API called ${tracking.callCount} times within ${this.duplicateThreshold}ms`,
      });
    }

    this.logEvent(JamEventType.API_CALL_START, {
      method: data.method,
      url: data.url,
      endpoint: data.endpoint,
      requestId: data.requestId,
      caller: tracking.caller,
      callCount: tracking.callCount,
      params: data.params,
    });

    return { ...data, isDuplicate: tracking.isDuplicate, callCount: tracking.callCount, caller: tracking.caller };
  }

  apiCallSuccess(data: ApiCallEventData): void {
    this.logEvent(JamEventType.API_CALL_SUCCESS, {
      method: data.method,
      url: data.url,
      endpoint: data.endpoint,
      requestId: data.requestId,
      status: data.status,
      duration: data.duration,
      responseSize: data.responseSize,
    });
  }

  apiCallError(data: ApiCallEventData): void {
    this.logEvent(JamEventType.API_CALL_ERROR, {
      method: data.method,
      url: data.url,
      endpoint: data.endpoint,
      requestId: data.requestId,
      status: data.status,
      error: data.error,
      duration: data.duration,
    });
  }

  // ==========================================
  // Utility Methods
  // ==========================================

  /**
   * Get duplicate call statistics
   */
  getDuplicateStats(): {
    api: Array<{ key: string; count: number; callers: string[] }>;
    query: Array<{ key: string; count: number; callers: string[] }>;
  } {
    const apiDuplicates: Array<{ key: string; count: number; callers: string[] }> = [];
    const queryDuplicates: Array<{ key: string; count: number; callers: string[] }> = [];

    this.apiCallTracker.forEach((value, key) => {
      if (value.count > 1) {
        apiDuplicates.push({ key, count: value.count, callers: value.callers });
      }
    });

    this.queryCallTracker.forEach((value, key) => {
      if (value.count > 1) {
        queryDuplicates.push({ key, count: value.count, callers: value.callers });
      }
    });

    return {
      api: apiDuplicates.sort((a, b) => b.count - a.count),
      query: queryDuplicates.sort((a, b) => b.count - a.count),
    };
  }

  /**
   * Clear duplicate trackers
   */
  clearDuplicateTrackers(): void {
    this.apiCallTracker.clear();
    this.queryCallTracker.clear();
  }

  /**
   * Set the threshold for duplicate detection (in ms)
   */
  setDuplicateThreshold(ms: number): void {
    this.duplicateThreshold = ms;
  }

  /**
   * Get all buffered events (useful for debugging)
   */
  getEventBuffer(): Array<{ type: string; data: unknown; timestamp: number }> {
    return [...this.eventBuffer];
  }

  /**
   * Clear event buffer
   */
  clearEventBuffer(): void {
    this.eventBuffer = [];
  }

  /**
   * Create a timer for measuring operation duration
   */
  startTimer(): () => number {
    const start = Date.now();
    return () => Date.now() - start;
  }
}

// Export singleton instance
export const jamMonitor = new JamMonitorService();

// Expose to window for debugging in browser console
if (typeof window !== 'undefined') {
  (window as unknown as { bakoMonitor: typeof jamMonitor }).bakoMonitor = jamMonitor;

  // Add helper commands
  console.log(
    '%c[BakoSafe Monitor] Available debug commands:',
    'color: #4CAF50; font-weight: bold;'
  );
  console.log('  window.bakoMonitor.getDuplicateStats() - Show duplicate API/query calls');
  console.log('  window.bakoMonitor.getEventBuffer() - Show recent events');
  console.log('  window.bakoMonitor.clearDuplicateTrackers() - Reset duplicate tracking');
  console.log('  window.bakoMonitor.setDuplicateThreshold(ms) - Change duplicate detection window');
}
