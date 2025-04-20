FROM oven/bun:1

WORKDIR /app

COPY . .

RUN bun install --production

ARG PORT
EXPOSE ${PORT:-3000}

CMD ["bun", "start"]