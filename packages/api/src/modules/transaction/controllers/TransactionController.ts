import { Controller, Get, Query } from '@nestjs/common';
import { TransactionService } from '../services/TransactionService';
import { IListTransactions } from '@/modules/core/hooks/bakosafe/utils/types';
import { Address } from 'fuels';
import { TransactionStatus } from '@/modules/core/models';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async list(
    @Query('predicateAddress') predicateAddress?: string,
    @Query('to') to?: string,
    @Query('status') status?: TransactionStatus,
    @Query('dateStart') dateStart?: string,
    @Query('dateEnd') dateEnd?: string,
  ) {
    const filters: IListTransactions = {
      predicateAddress: predicateAddress ? Address.fromString(predicateAddress) : undefined,
      to: to ? Address.fromString(to) : undefined,
      status,
      dateStart,
      dateEnd,
    };

    try {
      const transactions = await this.transactionService.list(filters);
      
      return {
        transactions,
        totalCount: transactions.length,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    } catch (error) {
      throw error;
    }
  }
}