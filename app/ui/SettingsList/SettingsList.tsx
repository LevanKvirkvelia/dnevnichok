import React, {PropsWithChildren} from 'react';
import {View, ViewProps} from 'react-native';

export function SettingsList({style, children, ...props}: PropsWithChildren<ViewProps>) {
  const _children = React.Children.toArray(children).filter(child => React.isValidElement(child));

  return (
    <View style={{padding: 0, marginTop: 15, ...(typeof style === 'object' && style)}} {...props}>
      {_children.map((child, i) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              // @ts-ignore
              last: i + 1 === _children.length,
              key: `key-${i}`,
            })
          : null,
      )}
    </View>
  );
}
