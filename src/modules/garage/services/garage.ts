import {
  Asset,
  GaragePaginatedResponse,
  GaragePaginatedResponseUserOrders,
  Order,
  OrderWithMedatada,
} from '../types';
import { constructUrl } from '../utils/construct-url';
import { Networks, resolveNetwork } from '../utils/resolver-network';

const BASE_API_URL = import.meta.env.VITE_BAKO_ID_API_URL;

// const BASE_GARAGE_URL = import.meta.env.VITE_GARAGE_API_URL;
const BASE_GARAGE_URL = 'https://garage-api.bako.global';

export enum ORDER_EVENTS {
  OrderCreatedEvent = 'OrderCreatedEvent',
  OrderExecutedEvent = 'OrderExecutedEvent',
  OrderCancelledEvent = 'OrderCancelledEvent',
  OrderEditedEvent = 'OrderEditedEvent',
}

export class GarageService {
  static async getAssets({
    chainId = Networks.MAINNET,
  }: {
    chainId?: number;
  }): Promise<Asset[]> {
    const network = resolveNetwork(chainId);
    const response = await fetch(
      `${BASE_API_URL}/${network}/marketplace/assets`,
    );

    const data = await response.json();

    return data;
  }

  static async getOrder({
    orderId,
    chainId = Networks.MAINNET,
  }: {
    orderId: string;
    chainId?: number;
  }): Promise<{ data: OrderWithMedatada }> {
    const network = resolveNetwork(chainId);

    const url = constructUrl(
      `${BASE_GARAGE_URL}/${network}/orders/${orderId}`,
      {},
    );

    const response = await fetch(url);

    const data = await response.json();

    return data;
  }

  static async getCollectionOrders({
    collectionId,
    page,
    limit,
    search,
    chainId = Networks.MAINNET,
    sortValue,
    sortDirection,
  }: {
    collectionId: string;
    page: number | string;
    limit: number;
    search?: string;
    chainId?: number;
    sortValue: string;
    sortDirection: 'asc' | 'desc';
  }): Promise<GaragePaginatedResponse<Order>> {
    const network = resolveNetwork(chainId);

    const url = constructUrl(
      `${BASE_GARAGE_URL}/${network}/collections/${collectionId}/orders`,
      {
        page,
        limit,
        assetId: search,
        orderBy: sortValue,
        orderDirection: sortDirection,
      },
    );

    const response = await fetch(url);

    const data = await response.json();

    return data;
  }

  static async listUserOrders({
    page,
    chainId = Networks.MAINNET,
    sellerAddress,
    limit,
  }: {
    page: number | string;
    chainId: number;
    limit?: number;
    sellerAddress: string;
  }): Promise<GaragePaginatedResponseUserOrders<Order>> {
    const network = resolveNetwork(chainId);

    const url = constructUrl(
      `${BASE_GARAGE_URL}/${network}/user/orders/${sellerAddress}`,
      {
        page,
        limit: limit ?? 10,
        orderBy: 'createdAt',
        orderDirection: 'desc',
        sellerAddress,
      },
    );

    const response = await fetch(url);

    const data = await response.json();

    return data;
  }

  static async saveReceipt(data: { txId: string; chainId: number }) {
    const { txId, chainId } = data;
    const network = resolveNetwork(chainId);

    try {
      const url = constructUrl(
        `${BASE_GARAGE_URL}/${network}/receipts/tx/${txId}`,
        {},
      );

      const response = await fetch(url, {
        method: 'POST',
      });

      return response.json();
    } catch {
      return null;
    }
  }

  static async getReceiptStatus(data: {
    txId: string;
    chainId: number;
  }): Promise<{
    success: boolean;
    data: {
      isProcessed: boolean;
      event: keyof typeof ORDER_EVENTS;
    };
  } | null> {
    const { txId, chainId } = data;
    const network = resolveNetwork(chainId);

    try {
      const url = constructUrl(
        `${BASE_GARAGE_URL}/${network}/receipts/tx/${txId}`,
        {},
      );

      const response = await fetch(url);

      return response.json();
    } catch {
      return null;
    }
  }
}
