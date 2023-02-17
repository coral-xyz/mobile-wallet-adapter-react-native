# mobile wallet adapter for expo

## Getting Started

- npm install (npm in this one, noted by package-lock.json)
- npm run start android (android only)

## Missing parts

- The Android SplashScreen activity (or something else) is preventing this experience from correctly showing up from the bottom. Not sure what exactly is going on.
- The bridge itself is working correctly. This app doesn't have any real wallets connected to it, but it will "authorize" a transaction and take you to your dapp seamlessly

## Important Files

- App.js is the entry point for a react native / expo app. Most of the code is bundled in here.
- android/app/src/main/java/com/backpackmwa/MainActivity.java
  - if you're familiar with Android dev, this is your MainActivity
  - most of this is boilerplate except for the `onCreate` method we override to show the correct modal bottom sheet experience
- android/app/src/main/java/com/backpackmwa/MainApplication.java
  - when creating your own modules, you would add them to the `getPackages` method.
  - there's not much you need to worry about here unless you want to add a different package
- android/app/src/main/java/com/backpackmwa/MwaWalletLibModule.kt
  - the bulk of the bridge implementation
- android/app/src/main/java/com/backpackmwa/MwaWalletLibPackage.kt
  - mostly boilerplate. Just registers the module
