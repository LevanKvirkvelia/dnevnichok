import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IconProps } from 'react-native-vector-icons/Icon';

export const IonIcon: React.FC<IconProps> = ({ style, color, size = 18, name, ...rest }) => {
	return (
		<Ionicons
			style={[{ textAlign: 'center', lineHeight: size, width: size, height: size }, style]}
			color={color}
			size={size}
			name={name}
			{...rest}
		/>
	);
};
