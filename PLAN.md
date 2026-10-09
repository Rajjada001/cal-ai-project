# Cal AI Clone — Spec & Implementation Plan

## Context
A Cal AI-style calorie tracker. The user photographs a meal (or describes it, or enters it by hand), and an AI model estimates calories and macros. Results are personalised against daily targets that come from an onboarding questionnaire. The project already contains the default Expo SDK 57 template (expo 57.0.x, React Native 0.86.3, React 19.2.3, TypeScript 6, Expo Router, routes in `src/app/`). Building on it starts only once the user says go. Follow `CLAUDE.md` / `AGENTS.md`: always add packages with `npx expo install`, check the v57 docs before using any Expo API, and run lint and typecheck before declaring work done. The template's demo screens (`src/app/explore.tsx`, the sample components) get replaced via `npm run reset-project` or removed by hand in Phase 0.

---

## 1. Spec summary

### Product & scope
- **Users:** individuals who want to lose, maintain or gain weight. Free in v1.
- **Must do well:** photo → accurate, editable macro breakdown within seconds, without blocking the user.
- **In v1:** onboarding → plan reveal → sign-up (Clerk with Google and Apple); Home with calorie and macro rings, a week/day date strip, the meal list, a streak, and weight logging with a progress chart; logging by camera, gallery, text description or manual entry; an itemised, editable result; a Profile screen to edit info, targets and units; dark mode; a "streak at risk" push; account deletion; English only, with strings ready for i18n.
- **Out of v1:** payments and paywall (a `plan` field exists for later), barcode scanning, "fix with AI", meal reminders and "analysis done" push notifications, Apple Health and Google Fit, product analytics, web, staging environment, E2E tests, translations.

### Core flows
1. **First launch:** onboarding screens collect sex, birthdate, height, weight, activity level, goal (lose/maintain/gain), target weight, weekly pace and unit system. Answers are kept in a persisted Zustand store. Next comes the "Building your plan…" animation, then a plan reveal. The targets shown there are calculated on the device by the shared `calculateTargets()` function.
2. **Sign-up:** Clerk with Google or Apple. Then `POST /api/onboarding` sends the raw answers. The server recalculates the targets (it is the source of truth) and stores the profile and targets. Once the server confirms, the local store is cleared, and the user lands on Home.
3. **Returning user:** a Clerk session exists, so `GET /api/me` runs. If onboarding is complete → Home. Otherwise → resume onboarding.
4. **Scan:**
   1. The user takes or picks a photo, which is resized on the device (about 1024px JPEG).
   2. The app calls `GET /api/imagekit/auth` and uploads directly to ImageKit at `/users/{userId}/meals/`.
   3. The app calls `POST /api/meals` with a client-generated UUID. The server reserves quota, inserts a `pending` meal, and calls `tasks.trigger('analyze-meal', …, { idempotencyKey: mealId })`.
   4. The app returns to Home, where the card shows "Analyzing…", updated via Realtime or polling.
   5. The card completes, and tapping it opens the itemised detail where the user can edit.
5. **Text log:** same pipeline as a photo scan, without an image. **Manual entry:** saved directly as `completed` with no AI and no quota use.
6. **Failure:** the task retries transient errors 3 times with backoff. If the image isn't food or it still fails, the meal becomes `failed` with a reason, the quota is refunded, and the card offers Retry / Enter manually / Delete.
7. **Profile:** edit body stats, goal and activity (targets are recalculated unless the user has custom targets), override targets manually, switch units, toggle notifications, sign out, delete account.

### Data model (Drizzle, Postgres on Neon). All weights in kg, heights in cm, times stored in UTC.
- **users:** `id uuid pk`, `clerk_user_id unique`, `email`, `timezone` (IANA), `unit_system` (metric|imperial), `plan` (default 'free'), `onboarded_at`, `expo_push_token`, `streak_nudges_enabled`, `last_streak_nudge_date`, timestamps.
- **profiles** (1:1 users): `sex`, `birthdate`, `height_cm`, `current_weight_kg`, `activity_level`, `goal`, `target_weight_kg`, `weekly_rate_kg`, `raw_answers jsonb`.
- **nutrition_targets:** `user_id`, `calories`, `protein_g`, `carbs_g`, `fat_g`, `source` (calculated|custom), `effective_from date`. Rows are append-only, so the rings for past days use the targets that applied on that day.
- **meals:** `id uuid pk` (generated on the client, which makes requests idempotent), `user_id`, `status` (pending|analyzing|completed|failed), `source` (camera|gallery|text|manual), `name`, `text_input`, `image_file_id`, `image_path`, `eaten_at timestamptz`, `local_date date`, totals (`calories`, `protein_g`, `carbs_g`, `fat_g`), `ai_confidence`, `ai_model`, `ai_raw jsonb`, `failure_reason`, `trigger_run_id`, timestamps. Index on `(user_id, local_date)`.
- **meal_items:** `id`, `meal_id` (cascade), `name`, `quantity`, `unit`, `serving_multiplier`, `calories`, `protein_g`, `carbs_g`, `fat_g`, `position`. Meal totals are always recalculated from the items on the server.
- **weight_logs:** `id`, `user_id`, `weight_kg`, `local_date`, `logged_at`. Unique on `(user_id, local_date)`, upserted. The latest entry updates `profiles.current_weight_kg`.
- **ai_daily_usage:** `user_id`, `local_date`, `count`. Primary key on `(user_id, local_date)`. A conditional upsert reserves quota (`count < AI_DAILY_LIMIT`, default 5), and a failed meal decrements the count.
- All foreign keys reference `users` with `ON DELETE CASCADE`.

