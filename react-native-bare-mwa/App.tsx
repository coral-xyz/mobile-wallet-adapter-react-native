/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
  clusterApiUrl,
  Connection,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js';
import {Buffer} from 'buffer';
import Watcher from './Watcher';

import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Button,
  NativeModules,
  Linking,
  NativeEventEmitter,
} from 'react-native';

const BK_DEV_SECRET = new Buffer([]); // should be ok just double check it

const WALLET = Keypair.fromSecretKey(BK_DEV_SECRET);
const RECEIVER = new PublicKey('EcxjN4mea6Ah9WSqZhLtSJJCZcxY73Vaz6UVHFZZ5Ttz');

const network = clusterApiUrl('mainnet-beta');
let connection = new Connection('https://swr.xnfts.dev/rpc-proxy/');

async function requestAirdrop(publicKey: PublicKey) {
  console.log('request airdrop: publicKey', publicKey);
  const [signature, {blockhash, lastValidBlockHeight}] = await Promise.all([
    connection.requestAirdrop(publicKey, 3000000000),
    connection.getLatestBlockhash(),
  ]);

  console.log('signature', signature);
  console.log('blockhash', blockhash);
  console.log('lastValidBlockHeight', lastValidBlockHeight);

  const accountInfo = await connection.getAccountInfo(publicKey);
  console.log('accountInfo', accountInfo);

  try {
    const res = await connection.confirmTransaction(
      {
        signature,
        blockhash,
        lastValidBlockHeight,
      },
      'processed',
    );

    console.log('confirm transaction success', res);
  } catch (error) {
    console.error('confirm transaction success', error);
  }
}

async function getAccountInfo(payer) {
  const accountInfo = await connection.getAccountInfo(payer.publicKey);
  console.log('accountInfo', accountInfo);
  console.log('accountInfo:data', Buffer.from(accountInfo.data).toJSON());
  console.log('accountInfo:data', accountInfo.data.toJSON());
  console.log('accountInfo:owner', accountInfo.owner.toString());
}

async function makeTransaction(payer, receiver: PublicKey) {
  console.log('sending...');
  const blockhash = await connection.getLatestBlockhash();
  console.log('blockhash', blockhash);
  console.log('payer', payer);
  console.log('receiver', receiver);
  try {
    console.log('getting payer');
    const payerInfo = await connection.getAccountInfo(payer.publicKey);
    console.log('payerInfo', payerInfo);
  } catch (err) {
    console.log('payerinfo error', err);
  }

  try {
    console.log('getting receiver');
    const receiverInfo = await connection.getAccountInfo(receiver);
    console.log('receiverInfo', receiverInfo);
  } catch (err) {
    console.log('receiverinfo error', err);
  }

  // Airdrop SOL for paying transactions
  // try {
  //   console.log('request air drop ');
  //   // await requestAirdrop(payer.publicKey);
  //   console.log('airdrop success');
  // } catch (err) {
  //   console.error('airdrop error', err);
  // }

  const sp = new TransactionInstruction({
    keys: [
      {
        pubkey: payer.publicKey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: receiver,
        isSigner: false,
        isWritable: true,
      },
    ],
    programId: new PublicKey('11111111111111111111111111111111'),
    data: new Buffer([2, 0, 0, 0, 128, 150, 152, 0, 0, 0, 0, 0]),
  });

  const instruction = new TransactionInstruction(sp);

  let transaction = new Transaction();
  console.log('create instructions');
  transaction.add(instruction);

  try {
    console.log('send transaction');
    const res = await sendAndConfirmTransaction(connection, transaction, [
      payer,
    ]);
    console.log('transaction success', res);
  } catch (error) {
    console.error('sendAndConfirmTransaction error', error);
  }
}

function NormalAppExperience() {
  return (
    <SafeAreaView>
      <Button
        title="Send Money"
        onPress={() => {
          console.log('pressed');
          makeTransaction(WALLET, RECEIVER);
        }}
      />
      <Button
        title="Get Account Info"
        onPress={() => {
          getAccountInfo(WALLET);
        }}
      />
      <Button
        title="Try Test"
        onPress={() => {
          NativeModules.MwaWalletLibModule.tryTest('hello');
        }}
      />
    </SafeAreaView>
  );
}

function App(): JSX.Element {
  const [event, setEvent] = React.useState(null);

  function initiateWalletScenario(intent /* string */) {
    NativeModules.MwaWalletLibModule.createScenario(
      'Backpack', // wallet name
      intent,
      (event, errorMsg) => {
        switch (event) {
          case 'ERROR':
            console.error('ERROR', errorMsg);
            break;
          default:
            console.log('SUCCESS');
        }
      },
    );
  }

  function handleNativeEvent(event) {
    setEvent(event.type);
    switch (event.type) {
      case 'ON_SCENARIO_READY':
        console.log('SCENARIO_READY');
        break;
      case 'SCENARIO_COMPLETE':
        console.log('SCENARIO_COMPLETE');
        break;
      case 'SCENARIO_ERROR':
        console.log('SCENARIO_ERROR');
        break;
      case 'SCENARIO_TEARDOWN_COMPLETE':
        console.log('SCENARIO_TEARDOWN_COMPLETE');
        break;
      case 'AUTHORIZE_REQUEST':
        console.log('AUTHORIZE_REQUEST');
        break;
      case 'RE_AUTHORIZE_REQUEST':
        console.log('RE_AUTHORIZE_REQUEST');
        break;
      case 'SIGN_TRANSACTION_REQUEST':
        console.log('SIGN_TRANSACTION_REQUEST');
        break;
      case 'SIGN_MESSAGE_REQUEST':
        console.log('SIGN_MESSAGE_REQUEST');
        break;
      case 'SIGN_AND_SEND_TRANSACTION_REQUEST':
        console.log('SIGN_AND_SEND_TRANSACTION_REQUEST');
        break;
      case 'DE_AUTHORIZE_EVENT':
        console.log('DE_AUTHORIZE_EVENT');
        break;
      case 'SCENARIO_SERVING_CLIENTS':
        console.log('SCENARIO_SERVING_CLIENTS');
        break;
      default:
        console.log('UNKNOWN_EVENT', event);
    }
  }

  // fires if app is open
  // solana-wallet://1/associate/local
  React.useEffect(() => {
    Linking.addEventListener('url', evt => {
      const {url} = evt;
      if (url && url.startsWith('solana-wallet:/v1/associate/local')) {
        initiateWalletScenario(url);
      }
    });

    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  //
  // // fires if app is closed
  React.useEffect(() => {
    async function f() {
      const url = await Linking.getInitialURL();
      if (url && url.startsWith('solana-wallet:/v1/associate/local')) {
        initiateWalletScenario(url);
      }
    }

    f();
  }, []);

  React.useEffect(() => {
    const eventEmitter = new NativeEventEmitter(
      NativeModules.MwaWalletLibModule,
    );

    eventEmitter.addListener('MWA_EVENT', handleNativeEvent);

    return () => {
      // eventEmitter.removeListeners();
    };
  }, []);

  if (event == null) {
    return <NormalAppExperience />;
  }

  return <Watcher wallet={WALLET} event={event} />;
}

export default App;
