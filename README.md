# Дневничок

Это моя переписанная за 6 дней мини-версия Дневничка.

Дневничок был когда-то очень большим продуктом:
- 300К еженедельных активных пользователей
- +2М установок
- Команда разработки, проверяющая от 4 до 8 продуктовых гипотез в месяц
- Команда редакторов сторис, выпускавшая по 1-2 сторис ежедневно с завидной конверсией прочтения в 70%
- Сервис вопросов и ответов, с командой экспертов, готовых отвечать на тысячи вопросов ежедневно
- Почти все дневники России в Дневничке
- Пуш-уведомления и так далее.
- Поддержка 4 платформ: iOS, Android, Web и приложениях ВКонтакте
- Бот во ВКонтакте
- Инфраструктура для аналитики и микросервисы, выдерживающая до 100 тыс. запросов в минуту в пиковые моменты.


В этой мини-версии я сконцентировался на минимально необходимом коде для работы базового функционала дневников. Цель проекта быть максимально понятным и хакабельным, чтобы каждый мог быстро разобраться в коде, внести изменения или сделать свой Дневничок на его основе.

Вы можете использовать этот репозиторий как основу для своего Дневничка, или пулл-реквестить в него свои фичи, чтобы Дневничок стал лучше.


## Из чего состоит Дневничок

1. Дневничок работает полностью на клиенте. Бекенд не нужен
2. Дневничок написан на TypeScript, используя React Native
3. Мы используем React Query для хренения стейта с API, и Zustand для хранения стейта внутри приложения
4. Мы используем React Navigation для навигации
5. Мы используем React Native Firebase для аналитики и пуш уведомлений
6. CodePush для обновления приложения без релиза в AppStore и Google Play

## Как запустить Дневничок
Воспользуйтесь инструкцией по работе с React Native. Я не пробовал запускать Дневничок на других компьютерах, поэтому не могу гарантировать, что все будет работать сразу. Если у вас не получается запустить Дневничок, то пишите мне в [телеграм чате](https://t.me/+804g3J7utW9kZWEy), я постараюсь помочь.

Скорее всего, из xcode запустить не получится, потому что необходим аккаунт разработчика. Но через `yarn ios` или `yarn android` все должно работать.
Скоро я постараюсь сделаю превью-релизы коммитов, чтобы можно было тестить Дневничок в продакшен версии из AppStore/Google Play.


[телеграм чат](https://t.me/+804g3J7utW9kZWEy)
