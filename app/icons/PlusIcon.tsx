import React from 'react';
import { View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { useTheme } from '../features/theming/containers/ReduxTheme';

export function PlusIcon({ size = 26, fill = '' }) {
	const { colors } = useTheme();
	fill = fill || colors.questionsPrimary;
	return (
		<View style={{ width: size, height: size }}>
			<Svg width={size} height={size} fill={fill} viewBox="0 0 26 26">
				<Path d="M14.5652 2.56522C14.5652 1.70077 13.8644 1 13 1C12.1356 1 11.4348 1.70077 11.4348 2.56522V11.4348H2.56522C1.70077 11.4348 1 12.1356 1 13C1 13.8644 1.70077 14.5652 2.56522 14.5652H11.4348V23.4348C11.4348 24.2992 12.1356 25 13 25C13.8644 25 14.5652 24.2992 14.5652 23.4348V14.5652H23.4348C24.2992 14.5652 25 13.8644 25 13C25 12.1356 24.2992 11.4348 23.4348 11.4348H14.5652V2.56522Z" />
			</Svg>
		</View>
	);
}
