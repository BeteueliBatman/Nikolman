import { projectCategoryKeys } from "@/lib/siteContent";
import type { ProjectCategoryKey } from "@/lib/db/types";

export const projectCategoryOptions = projectCategoryKeys.filter(
  (key) => key !== "all"
) as ProjectCategoryKey[];
