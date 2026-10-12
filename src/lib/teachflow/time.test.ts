import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { planDeadlineReminder, reconcileDecision } from "./reminders.ts";
import { inQuietWindow, shiftOutOfQuiet, zonedWallTimeToUtc } from "./time.ts";

describe("time zones", () => {
  it("converts India wall time to UTC", () => {
    const utc = zonedWallTimeToUtc("2026-01-15", "10:00", "Asia/Kolkata");
    assert.equal(utc.toISOString(), "2026-01-15T04:30:00.000Z");
  });

  it("moves a late reminder to the end of quiet hours", () => {
    const late = zonedWallTimeToUtc("2026-01-15", "22:30", "Asia/Kolkata");
    const shifted = shiftOutOfQuiet(late, "Asia/Kolkata", "21:00", "07:00");
    assert.equal(shifted.toISOString(), "2026-01-16T01:30:00.000Z");
  });

  it("leaves a school-day reminder where it is", () => {
    const noon = zonedWallTimeToUtc("2026-01-15", "12:00", "Asia/Kolkata");
    const shifted = shiftOutOfQuiet(noon, "Asia/Kolkata", "21:00", "07:00");
    assert.equal(shifted.toISOString(), noon.toISOString());
  });

  it("detects a quiet window that crosses midnight", () => {
    assert.equal(inQuietWindow(22 * 60, "21:00", "07:00"), true);
    assert.equal(inQuietWindow(12 * 60, "21:00", "07:00"), false);
    assert.equal(inQuietWindow(6 * 60, "21:00", "07:00"), true);
  });
});

describe("reminder plans", () => {
  it("schedules before the due time and cancels a stale plan", () => {
    const plan = planDeadlineReminder({
      scope: "task",
      id: "task-1",
      dueDate: "2026-01-15",
      dueTime: "16:00",
      remind: true,
      leadMinutes: 60,
      timeZone: "Asia/Kolkata",
      quietStart: "21:00",
      quietEnd: "07:00",
      fallbackTime: "16:00",
    });
    assert.ok(plan);
    assert.equal(plan.fireAtIso, "2026-01-15T09:30:00.000Z");
    const decision = reconcileDecision(
      [
        { idempotencyKey: "task:task-1:at:old:lead:60", status: "scheduled" },
        { idempotencyKey: plan.idempotencyKey, status: "delivered" },
      ],
      plan,
    );
    assert.deepEqual(decision.cancelKeys, ["task:task-1:at:old:lead:60"]);
    assert.equal(decision.insert, null);
  });

  it("does not schedule twice for the same due time", () => {
    const plan = planDeadlineReminder({
      scope: "task",
      id: "task-1",
      dueDate: "2026-01-15",
      dueTime: "16:00",
      remind: true,
      leadMinutes: 60,
      timeZone: "UTC",
      quietStart: "21:00",
      quietEnd: "07:00",
      fallbackTime: "16:00",
    });
    const again = reconcileDecision([{ idempotencyKey: plan!.idempotencyKey, status: "scheduled" }], plan);
    assert.deepEqual(again.cancelKeys, []);
    assert.equal(again.insert, null);
  });

  it("cancels reminders when the teacher turns them off", () => {
    const decision = reconcileDecision(
      [{ idempotencyKey: "task:task-1:at:x:lead:60", status: "snoozed" }],
      null,
    );
    assert.deepEqual(decision.cancelKeys, ["task:task-1:at:x:lead:60"]);
    assert.equal(decision.insert, null);
  });
});
