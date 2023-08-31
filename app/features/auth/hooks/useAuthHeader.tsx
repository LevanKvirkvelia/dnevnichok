import React, {useEffect} from 'react';
import {Button as NativeButton, Platform, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import Color from 'color';
import {AuthNavigationProp} from '../../../navigation/auth/Auth';
import {HeaderBackButton} from '@react-navigation/elements';
import {useTheme} from '../../themes/useTheme';
import {IconButton} from '../../../ui/IconButton';
import {useGetLatest} from '../../../shared/hooks/useGetLatest';

// TODO Refactoring
export const useAuthHeader = ({
  header,
  subHeader = null,
  canClose = null,
  onBack = null,
}: {
  header: string;
  subHeader?: string | null;
  canClose?: boolean | null;
  onBack?: null | (() => void);
}) => {
  const {colors} = useTheme();
  const navigation = useNavigation<AuthNavigationProp>();

  const handleBack = useGetLatest(event => {
    if (onBack && event?.data?.action?.type === 'POP') {
      onBack();
    }
  });
  useEffect(() => {
    return navigation.addListener('beforeRemove', handleBack);
  }, [navigation, handleBack]);

  useEffect(() => {
    const closeModal = () => {
      navigation.navigate('EngineSelect');
    };

    navigation.setOptions({
      title: header,
      headerTitle: () => (
        <TouchableOpacity disabled={!canClose} onPress={closeModal} style={{alignItems: 'center'}}>
          <Text
            style={{
              fontWeight: '600',
              fontSize: 17,
              lineHeight: 22,
              color: colors.textOnRow,
            }}
            numberOfLines={1}>
            {header}
          </Text>
          {subHeader ? (
            <Text
              style={{
                fontSize: 12,
                lineHeight: 14,
                color: Color(colors.textOnRow).alpha(0.3).rgb().toString(),
              }}
              numberOfLines={1}>
              {subHeader}
            </Text>
          ) : null}
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <View>
          {canClose ? null : (
            <HeaderBackButton
              truncatedLabel="Назад"
              label="Назад"
              onPress={() => navigation.pop(1)}
              tintColor={Platform.OS === 'ios' ? undefined : colors.textOnRow}
            />
          )}
        </View>
      ),
      headerRight: () => {
        let content;

        if (Platform.OS === 'ios') {
          content = <NativeButton title="Закрыть" onPress={closeModal} />;
        } else {
          content = <IconButton onPress={closeModal} name="close" color={colors.textOnRow} />;
        }

        return <View>{canClose ? content : null}</View>;
      },
    });
  }, [navigation, header, subHeader, canClose, handleBack, colors.textOnRow]);
};
