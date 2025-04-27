FROM rust:alpine AS rust-builder

WORKDIR /app
RUN apk add --no-cache musl-dev

COPY hyper/Cargo.toml .
COPY hyper/src src
RUN cargo build --release

FROM alpine:edge AS stockfish-builder

RUN apk update && apk add --no-cache git make g++ wget
RUN git clone https://github.com/official-stockfish/Stockfish.git
WORKDIR /Stockfish/src
RUN make -j$(nproc) profile-build ARCH=x86-64-bmi2

FROM alpine:edge

RUN apk update && apk add --no-cache libstdc++ libgcc socat supervisor

COPY --from=rust-builder /app/target/release/stockfish-api /usr/local/bin/stockfish-api
COPY --from=stockfish-builder /Stockfish/src/stockfish /usr/local/bin/stockfish

WORKDIR /etc/supervisor.d/
COPY supervisord.conf /etc/supervisord.conf

RUN mkdir -p /etc/supervisor.d/
RUN echo "[program:stockfish]" > /etc/supervisor.d/stockfish.ini && \
    echo "command=socat TCP-LISTEN:4001,reuseaddr,fork,bind=127.0.0.1 EXEC:/usr/local/bin/stockfish,pty,raw" >> /etc/supervisor.d/stockfish.ini && \
    echo "autostart=true" >> /etc/supervisor.d/stockfish.ini && \
    echo "autorestart=true" >> /etc/supervisor.d/stockfish.ini && \
    echo "" >> /etc/supervisor.d/stockfish.ini && \
    echo "[program:api]" >> /etc/supervisor.d/stockfish.ini && \
    echo "command=/usr/local/bin/stockfish-api" >> /etc/supervisor.d/stockfish.ini && \
    echo "autostart=true" >> /etc/supervisor.d/stockfish.ini && \
    echo "autorestart=true" >> /etc/supervisor.d/stockfish.ini

EXPOSE 4000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]