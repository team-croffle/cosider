# @cosider/web

Cosider 프론트엔드 (Nuxt 4 + Nuxt UI).

## 레이아웃

| Layout    | 용도                                                 |
| --------- | ---------------------------------------------------- |
| `landing` | 랜딩 (`/`): 헤더 + 푸터                              |
| `default` | 앱 내부: GNB + LNB (푸터 없음)                       |
| `project` | 프로젝트 하위: `default` 위에 프로젝트 사이드바 슬롯 |

공통 컴포넌트는 `app/components/landing`, `layout`, `overlay`, `project`에 있습니다.

## 개발

루트에서:

```bash
yarn install
yarn dev --filter=@cosider/web
```

또는:

```bash
cd apps/web
yarn dev
```

`http://localhost:5173`
