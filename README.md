# Cosider

기획 → 설계 → 구현 → 테스트 → 배포 → 유지보수까지 프로젝트 전 과정을 추적하는 관리/협업 툴입니다.

- **팀:** Croffle Dev.
- **저장소:** https://github.com/team-croffle/cosider

## 구조

| 경로              | 설명                        |
| ----------------- | --------------------------- |
| `apps/web`        | Nuxt 4 + Nuxt UI 프론트엔드 |
| `apps/server`     | NestJS API 서버             |
| `packages/shared` | 공유 타입/DTO               |

Yarn workspaces + Turborepo 모노레포입니다.

## 로컬 인프라 (`test/docker-compose.yaml`)

로컬 개발용 Postgres(pgvector), pgAdmin, Valkey, MinIO를 띄웁니다.

```bash
docker compose -f test/docker-compose.yaml up -d
```

| 서비스        | 포트   | 비고                                                   |
| ------------- | ------ | ------------------------------------------------------ |
| Postgres      | `5432` | user/password/db: `cosider` / `cosider123` / `cosider` |
| pgAdmin       | `5433` | `admin@cosider.com` / `cosider123`                     |
| Valkey        | `6379` | Redis 호환 캐시                                        |
| MinIO API     | `9000` | root: `admin` / `minioadminpassword`                   |
| MinIO Console | `9001` | 브라우저 콘솔                                          |

`minio-init`이 기동 시 `cosider` 사용자·`cosider` 버킷을 준비합니다.

중지:

```bash
docker compose -f test/docker-compose.yaml down
```

## 시작하기

```bash
yarn install
yarn build:shared
yarn dev
```

- Web: `http://localhost:5173`
- Server: 환경에 맞게 `.env` 설정 후 `yarn dev:server` (위 compose와 포트를 맞춤)

## 스크립트

```bash
yarn build        # 전체 빌드
yarn typecheck    # 타입 검사
yarn lint         # 린트
```
