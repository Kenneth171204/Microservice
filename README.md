# Microservice Project

This repository contains multiple microservices behind a Go API Gateway.

## Backend

Start containers (examples):

1) MySQL + Redis (and DB init)
```bash
docker compose up -d
```

2) Start each microservice using its own compose file:
```bash
# In each folder: order-service, restaurant-service, delivery-service, user-service
# run:
# docker compose up -d
```

3) API Gateway
- The gateway runs on **port 8080**.

## Frontend (React + Tailwind)

See: `frontend/README.md`

```bash
cd frontend
npm install
npm run dev
```

The frontend calls only the API Gateway (`http://localhost:8080`).
When a microservice is down, its page shows a busy message and a motivational quote.

