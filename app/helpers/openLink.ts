import {Linking} from 'react-native';

export function openLink(url: string) {
  Linking.openURL(url).catch(error => console.log({error}));
}
