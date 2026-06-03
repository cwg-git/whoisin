# Client Request Status

This note tracks the comments from the client brief and the current implementation state.

## Completed

- Frontend navigation is shifted toward the Barcelona/Spanish-first experience.
- `Contact` is replaced by `Subscriptions` in the live routing.
- `Today` is reduced to an events/calendar-focused page.
- Maps now default to Barcelona instead of Lebanon.
- The CMS page flow in the admin app now supports HTML content storage and React-friendly API output.
- The page API returns both the stored HTML and a transformed version with React-style attributes such as `className`.
- The home page now includes direct entries for `Hoy`, `Esta semana`, `Agenda`, `Fiestas Mayor`, and `Festivales`.

## Intentionally Deferred

- Facebook and Instagram sourcing were left out on purpose, per the latest instruction to skip those points until after live.

## Still Open

- RSS source tuning for event categorization, location correction, and image-only event extraction.
- Festival and Fiestas Mayor editorial content still needs final manual data.
- Build/runtime verification is not fully complete because the frontend build folder hit local write permission issues during verification.

## Why These Changes

- The client wants Barcelona-first public pages, with events taking priority over blog-style content in the main experience.
- The page builder work is meant to preserve rich HTML in storage while making API output easier for a React frontend to consume.
- Maps and calendars are being aligned to Barcelona so live event content does not keep falling back to Lebanon defaults.

## Key Files

- Frontend shell: `src/components/Header.jsx`, `src/components/Footer.jsx`
- Home and calendar pages: `src/pages/Home.jsx`, `src/pages/Today.jsx`, `src/pages/TodayCalender.jsx`
- Map defaults: `src/components/PostsMap.jsx`, `src/pages/MapsByCategorie.jsx`
- Route aliases: `src/controller/RouteRedirect.jsx`
- Admin page API: `C:\wamp64\www\whoisinadmin\app\Http\Controllers\API\PageApiController.php`

