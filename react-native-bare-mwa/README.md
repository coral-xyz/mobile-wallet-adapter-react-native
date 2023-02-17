# mobile wallet adapter

Bare react native, aka a plain react native installation. We needed to use Hermes and the latest version of React Native which isn't supported yet (2/10/23). Expo SDK48 will support it and its only a couple days away.

This implementation has the full wallet experience set up including `@solana/web3.js` and a fake wallet. It will request an airdrop and send two different accounts money.


The implementation is copied over from the expo folder. The only reason this one exists is bc of the Hermes runtime engine.

aka, this will go away soon
