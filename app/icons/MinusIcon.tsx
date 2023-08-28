import React from 'react';
import { View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { useTheme } from '../features/theming/containers/ReduxTheme';

export function MinusIcon({ size = 26, fill = '' }) {
	const { colors } = useTheme();
	fill = fill || colors.questionsPrimary;

	return (
		<View style={{ width: size, height: size }}>
			<Svg width={size} height={size} fill={fill} viewBox="0 0 26 6">
				<Path d="M16.5652 1.43481H2.56522C1.70077 1.43481 1 2.13559 1 3.00003C1 3.86448 1.70077 4.56525 2.56522 4.56525H13.4348L27.4348 4.56525C28.2992 4.56525 29 3.86448 29 3.00003C29 2.13559 28.2992 1.43481 27.4348 1.43481H16.5652Z" />
			</Svg>
		</View>
	);
}
