// @ts-nocheck
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  NativeModules,
  Button,
  Platform,
  BackHandler,
} from 'react-native';

function ReAuthorizeView() {
  // Shouldn't need to show any buttons here or anything, but doing it for the sake of visually confirming differences
  try {
    NativeModules.MwaWalletLibModule.reauthorizeDapp();
  } catch (err) {
    console.error('authorized:err', err);
  }

  return (
    <View style={styles.modal}>
      <Button title="Re-Authorize" onPress={() => handlePress(true)} />
    </View>
  );
}

function AuthorizeView({publicKey}) {
  console.log('AuthorizeView:publicKey', publicKey.toString());
  function handlePress(authorized) {
    try {
      NativeModules.MwaWalletLibModule.authorizeDapp(
        publicKey.toString(),
        authorized,
      );
    } catch (err) {
      console.error('authorized:err', err);
    }
  }

  return (
    <View style={styles.modal}>
      <Button
        title="Authorize"
        onPress={() => handlePress(true)}
        style={{marginRight: 12}}
      />
      <Button title="Decline" onPress={() => handlePress(false)} />
    </View>
  );
}

function CloseApp() {
  console.log('CloseApp:render');
  React.useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp(); // closes the view and returns to the app
    }
  }, []);
}

function SignTransactionView({publicKey}) {
  function handlePress(authorized) {
    try {
      NativeModules.MwaWalletLibModule.authorizeDapp(
        publicKey.toString(),
        authorized,
      );
    } catch (err) {
      console.error('authorized:err', err);
    }
  }

  return (
    <View style={styles.modal}>
      <Button title="Authorize" onPress={() => handlePress(true)} />
      <Button title="Deauthorize" onPress={() => handlePress(false)} />
    </View>
  );
}

function SignMessageView({publicKey}) {
  function handlePress(authorized) {
    try {
      NativeModules.MwaWalletLibModule.authorizeDapp(
        publicKey.toString(),
        authorized,
      );
    } catch (err) {
      console.error('authorized:err', err);
    }
  }

  return (
    <View style={styles.modal}>
      <Button title="Authorize" onPress={() => handlePress(true)} />
      <Button title="Deauthorize" onPress={() => handlePress(false)} />
    </View>
  );
}

export default function Watcher({wallet, event}) {
  const {publicKey} = wallet;
  function renderViewForEvent(evt) {
    switch (evt) {
      case 'AUTHORIZE_REQUEST':
        return <AuthorizeView publicKey={publicKey} />;
      case 'RE_AUTHORIZE_REQUEST':
        return <ReAuthorizeView publicKey={publicKey} />;
      case 'SIGN_TRANSACTION_REQUEST':
        return <SignTransactionView publicKey={publicKey} />;
      case 'SIGN_MESSAGE_REQUEST':
        return <SignMessageView publicKey={publicKey} />;
      case 'SCENARIO_TEARDOWN_COMPLETE':
        return <CloseApp />;
      default:
        return null;
    }
  }

  return renderViewForEvent(event);
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'orange',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
