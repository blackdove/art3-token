# ART3 Token

## Development

* Copy [.env.example](.env.example) to `.env` and fill in the values then `source .env`
* `yarn install` to get started then `yarn build` to compile contracts
* `yarn build` to build resources
* `yarn deploy` or `yarn deploy --network rinkeby` to deploy

```sh
### Verify
DEPLOYED_TOKEN_ADDRESS=<address> && yarn hardhat verify "$DEPLOYED_TOKEN_ADDRESS" --network rinkeby
```

