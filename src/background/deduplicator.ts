import type { TabInfo } from "../shared/types";

/**
 * 去重逻辑：检测相同 URL 的标签页，保留最近访问的，返回待关闭的 id 列表。
 *
 * 规则：
 * - 仅比较完整的 URL（含 hash 和 query string）
 * - URL 完全相同的视为重复
 * - 保留 lastAccessed 最近的标签页
 * - 没有 URL 的标签页（如新标签页页、about:blank）跳过
 */
export function deduplicateTabs(tabs: TabInfo[]): { keep: TabInfo[]; closeIds: number[] } {
  const seen = new Map<string, TabInfo>();
  const closeIds: number[] = [];

  for (const tab of tabs) {
    if (!tab.url || tab.url === "about:blank" || tab.url.startsWith("about:")) {
      continue;
    }

    const existing = seen.get(tab.url);
    if (!existing) {
      seen.set(tab.url, tab);
      continue;
    }

    // 保留最近访问的，关掉另一个
    if (tab.lastAccessed > existing.lastAccessed) {
      seen.set(tab.url, tab);
      closeIds.push(existing.id);
    } else {
      closeIds.push(tab.id);
    }
  }

  return { keep: Array.from(seen.values()), closeIds };
}
