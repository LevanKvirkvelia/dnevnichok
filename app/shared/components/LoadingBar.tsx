import React, {useState, useEffect} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';


// TODO refactor this component
export function LoadingBar({hasData, isLoading, error}: {hasData: boolean; isLoading: boolean; error: boolean}) {
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState<string>('#ffcc00');
  const [text, setText] = useState<string | null>();
  const textColor = color === '#ffcc00' ? 'black' : 'white';

  useEffect(() => {
    if (!loading && isLoading) {
      setLoading(true);
      setText(hasData ? 'Обновление...' : 'Загрузка...');
      setColor('#ffcc00');
    } else if (loading && !isLoading) {
      if (error) {
        setText('Ошибка загрузки');
        setColor('#ec6045');
      } else {
        setText('Загружено!');
        setColor('#12c3bd');
      }
      const timeout = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [hasData, isLoading, error]);

  if (!loading) return null;
  return (
    <View
      style={{
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color,
      }}>
      <Text
        style={{
          color: textColor,
          flex: 1,
          marginLeft: 30,
          textAlign: 'center',
          fontWeight: '600',
          fontSize: 17,
        }}>
        {text}
      </Text>
      <ActivityIndicator style={{width: 30}} color={textColor} animating={loading} />
    </View>
  );
}
