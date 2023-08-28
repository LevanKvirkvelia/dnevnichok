import React from 'react';
import { View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { useTheme } from '../features/theming/containers/ReduxTheme';

export function GiftIcon({ size = 30, fill = '' }) {
	const { colors } = useTheme();
	fill = fill || colors.questionsPrimary;

	return (
		<View style={{ width: size, height: size }}>
			<Svg width={size} height={size} fill={fill} viewBox="0 0 29 31">
				<Path d="M4.69118 5.30071C4.69118 2.37321 7.17336 0 10.2353 0C11.9501 0 13.483 0.744329 14.5 1.9135C15.517 0.744329 17.0499 0 18.7647 0C21.8266 0 24.3088 2.37321 24.3088 5.30071C24.3088 6.5309 23.8705 7.66322 23.135 8.56268H24.7353C27.0906 8.56268 29 10.3882 29 12.6401V14.6789C29 15.3545 28.4272 15.9021 27.7206 15.9021H16.2912C16.0085 15.9021 15.7794 15.6831 15.7794 15.4128V9.76813C15.2967 9.47267 14.8651 9.10767 14.5 8.68791C14.1349 9.10767 13.7033 9.47267 13.2206 9.76813V15.4128C13.2206 15.6831 12.9915 15.9021 12.7088 15.9021H1.27941C0.572812 15.9021 0 15.3545 0 14.6789V12.6401C0 10.3882 1.90937 8.56268 4.26471 8.56268H5.86496C5.12949 7.66322 4.69118 6.5309 4.69118 5.30071ZM13.2206 5.30071C13.2206 3.72436 11.884 2.44648 10.2353 2.44648C8.58656 2.44648 7.25 3.72436 7.25 5.30071C7.25 6.87705 8.58656 8.15493 10.2353 8.15493C11.884 8.15493 13.2206 6.87705 13.2206 5.30071ZM15.7794 5.30071C15.7794 6.87705 17.116 8.15493 18.7647 8.15493C20.4134 8.15493 21.75 6.87705 21.75 5.30071C21.75 3.72436 20.4134 2.44648 18.7647 2.44648C17.116 2.44648 15.7794 3.72436 15.7794 5.30071Z" />
				<Path d="M13.2206 18.5933C13.2206 18.323 12.9915 18.104 12.7088 18.104H3.66596C2.97397 18.104 2.38265 18.5807 2.26577 19.2328C1.88698 21.3462 1.88698 23.5059 2.26577 25.6194L2.64842 27.7544C2.90607 29.1919 4.12722 30.2932 5.64327 30.4552L7.46024 30.6493C9.20179 30.8354 10.9494 30.9522 12.6985 30.9998C12.9851 31.0076 13.2206 30.7868 13.2206 30.5127L13.2206 18.5933Z" />
				<Path d="M16.3015 30.9998C16.0149 31.0076 15.7794 30.7868 15.7794 30.5127L15.7794 18.5933C15.7794 18.323 16.0085 18.104 16.2912 18.104H25.334C26.026 18.104 26.6173 18.5807 26.7342 19.2328C27.113 21.3462 27.113 23.5059 26.7342 25.6194L26.3516 27.7544C26.0939 29.1919 24.8728 30.2932 23.3567 30.4552L21.5398 30.6493C19.7982 30.8354 18.0506 30.9522 16.3015 30.9998Z" />
			</Svg>
		</View>
	);
}
