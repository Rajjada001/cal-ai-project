Generate a complete modern mobile app UI design system and screen designs for an AI calorie tracking app called "CalScan".

CalScan is a photo-first calorie tracker. The user photographs a meal, picks one from their gallery, or describes it in a sentence. An AI vision model breaks it into individual food items with portion sizes, calories, protein, carbs and fat. The meal is logged against a personalized daily target built from a short onboarding questionnaire. The core loop: capture food → get an itemized, editable breakdown in seconds → stay on target → watch your weight move toward your goal.

The app helps users:
- log meals with a photo, a gallery image, a short text description ("two eggs and toast with butter"), or quick manual entry
- see an itemized breakdown of each meal (e.g. "Grilled chicken · 150 g", "Rice · 1 cup") and fix any item's portion or numbers
- hit a personalized daily calorie target and protein / carbs / fat targets
- lose, maintain or gain weight at a chosen weekly pace
- log their weight once a day and see progress toward a target weight
- keep a daily logging streak
- review any past day, with each day's targets as they were on that day
- override their calculated targets with custom ones

Design style:
- ultra modern 2026 consumer app aesthetic
- minimalist, lots of whitespace, calm
- light mode first, with a full dark mode version of every screen
- clean layouts, even spacing, premium mobile design
- large friendly numbers: the data is the hero, not the chrome
- rounded corners, soft shadows, subtle depth
- no glassmorphism, except optionally on the camera overlay
- food photography is the only saturated color on screen
- Apple Health / Apple Fitness level of polish, but warmer and friendlier
- NOT cluttered, NOT gamified-cartoon, NOT a bodybuilding or macro-nerd spreadsheet
- feels effortless and trustworthy, like logging a meal takes three seconds

Color palette:
- warm off-white / soft paper backgrounds in light mode
- near-black warm charcoal backgrounds in dark mode
- true black primary text, medium warm grey secondary text
- one confident accent for the calorie ring and primary CTAs
- three distinct, muted macro colors for protein / carbs / fat, used the same way everywhere they appear
- one soft amber "low confidence" hint tone, separate from the error tone
- one soft warning/error tone for failed analyses and destructive actions
- premium cards with hairline borders in light mode and raised surfaces in dark mode
- charts and rings drawn with smooth rounded caps and no gridline clutter

Typography:
- clean geometric sans-serif
- Apple-like hierarchy: oversized bold numerals, tight semibold headings, quiet small caps for labels
- tabular figures for all numbers, so values don't jitter as they update
- easy to read at a glance while holding the phone in one hand

Design system to define first (before the screens):
- color tokens for light and dark, with semantic names (background, surface, surface-elevated, text-primary, text-secondary, accent, protein, carbs, fat, warning, danger, border)
- type scale with sizes, weights and line heights
- 4pt spacing scale and corner radius scale
- component library: primary / secondary / ghost buttons, segmented control, text and numeric inputs, multiline text input, unit toggle (metric/imperial), stepper, serving-multiplier control (½×, 1×, 1.5×, 2×, custom), selection cards, chips, list rows, toggle switch, bottom sheet, action sheet, modal, toast, skeleton loader, empty state, circular calorie progress ring, three small macro rings, horizontal week date strip with "logged" dots, meal card, food item row, confidence hint pill, weight line chart, quota pill ("3 of 5 AI scans left today")
- bottom tab bar: Home and Profile, with a prominent center "+" / camera button that opens a log-method sheet
- icon style: single-weight rounded line icons

Screens to design:

1. Splash screen
   - CalScan logo, minimal branding, no spinner

2. Welcome screen
   - short, confident headline about photographing food instead of searching for it
   - clean visual: a plate turning into an itemized list of numbers
   - primary "Get started" CTA and a quiet "I already have an account" link

