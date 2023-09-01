import React from 'react';
import {useDiaryNavOptions} from '../../shared/hooks/useDiaryNavOptions';
import {SettingsListItem} from '../../ui/SettingsList/SettingsListItem';
import {Card} from '../../ui/card/Card';
import {CardSettingsList} from '../../ui/card/CardSettingsList';
import {StyledTitle} from '../../ui/typography/StyledTitle';
import {MMKV} from 'react-native-mmkv';
import {clearCookies} from '../../features/auth/helpers/cookies';
import {useActiveAccount, useActiveUser} from '../../features/auth/hooks/useActiveUser';
import {useUsersStore} from '../../features/auth/state/useUsersStore';
import {ThemedScrollView} from '../../features/themes/ThemedScrollView';

// @ts-ignore
const isHermes = !!global.HermesInternal;

export function AdminPage() {
  useDiaryNavOptions({headerTitle: 'Управление приложением'});

  const user = useActiveUser();
  const account = useActiveAccount();
  const {upsertAccount} = useUsersStore();

  function killToken() {
    clearCookies();
    upsertAccount({
      id: account.id,
      sessionData: {
        ...account.sessionData,
        token: '5b5b11cb57b5a84874ead34c85b6d64a',
      },
    });
  }

  return (
    <ThemedScrollView>
      {/* 
        <SwitchDeployment />  //TODO 
      */}
      <Card>
        <StyledTitle>Main</StyledTitle>
        <CardSettingsList dividerTop>
          <SettingsListItem onPress={() => new MMKV().clearAll()} title="Почистить память" hasNavArrow />
          <SettingsListItem title="js" rightText={isHermes ? 'hermes' : 'v8'} />
        </CardSettingsList>
      </Card>
      <Card>
        <StyledTitle>Дневничок</StyledTitle>
        <CardSettingsList dividerTop>
          <SettingsListItem onPress={killToken} title="Сбросить токен" hasNavArrow />
          <SettingsListItem title="user" rightText={JSON.stringify({...user, userData: null})} />
        </CardSettingsList>
      </Card>
      <Card>
        <StyledTitle>Ads</StyledTitle>
        <CardSettingsList dividerTop>
          {/* <SettingsListItem onPress={showAd} title="Показать рекламу" hasNavArrow /> */}
        </CardSettingsList>
      </Card>
    </ThemedScrollView>
  );
}
