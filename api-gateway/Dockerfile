FROM golang:1.26-alpine

WORKDIR /app

COPY go.mod ./
# COPY go.sum ./ # Hapus tanda komentar jika file go.sum sudah ada
RUN go mod download

COPY . .

RUN go build -o main .

EXPOSE 8080

CMD ["./main"]