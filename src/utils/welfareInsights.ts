import { WelfareItem } from '@/types/welfare';

export type WelfareInsightTone = 'urgent' | 'new' | 'default';

export interface RankedWelfareItem extends WelfareItem {
  dday: number | null;
  isRecent: boolean;
  normalizedCategory: string;
  insightTone: WelfareInsightTone;
  insightBadge: string;
  score: number;
}

export interface WelfareCategoryStat {
  label: string;
  count: number;
  ratio: number;
}

export interface WelfareInsights {
  totalCount: number;
  urgentCount: number;
  newCount: number;
  regionalCount: number;
  categoryCount: number;
  recommendedItems: RankedWelfareItem[];
  urgentItems: RankedWelfareItem[];
  newItems: RankedWelfareItem[];
  categoryStats: WelfareCategoryStat[];
}

const URGENT_WINDOW_DAYS = 30;
const RECENT_WINDOW_DAYS = 30;

const CATEGORY_RULES = [
  { label: '의료/건강', keys: ['의료', '건강', '검진', '보건', '병원'] },
  { label: '주거/생활', keys: ['주거', '전세', '월세', '생활', '생계', '에너지'] },
  { label: '교육/보육', keys: ['교육', '보육', '아동', '영유아', '학교', '학습'] },
  { label: '취업/일자리', keys: ['취업', '일자리', '창업', '구직', '고용'] },
  { label: '돌봄/상담', keys: ['돌봄', '상담', '장애', '노인', '가족'] },
] as const;

function parseYmd(value?: string): Date | null {
  if (!value || !/^\d{8}$/.test(value)) return null;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getDday(applyEndDd?: string, now = new Date()): number | null {
  const deadline = parseYmd(applyEndDd);
  if (!deadline) return null;
  const diff = startOfDay(deadline).getTime() - startOfDay(now).getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export function isRecentService(lastModYmd?: string, now = new Date(), windowDays = RECENT_WINDOW_DAYS): boolean {
  const modifiedAt = parseYmd(lastModYmd);
  if (!modifiedAt) return false;
  const diff = startOfDay(now).getTime() - startOfDay(modifiedAt).getTime();
  const days = Math.round(diff / (1000 * 60 * 60 * 24));
  return days >= 0 && days <= windowDays;
}

export function normalizeCategory(category = ''): string {
  const normalized = category.replace(/\s+/g, '');
  const matched = CATEGORY_RULES.find((rule) => rule.keys.some((key) => normalized.includes(key)));
  return matched?.label ?? '기타';
}

function getInsightBadge(item: WelfareItem, dday: number | null, isRecent: boolean) {
  if (dday !== null && dday >= 0 && dday <= 7) return `D-${dday}`;
  if (dday !== null && dday >= 0 && dday <= URGENT_WINDOW_DAYS) return '마감 예정';
  if (isRecent) return '신규';
  if (item.region && item.region !== '전국') return '지역 맞춤';
  return item.category?.split(',')[0]?.trim() || '복지';
}

function scoreItem(item: WelfareItem, dday: number | null, isRecent: boolean) {
  let score = 0;
  if (item.region && item.region !== '전국') score += 24;
  if (dday !== null && dday >= 0 && dday <= 7) score += 60;
  else if (dday !== null && dday >= 0 && dday <= URGENT_WINDOW_DAYS) score += 42;
  if (isRecent) score += 26;
  if (item.summary) score += 6;
  if (item.target && item.target !== '전체') score += 4;
  return score;
}

function rankItems(items: WelfareItem[], now: Date): RankedWelfareItem[] {
  return items
    .map((item) => {
      const dday = item.isAlways ? null : getDday(item.applyEndDd, now);
      const isRecent = isRecentService(item.lastModYmd, now);
      const insightTone: WelfareInsightTone =
        dday !== null && dday >= 0 && dday <= URGENT_WINDOW_DAYS ? 'urgent' : isRecent ? 'new' : 'default';

      return {
        ...item,
        dday,
        isRecent,
        normalizedCategory: normalizeCategory(item.category),
        insightTone,
        insightBadge: getInsightBadge(item, dday, isRecent),
        score: scoreItem(item, dday, isRecent),
      };
    })
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'ko'));
}

function buildCategoryStats(items: RankedWelfareItem[]): WelfareCategoryStat[] {
  const counts = new Map<string, number>();
  items.forEach((item) => counts.set(item.normalizedCategory, (counts.get(item.normalizedCategory) ?? 0) + 1));

  const max = Math.max(...counts.values(), 1);
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count, ratio: Math.round((count / max) * 100) }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'ko'));
}

export function buildWelfareInsights(items: WelfareItem[], now = new Date()): WelfareInsights {
  const rankedItems = rankItems(items, now);
  const urgentItems = rankedItems
    .filter((item) => item.dday !== null && item.dday >= 0 && item.dday <= URGENT_WINDOW_DAYS)
    .sort((a, b) => (a.dday ?? 9999) - (b.dday ?? 9999));
  const newItems = rankedItems
    .filter((item) => item.isRecent)
    .sort((a, b) => (b.lastModYmd ?? '').localeCompare(a.lastModYmd ?? ''));
  const regionalCount = rankedItems.filter((item) => item.region && item.region !== '전국').length;
  const categoryStats = buildCategoryStats(rankedItems);

  return {
    totalCount: rankedItems.length,
    urgentCount: urgentItems.length,
    newCount: newItems.length,
    regionalCount,
    categoryCount: categoryStats.length,
    recommendedItems: rankedItems.slice(0, 8),
    urgentItems: urgentItems.slice(0, 8),
    newItems: newItems.slice(0, 8),
    categoryStats: categoryStats.slice(0, 5),
  };
}
