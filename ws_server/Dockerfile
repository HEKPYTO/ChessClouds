FROM rust:bookworm AS builder

WORKDIR /usr/src/app
COPY . .

RUN apt-get update
RUN apt-get install -y libssl-dev
RUN cargo build --release

FROM debian:bookworm

RUN apt-get update
RUN apt-get install -y openssl

WORKDIR /app

COPY --from=builder /usr/src/app/target/release/ws_server /app/

EXPOSE 8000

CMD ["./ws_server"]