### Architecture
- **Single Expo project** (**SDK 57 / React Native 0.86.3 / React 19.2.3**, already installed), Expo Router, TypeScript.
- **API:** Expo Router API routes (`src/app/api/**+api.ts`) deployed to **EAS Hosting**. Each route verifies the Clerk session JWT with `@clerk/backend` and validates input with zod. Business logic lives in `src/server/*`, so route handlers stay thin.
- **Database:** Neon Postgres via `@neondatabase/serverless` and Drizzle, with drizzle-kit migrations. The schema in `src/db/schema.ts` is shared by the API and Trigger.dev tasks.
- **Background jobs:** Trigger.dev tasks in `src/trigger/` (deployed separately with `trigger.config.ts`):
  - `analyze-meal`: loads the meal, builds a signed ImageKit URL with a resize transform, and calls the OpenAI vision model with a Structured Outputs JSON schema (`isFood`, `mealName`, `items[]`, `confidence`). It validates the result with zod, writes the items and totals, and sets the status. It is idempotent: it exits early if the meal is already `completed`.
  - `streak-nudge`: a scheduled task that runs hourly. It finds users whose local time is about 20:00, who have a streak of 1 or more, nothing logged today, and `last_streak_nudge_date` ≠ today, and sends them a push through the Expo Push API.
  - `delete-user-data`: deletes the user's ImageKit folder and the Clerk user. It retries until it succeeds.
- **AI:** OpenAI vision model. The model name lives in an env var (`OPENAI_MODEL`); the current recommended vision model is to be checked against OpenAI docs at implementation time. The prompt asks for realistic portion estimates and English food names.
- **Images:** ImageKit private files, uploaded directly from the client with a signature from our API. The API checks that the submitted `image_path` starts with that user's folder. Images are displayed via short-lived signed URLs with thumbnail transforms.
- **Client:**
  - **Server data:** TanStack Query, with optimistic updates for edits and deletes. While any meal is pending, the app refetches it.
  - **Onboarding answers:** a persisted Zustand store (MMKV or AsyncStorage).
  - **Styling and theming:** NativeWind (version compatible with the SDK, checked at init), with dark mode via the system scheme.
  - **Strings:** all strings live in `src/i18n/en.ts`.
- **Observability:** Sentry in the app (`@sentry/react-native` with the Expo config plugin), API routes, and Trigger.dev tasks (init in the config, report in `onFailure`). Every log is tagged with the user id; no PII is logged and images are not sent to Sentry. Alerts: task failure rate, API 5xx, crash-free sessions.
- **Webhooks:** `POST /api/webhooks/clerk` (verified with svix) handles `user.deleted` and triggers the same cleanup as in-app deletion. Users are created lazily on the first authenticated call (`/api/me` or `/api/onboarding`), so there is no dependency on a `user.created` webhook.

### API surface (all routes need auth except the webhook)
`GET/PATCH /api/me` · `DELETE /api/me` · `POST /api/onboarding` · `PUT /api/targets` · `GET /api/imagekit/auth` · `POST /api/meals` (photo/text/manual) · `GET /api/meals?date=` · `GET/PATCH/DELETE /api/meals/:id` · `POST /api/meals/:id/retry` · `GET /api/summary?date=` (rings, streak, quota left) · `GET /api/days?from=&to=` (date-strip dots) · `GET/POST/DELETE /api/weights` · `PUT /api/push-token` · `POST /api/webhooks/clerk`

### Proposed layout
```
src/app/(onboarding)/…   src/app/(auth)/sign-in.tsx   src/app/(app)/(tabs)/{index,profile}.tsx
src/app/(app)/scan.tsx   src/app/(app)/meal/[id].tsx   src/app/(app)/weight.tsx   src/app/api/**+api.ts
src/db/{schema,client}.ts   src/server/{auth,meals,quota,targets,imagekit,users}.ts
src/lib/nutrition.ts (shared calculateTargets)   src/lib/ai-schema.ts (zod)
src/trigger/{analyze-meal,streak-nudge,delete-user-data}.ts   trigger.config.ts
src/features/*   src/components/*   src/i18n/en.ts
```

---

