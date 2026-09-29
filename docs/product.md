# Product rules

This file is the source of truth for how the product behaves. The studio owner and the coding agent both follow it. If the app and this file disagree, fix the app or change this file on purpose. Do not keep a second copy of these rules.

`plan.md` is only the build order. It does not override this file.

## What this is

A phone tool for a dance studio. It replaces manual tracking of who has paid sessions left.

During class, a teacher identifies one student and immediately sees whether that student has a valid paid package.

Someone at the studio records that a student has paid, by adding the sessions they bought. The app does not take money. There is no payment system in this version.

It is not a CRM, an accounting system, a schedule, or a social network.

## People

- **Admin.** Adds a student. When that student has paid, adds the sessions they bought and shares the student's QR link. Does not scan in class and does not deduct a session.
- **Teacher.** Uses the app in class. Scans one student, reads the status, and may deduct one session. Does not add students or sessions.
- **Student.** Opens a personal page on their own phone and shows a QR code. The student does not edit their package.

There is one admin and one teacher in this version. There is no login. The admin area and the teacher screens are not linked from the student page. The teacher's home screen is the scanner, not the admin area.

The interface is Ukrainian.

The studio name is a per-deployment setting, not part of the product. The app works for any studio.

## Class flow

This is the whole in-class path. It must stay fast, because it repeats for every arrival.

1. The student opens their personal link and shows the QR code.
2. The teacher scans that code with the phone camera.
3. The teacher sees only that student: name, sessions left, and whether the package is still valid.
4. The teacher may deduct one session for this class.

The teacher home screen is the scanner. It does not list students. A directory or search is the admin's tool for finding a student to update. It is not part of class.

## Admin flow

The admin does this outside class, after the studio has already received the money.

1. Add a student, or open an existing one.
2. Enter how many sessions that student just paid for.
3. The app sets the package end date. The admin does not type it.
4. Share that student's personal link so they can show the QR code.

"Add classes" means add those paid sessions. It does not mean a timetable or a list of class times.

No price is stored. Recording the sessions is the record that the money was received.

## Screens

| Screen | Who | What it shows |
|---|---|---|
| `/scan` | Teacher | Camera. After a successful scan, open that one student's card. |
| `/student/{id}` | Teacher | One student's status, and the deduct action when it is allowed. `{id}` is the student's UUID. |
| `/s/{id}` | Student | That student's name and a QR code. The QR opens `/student/{id}`. No package editing. |
| Admin area | Admin | Add a student. Add paid sessions. Copy that student's link. A list is allowed here so the admin can find the student. |

An unknown code says the student was not found. It does not show anyone else.

## Status the teacher must understand at a glance

Use the active package only. Dates are calendar dates.

| Situation | Meaning | Deduct |
|---|---|---|
| 3 or more sessions, date still valid | Valid package | Allowed |
| 1 or 2 sessions, date still valid | Low balance | Allowed |
| 0 sessions, date still valid | No sessions left | Blocked |
| Date has passed | Package expired, even if sessions remain | Blocked |
| No active package | Student exists, nothing to consume | Blocked |
| Unknown code | Not a student in this studio | No card |

Expired wins over the session count. A package that ended yesterday with 3 sessions left is expired, not valid.

## Packages

A package is a number of sessions and an end date. It is not unlimited and it does not last forever.

The admin enters only the number of sessions just paid for. The app sets the end date to one calendar month after that payment date. A payment on 26 September is valid through 26 October.

- A student has at most one active package.
- Deducting a session does not move the end date.
- Editing the student's name, or anything else that is not a payment, does not move the end date.
- If the student has an active package that has not expired, a new payment adds the new sessions to the ones still left, and sets the end date to one calendar month from this payment.
- If there is no package, or the current one is already expired, the payment starts a new package. Remaining sessions are the ones just paid for. The end date is one calendar month from this payment. Sessions left on an expired package are not carried over.
- Zero sessions and an expired date are different problems. Both block deduction.

## Deducting a session

The teacher has one clear action: deduct one session for this class.

When deduction is built, it must follow these rules:

- No active package: do not deduct.
- Zero sessions left: do not deduct.
- Expired package: do not deduct. The admin records a new payment first. There is no force-deduct on an expired package.
- The same student and the same calendar day: treat it as already deducted. A second class on the same day is out of scope.
- Each successful deduction reduces the remaining sessions by one and is stored as attendance for that package and that date.

Manual corrections, undo, and a full attendance history are not required for the first version. The data should still be stored so they can be added later.

## Identification

The student uses their own phone. No cards, NFC tags, or other hardware.

The chosen method is a personal link. The address is `/s/{id}`, where `{id}` is the student's UUID. The student bookmarks it. The page shows a QR code. The teacher scans that code.

A UUID is hard to guess, so one student cannot find another student's page by guessing addresses.

Known risk: the link is the only protection. Anyone who already has the link can open it and show that student's QR code. The app does not bind the page to one phone. After a scan, the teacher sees the student's name and is expected to notice if the person in front of them is someone else.

Instagram and other identities are not part of this version.

## Not in this version

Do not build these unless this file is updated first:

- Taking payment inside the app, payment amounts, or payment history
- Class schedules or multiple class types
- A catalog of package products
- Student search on the teacher scanner, or a class-time student list
- Notifications, reports, analytics
- Several admins or several teachers
- Login or passwords
- Student self-registration

The admin area must not replace the scanner as the teacher's home screen.
