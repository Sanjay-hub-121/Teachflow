import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/tf/shell";

export const Route = createFileRoute("/app")({ component: AppShell });
