# Popular Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** FE 복지 카드의 노출/클릭/저장 이벤트를 BE 인기 복지 집계 API에 연결하고, 인기 복지 목록을 BE 집계 데이터 기반으로 표시한다.

**Architecture:** FE `WelfareItem`에 `source`와 `cacheKey`를 추가해 BE `popular_services.cache_key`와 동일한 식별자를 사용한다. BE는 `popular_services`와 `welfare_services`를 조인한 projection DTO를 제공하고, FE는 BE 결과를 우선 사용하되 실패하거나 결과가 없으면 기존 클라이언트 추천 데이터로 fallback한다.

**Tech Stack:** Next.js 16, React 19, TypeScript, Node test runner, Spring Boot 3.5, Java 21, Spring Data JPA, PostgreSQL.

## Global Constraints

- 기능 로직은 점진적으로 연결한다. 기존 복지 조회, Supabase cache, localStorage 북마크 동작을 깨지 않는다.
- `cacheKey`는 `local:${serviceId}` 또는 `national:${serviceId}` 형식을 사용한다.
- 집계 이벤트는 `cacheKey`가 없으면 조용히 skip한다.
- BE 인기 목록은 `title`, `summary`, `link`, `region`, `target`, `category`를 포함한다.
- FE 인기 목록은 BE 결과 우선, 실패/빈 결과 시 기존 `welfareInsights` fallback을 유지한다.
- 테스트를 먼저 추가하고 실패를 확인한 뒤 production code를 수정한다.

---

### Task 1: FE cacheKey model

**Files:**
- Modify: `D:\ms\welfare-map-fe\src\types\welfare.ts`
- Modify: `D:\ms\welfare-map-fe\src\lib\welfare\cache.ts`
- Modify: `D:\ms\welfare-map-fe\app\api\welfare\local\route.ts`
- Modify: `D:\ms\welfare-map-fe\app\api\welfare\national\route.ts`
- Test: `D:\ms\welfare-map-fe\scripts\test-welfare-cache.mjs`

**Interfaces:**
- Produces: `WelfareItem.source?: 'local' | 'national'`, `WelfareItem.cacheKey?: string`.
- Produces: `toWelfareCacheRow(item, source)` and `fromWelfareCacheRow(row)` preserve `cacheKey`.

- [ ] Add failing Node tests asserting local/national cache rows round-trip `source` and `cacheKey`.
- [ ] Run `node --test scripts/test-welfare-cache.mjs` and verify the new assertions fail.
- [ ] Add `source` and `cacheKey` to `WelfareItem`.
- [ ] Ensure local/national API normalization sets `source` and `cacheKey`.
- [ ] Run `node --test scripts/test-welfare-cache.mjs` and verify pass.

### Task 2: BE popular projection response

**Files:**
- Create: `D:\ms\welfare-map-be\src\main\java\com\welfareMap\popular\dto\PopularServiceProjection.java`
- Modify: `D:\ms\welfare-map-be\src\main\java\com\welfareMap\popular\dto\PopularServiceDto.java`
- Modify: `D:\ms\welfare-map-be\src\main\java\com\welfareMap\popular\repository\PopularServiceStatsRepository.java`
- Modify: `D:\ms\welfare-map-be\src\main\java\com\welfareMap\popular\service\PopularServiceFacade.java`
- Test: `D:\ms\welfare-map-be\src\test\java\com\welfareMap\popular\dto\PopularServiceDtoTests.java`

**Interfaces:**
- Produces: `PopularServiceDto` fields `title`, `summary`, `link`, `region`, `target`, `category`.
- Produces: `findTopProjectedByScore(int limit)` native query joining `popular_services` and `welfare_services`.

- [ ] Add failing DTO test proving projection fields map into `PopularServiceDto`.
- [ ] Run `.\gradlew.bat test --tests com.welfareMap.popular.dto.PopularServiceDtoTests` and verify failure.
- [ ] Add projection interface and DTO mapper.
- [ ] Change top-list service path to use projection query.
- [ ] Run targeted BE test and verify pass.

### Task 3: FE popular API client and fallback

**Files:**
- Create: `D:\ms\welfare-map-fe\src\lib\popular\client.ts`
- Create: `D:\ms\welfare-map-fe\scripts\test-popular-client.mjs`
- Modify: `D:\ms\welfare-map-fe\src\components\PopularList\index.tsx`

**Interfaces:**
- Produces: `PopularServiceItem` type for BE popular response.
- Produces: `normalizePopularItems(items)` converting BE response to display rows.
- Produces: `fetchPopularServices(limit?: number)` returning `PopularServiceItem[]`.

- [ ] Add failing Node test for `normalizePopularItems`.
- [ ] Run `node --test scripts/test-popular-client.mjs` and verify failure.
- [ ] Implement `src/lib/popular/client.ts`.
- [ ] Update `PopularList` to fetch BE top list in `useEffect`, use BE items when present, fallback to existing `insights`.
- [ ] Run Node popular client test and `npm run lint`.

### Task 4: FE interaction tracking

**Files:**
- Create: `D:\ms\welfare-map-fe\src\lib\popular\tracking.ts`
- Create: `D:\ms\welfare-map-fe\scripts\test-popular-tracking.mjs`
- Modify: `D:\ms\welfare-map-fe\src\components\WelfareCard\index.tsx`
- Modify: `D:\ms\welfare-map-fe\src\components\WelfareList\index.tsx`

**Interfaces:**
- Produces: `trackPopularInteraction(cacheKey, type, fetcher?)` where `type` is `view | click | save`.
- Produces: `WelfareCard` fires `click` on detail link and `save` on save button.
- Produces: `WelfareList` fires `view` once per visible `cacheKey` page.

- [ ] Add failing Node tests for skip-without-cacheKey and URL encoding behavior.
- [ ] Run `node --test scripts/test-popular-tracking.mjs` and verify failure.
- [ ] Implement tracking helper.
- [ ] Wire `WelfareCard` click/save events.
- [ ] Wire `WelfareList` visible-page view events with duplicate guard.
- [ ] Run tracking test and `npm run lint`.

### Task 5: Verification, docs, commit, push

**Files:**
- Modify: `D:\ms\welfare-map-fe\PROJECT.md`

**Verification:**
- FE: `node --test scripts/test-welfare-cache.mjs scripts/test-popular-client.mjs scripts/test-popular-tracking.mjs`
- FE: `npm run lint`
- FE: `npm run build`
- BE: `.\gradlew.bat test`

- [ ] Update `PROJECT.md` with 2026.07.01 popular integration work.
- [ ] Run all verification commands.
- [ ] Commit FE changes.
- [ ] Commit BE changes.
- [ ] Push branches.
