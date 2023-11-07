import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitModuleCurrency1690267633589 implements MigrationInterface {
  name = 'InitModuleCurrency1690267633589';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "transaction" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "originalTransactionId" character varying(1024),
        "type" character varying(64) NOT NULL DEFAULT 'default',
        "currencyId" bigint NOT NULL,
        "metadata" jsonb,
        "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_f862b8fefd080746987559e573" ON "transaction" ("originalTransactionId")
      `);
    await queryRunner.query(`
      CREATE TABLE "account_transaction" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "accountId" uuid NOT NULL,
        "transactionId" uuid NOT NULL,
        "amount" numeric(78, 0) NOT NULL DEFAULT '0',
        "currencyId" bigint NOT NULL,
        "metadata" jsonb,
        "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_eba337658ffe8785716a99dcb92" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE TABLE "currency_account" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "currencyId" bigint NOT NULL,
        "type" character varying(64) NOT NULL DEFAULT 'default',
        "balance" numeric(78, 0) NOT NULL DEFAULT '0',
        "minBalance" numeric(78, 0) DEFAULT '0',
        "maxBalance" numeric(78, 0),
        "metadata" jsonb,
        "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_44d8cedfcbbf5439ee46da6f33f" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE INDEX "IDX_24000a0a2d98059147329187c7" ON "currency_account" ("userId")
      `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_4ee216cc38994cd5f5c74e359a" ON "currency_account" ("userId", "currencyId", "type")
      `);
    await queryRunner.query(`
      CREATE TABLE "currency" (
        "id" BIGSERIAL NOT NULL,
        "symbol" character varying(64) NOT NULL,
        "name" character varying(64) NOT NULL,
        "fullName" text,
        "unitLabel" character varying(64),
        "subunitLabel" character varying(64),
        "decimalPlaces" integer NOT NULL DEFAULT 0,
        "metadata" jsonb,
        CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE TABLE "currency_rate" (
        "id" BIGSERIAL NOT NULL,
        "currency1" bigint NOT NULL,
        "currency2" bigint NOT NULL,
        "rate" numeric NOT NULL,
        "type" character varying(64) NOT NULL DEFAULT 'default',
        "metadata" jsonb,
        "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_a92517ae58f0f116bc0f792f878" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE INDEX "IDX_8aaf81acd0b17b9d0f60feaaee" ON "currency_rate" ("currency1")
      `);
    await queryRunner.query(`
      CREATE INDEX "IDX_998de2db8723230cfa9149230c" ON "currency_rate" ("currency2")
      `);
    await queryRunner.query(`
      ALTER TABLE "transaction"
      ADD CONSTRAINT "FK_a6eb26abbedbeaeb81ff45c5490" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
    await queryRunner.query(`
      ALTER TABLE "account_transaction"
      ADD CONSTRAINT "FK_03114b894370038c6294a8a74b9" FOREIGN KEY ("accountId") REFERENCES "currency_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
    await queryRunner.query(`
      ALTER TABLE "account_transaction"
      ADD CONSTRAINT "FK_578c7a3c2e16b7b20c9418c15ce" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
    await queryRunner.query(`
      ALTER TABLE "account_transaction"
      ADD CONSTRAINT "FK_0bb351263472642001a9c298958" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
    await queryRunner.query(`
      ALTER TABLE "currency_account"
      ADD CONSTRAINT "FK_af8be9f31a564714a95d9ca94cc" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "currency_account" DROP CONSTRAINT "FK_af8be9f31a564714a95d9ca94cc"
      `);
    await queryRunner.query(`
      ALTER TABLE "account_transaction" DROP CONSTRAINT "FK_0bb351263472642001a9c298958"
      `);
    await queryRunner.query(`
      ALTER TABLE "account_transaction" DROP CONSTRAINT "FK_578c7a3c2e16b7b20c9418c15ce"
      `);
    await queryRunner.query(`
      ALTER TABLE "account_transaction" DROP CONSTRAINT "FK_03114b894370038c6294a8a74b9"
      `);
    await queryRunner.query(`
      ALTER TABLE "transaction" DROP CONSTRAINT "FK_a6eb26abbedbeaeb81ff45c5490"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_998de2db8723230cfa9149230c"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_8aaf81acd0b17b9d0f60feaaee"
      `);
    await queryRunner.query(`
      DROP TABLE "currency_rate"
      `);
    await queryRunner.query(`
      DROP TABLE "currency"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_4ee216cc38994cd5f5c74e359a"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_24000a0a2d98059147329187c7"
      `);
    await queryRunner.query(`
      DROP TABLE "currency_account"
      `);
    await queryRunner.query(`
      DROP TABLE "account_transaction"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_f862b8fefd080746987559e573"
      `);
    await queryRunner.query(`
      DROP TABLE "transaction"
      `);
  }
}
