import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Currency } from './currency.entity.js';
import { Transaction } from './transaction.entity.js';
import { CurrencyAccount } from './currency.account.entity.js';

@Entity()
export class AccountTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  accountId: string;

  @ManyToOne(() => CurrencyAccount, (account) => account.accountTransactions)
  account: Relation<CurrencyAccount>;

  @Column('bigint')
  transactionId: string;

  @ManyToOne(
    () => Transaction,
    (transaction) => transaction.accountTransactions
  )
  transaction: Relation<Transaction>;

  @Column({ type: 'decimal', precision: 78, scale: 0, default: 0 })
  amount: string;

  @Column({ type: 'decimal', precision: 78, scale: 0 })
  oldBalance: string;

  @Column({ type: 'decimal', precision: 78, scale: 0 })
  newBalance: string;

  @Column('bigint')
  currencyId: string;

  @ManyToOne(() => Currency, (currency) => currency.accountTransactions)
  currency: Relation<Currency>;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;
}