3. Onboarding questionnaire (one question per screen; back arrow and slim progress bar at the top; large question; big tap targets; one primary CTA pinned to the bottom)
   - unit system: metric / imperial (asked first, so every following screen uses it)
   - sex: male / female / prefer not to say (with a small note that it's used only for the calorie formula)
   - date of birth (native-feeling wheel picker)
   - height and weight
   - activity level: sedentary / light / moderate / very active, each with a one-line description
   - goal: lose weight / maintain / gain weight
   - target weight (wheel or slider, showing the difference from current weight); skipped for "maintain"
   - weekly pace: slow / recommended / fast, showing kg or lb per week and an estimated goal date, with a gentle capped-pace note if the user picks something aggressive

4. "Building your plan" screen
   - full-screen generation state, calm and confident
   - animated progress with short reassuring status lines ("Calculating your metabolism…", "Balancing your macros…")
   - takes several seconds on purpose and must not feel broken

5. Plan reveal screen
   - the emotional payoff: a big daily calorie number
   - protein / carbs / fat targets as three cards with their macro colors
   - estimated date to reach the target weight
   - one-line explanation of how the plan was calculated
   - a note that targets can be changed later
   - "Save my plan" CTA that leads into account creation

6. Authentication
   - sign up: "Continue with Apple" and "Continue with Google" (native buttons, no email/password form)
   - sign in: the same two buttons
   - one line of small legal text with Terms and Privacy links
   - a "Saving your plan…" state after sign-in while the account is being set up
   - an error state if saving fails, with retry

7. Home dashboard (the screen users open ten times a day)
   - week date strip at the top: today selected, small dots under days that have logged meals, swipe to earlier weeks, future days dimmed and not tappable
   - streak indicator (flame + number of consecutive days logged)
   - large circular calorie ring with calories remaining as the main number, and eaten / target as a secondary line
   - three smaller macro rings for protein / carbs / fat, each showing grams left
   - quota pill showing the AI scans left today
   - compact weight card: current weight, change toward the target, "Log weight" action
   - "Today's meals" list: photo thumbnail (or a text/manual icon when there's no photo), meal name, time, calories, small macro summary
   - empty state for a day with no meals, inviting the first photo
   - a meal card in the "Analyzing…" state: shimmering skeleton, with the thumbnail already visible
   - a meal card in the failed state: "Couldn't identify this" with Retry / Enter manually / Delete
   - a past completed day (targets shown as they were that day)
   - the state after the daily AI quota is used up: scan actions disabled with a friendly "Resets at midnight · you can still add manually"

8. Log method sheet (opened from the center tab button)
   - four large options: Take photo, Choose from gallery, Describe it, Enter manually
   - the AI scans left today shown quietly in the sheet

9. Camera capture screen
   - full-bleed live camera preview
   - minimal overlay: subtle framing guide, close button, flash toggle, gallery picker
   - one large shutter button
   - short hint: "Point at your meal"
   - camera permission request screen, and a permission-denied screen with a link to Settings
   - right after capture: the frozen photo with an uploading indicator, then dismissing back to Home where the Analyzing card appears
   - an upload-failed state (e.g. offline) with retry

10. Describe-a-meal screen
    - one large multiline input with a placeholder example
    - optional time-eaten picker
    - "Analyze" CTA; afterwards it follows the same Analyzing → completed flow as a photo

11. Manual entry screen
    - meal name, calories, protein, carbs, fat as large numeric fields
    - time eaten
    - no AI, saved instantly (and doesn't use any quota)

12. Meal detail screen
    - large meal photo at the top (or a tasteful header for text/manual meals)
    - meal name, time eaten (editable, so a meal can move to another day), total calories
    - protein / carbs / fat totals
    - itemized list of food items: name, quantity + unit, calories, macros
    - a low-confidence hint banner when the AI wasn't sure ("Portions are estimates, double-check them")
    - item edit sheet: serving multiplier, quantity, and calories and macros for that item; meal totals update live
    - add item, remove item
    - delete meal, with a confirmation sheet
    - failed-analysis variant: the reason ("This doesn't look like food"), plus Retry / Enter manually / Delete

13. Weight screen
    - large current weight, change since starting, distance to target
    - line chart with 30 / 90 day toggle and a dashed target-weight line
    - "Log today's weight" sheet with a wheel or numeric input (re-logging the same day replaces that day's entry)
    - history list with swipe-to-delete
    - empty state before the first entry

14. Profile screen
    - name, avatar, current streak, member since
    - current daily targets summarized, with a "Calculated" or "Custom" tag and an edit button
    - edit body stats sheet: height, weight, birthdate, sex, activity level, goal, target weight, pace
    - edit targets sheet: custom calories and macros, plus a "Reset to recommended" option
    - a subtle "Recalculating your targets…" state after body stats are edited
    - units preference (metric/imperial)
    - "Streak reminders" toggle
    - sign out
    - delete account as a quiet destructive row, with a serious confirmation screen explaining that all meals, photos and data will be permanently removed

15. Notification permission prompt
    - shown once, after the first meal is logged
    - soft pre-permission screen explaining a single evening "Don't lose your streak" reminder, with "Turn on" and "Not now"
    - a mock of the lock-screen notification itself

16. System states to design once and reuse
    - skeleton loaders for the rings, weight card and meal list
    - offline / no-connection banner
    - generic error state with retry
    - success toast after saving an edit
    - a slow-network version of the analyzing state ("Still working on it…")

Do NOT design: paywall or subscription screens, barcode scanning, food database search, "fix with AI" chat, water tracking, exercise or calories-burned tracking, Apple Health / Google Fit connection screens, social or sharing features, XP or level systems, other languages, or any web or tablet layout.

Design it like a real App Store product that a solo founder shipped and 100k people use every day. Every screen must share the same tokens, spacing and components: one design system, not sixteen pretty pictures. Show light and dark mode for the key screens: Welcome, Plan reveal, Home, Camera, Meal detail, Weight and Profile.

Deliver high-quality iPhone-style mockups with realistic safe areas, status bars and home indicators, and honest spacing. The Home dashboard and the capture → analyzing → itemized-result loop are the product, so put the most care there.

The UI should feel effortless, trustworthy, quietly premium and fast, and satisfying enough that logging a meal becomes a habit.
