import { Keyboard, KeyboardEventListener } from 'react-native';
import { useState, useEffect } from 'react';

export function useKeyboardHeight() {
	const [keyboardHeight, setKeyboardHeight] = useState(0);

	useEffect(() => {
		const onShow: KeyboardEventListener = e => {
			setKeyboardHeight(e.endCoordinates.height);
		};
		const onHide: KeyboardEventListener = () => {
			setKeyboardHeight(0);
		};

		const didHideRemove = Keyboard.addListener('keyboardDidHide', onHide);
		const didShowRemove = Keyboard.addListener('keyboardDidShow', onShow);

		return () => {
			didShowRemove.remove();
			didHideRemove.remove();
		};
	}, []);

	return keyboardHeight;
}
