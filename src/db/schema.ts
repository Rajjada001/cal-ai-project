import {
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  boolean,
} from 'drizzle-orm/pg-core';

// Weights are stored in kg, heights in cm, timestamps in UTC.

export const unitSystemEnum = pgEnum('unit_system', ['metric', 'imperial']);
export const sexEnum = pgEnum('sex', ['male', 'female', 'other']);
export const activityLevelEnum = pgEnum('activity_level', [
  'sedentary',
  'light',
  'moderate',
  'active',
  'very_active',
]);
export const goalEnum = pgEnum('goal', ['lose', 'maintain', 'gain']);
export const targetSourceEnum = pgEnum('target_source', ['calculated', 'custom']);
export const mealStatusEnum = pgEnum('meal_status', [
  'pending',
  'analyzing',
  'completed',
  'failed',
]);
export const mealSourceEnum = pgEnum('meal_source', [
  'camera',
  'gallery',
  'text',
  'manual',
]);

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

const num = (name: string, precision: number, scale: number) =>
  numeric(name, { precision, scale, mode: 'number' });

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkUserId: text('clerk_user_id').notNull().unique(),
  email: text('email'),
  timezone: text('timezone').notNull().default('UTC'), // IANA name
  unitSystem: unitSystemEnum('unit_system').notNull().default('metric'),
  plan: text('plan').notNull().default('free'),
  onboardedAt: timestamp('onboarded_at', { withTimezone: true }),
  expoPushToken: text('expo_push_token'),
  streakNudgesEnabled: boolean('streak_nudges_enabled').notNull().default(true),
  lastStreakNudgeDate: date('last_streak_nudge_date'),
  ...timestamps,
});

export const profiles = pgTable('profiles', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  sex: sexEnum('sex').notNull(),
  birthdate: date('birthdate').notNull(),
  heightCm: num('height_cm', 5, 1).notNull(),
  currentWeightKg: num('current_weight_kg', 5, 2).notNull(),
  activityLevel: activityLevelEnum('activity_level').notNull(),
  goal: goalEnum('goal').notNull(),
  targetWeightKg: num('target_weight_kg', 5, 2),
  weeklyRateKg: num('weekly_rate_kg', 4, 2),
  rawAnswers: jsonb('raw_answers'),
  ...timestamps,
});

// Append-only: past days use the targets that applied on that day.
export const nutritionTargets = pgTable(
  'nutrition_targets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    calories: integer('calories').notNull(),
    proteinG: integer('protein_g').notNull(),
    carbsG: integer('carbs_g').notNull(),
    fatG: integer('fat_g').notNull(),
    source: targetSourceEnum('source').notNull().default('calculated'),
    effectiveFrom: date('effective_from').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('nutrition_targets_user_effective_idx').on(t.userId, t.effectiveFrom)],
);

export const meals = pgTable(
  'meals',
  {
    // Generated on the client so requests are idempotent.
    id: uuid('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: mealStatusEnum('status').notNull().default('pending'),
    source: mealSourceEnum('source').notNull(),
    name: text('name'),
    textInput: text('text_input'),
    imageFileId: text('image_file_id'),
    imagePath: text('image_path'),
    eatenAt: timestamp('eaten_at', { withTimezone: true }).notNull().defaultNow(),
    localDate: date('local_date').notNull(),
    calories: integer('calories').notNull().default(0),
    proteinG: num('protein_g', 7, 1).notNull().default(0),
    carbsG: num('carbs_g', 7, 1).notNull().default(0),
    fatG: num('fat_g', 7, 1).notNull().default(0),
    aiConfidence: num('ai_confidence', 4, 3),
    aiModel: text('ai_model'),
    aiRaw: jsonb('ai_raw'),
    failureReason: text('failure_reason'),
    triggerRunId: text('trigger_run_id'),
    ...timestamps,
  },
  (t) => [index('meals_user_local_date_idx').on(t.userId, t.localDate)],
);

export const mealItems = pgTable(
  'meal_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    mealId: uuid('meal_id')
      .notNull()
      .references(() => meals.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    quantity: num('quantity', 8, 2).notNull().default(1),
    unit: text('unit'),
    servingMultiplier: num('serving_multiplier', 6, 3).notNull().default(1),
    calories: integer('calories').notNull(),
    proteinG: num('protein_g', 7, 1).notNull().default(0),
    carbsG: num('carbs_g', 7, 1).notNull().default(0),
    fatG: num('fat_g', 7, 1).notNull().default(0),
    position: integer('position').notNull().default(0),
  },
  (t) => [index('meal_items_meal_idx').on(t.mealId)],
);

export const weightLogs = pgTable(
  'weight_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    weightKg: num('weight_kg', 5, 2).notNull(),
    localDate: date('local_date').notNull(),
    loggedAt: timestamp('logged_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('weight_logs_user_date_uniq').on(t.userId, t.localDate)],
);

export const aiDailyUsage = pgTable(
  'ai_daily_usage',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    localDate: date('local_date').notNull(),
    count: integer('count').notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.userId, t.localDate] })],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NutritionTarget = typeof nutritionTargets.$inferSelect;
export type Meal = typeof meals.$inferSelect;
export type MealItem = typeof mealItems.$inferSelect;
export type WeightLog = typeof weightLogs.$inferSelect;
