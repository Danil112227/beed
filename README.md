# Boilerplate для Django+react.js

## Запуск docker-compose

3. Поднимаем контейнеры
    ```shell
    docker-compose up -d
    ```
4. Идем на [localhost:9000](http://localhost/). Сервит все nginx.

## Разработка бэкенд

Если Pycharm говорит, что не видит зависимости в виде наших модулей (application/users/etc), то следует
отметить папку backend в качестве Source Root (ПКМ > Mark directory as).

## Разработка фронта

### Зависимости фронта

Чтобы IDE могла распознать все установленные зависимости, есть 2 варианта:
1. Указать ей путь до node_modules в докер контейнере (не рекомендуется: будет лагать и работает плохо)
2. Поставить все зависимости локально

Для п.2 делаем следующее из корня проекта:
```shell
cd frontend && export $(cat ../.env | xargs) && yarn
```

### Схлопывание файлов в проекте

На фронте рекомендуетя придерживаться следующего правила нейминга стилей:
если есть компонент Home.tsx, то соответствующий .scss файл стоит называть
Home.module.scss.

Чтобы боковый вид проекта не превращался в мусорку, рекомендуется включить
file nesting в pycharm: https://www.jetbrains.com/help/idea/file-nesting-dialog.html

В ряду с .tsx должно лежать следующее правило:
```
.d.ts; .js; .js.map; .jsx; .jsx.map; .module.scss
```
