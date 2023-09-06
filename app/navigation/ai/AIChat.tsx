import React, {useState} from 'react';
import {GiftedChat, IMessage, Composer, InputToolbar, Bubble, Message as ChatMessage} from 'react-native-gifted-chat';
import {ThemedBackgroundImage} from '../../features/themes/ThemedBackgroundImage';
import {useTheme} from '../../features/themes/useTheme';
import {useDiaryNavOptions} from '../../shared/hooks/useDiaryNavOptions';
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import {OpenAI} from 'openai';
import {View, Text} from 'react-native';
import {QuotaWidget} from '../../features/ai/components/QuotaWidget';

export function AIChat() {
  const {colors, isDark} = useTheme();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState('');

  const mutation = useMutation(
    ['chat', 'append'],
    async (messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) => {
      return axios.post('http://localhost:3000/api/chat', {messages}, {responseType: 'text'});
    },
    {
      onSuccess: data => {
        setMessages(
          GiftedChat.append(messages, [
            {
              _id: String(Math.random()),
              text: data.data,
              createdAt: new Date(),
              user: {
                _id: 'assistant',
              },
            },
          ]),
        );
      },
    },
  );

  useDiaryNavOptions({
    header: undefined,
    headerTitleAlign: 'left',
    headerTitleStyle: {color: colors.textOnRow},
    headerStyle: {elevation: 0, shadowOpacity: 0, backgroundColor: colors.rowBackgroundColor},
    headerTitle: 'Чат с AI',
    headerRight: () => <QuotaWidget>5/5</QuotaWidget>,
  });

  return (
    <ThemedBackgroundImage style={{backgroundColor: colors.backgroundColor}}>
      <GiftedChat
        messages={messages}
        messagesContainerStyle={{backgroundColor: 'transparent'}}
        bottomOffset={33}
        user={{_id: 'user'}}
        onSend={async message => {
          setInput('');
          setMessages(GiftedChat.append(messages, message));
          mutation.mutate(
            GiftedChat.append(messages, message).map(m => ({
              content: m.text,
              role: String(m.user._id) as 'user' | 'assistant',
            })),
          );
        }}
        text={input}
        onInputTextChanged={text => {
          setInput(text);
        }}
        isTyping={mutation.isLoading}
        disableComposer={mutation.isLoading}
        renderComposer={props => (
          <Composer {...props} placeholder="Введите сообщение" textInputStyle={{color: colors.textOnRow}} />
        )}
        minInputToolbarHeight={54}
        renderInputToolbar={props => (
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: colors.tabsBackground,
              borderTopColor: colors.border,
              borderBottomColor: colors.border,
              paddingVertical: 5,
            }}
            // @ts-ignore
          />
        )}
        textInputProps={{}}
        renderMessage={messageProps => {
          const {containerStyle, ...props} = messageProps;

          const style = {marginBottom: 5};

          return <ChatMessage {...messageProps} containerStyle={{left: style, right: style}} />;
        }}
        renderAvatar={null}
        renderBubble={bubbleProps => {
          const wrapperStyle = {
            left: {
              paddingVertical: 10,
              paddingHorizontal: 15,
              backgroundColor: colors.rowBackgroundColor,
              minHeight: 40,
              borderTopLeftRadius: 15,
              borderBottomLeftRadius: 2,
            },
            right: {
              paddingVertical: 10,
              paddingHorizontal: 15,
              backgroundColor: colors.rowBackgroundColor,
              minHeight: 40,
              borderTopRightRadius: 15,
              borderBottomRightRadius: 2,
            },
          };

          return (
            <View style={{flex: 1}}>
              <Bubble
                {...bubbleProps}
                wrapperStyle={wrapperStyle}
                // touchableProps={{onPress: () => onDoubleTap(bubbleProps.currentMessage!)}}
              />
            </View>
          );
        }}
        renderMessageText={({currentMessage}) => {
          if (!currentMessage) return null;
          const {user, text} = currentMessage;
          return (
            <View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2}}>
                <Text
                  style={{
                    fontWeight: '500',
                    color: user._id === 'user' ? colors.questionsPrimary : isDark ? colors.good : colors.primary,
                    fontSize: 14,
                    lineHeight: 20,
                  }}>
                  {user._id === 'user' ? 'Вы' : 'Дневничок AI'}
                </Text>
              </View>
              <Text style={{flexDirection: 'row', fontSize: 16, color: colors.textOnRow}}>{text}</Text>
            </View>
          );
        }}
        renderDay={() => null}
        renderTime={() => null}
        // renderMessageText={({currentMessage}) => (
        //   <QMessageView
        //     fontSize={16}
        //     message={currentMessage!}
        //     disableThread={isThread}
        //     onThread={() => onThread(currentMessage!)}
        //     onLike={() => onLike(currentMessage!)}
        //   />
        // )}
      />
    </ThemedBackgroundImage>
  );
}
