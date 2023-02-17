# mobile-wallet-adapter for React Native (wip)

An implementation of [mobile-wallet-adapter](https://github.com/solana-mobile/mobile-wallet-adapter) for React Native for Android. This is very much in progress. I switch between working on releasing our internal mobile app and this.

- mobile-wallet-adapter will work on any Android phone.
- seed-vault will only work on the Solana saga. The reason is because of the specific APIs required that talk to the hardware vault.

# Goals

The long-term goal of this is most importantly to get a working solution for React Native and Expo without ejecting. The [Backpack app](https://github.com/coral-xyz/backpack/tree/master/packages/app-mobile) is a managed Expo app which comes with many advantages that outweigh any desire to eject into a traditional React Native experience.

The short-term goal is to get this working in an regular "bare" React Natiev app and figure out the rest later. This is mostly working, but requires a lot of tweaking on the design side.

# Challenges

- I'm not a great Kotlin, Java or Android person. A lot of this has been learning how those environments work and applying what I know about iOS to get there. I mostly have this working
- React Native's support for BigInt and crypto libraries is TBD. The latest version of React Native supports a new runtime engine called Hermes with BigInt support. Expo's SDK48 which will be live any day now supports Hermes.
