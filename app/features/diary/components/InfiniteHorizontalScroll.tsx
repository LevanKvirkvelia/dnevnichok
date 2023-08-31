import React, {useEffect, useMemo, useState} from 'react';
import {Dimensions} from 'react-native';
import {Route, TabView} from 'react-native-tab-view';

const initialLayout = {width: Dimensions.get('window').width};

interface InfiniteHorizontalScrollProps {
  current: string | number;
  rows: (string | number)[];

  placeholder(): React.ReactNode;
  renderItem(key: string | number): React.ReactNode;
  onIndexChanged?(key: string | number): void;

  placeholderDist?: number;
}

export function InfiniteHorizontalScroll({
  current,
  rows,
  renderItem,
  placeholder,
  onIndexChanged,
  placeholderDist = 2,
}: InfiniteHorizontalScrollProps) {
  const [index, setIndex] = useState(rows.indexOf(current));
  const [forcedIndex, setForcedIndex] = useState<number | null>(null);

  useEffect(() => {
    const newIndex = rows.indexOf(current);
    if (index !== newIndex) {
      setIndex(newIndex);
      setForcedIndex(newIndex);
    }
  }, [rows, current]);

  const routes = useMemo<Route[]>(() => {
    return rows.map(item => ({key: String(item)}));
  }, [rows]);

  return (
    <TabView
      initialLayout={initialLayout}
      renderTabBar={() => null}
      navigationState={{index, routes}}
      renderScene={({route}) => renderItem(route.key)}
      lazy
      lazyPreloadDistance={placeholderDist}
      renderLazyPlaceholder={placeholder}
      onIndexChange={i => {
        if (forcedIndex !== null && forcedIndex === index) {
          setForcedIndex(null);
        }
        if (forcedIndex === null) {
          setIndex(i);
          onIndexChanged?.(rows[i]);
        }
      }}
    />
  );
}
