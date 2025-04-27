FROM rust:slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*
ENV SQLX_OFFLINE=true
COPY Cargo.toml .
COPY .sqlx .sqlx
COPY src src
COPY bindings bindings
RUN cargo build --release

FROM debian:12-slim
WORKDIR /app
RUN apt-get update && apt-get install -y ca-certificates libssl-dev && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/matchmaking /app/matchmaking
EXPOSE 8001
CMD ["/app/matchmaking"]