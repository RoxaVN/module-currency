import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Currency } from './currency.entity.js';
import { AccountTransaction } from './account.transaction.entity.js';

@Entity()
@Index(['userId', 'currencyId', 'type'], { unique: true })
export class CurrencyAccount {
  static TYPE_DEFAULT = 'default';

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  userId: string;

  @Column('bigint')
  currencyId: string;

  @ManyToOne(() => Currency, (currency) => currency.accounts)
  currency: Relation<Currency>;

  @Column('varchar', { length: 64, default: CurrencyAccount.TYPE_DEFAULT })
  type: string;

  @Column({ type: 'decimal', precision: 78, scale: 0, default: 0 })
  balance: string;

  @Column({
    type: 'decimal',
    precision: 78,
    scale: 0,
    default: 0,
    nullable: true,
  })
  minBalance?: string;

  @Column({
    type: 'decimal',
    precision: 78,
    scale: 0,
    nullable: true,
  })
  maxBalance?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @OneToMany(
    () => AccountTransaction,
    (accountTransaction) => accountTransaction.account
  )
  accountTransactions: Relation<AccountTransaction>[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
