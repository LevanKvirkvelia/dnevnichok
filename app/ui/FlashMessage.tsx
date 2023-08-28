import React, {MutableRefObject, useEffect, useRef} from 'react';
import RNFlashMessage, {
  showMessage as showFlashMessage,
  MessageOptions,
} from 'react-native-flash-message';
import {useKeyboardHeight} from '../helpers/useKeyboardHeight';

const flashMessageRef = React.createRef<
  null | any
>() as MutableRefObject<RNFlashMessage | null>;

export function showMessage(options: MessageOptions) {
  if (flashMessageRef.current) {
    return flashMessageRef.current.showMessage(options);
  }

  return showFlashMessage(options);
}

export function FlashMessage() {
  const ref = useRef<null | RNFlashMessage>(null);

  const keyboardHeight = useKeyboardHeight();

  useEffect(() => {
    flashMessageRef.current = ref.current;

    return () => {
      flashMessageRef.current = null;
    };
  }, []);

  return (
    <RNFlashMessage
      ref={ref}
      position={keyboardHeight > 0 ? 'top' : 'bottom'}
      style={{zIndex: 9999999999}}
    />
  );
}
