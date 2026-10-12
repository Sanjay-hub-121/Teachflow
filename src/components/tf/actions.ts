import { toast } from "sonner";
import { errorText } from "@/lib/teachflow/errors";

export async function attempt<T>(work: () => Promise<T>, success?: string): Promise<T | null> {
  try {
    const value = await work();
    if (success) toast.success(success);
    return value;
  } catch (error) {
    toast.error(errorText(error));
    return null;
  }
}
