import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Transaction } from '../entities/Transaction';
import { IListTransactions, ITransaction } from '@/modules/core/hooks/bakosafe/utils/types';
import { DATE_FILTER_ERRORS } from '@/modules/core/constants/errorMessages';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async list(request: IListTransactions): Promise<ITransaction[]> {
    const queryBuilder = this.transactionRepository.createQueryBuilder('transaction');

    if (request.predicateAddress) {
      queryBuilder.andWhere('transaction.predicateAddress = :predicateAddress', {
        predicateAddress: request.predicateAddress.toString(),
      });
    }

    if (request.to) {
      queryBuilder.andWhere('transaction.to = :to', {
        to: request.to.toString(),
      });
    }

    if (request.status) {
      queryBuilder.andWhere('transaction.status = :status', {
        status: request.status,
      });
    }

    // Date filtering logic
    if (request.dateStart && request.dateEnd) {
      // Validate date range on backend
      const startDate = new Date(request.dateStart);
      const endDate = new Date(request.dateEnd);
      
      if (endDate <= startDate) {
        throw new Error(DATE_FILTER_ERRORS.END_DATE_BEFORE_START);
      }
      
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 365) {
        throw new Error(DATE_FILTER_ERRORS.MAX_RANGE_EXCEEDED);
      }
      
      queryBuilder.andWhere('transaction.createdAt BETWEEN :dateStart AND :dateEnd', {
        dateStart: request.dateStart,
        dateEnd: request.dateEnd,
      });
    } else if (request.dateStart) {
      // Only start date provided - filter from start date onwards
      queryBuilder.andWhere('transaction.createdAt >= :dateStart', {
        dateStart: request.dateStart,
      });
    } else if (request.dateEnd) {
      // Only end date provided - filter up to end date
      queryBuilder.andWhere('transaction.createdAt <= :dateEnd', {
        dateEnd: request.dateEnd,
      });
    }

    queryBuilder.orderBy('transaction.createdAt', 'DESC');

    const transactions = await queryBuilder.getMany();
    return transactions;
  }

  async findByHash(hash: string): Promise<ITransaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { hash },
    });
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    
    return transaction;
  }

  async create(transaction: Omit<ITransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<ITransaction> {
    const newTransaction = this.transactionRepository.create(transaction);
    return await this.transactionRepository.save(newTransaction);
  }

  async update(id: string, transaction: Partial<ITransaction>): Promise<ITransaction> {
    await this.transactionRepository.update(id, transaction);
    const updatedTransaction = await this.transactionRepository.findOne({
      where: { id },
    });
    
    if (!updatedTransaction) {
      throw new Error('Transaction not found');
    }
    
    return updatedTransaction;
  }

  async delete(id: string): Promise<void> {
    const result = await this.transactionRepository.delete(id);
    
    if (result.affected === 0) {
      throw new Error('Transaction not found');
    }
  }
}