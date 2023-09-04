import React from 'react';
import {View, ViewProps} from 'react-native';
import {Divider} from '../SettingsList/Divider';

interface CardSettingsListProps extends ViewProps {
  dividerTop?: boolean;
}

export const CardSettingsList: React.FC<CardSettingsListProps> = ({style = {}, children, dividerTop, ...props}) => {
  const _children = React.Children.toArray(children).filter(child => !!child);

  return (
    <View
      style={[
        dividerTop ? {marginBottom: -12} : {marginVertical: -12},
        {marginHorizontal: -15, borderRadius: 6},
        style,
      ]}
      {...props}>
      {dividerTop ? <Divider style={{marginLeft: 15, marginTop: 15}} /> : null}
      {_children.map((child, i) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              // @ts-ignore
              last: i + 1 == _children.length,
              key: i.toString(),
            })
          : child,
      )}
    </View>
  );
};
