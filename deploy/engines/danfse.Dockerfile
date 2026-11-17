FROM golang:1.27.1 AS build
RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*
WORKDIR /src
RUN git init && git remote add origin https://github.com/ReceitaFederal/calculadora-rtc-gerador-danfse.git \
    && git fetch --depth 1 origin 8d79e6b2f7fad6375340afcb51c85ed370c64a14 \
    && git checkout --detach FETCH_HEAD
RUN go mod download
RUN go install github.com/swaggo/swag/cmd/swag@v1.16.6
RUN /go/bin/swag init -g cmd/danfse/main.go -o ./api/swagger
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o danfse-service ./cmd/danfse

FROM alpine:3.21
RUN apk add --no-cache ca-certificates tzdata
ENV TZ=America/Sao_Paulo
WORKDIR /app
COPY --from=build /src/danfse-service ./danfse-service
EXPOSE 8080
ENTRYPOINT ["./danfse-service"]
