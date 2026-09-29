# Dance studio app

Smartphone app for a dance studio: a teacher opens a student, sees package status, later deducts a session.

The studio name comes from the `STUDIO_NAME` environment variable. Without it the app shows a generic name.

The teacher screens and the admin area ask for a password in the browser's own prompt. Set `TEACHER_PASSWORD` and `ADMIN_PASSWORD`. Any username works. If a password is not set, its screens return an error instead of opening.

## Local

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Open http://localhost:3000. Local data comes from `dance.db` (not committed).

## Demo host (UI first)

Push this repo to GitHub and import it in [Vercel](https://vercel.com). Set `TEACHER_PASSWORD` and `ADMIN_PASSWORD`. Set `STUDIO_NAME` to show the customer's studio name.

On Vercel the app uses built-in demo students, so the screens work on a phone before a database is connected. Locally it keeps using SQLite.

Try:

- `/scan` — teacher home. Camera comes later. This screen does not list students.
- `/admin` — student list. Each student link uses that student's UUID.

## Where to change things

| Change | File |
|---|---|
| Status rules (valid, low, empty, expired) | `src/lib/studentStatus.ts` |
| Colors and labels | `src/components/student/statusTheme.ts` |
| Teacher card layout | `src/components/student/StudentStatusCard.tsx` |
| How a student is loaded | `src/server/students.ts` |
| Local database | `src/db/schema.ts` |

Pages and API routes call `getStudentById`. They do not import the database driver. The next database (Turso) is a new file behind that function.
