FROM python:3.13-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    openssl \
    && rm -rf /var/lib/apt/lists/*

ENV POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTION=1

RUN curl -sSL https://install.python-poetry.org | python3 - \
    && ln -s $POETRY_HOME/bin/poetry /usr/local/bin/poetry

WORKDIR /app

# Копируем файлы конфигурации poetry
COPY pyproject.toml poetry.lock ./

# Устанавливаем зависимости без установки самого текущего пакета (--no-root)
RUN poetry install --no-root

# Копируем весь проект
COPY . .
RUN ls -R /app

RUN poetry install

CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]


