import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Currency } from './currency.entity.js';
import { AccountTransaction } from './account.transaction.entity.js';

@Entity()
export class Transaction {
  static TYPE_DEFAULT = 'default';

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column('varchar', { length: 1024, nullable: true })
  originalTransactionId?: string;

  @Column('varchar', { length: 64, default: Transaction.TYPE_DEFAULT })
  type: string;

  @Column('bigint')
  currencyId: string;

  @ManyToOne(() => Currency, (currency) => currency.transactions)
  currency: Relation<Currency>;

  @OneToMany(
    () => AccountTransaction,
    (accountTransaction) => accountTransaction.transaction
  )
  accountTransactions: Relation<AccountTransaction>[];

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;
}
