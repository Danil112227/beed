# Почему все фронтенд и бекенд в одном файле? Потому что фротенд собирает статику из бекенда для админки
# Если не используешь админку, то можешь разделить стадии и удалить стадию static-files и COPY --from=static-files /app/collected_static ./static

FROM python:3.11 as backend-base
ENV PROJECT=beed
ENV PROJECT_DIR=/opt/${PROJECT}
ENV VIRTUAL_ENV=/opt/env
ENV PIPENV_CUSTOM_VENV_NAME=env

WORKDIR /opt
RUN pip3 install pipenv && virtualenv ${VIRTUAL_ENV}
COPY ./backend/Pipfile ./backend/Pipfile.lock ./
RUN pipenv install --deploy --ignore-pipfile
ENV PATH="${VIRTUAL_ENV}/bin:$PATH"

WORKDIR ${PROJECT_DIR}
COPY ./backend .
COPY ./deploy/ ./deploy

# часть используемая в фронтенде для сбора статики админки
FROM backend-base as static-files
RUN python3 manage.py collectstatic --no-input

######################### Frontend ########################

FROM node:alpine as frontend-builder
# нужен только для того, чтобы стянуть intdev-ui или какие-то другие наши зависимости. Если ничего не используешь такого
# смело выпиливай все что связано с этой переменной
RUN apk update && apk add bash
WORKDIR /app
COPY ./frontend/package.json ./frontend/package-lock.json ./

RUN npm install
COPY ./frontend .

FROM frontend-builder as frontend-builder-prod

FROM nginx:1.21 as frontend-nginx
ENV PROJECT=beed
ENV PROJECT_DIR=/opt/${PROJECT}
WORKDIR /usr/share/nginx/html
COPY --from=static-files $PROJECT_DIR/collected_static ./django

######################### RPM ########################
# Общий имейдж со структурой, нобходимой для рпмтулз-а
FROM almalinux:9 as common_image
ENV PROJECT=beed
ENV PROJECT_DIR=/opt/${PROJECT}
ENV BACK_STATIC_DIR=${PROJECT_DIR}/collected_static/back
ENV FRONT_STATIC_DIR=${PROJECT_DIR}/collected_static/
ENV VIRTUAL_ENV=${PROJECT_DIR}/env

WORKDIR ${PROJECT_DIR}
COPY ./rpmtools ./rpmtools
RUN dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-$(rpm --eval '%{_arch}')/pgdg-redhat-repo-latest.noarch.rpm && \
	dnf install -y \
    		rpm-build \
  			rsync \
  			postgresql14-libs \
  			python3.11-devel \
  			libjpeg-devel

COPY --from=backend-base ${PROJECT_DIR} ${PROJECT_DIR}
COPY --from=backend-base /opt/env ${VIRTUAL_ENV}
COPY --from=static-files $PROJECT_DIR/collected_static ./collected_static/static
COPY --from=frontend-builder-prod /app/dist/ ${PROJECT_DIR}/collected_static/
