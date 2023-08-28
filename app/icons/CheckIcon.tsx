import React from 'react';
import { View } from 'react-native';
import { Path, Svg } from 'react-native-svg';

export function CheckIcon({ size = 16, fill = 'black' }) {
	return (
		<View style={{ width: size, height: size }}>
			<Svg width={size} height={size} fill={fill} viewBox="0 0 16 12">
				<Path
					d="M14.7803 0.96967C15.0732 1.26256 15.0732 1.73744 14.7803 2.03033L5.78033 11.0303C5.48744 11.3232 5.01256 11.3232 4.71967 11.0303L0.71967 7.03033C0.426777 6.73744 0.426777 6.26256 0.71967 5.96967C1.01256 5.67678 1.48744 5.67678 1.78033 5.96967L5.25 9.43934L13.7197 0.96967C14.0126 0.676777 14.4874 0.676777 14.7803 0.96967Z"
					stroke={fill}
					strokeWidth="0.6"
				/>
			</Svg>
		</View>
	);
}
