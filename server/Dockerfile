# Stage 1: Build the Go binary
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Download dependencies first (cached layer)
COPY go.mod go.sum ./
RUN go mod download

# Copy source and build
COPY . .
RUN go build -ldflags="-w -s" -o main .

# Stage 2: Minimal runtime image (~15 MB)
FROM alpine:latest

WORKDIR /app

# Copy binary and env file
COPY --from=builder /app/main .
COPY .env .

# Create uploads directory so volume mounts work
RUN mkdir -p uploads

EXPOSE 5000

CMD ["./main"]