## 2. Assumptions (no firm answer was given; easy to change)
- **A1:** Targets use Mifflin-St Jeor. Macros by goal: protein about 1.8–2.2 g/kg, fat about 25% of calories, carbs make up the rest. Safety floors: 1200 kcal (female), 1500 kcal (male). Weekly pace is capped at about 1% of body weight.
- **A2:** "Sex" offers male/female (for the formula), plus an option that uses the average of the two.
- **A3:** The quota counts per user's local day, using the timezone the device sends. Pending meals count, so bursts can't get around the cap.
- **A4:** A streak means consecutive local days with at least one completed meal. The nudge is sent at 20:00 local time, at most once a day, and is opt-in via the OS permission prompt shown after the first logged meal.
- **A5:** Weight logging allows one entry per day (re-logging overwrites it). The chart shows the last 30/90 days alongside the target weight.
- **A6:** A user can change `eaten_at` (and therefore the day) when editing a meal.
- **A7:** Meal images are kept until the meal or the account is deleted. No other retention policy.
- **A8:** Live status updates use Trigger.dev Realtime hooks if they work in React Native (see R1). Otherwise, TanStack Query polls `GET /api/meals/:id` every 2s while the meal is pending (giving up after 2 minutes).
- **A9:** Environments are dev and prod. Each environment gets its own Neon branch and its own Clerk, Trigger.dev, ImageKit and Sentry project. Builds and over-the-air updates use EAS Build and EAS Update. GitHub Actions runs typecheck, lint and unit tests. The user still needs to say where the repo is hosted.
- **A10:** No deadline was given. The phases below are ordered so the app can be demoed early.

## 3. Open risks / unknowns
- **R1:** `@trigger.dev/react-hooks` documentation is only for web React, and React Native support is unverified. A spike in Phase 0 will test it, with polling (A8) as the fallback.
- **R2:** EAS Hosting runs on a Workers-style runtime. Still to confirm: compatibility of the Neon serverless driver, `@clerk/backend`, the ImageKit Node SDK (signing may need Web Crypto), and Sentry in that runtime. Fallback: hand-roll the HMAC signing for ImageKit.
- **R3:** The OpenAI model name and pricing are unverified (search results were unreliable). Confirm on platform.openai.com before implementing.
- **R4:** AI portion estimates are inherently imprecise. To keep trust, editing must be quick, and low-confidence results should show a hint.
- **R5:** Apple review requirements: Sign in with Apple (included), in-app account deletion (included), a privacy policy URL, and accurate "Nutrition / Health & Fitness" privacy labels. Apple sign-in on Android goes through a web-based OAuth flow, which needs to be tested.
- **R6:** Sign-in needs Clerk's native modules, so Expo Go won't work and a development build is required from day one.
- **R7:** NativeWind and Expo SDK 57 compatibility is unverified. Check the NativeWind installation docs at init.
- **R8:** Clock and timezone edge cases: travel, midnight boundaries, and the hourly cron matching "20:00" across half-hour offsets.
- **R9:** Health-adjacent data (weight, body stats) is personal data. It needs a privacy policy, encryption at rest (Neon default) and TLS. GDPR deletion is covered by account deletion.

---

## 4. Implementation phases
0. **Spikes and setup:** clean out the template's demo screens (Expo is already initialised), dev build, NativeWind, Sentry, env handling. Spike R1 and R2.
1. **Data and backend foundation:** Drizzle schema and migrations on a Neon dev branch, Clerk auth helper, `/api/me`, the shared `calculateTargets()` with unit tests.
2. **Onboarding and auth:** onboarding screens, persisted store, "Building your plan…" animation, plan reveal, Clerk Google and Apple sign-in, `POST /api/onboarding`, route guards.
3. **Logging pipeline:** camera and gallery capture with resize, ImageKit signed upload, `POST /api/meals` with quota, the `analyze-meal` task with OpenAI Structured Outputs, status updates, failure card and retry. Then text and manual entry.
4. **Home:** rings, date strip, meal list with Analyzing/failed states, meal detail with item editing, `/api/summary`, `/api/days`, streak.
5. **Profile and weight:** profile editing, target override, units, weight log and chart, dark mode polish.
6. **Push and deletion:** push token registration, the `streak-nudge` scheduled task, account deletion, the Clerk webhook, and the `delete-user-data` task.
7. **Hardening and release:** Sentry alerts, empty, loading and error states, offline messaging, GitHub Actions CI, EAS Build profiles, prod environment setup, store metadata and privacy policy.

## 5. Verification
- **Unit tests (Jest):**
  - `calculateTargets` across sexes, goals and units
  - AI response zod parsing, including malformed and not-food responses
  - quota reserve and refund
  - meal total recalculation
  - API handlers for auth rejection and ownership checks (user A cannot read or edit B's meal or image path)
- **Task tests:** run `analyze-meal` locally with `npx trigger.dev dev` against fixture images (a plate of food, a non-food photo, a blurry photo). Then check the DB state and that re-triggering with the same idempotency key does nothing.
- **Manual end-to-end on iOS and Android dev builds:**
  - fresh install → onboarding → sign-up → targets stored and matching the reveal
  - scan → Analyzing card → completed → edit an item → totals update
  - a 6th scan gets blocked
  - airplane mode mid-upload shows an error
  - delete account → rows, images and the Clerk user are all removed
- **Observability check:** a forced error in the app, the API and a task each shows up in Sentry with the user id and no PII.
