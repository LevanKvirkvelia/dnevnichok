import React from 'react';
import { View } from 'react-native';
import { Path, Svg } from 'react-native-svg';

export function TimeLockIcon({ size = 28, fill = '#FB5050' }) {
	return (
		<View style={{ width: size, height: size }}>
			<Svg width={size} height={size} fill={fill} viewBox="0 0 28 32">
				<Path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M3.89721 8.38958L4.42812 13.1678L3.69936 13.2318C2.01471 13.3797 0.651247 14.6635 0.402253 16.3362C-0.134084 19.9393 -0.134084 23.6018 0.402253 27.2049C0.651247 28.8776 2.01471 30.1614 3.69936 30.3093L5.43585 30.4618C7.30358 30.6258 9.17667 30.7083 11.0498 30.7092C11.3177 30.7093 11.457 30.3851 11.2849 30.1798C9.72505 28.3186 8.78586 25.9196 8.78586 23.3012C8.78586 18.1284 12.4515 13.8117 17.3269 12.8071C17.5965 12.7515 17.8061 12.5337 17.8365 12.2602L18.2666 8.38958C18.3285 7.83244 18.3285 7.27016 18.2666 6.71303L18.2317 6.3994C17.8621 3.07262 15.2467 0.44037 11.9224 0.0492734C11.364 -0.0164245 10.7998 -0.0164245 10.2413 0.0492733C6.91703 0.44037 4.3017 3.07262 3.93206 6.3994L3.89721 6.71303C3.8353 7.27016 3.8353 7.83244 3.89721 8.38958ZM11.6542 2.32957C11.274 2.28484 10.8898 2.28484 10.5096 2.32957C8.24631 2.59584 6.46571 4.38797 6.21404 6.65295L6.17919 6.96658C6.13601 7.3552 6.13601 7.74741 6.17919 8.13602L6.71737 12.9796C9.62371 12.7826 12.5401 12.7826 15.4464 12.9796L15.9846 8.13602C16.0278 7.74741 16.0278 7.3552 15.9846 6.96658L15.9497 6.65295C15.6981 4.38797 13.9175 2.59584 11.6542 2.32957Z"
				/>
				<Path d="M20.6487 21.0052C20.6487 20.3712 20.1347 19.8572 19.5007 19.8572C18.8666 19.8572 18.3526 20.3712 18.3526 21.0052V23.7187C18.3526 24.086 18.5284 24.4311 18.8254 24.6471L20.3561 25.7604C20.8689 26.1333 21.5869 26.0199 21.9598 25.5071C22.3327 24.9944 22.2193 24.2764 21.7066 23.9035L20.6487 23.1341V21.0052Z" />
				<Path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M19.5007 31.72C24.1502 31.72 27.9194 27.9508 27.9194 23.3012C27.9194 18.6517 24.1502 14.8825 19.5007 14.8825C14.8511 14.8825 11.0819 18.6517 11.0819 23.3012C11.0819 27.9508 14.8511 31.72 19.5007 31.72ZM19.5007 29.424C22.8821 29.424 25.6234 26.6827 25.6234 23.3012C25.6234 19.9197 22.8821 17.1785 19.5007 17.1785C16.1192 17.1785 13.3779 19.9197 13.3779 23.3012C13.3779 26.6827 16.1192 29.424 19.5007 29.424Z"
				/>
			</Svg>
		</View>
	);
}
