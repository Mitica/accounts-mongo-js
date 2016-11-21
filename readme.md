# mongo-accounts

A MongoDB storage implementation for [accounts](https://github.com/Mitica/node-accounts).

## Usage

```
var storage = require('mongo-accounts').storage();

var accounts = require('accounts')(storage);

```

Supported envs:

  - ACCOUNTS_CONNECTION_STRING
  - ACCOUNTS_COLLECTION_PREFIX
