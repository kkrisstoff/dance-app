import type { StatusCode, StudentStatus } from "@/lib/studentStatus";

/**
 * Every Ukrainian sentence the app shows lives here. Business code
 * (src/lib/studentStatus.ts, src/server/*) returns facts only — status
 * codes, counts, dates — and never builds text. A future English catalog
 * is a second file with this same shape.
 */

// "заняття" / "заняття" / "занять" depending on count (uk plural rules: one, few, many)
function sessionWord(n: number): string {
  const form = new Intl.PluralRules("uk").select(n);
  switch (form) {
    case "one":
      return "заняття";
    case "few":
      return "заняття";
    default:
      return "занять";
  }
}

// "2026-10-15" -> "15.10.2026"
function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function describeStatus(status: StudentStatus): { label: string; sublabel: string } {
  switch (status.code) {
    case "no_package":
      return { label: "Немає абонементу", sublabel: "Зверніться до викладача" };
    case "expired":
      return {
        label: `${status.remaining} ${sessionWord(status.remaining!)} залишилось`,
        sublabel: `Термін дії минув ${formatDate(status.expiresAt!)}`,
      };
    case "empty":
      return {
        label: "0 занять",
        sublabel: `Абонемент дійсний до ${formatDate(status.expiresAt!)}`,
      };
    case "low":
    case "valid":
      return {
        label: `${status.remaining} ${sessionWord(status.remaining!)} залишилось`,
        sublabel: `Дійсний до ${formatDate(status.expiresAt!)}`,
      };
  }
}

const statusBadge: Record<StatusCode, string> = {
  valid: "Активний",
  low: "Мало занять",
  empty: "Заняття відсутні",
  expired: "Термін минув",
  no_package: "Немає абонементу",
};

const deductBlockedReason: Record<StatusCode, string> = {
  valid: "",
  low: "",
  empty: "Немає доступних занять",
  expired: "Термін дії абонементу минув",
  no_package: "Спочатку додайте абонемент",
};

export const uk = {
  app: {
    defaultStudioName: "Студія танців",
    description: "Система обліку занять",
  },
  scan: {
    title: "Сканер",
    description: "Наведіть камеру на QR-код студента",
    cameraError: "Не вдалося відкрити камеру",
    unrecognized: "Цей QR-код не належить студенту",
  },
  student: {
    labelAboveName: "Студент",
    total: (total: number) => `Всього: ${total} ${sessionWord(total)}`,
    deducted: (count: number) => `Списано: ${count}`,
  },
  action: {
    deduct: "Списати заняття",
  },
  deduct: {
    alreadyToday: "Сьогодні заняття вже списано",
    noPackage: "Спочатку додайте абонемент",
    expired: "Термін дії абонементу минув",
    empty: "Немає доступних занять",
  },
  nav: {
    scanNext: "← Сканувати наступного",
    backToScan: "← Назад до сканера",
  },
  notFound: {
    title: "Студента не знайдено",
    checkQrOrLink: "Перевірте QR-код або посилання",
    checkLink: "Перевірте посилання",
  },
  qr: {
    instruction: "Покажіть цей QR-код викладачу",
    alt: "QR-код для викладача",
  },
  api: {
    studentNotFound: "Студента не знайдено",
  },
  // TODO: Temporary fix for demo mode
  readOnly: {
    notice: "Демо-версія: дані лише для перегляду",
    blocked: "У демо-версії змінювати дані не можна",
  },
  admin: {
    title: "Адміністрування",
    studentList: "Студенти",
    addStudent: "Додати студента",
    studentName: "Ім'я студента",
    namePlaceholder: "Введіть ім'я",
    save: "Зберегти",
    cancel: "Скасувати",
    payment: "Оплата",
    addSessions: "Додати заняття",
    sessionsCount: "Кількість занять",
    sessionsPlaceholder: "Наприклад, 8",
    recordPayment: "Записати оплату",
    paymentRecorded: "Оплату записано",
    packageUpdated: (remaining: number, expiresAt: string) =>
      `${remaining} ${sessionWord(remaining)} до ${formatDate(expiresAt)}`,
    qrLink: "Посилання для студента",
    copyLink: "Копіювати",
    linkCopied: "Скопійовано!",
    noStudents: "Студентів ще немає",
    backToList: "← До списку",
    studentCreated: "Студента створено",
    validationNameRequired: "Введіть ім'я студента",
    validationSessionsRequired: "Вкажіть кількість занять",
    validationSessionsPositive: "Кількість має бути більше 0",
  },
  statusBadge,
  deductBlockedReason,
  describeStatus,
};
