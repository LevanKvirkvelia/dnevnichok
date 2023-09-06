import React, {useEffect, useState} from 'react';
import {
  GiftedChat,
  IMessage,
  Composer,
  InputToolbar,
  Bubble,
  Message as ChatMessage,
  Send,
} from 'react-native-gifted-chat';
import {ThemedBackgroundImage} from '../../features/themes/ThemedBackgroundImage';
import {useTheme} from '../../features/themes/useTheme';
import {useDiaryNavOptions} from '../../shared/hooks/useDiaryNavOptions';
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import {OpenAI} from 'openai';
import {View, Text} from 'react-native';
import {QuotaWidget} from '../../features/ai/components/QuotaWidget';
import {useAIStore} from '../../features/ai/hooks/useUsersStore';
import {useBackwardTimer} from '../../shared/hooks/useBackwardTimer';
import endent from 'endent';

const LIMIT = 10;
const TIME_WINDOW = 1000 * 60 * 60;

function AIChatHeaderRight() {
  const {colors, isDark} = useTheme();
  const {counter} = useAIStore();
  const timer = useBackwardTimer({endTime: counter?.[counter.length - 1] + TIME_WINDOW});

  return (
    <View className="flex flex-row justify-center items-center">
      {timer && (
        <Text style={{color: colors.textOnPrimary, marginRight: 8}}>
          {timer[0]}:{timer[1].toString().padStart(2, '0')}
        </Text>
      )}
      <QuotaWidget>{LIMIT - (counter?.length ?? 0)}</QuotaWidget>
    </View>
  );
}

export function AIChat() {
  const {colors, isDark} = useTheme();

  const {counter, incrementCounter, setCounter, temporaryId} = useAIStore();
  const isDisabled = (counter?.length ?? 0) >= LIMIT;
  const timer = useBackwardTimer({endTime: counter?.[counter.length - 1] + TIME_WINDOW});

  const [messages, setMessages] = useState<IMessage[]>(() => [
    {
      _id: String(Math.random()),
      createdAt: new Date(),
      text: endent`
      Привет! Я - Дневничок AI. 
      Я могу ответить на твои вопросы, помочь с выполнением заданий и даже научить тебя новому! 
      
      В данный момент я могу отвечать только на ${LIMIT} сообщений в час.
      Справа сверху ты можешь увидеть сколько сообщений тебе осталось.

      Напиши мне что-нибудь, чтобы начать общение.
      `,
      user: {
        _id: 'assistant',
      },
    },
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const newCounter = counter.filter(id => new Date().getTime() - id < TIME_WINDOW);

    if (newCounter.length !== counter.length) {
      setCounter(newCounter);
    }
  }, [counter, timer]);

  const mutation = useMutation(
    ['chat', 'append'],
    async (messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) => {
      return axios.post(
        'https://dnevnichok-backend.vercel.app/api/chat',
        // 'http://localhost:3000/api/chat',
        {messages, temporaryId},
        {responseType: 'text'},
      );
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
    headerTitle: 'Чат с AI',
    headerRight: () => <AIChatHeaderRight />,
  });

  return (
    <ThemedBackgroundImage style={{backgroundColor: colors.backgroundColor}}>
      <GiftedChat
        messages={messages}
        messagesContainerStyle={{backgroundColor: 'transparent'}}
        bottomOffset={33}
        user={{_id: 'user'}}
        onSend={async message => {
          if (isDisabled) {
            return;
          }
          incrementCounter();
          setMessages(GiftedChat.append(messages, message));
          mutation.mutate(
            GiftedChat.append(messages, message)
              .map(m => ({
                content: m.text,
                role: String(m.user._id) as 'user' | 'assistant',
              }))
              .reverse()
              .slice(1),
          );
          setInput('');
        }}
        text={input}
        onInputTextChanged={text => {
          setInput(text);
        }}
        isTyping={mutation.isLoading}
        disableComposer={mutation.isLoading || isDisabled}
        renderComposer={props => (
          <Composer
            {...props}
            placeholder={
              isDisabled
                ? `До восстановления осталось ${timer[0]}:${timer[1].toString().padStart(2, '0')}`
                : 'Введите сообщение'
            }
            textInputStyle={{color: colors.textOnRow}}
          />
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
