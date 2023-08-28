import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export function LoadingSplash() {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			<ActivityIndicator style={{ width: 30 }} />
		</View>
	);
}
