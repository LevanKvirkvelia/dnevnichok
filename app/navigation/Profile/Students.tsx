import React, {useMemo, useState, useRef} from 'react';
import {Text, View} from 'react-native';
import {useTheme} from '../../features/themes/useTheme';
import {useDiaryNavOptions} from '../../shared/hooks/useDiaryNavOptions';
import {SettingsListItem} from '../../ui/SettingsList/SettingsListItem';
import {Card} from '../../ui/card/Card';
import {CardSettingsList} from '../../ui/card/CardSettingsList';
import {useUsersStore} from '../../features/auth/state/useUsersStore';
import {SettingsIconWrapper} from '../../ui/SettingsIconWrapper';
import {useMMKVBoolean} from 'react-native-mmkv';
import {isEmulatorSync} from 'react-native-device-info';
import {ThemedScrollView} from '../../features/themes/ThemedScrollView';
import {replaceAbbr} from '../../shared/helpers/replaceAbbr';
import {useNavigation} from '@react-navigation/native';
import {useThemedActionSheet} from '../../shared/helpers/useActionSheet';
import {useActiveUser} from '../../features/auth/hooks/useActiveUser';
import {IonIcon} from '../../ui/IonIcon';
import {AvatarPicker, AvatarPickerRef} from '../../features/profile/components/AvatarPicker';
import {Avatar} from '../../features/profile/components/Avatar';

export function StudentsList() {
  const navigation = useNavigation();
  const {accounts, setActiveUserId} = useUsersStore();

  const students = useMemo(() => Object.values(accounts).flatMap(account => Object.values(account.users)), [accounts]);

  const sortedUsers = useMemo(
    () =>
      students.sort((a, b) => {
        const compA = a?.name?.toUpperCase() || '';
        const compB = b?.name?.toUpperCase() || '';
        if (compA < compB) return -1;
        if (compA > compB) return 1;
        return 0;
      }),
    [students],
  );

  return (
    <Card>
      <CardSettingsList>
        {sortedUsers.map(user => (
          <SettingsListItem
            icon={
              <Avatar
                user={user}
                size={25}
                style={{borderWidth: 0}}
                containerStyle={{margin: 0, marginRight: 10, alignSelf: 'center'}}
              />
            }
            onPress={() => setActiveUserId(user.id, user.accountId)}
            key={user.id}
            title={replaceAbbr(user?.name)}
            numberOfLines={2}
            hasNavArrow
          />
        ))}
        <SettingsListItem
          icon={<SettingsIconWrapper backgroundColor="#e91e63" iconName="add" iconSize={25} />}
          onPress={() =>
            navigation.navigate('Auth', {
              screen: 'Login',
            })
          } // TODO ADD user
          title="Добавить пользователя"
          hasNavArrow
        />
      </CardSettingsList>
    </Card>
  );
}

export function Students() {
  const {colors} = useTheme();
  const user = useActiveUser();
  const navigation = useNavigation();
  const {fullLogout, setUserSettings} = useUsersStore();
  const showActionSheet = useThemedActionSheet();

  useDiaryNavOptions({
    headerTitle: () => (
      <View style={{alignItems: 'center'}}>
        <Text style={{color: colors.textOnPrimary, fontWeight: '600', fontSize: 17, lineHeight: 20}}>Профиль</Text>
      </View>
    ),
  });

  const [isEmulator] = useState(isEmulatorSync());
  const [isAdmin = false, setIsAdmin] = useMMKVBoolean('isAdmin');

  return (
    <ThemedScrollView style={{paddingBottom: 20}}>
      <Card>
        <CardSettingsList>
          <SettingsListItem
            rightIcon={
              <IonIcon
                name="settings-outline"
                size={28}
                style={{
                  flexShrink: 1,
                  color: '#aaaaaa',
                  alignSelf: 'center',
                  textAlign: 'right',
                }}
                onPress={() =>
                  showActionSheet([
                    {text: 'Отмена', cancel: true},
                    {
                      text: user?.settings?.showSaturday ? 'Не показывать субботы' : 'Показывать субботы',
                      onPress: () => setUserSettings({showSaturday: !user?.settings?.showSaturday}),
                    },
                  ])
                }
              />
            }
            title={replaceAbbr(user?.name)}
            titleStyle={{
              fontSize: 20,
              flexWrap: 'wrap',
              fontWeight: '500',
              marginLeft: 0,
              flexShrink: 1,
              color: colors.textOnRow,
            }}
            numberOfLines={2}
            description={<AvatarPicker />}
            icon={<Avatar user={user} size={60} />}
          />
          <SettingsListItem
            icon={<SettingsIconWrapper backgroundColor="#ffcc00" iconName="star" />}
            onPress={() =>
              showActionSheet(
                [
                  {text: 'Отмена', cancel: true},
                  {text: 'Советы на 3', onPress: () => setUserSettings({target: 3})},
                  {text: 'Советы на 4', onPress: () => setUserSettings({target: 4})},
                  {text: 'Советы на 5', onPress: () => setUserSettings({target: 5})},
                ],
                {title: 'Выберите цель, а наши советы помогут вам получить эту оценку'},
              )
            }
            title="Цель обучения"
            rightText={`${user.settings.target}`}
            rightTextStyle={{marginRight: 5, color: 'grey', fontSize: 15}}
            hasNavArrow
          />
        </CardSettingsList>
      </Card>
      <StudentsList />
      <Card>
        <CardSettingsList debug>
          <SettingsListItem
            icon={<SettingsIconWrapper backgroundColor={colors.primary} iconName="color-palette" />}
            title="Тема"
            // onPress={() => openPage('Theme')}
            // rightIcon={<ThemeCircle style={{marginRight: 5}} size={15} showActive={false} />}
            hasNavArrow
          />
          <SettingsListItem
            icon={<SettingsIconWrapper backgroundColor="#bdbdbd" iconName="help-buoy" />}
            title="Связаться с нами"
            // onPress={() => openPage('Contacts')}
            hasNavArrow
          />
          {isAdmin || isEmulator ? (
            <SettingsListItem title="Раздел разработчика" onPress={() => navigation.navigate('Test')} hasNavArrow />
          ) : null}
        </CardSettingsList>
      </Card>
      <Card>
        <CardSettingsList>
          <SettingsListItem onPress={() => fullLogout()} title="Выход" hasNavArrow />
        </CardSettingsList>
      </Card>
      {/* 
	  // TODO 
	  <View style={{alignItems: 'center', padding: 8}}>
        <Text style={{color: colors.textOnRow, opacity: 0.2}}>
          {appVersion} - {(+otaPercent).toFixed(2) * 100}
        </Text>
      </View> */}
    </ThemedScrollView>
  );
}
