import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { EngineNames } from '@diaryapp/diaryparsers';
import { useTheme } from '../../theming/containers/ReduxTheme';
import { Workers } from '../../../provider/Workers';
import { selectEngine } from '../redux/duck';
import FastImage from '../../../components/FastImage';
import { IonIcon } from '../../../components/IonIcon';

export const EngineList: React.FC<{ onNavigate(engine: EngineNames): void }> = ({ onNavigate }) => {
	const { colors } = useTheme();
	const dispatch = useDispatch();
	const engines = Object.values(Workers).filter((w): w is NonNullable<typeof w> => !!w && w.canLogin !== false);

	return (
		<>
			{engines.map((engine, index) => {
				return (
					<TouchableOpacity
						key={engine.name}
						onPress={() => {
							dispatch(selectEngine(engine.name));
							if (onNavigate) onNavigate(engine.name);
						}}
						style={{
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							paddingVertical: 18,
							paddingHorizontal: 20,
							borderColor: colors.border,
							borderTopWidth: index ? 1 : 0,
						}}
					>
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<FastImage source={engine.logo!} style={{ width: 38, height: 38 }} resizeMode="contain" />
							<View style={{ marginLeft: 12 }}>
								<Text style={{ color: colors.textOnRow, fontSize: 16, lineHeight: 22 }}>
									{engine.title || engine.name}
								</Text>
								{engine.subTitle ? (
									<Text style={{ color: '#818388', fontSize: 12, lineHeight: 14 }}>{engine.subTitle}</Text>
								) : null}
							</View>
						</View>
						<IonIcon name="chevron-forward" style={{ marginLeft: 10 }} size={25} color="#BCBEC6" />
					</TouchableOpacity>
				);
			})}
		</>
	);
};
