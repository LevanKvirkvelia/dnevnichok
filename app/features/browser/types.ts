import {RefObject} from 'react';
import WebView from 'react-native-webview';
import {Account} from '../auth/state/useUsersStore';

export interface WebFunctionsParams {
  event: {url: string};
  account: Account;
  webview: RefObject<WebView>;
  startUrl?: string;
  nextUrl?: string;
  setVisible(visible: boolean): void;
  setUri(uri: string): void;
}
