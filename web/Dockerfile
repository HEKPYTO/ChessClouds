FROM oven/bun:1 AS builder
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*
RUN touch bun.lockb                         
RUN bun install                                 
RUN bun add tailwindcss @tailwindcss/postcss postcss autoprefixer

ARG NEXT_PUBLIC_GOOGLE_AUTH_ENDPOINT
ARG NEXT_PUBLIC_ENGINE_API_URL
ARG NEXT_PUBLIC_WS_SERVER_URL
ARG NEXT_PUBLIC_MATCHMAKING_SERVER_URL
ARG DATABASE_URL

ENV NEXT_PUBLIC_GOOGLE_AUTH_ENDPOINT=${NEXT_PUBLIC_GOOGLE_AUTH_ENDPOINT}
ENV NEXT_PUBLIC_ENGINE_API_URL=${NEXT_PUBLIC_ENGINE_API_URL}
ENV NEXT_PUBLIC_WS_SERVER_URL=${NEXT_PUBLIC_WS_SERVER_URL}
ENV NEXT_PUBLIC_MATCHMAKING_SERVER_URL=${NEXT_PUBLIC_MATCHMAKING_SERVER_URL}
ENV DATABASE_URL=${DATABASE_URL}

RUN bunx prisma generate
RUN bun run build

FROM oven/bun:1 AS runner
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lockb ./bun.lockb
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client

RUN bun install --production
ARG PORT
EXPOSE ${PORT:-3000}
CMD ["bun", "start"]