# Gestor de Turnos Médicos — Backend

[![Backend CI](https://github.com/Rhazieh/backend-gestor/actions/workflows/ci.yml/badge.svg)](https://github.com/Rhazieh/backend-gestor/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Rhazieh/backend-gestor/graph/badge.svg)](https://codecov.io/gh/Rhazieh/backend-gestor)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/ff8171b8562047ed927e484cd6071d8c)](https://app.codacy.com/gh/Rhazieh/backend-gestor/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

REST API for the **Gestor de Turnos Médicos** (Medical Appointment Manager) platform, built with **NestJS**, **TypeScript**, and **PostgreSQL (TypeORM)**. It provides full CRUD management, input validation, dynamic filtering, automated CI/CD, Docker Compose orchestration, and local Kubernetes manifests for Minikube.

- **Production API (Render):** https://backend-gestor-zfez.onrender.com *(may take a few seconds to wake up on cold start)*
- **Frontend Repository:** https://github.com/Rhazieh/frontend-gestor

---

## Tech Stack

- **Runtime & Framework:** Node.js 20, NestJS 11, TypeScript
- **Database & ORM:** PostgreSQL 15, TypeORM, `class-validator` / `class-transformer`
- **Containers & Orchestration:** Docker, Docker Compose, Kubernetes (`k8s/` manifests for Minikube)
- **CI/CD & Code Quality:** GitHub Actions, ESLint, Jest (unit tests & coverage), Codecov, Codacy, Dependabot, Render

---

## Running Locally (`localhost:3000`)

1. **Install dependencies:**

```bash
npm install
```

2. **Start PostgreSQL with Docker Compose (recommended):**

```bash
docker compose -f docker-compose.yml up -d db
```

This exposes a local database at `postgres://postgres:postgres@localhost:5432/turnos` with a persistent volume (`pgdata`). You can also launch the full stack (`db`, `backend`, `frontend`) with `docker compose up -d`.

3. **Configure environment variables:**

Copy `.env.example` to `.env` and adjust if needed (by default it uses port `3000` and the local database URL above):

```bash
cp .env.example .env
```

4. **Run in development mode (watch):**

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000` with CORS enabled.

---

## API Endpoints

### Patients (`/pacientes`)

```http
GET    /pacientes
POST   /pacientes
GET    /pacientes/:id
PATCH  /pacientes/:id
DELETE /pacientes/:id
```

### Appointments (`/turnos`)

```http
GET    /turnos
POST   /turnos
GET    /turnos/:id
PATCH  /turnos/:id
DELETE /turnos/:id
```

### Filters & Nested Routes

```http
GET  /turnos?fecha=YYYY-MM-DD
GET  /turnos?pacienteId=ID
GET  /turnos?fecha=YYYY-MM-DD&pacienteId=ID
GET  /pacientes/:id/appointments
POST /pacientes/:id/appointments
```

---

## Database Schema (1:N Relationship)

A `paciente` can have multiple `turnos`:

```text
paciente
├── id
├── nombre
├── email
└── telefono

turno
├── id
├── fecha
├── hora
├── razon
└── pacienteId (FK -> paciente.id)
```

---

## CI/CD & Code Quality Pipeline

The workflow in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) triggers on pushes and pull requests to `main`/`master`:

1. **Deterministic install:** `npm ci` on Node.js 20
2. **Static analysis:** `npm run lint:check` (ESLint)
3. **Unit tests & coverage:** `npm run test:cov` (Jest), uploading `lcov.info` to **Codecov**
4. **Build verification:** `npm run build`
5. **Continuous Deployment (Render):** On push to `main` (after `test` succeeds), triggers the Render deploy hook via `RENDER_DEPLOY_HOOK_URL`

Code quality is continuously monitored with **Codacy** and dependency updates are automated with **Dependabot**.

---

## Local Kubernetes Deployment (Minikube)

Kubernetes manifests live under [`k8s/`](k8s/):

- [`01-postgres-secret.yaml`](k8s/01-postgres-secret.yaml): `Secret` holding PostgreSQL credentials and `DATABASE_URL`
- [`02-postgres-pvc.yaml`](k8s/02-postgres-pvc.yaml): `PersistentVolumeClaim` (`1Gi`, `ReadWriteOnce`)
- [`03-postgres-deployment.yaml`](k8s/03-postgres-deployment.yaml): PostgreSQL 15 `Deployment` + `ClusterIP` service (`db:5432`)
- [`04-backend-deployment.yaml`](k8s/04-backend-deployment.yaml): Backend `Deployment` (`rhazieh1/gestor-backend:latest`, TCP readiness probe, resource limits) + `NodePort` service (`30000`)
- [`05-frontend-deployment.yaml`](k8s/05-frontend-deployment.yaml): Frontend `Deployment` (`rhazieh1/gestor-frontend:latest`, 2 replicas, HTTP readiness probe) + `NodePort` service (`30080`)

```bash
minikube start --driver=docker
kubectl apply -f k8s/
kubectl get all,pvc
```

To access the services via port-forwarding (`http://localhost:8080` frontend → `http://localhost:3000` backend):

```bash
kubectl port-forward svc/backend 3000:3000 &
kubectl port-forward svc/frontend 8080:80 &
```

---

## Postman Collection

- **File:** [`Entrega 1 - Backend Gestor (FINAL).postman_collection.json`](Entrega%201%20-%20Backend%20Gestor%20(FINAL).postman_collection.json)
- **Usage:**
  1. Open Postman → **Import** → **File** → select `Entrega 1 - Backend Gestor (FINAL).postman_collection.json`.
  2. Set the `baseUrl` environment variable if targeting Render instead of `http://localhost:3000`.
  3. Run the requests for Patients CRUD, Appointments CRUD, filters, and nested `/appointments` endpoints.

---

## Recommended Code Reading Order

1. `src/main.ts`
2. `src/app.module.ts`
3. `src/pacientes/entities/paciente.entity.ts`
4. `src/turnos/entities/turno.entity.ts`
5. `src/pacientes/dto/create-paciente.dto.ts`
6. `src/pacientes/dto/update-paciente.dto.ts`
7. `src/turnos/dto/create-turno.dto.ts`
8. `src/turnos/dto/update-turno.dto.ts`
9. `src/pacientes/pacientes.service.ts`
10. `src/turnos/turnos.service.ts`
11. `src/pacientes/pacientes.controller.ts`
12. `src/turnos/turnos.controller.ts`
13. `src/pacientes/pacientes.module.ts`
14. `src/turnos/turnos.module.ts`
