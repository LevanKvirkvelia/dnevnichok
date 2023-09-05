import React, {useMemo} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GiftedChat, IMessage, Composer, InputToolbar} from 'react-native-gifted-chat';
import {useChat} from 'ai/react/dist';
import {ThemedBackgroundImage} from '../../features/themes/ThemedBackgroundImage';
import {useTheme} from '../../features/themes/useTheme';
import {useDiaryNavOptions} from '../../shared/hooks/useDiaryNavOptions';

export function AIChat() {
  const {colors} = useTheme();
  const {messages, append, isLoading, setInput, input} = useChat({
    api: 'http://localhost:3000/api/chat',
  });

  const giftedMessages = useMemo(
    () =>
      messages.map<IMessage>(message => ({
        _id: message.id,
        text: message.content,
        createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),
        user: {
          _id: message.role,
          name: message.role === 'user' ? 'You' : 'AI',
        },
      })),
    [messages, isLoading],
  );

  useDiaryNavOptions({
    headerTitle: 'Чат с AI',
  });

  console.log('giftedMessages', giftedMessages, messages);

  return (
    <ThemedBackgroundImage style={{backgroundColor: colors.backgroundColor}}>
      <GiftedChat
        messages={giftedMessages}
        messagesContainerStyle={{backgroundColor: 'transparent'}}
        bottomOffset={33}
        user={{_id: 'user'}}
        onSend={async message => {
          append({
            id: String(message[0]._id),
            content: message[0].text,
            createdAt: new Date(message[0].createdAt),
            role: 'user',
          })
            .catch(console.error)
            .then(console.log);
        }}
        text={input}
        onInputTextChanged={text => {
          setInput(text);
        }}
        isTyping={isLoading}
        disableComposer={isLoading}
        renderComposer={props => (
          <Composer {...props} placeholder="Type a message..." textInputStyle={{color: 'white'}} />
        )}
        renderInputToolbar={props => (
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: 'black',
              borderTopColor: 'rgba(255, 255, 255, 0.1)',
            }}
          />
        )}
      />
    </ThemedBackgroundImage>
  );
}
