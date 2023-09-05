import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GiftedChat, IMessage, Composer, InputToolbar} from 'react-native-gifted-chat';

export function AITab() {
  useAPIQuery<{
    messages: ServerMessage[];
  }>(`api/chat/list?date=${date}`, {
    onSettled: data => {
      const dat = data?.messages
        .filter(message => message.from !== 'system')
        .map(serverMessageToGifted)
        .reverse();
      setMessages(dat);
    },
  });

  const {mutate, isLoading: isReplying} = useMutation(
    (message: string) => {
      return ky.post('api/chat/send', {json: {date, message}}).json<{
        messages: ServerMessage[];
        reply: string;
      }>();
    },
    {
      onSuccess(data) {
        if (!data?.messages) return;
        setMessages(prev => [serverMessageToGifted(data.messages[1]), ...prev]);
      },
      onError() {
        setMessages(prev => prev.slice(1));
      },
    },
  );

  return (
    <SafeAreaView className="flex flex-1" edges={['right', 'bottom', 'left']}>
      <GiftedChat
        messages={messages}
        bottomOffset={33}
        user={{_id: 'user'}}
        onSend={message => {
          setMessages(prev => GiftedChat.append(prev, message));
          if (message?.[0]?.text) mutate(message?.[0]?.text);
        }}
        isTyping={isReplying}
        disableComposer={isReplying}
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
    </SafeAreaView>
  );
}
