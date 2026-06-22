import { newsroomCategoryKeys, newsroomCompanyKeys } from "@/lib/siteContent";
import type { NewsroomCategoryKey, NewsroomCompanyKey } from "@/lib/db/types";

export const articleCategoryOptions = newsroomCategoryKeys.filter(
  (key) => key !== "all"
) as NewsroomCategoryKey[];

export const articleCompanyOptions = newsroomCompanyKeys.filter(
  (key) => key !== "all"
) as NewsroomCompanyKey[];
