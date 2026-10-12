import { createServerFn } from "@tanstack/react-start";
import { hashPassword } from "better-auth/crypto";
import { authMiddleware } from "@/lib/auth/middleware";
import { AppError, rethrowKnown } from "../errors.ts";
import { isValidTimeZone, isHHMM } from "../time.ts";
import {
  db,
  hashRecovery,
  loadProfile,
  processDue,
  recoveryCode,
  sameHash,
} from "./common.ts";

const RECOVERY_ERROR = "Those details were not accepted, or there were too many tries. Wait a few minutes and try again.";

function passwordProblem(password: string): string | null {
  if (password.length < 10) return "Use at least 10 characters.";
  if (password.length > 128) return "That password is too long.";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Include at least one letter and one number.";
  return null;
}

export const ensureProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { timezone?: string } | undefined) => {
    const timezone = input?.timezone && isValidTimeZone(input.timezone) ? input.timezone : "UTC";
    return { timezone };
  })
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const users = await sql<{ name: string; email: string }>`
        select "name" as name, "email" as email from "user" where "id" = ${context.userId}`;
      const accounts = await sql<{ provider_id: string }>`
        select "providerId" as provider_id from "account" where "userId" = ${context.userId}`;
      const code = accounts.some((row) => row.provider_id === "credential") ? recoveryCode() : null;
      const inserted = await sql<{ user_id: string }>`
        insert into profiles (user_id, full_name, timezone, recovery_code_hash)
        values (${context.userId}, ${users[0]?.name ?? ""}, ${data.timezone}, ${code ? hashRecovery(code) : null})
        on conflict (user_id) do nothing
        returning user_id`;
      if (inserted.length) return { recoveryCode: code, email: users[0]?.email ?? "" };
      if (code) {
        const filled = await sql<{ user_id: string }>`
          update profiles set recovery_code_hash = ${hashRecovery(code)}, updated_at = now()
          where user_id = ${context.userId} and recovery_code_hash is null
          returning user_id`;
        if (filled.length) return { recoveryCode: code, email: users[0]?.email ?? "" };
      }
      return { recoveryCode: null, email: users[0]?.email ?? "" };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const getAccount = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      const sql = await db();
      const profile = await loadProfile(sql, context.userId);
      const users = await sql<{ email: string; name: string }>`
        select "email" as email, "name" as name from "user" where "id" = ${context.userId}`;
      const accounts = await sql<{ provider_id: string }>`
        select "providerId" as provider_id from "account" where "userId" = ${context.userId}`;
      return {
        email: users[0]?.email ?? "",
        hasPassword: accounts.some((row) => row.provider_id === "credential"),
        fullName: profile.full_name || users[0]?.name || "",
        institution: profile.institution,
        department: profile.department,
        designation: profile.designation,
        subjects: profile.subjects,
        grades: profile.grades,
        timezone: profile.timezone,
        workStart: profile.work_start,
        workEnd: profile.work_end,
        quietStart: profile.quiet_start,
        quietEnd: profile.quiet_end,
        reminderLeadMinutes: profile.reminder_lead_minutes,
        remindersEnabled: profile.reminders_enabled,
        docNote: profile.doc_note,
      };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const updateAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    fullName?: string;
    institution?: string;
    department?: string;
    designation?: string;
    subjects?: string;
    grades?: string;
    timezone?: string;
    workStart?: string;
    workEnd?: string;
    quietStart?: string;
    quietEnd?: string;
    reminderLeadMinutes?: number;
    remindersEnabled?: boolean;
    docNote?: string;
  }) => {
    const timezone = String(input.timezone ?? "UTC");
    if (!isValidTimeZone(timezone)) throw new AppError("Choose a valid time zone.");
    for (const value of [input.workStart, input.workEnd, input.quietStart, input.quietEnd]) {
      if (value && !isHHMM(value)) throw new AppError("Working hours and quiet hours use 24-hour HH:MM times.");
    }
    const lead = Number(input.reminderLeadMinutes ?? 60);
    if (!Number.isFinite(lead) || lead < 0 || lead > 10080) throw new AppError("Reminder lead time looks off.");
    const clip = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);
    return {
      fullName: clip(input.fullName, 120),
      institution: clip(input.institution, 160),
      department: clip(input.department, 120),
      designation: clip(input.designation, 120),
      subjects: clip(input.subjects, 240),
      grades: clip(input.grades, 160),
      timezone,
      workStart: input.workStart && isHHMM(input.workStart) ? input.workStart : "08:00",
      workEnd: input.workEnd && isHHMM(input.workEnd) ? input.workEnd : "16:00",
      quietStart: input.quietStart && isHHMM(input.quietStart) ? input.quietStart : "21:00",
      quietEnd: input.quietEnd && isHHMM(input.quietEnd) ? input.quietEnd : "07:00",
      reminderLeadMinutes: Math.round(lead),
      remindersEnabled: input.remindersEnabled !== false,
      docNote: clip(input.docNote, 400),
    };
  })
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const updated = await sql`
        update profiles set
          full_name = ${data.fullName},
          institution = ${data.institution},
          department = ${data.department},
          designation = ${data.designation},
          subjects = ${data.subjects},
          grades = ${data.grades},
          timezone = ${data.timezone},
          work_start = ${data.workStart},
          work_end = ${data.workEnd},
          quiet_start = ${data.quietStart},
          quiet_end = ${data.quietEnd},
          reminder_lead_minutes = ${data.reminderLeadMinutes},
          reminders_enabled = ${data.remindersEnabled},
          doc_note = ${data.docNote},
          updated_at = now()
        where user_id = ${context.userId}
        returning user_id`;
      if (!updated.length) throw new AppError("Your profile is not ready yet. Refresh the page.");
      if (data.fullName) {
        await sql`update "user" set "name" = ${data.fullName}, "updatedAt" = now() where "id" = ${context.userId}`;
      }
      return { ok: true as const };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const listSessions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      const sql = await db();
      const { auth } = await import("@/lib/auth/server");
      const { getRequest } = await import("@tanstack/react-start/server");
      const request = getRequest();
      let currentId: string | null = null;
      if (request) {
        const session = await auth.api.getSession({ headers: request.headers });
        currentId = session?.session?.id ?? null;
      }
      const rows = await sql<{ id: string; user_agent: string | null; created_at: unknown; expires_at: unknown }>`
        select "id" as id, "userAgent" as user_agent, "createdAt" as created_at, "expiresAt" as expires_at
        from "session" where "userId" = ${context.userId}
        order by "createdAt" desc`;
      return rows.map((row) => ({
        id: row.id,
        userAgent: row.user_agent ?? "Unknown device",
        createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
        expiresAt: row.expires_at instanceof Date ? row.expires_at.toISOString() : String(row.expires_at),
        current: row.id === currentId,
      }));
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const revokeSession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id?: string; others?: boolean }) => ({
    id: String(input.id ?? ""),
    others: Boolean(input.others),
  }))
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      if (data.others) {
        const { auth } = await import("@/lib/auth/server");
        const { getRequest } = await import("@tanstack/react-start/server");
        const request = getRequest();
        const session = request ? await auth.api.getSession({ headers: request.headers }) : null;
        const currentId = session?.session?.id ?? "";
        await sql`delete from "session" where "userId" = ${context.userId} and "id" <> ${currentId}`;
        return { ok: true as const };
      }
      if (!data.id) throw new AppError("Choose a session to sign out.");
      await sql`delete from "session" where "id" = ${data.id} and "userId" = ${context.userId}`;
      return { ok: true as const };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const rotateRecoveryCode = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      const sql = await db();
      const accounts = await sql<{ provider_id: string }>`
        select "providerId" as provider_id from "account" where "userId" = ${context.userId}`;
      if (!accounts.some((row) => row.provider_id === "credential")) {
        throw new AppError("Recovery codes are for email and password accounts.");
      }
      const code = recoveryCode();
      await sql`update profiles set recovery_code_hash = ${hashRecovery(code)}, updated_at = now() where user_id = ${context.userId}`;
      return { recoveryCode: code };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const deleteAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { email?: string }) => ({ email: String(input.email ?? "").trim().toLowerCase() }))
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const users = await sql<{ email: string }>`select "email" as email from "user" where "id" = ${context.userId}`;
      if (!users[0] || users[0].email.toLowerCase() !== data.email) {
        throw new AppError("Type the email on this account to confirm deletion.");
      }
      await sql`delete from "user" where "id" = ${context.userId}`;
      return { ok: true as const };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const resetWithRecoveryCode = createServerFn({ method: "POST" })
  .validator((input: { email?: string; code?: string; password?: string }) => {
    const email = String(input.email ?? "").trim().toLowerCase();
    const code = String(input.code ?? "").trim();
    const password = String(input.password ?? "");
    if (!email || !code || !password) throw new AppError("Email, recovery code, and a new password are required.");
    const problem = passwordProblem(password);
    if (problem) throw new AppError(problem);
    return { email, code, password };
  })
  .handler(async ({ data }) => {
    try {
      const sql = await db();
      const attempts = await sql<{ fails: number; locked_until: unknown }>`
        select fails, locked_until from recovery_attempts where email = ${data.email}`;
      const lockedUntil = attempts[0]?.locked_until ? new Date(String(attempts[0].locked_until)) : null;
      if (lockedUntil && lockedUntil.getTime() > Date.now()) return { ok: false as const, error: RECOVERY_ERROR };
      const baseFails = lockedUntil && lockedUntil.getTime() <= Date.now() ? 0 : (attempts[0]?.fails ?? 0);
      const users = await sql<{ id: string }>`select "id" as id from "user" where lower("email") = ${data.email}`;
      const profiles = users[0]
        ? await sql<{ recovery_code_hash: string | null }>`
            select recovery_code_hash from profiles where user_id = ${users[0].id}`
        : [];
      const actual = profiles[0]?.recovery_code_hash ?? hashRecovery("missing-code");
      const matches = Boolean(users[0] && profiles[0]?.recovery_code_hash && sameHash(actual, hashRecovery(data.code)));
      if (!matches) {
        const fails = baseFails + 1;
        const lock = fails >= 8 ? new Date(Date.now() + 15 * 60_000).toISOString() : null;
        await sql`insert into recovery_attempts (email, fails, locked_until) values (${data.email}, ${fails}, ${lock})
          on conflict (email) do update set fails = ${fails}, locked_until = ${lock}`;
        return { ok: false as const, error: RECOVERY_ERROR };
      }
      const hashed = await hashPassword(data.password);
      const updated = await sql`
        update "account" set "password" = ${hashed}, "updatedAt" = now()
        where "userId" = ${users[0].id} and "providerId" = 'credential'
        returning "id"`;
      if (!updated.length) return { ok: false as const, error: RECOVERY_ERROR };
      await sql`delete from "session" where "userId" = ${users[0].id}`;
      await sql`delete from recovery_attempts where email = ${data.email}`;
      return { ok: true as const, error: null };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const syncInbox = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      const sql = await db();
      const profile = await loadProfile(sql, context.userId);
      await processDue(sql, context.userId, profile.timezone);
      const rows = await sql<{ count: number }>`
        select count(*)::int as count from notifications where user_id = ${context.userId} and read_at is null`;
      return { unread: rows[0]?.count ?? 0, timezone: profile.timezone };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      const sql = await db();
      const profile = await loadProfile(sql, context.userId);
      await processDue(sql, context.userId, profile.timezone);
      const rows = await sql<{
        id: string;
        kind: string;
        title: string;
        body: string;
        href: string | null;
        reminder_id: string | null;
        read_at: unknown;
        created_at: unknown;
      }>`
        select id, kind, title, body, href, reminder_id, read_at, created_at
        from notifications where user_id = ${context.userId}
        order by created_at desc limit 80`;
      return rows.map((row) => ({
        id: row.id,
        kind: row.kind,
        title: row.title,
        body: row.body,
        href: row.href,
        reminderId: row.reminder_id,
        readAt: row.read_at instanceof Date ? row.read_at.toISOString() : row.read_at ? String(row.read_at) : null,
        createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      }));
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const markNotifications = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id?: string; all?: boolean }) => ({ id: String(input.id ?? ""), all: Boolean(input.all) }))
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      if (data.all) {
        await sql`update notifications set read_at = now() where user_id = ${context.userId} and read_at is null`;
      } else if (data.id) {
        await sql`update notifications set read_at = now() where id = ${data.id} and user_id = ${context.userId} and read_at is null`;
      }
      return { ok: true as const };
    } catch (error) {
      rethrowKnown(error);
    }
  });

export const snoozeReminder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id?: string; minutes?: number }) => {
    const allowed = [15, 60, 180, 1440];
    const minutes = allowed.includes(Number(input.minutes)) ? Number(input.minutes) : 60;
    const id = String(input.id ?? "");
    if (!id) throw new AppError("That reminder could not be found.");
    return { id, minutes };
  })
  .handler(async ({ context, data }) => {
    try {
      const sql = await db();
      const fireAt = new Date(Date.now() + data.minutes * 60_000).toISOString();
      const rows = await sql`
        update reminders set status = 'scheduled', fire_at = ${fireAt}, updated_at = now()
        where id = ${data.id} and user_id = ${context.userId} and status in ('scheduled', 'delivered', 'snoozed')
        returning id`;
      if (!rows.length) throw new AppError("That reminder could not be found.");
      return { ok: true as const };
    } catch (error) {
      rethrowKnown(error);
    }
  });
