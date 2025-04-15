FROM rust:1.75-alpine AS builder

WORKDIR /app
RUN apk add --no-cache musl-dev

COPY Cargo.toml .
COPY src src
RUN cargo build --release

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/target/release/stockfish-api .

EXPOSE 4000

CMD ["./stockfish-api"]