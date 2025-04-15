FROM alpine:edge AS builder

RUN apk update && apk add --no-cache git make g++ wget
RUN git clone https://github.com/official-stockfish/Stockfish.git
WORKDIR /Stockfish/src
RUN make -j$(nproc) profile-build ARCH=x86-64-bmi2

FROM alpine:edge
RUN apk update && apk add --no-cache libstdc++ libgcc socat
COPY --from=builder /Stockfish/src/stockfish /usr/local/bin/stockfish
WORKDIR /usr/local/bin
EXPOSE 4001

CMD ["socat", "TCP-LISTEN:4001,reuseaddr,fork,bind=0.0.0.0", "EXEC:/usr/local/bin/stockfish,pty,raw"]