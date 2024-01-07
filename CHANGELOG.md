# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.4](https://github.com/RoxaVN/roxavn/compare/v0.1.3...v0.1.4) (2024-01-07)

### Features

- add CreateTransaction permission ([186627b](https://github.com/RoxaVN/roxavn/commit/186627b75f824010bb1ae52c9fe860b6185449f6))
- export AccountTransactionResponse ([b9b0a6a](https://github.com/RoxaVN/roxavn/commit/b9b0a6a3355708fe799659bda32c251f6d13e4ac))

### [0.1.3](https://github.com/RoxaVN/roxavn/compare/v0.1.2...v0.1.3) (2024-01-03)

### Features

- add CreateBankerTransactionService ([a43533d](https://github.com/RoxaVN/roxavn/commit/a43533d52755efa6674875622148b039537e9b3b))
- add userIds, currencyIds to GetCurrencyAccountsRequest ([294a9c6](https://github.com/RoxaVN/roxavn/commit/294a9c64070088909343deaf74b8ec303387d1da))

### Bug Fixes

- can't create currency accounts after create user ([ad8973a](https://github.com/RoxaVN/roxavn/commit/ad8973ac701b0a10ccb5ee56f5811a45b7b4b62e))

### [0.1.2](https://github.com/RoxaVN/roxavn/compare/v0.1.1...v0.1.2) (2023-11-21)

### Features

- add AccountTransactions ([607d1f2](https://github.com/RoxaVN/roxavn/commit/607d1f2d42f4b97254d546446c9f8d34e1bc0295))
- add admin page ([dd8ff23](https://github.com/RoxaVN/roxavn/commit/dd8ff237a71f2bf19e7e347b4b4cb3b4c923d0dd))
- add CreateUserAndCurrencyAccountsService ([d36407e](https://github.com/RoxaVN/roxavn/commit/d36407ecc5d8ba76a854258a0fea2f7fcbcc88db))
- add currencyId translation ([35190db](https://github.com/RoxaVN/roxavn/commit/35190db46b6c8557bfad09fd4460b1a71db509c0))
- add GetUserCurrencyAccountsService ([6075536](https://github.com/RoxaVN/roxavn/commit/607553610169a79730ff4d7c51a9d79319dbe5bf))
- add hook ([2393261](https://github.com/RoxaVN/roxavn/commit/239326192d87c812242ef1c20833fb2a8ceb2c40))
- add oldBalance/ newBalance to account_transaction ([0e20739](https://github.com/RoxaVN/roxavn/commit/0e20739b25668fc5f4f73baf4eec0caf952cfac5))
- convert transactionId from uuid to bigint ([f880f41](https://github.com/RoxaVN/roxavn/commit/f880f41994e1c46744adf727c627709399d7bcdb))
- pass accountId instead of userId in request of CreateTransactionService ([b983d5a](https://github.com/RoxaVN/roxavn/commit/b983d5acf5ef7fdee045478403f0f40b00691104))

### [0.1.1](https://github.com/RoxaVN/roxavn/compare/v0.1.0...v0.1.1) (2023-11-11)

### Features

- add currencyAccountApi.getMany ([5094958](https://github.com/RoxaVN/roxavn/commit/5094958f2a2688ac7d4c0f56f04ce3a708dcffc5))
- add ExceedBalanceException ([4c14c30](https://github.com/RoxaVN/roxavn/commit/4c14c30fbf03bfefeb20eef2814b8364c7c586a7))
- add id param to CreateCurrencyService ([e025084](https://github.com/RoxaVN/roxavn/commit/e025084329771f1cc8aa6527e392a456e133b577))
- add userCurrencyAccountApi ([3a431a1](https://github.com/RoxaVN/roxavn/commit/3a431a1b79571536b29290d13964842ac616bfd7))
- add userId/ currencyId params to GetCurrencyAccountsRequest ([a3a769a](https://github.com/RoxaVN/roxavn/commit/a3a769a822209b0b7b67abd0719493cdf8936599))
- add userIds to GetCurrencyAccountsRequest ([9de3f4b](https://github.com/RoxaVN/roxavn/commit/9de3f4b2ec9733a711926cc766ddd30022aa61c9))
- make columns fullName, unitLabel, subunitLabel nullable ([06dfda4](https://github.com/RoxaVN/roxavn/commit/06dfda423bd39531e8685db6cd01a14357ab65eb))

### Bug Fixes

- create currency account with null minBalance ([6a5b7e3](https://github.com/RoxaVN/roxavn/commit/6a5b7e31754551803593b12c460bfd91ac45fef9))
- not export transaction ([7e948b0](https://github.com/RoxaVN/roxavn/commit/7e948b0d00099baa6d6f5c6eef60bc59b0eb0298))
- work with typeorm-transactional ([4a56c53](https://github.com/RoxaVN/roxavn/commit/4a56c53cbb3dafdb59c07cfe4dc03f0bb3e1c8fc))
- wrong balance type (string for bigint) ([b89da7a](https://github.com/RoxaVN/roxavn/commit/b89da7aaa0560944d7cdaf0fa47e4b8c08eee3d9))

## 0.1.0 (2023-08-30)

### Features

- init module ([f368acd](https://github.com/RoxaVN/roxavn/commit/f368acdffaa9be6c6bc5bbb672fb08bed0a4641d))

### Bug Fixes

- cannot read file tsconfig.json ([2cdae1e](https://github.com/RoxaVN/roxavn/commit/2cdae1eeb720b7e93a7ece2f69b027788ac82436))
