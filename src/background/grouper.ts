import type { TabInfo, TabGroup } from "../shared/types";
import { extractDomain, getGroupTitle } from "../shared/domain";
import { GROUP_COLORS, GROUP_COLOR_COUNT } from "../shared/constants";

/**
 * 分组逻辑：按域名对标签页分组。
 *
 * 规则：
 * - 按 extractDomain 提取域名
 * - 同一域名的标签页按打开顺序（lastAccessed 升序）排列
 * - 分配组名和颜色
 * - 组的顺序按该组最先打开的标签页排列
 */
export function groupTabs(tabs: TabInfo[]): TabGroup[] {
  const groups = new Map<string, TabInfo[]>();

  for (const tab of tabs) {
    if (!tab.url || tab.url === "about:blank" || tab.url.startsWith("about:")) {
      continue;
    }
    const domain = extractDomain(tab.url);
    const list = groups.get(domain);
    if (list) {
      list.push(tab);
    } else {
      groups.set(domain, [tab]);
    }
  }

  // 组内按打开顺序排序（最早打开的在前）
  for (const [, list] of groups) {
    list.sort((a, b) => a.lastAccessed - b.lastAccessed);
  }

  // 组的顺序按该组最早打开的标签页排序
  const sortedEntries = Array.from(groups.entries()).sort(
    (a, b) => a[1][0].lastAccessed - b[1][0].lastAccessed
  );

  let colorIndex = 0;
  return sortedEntries.map(([domain, list]) => ({
    name: getGroupTitle(domain),
    color: GROUP_COLORS[colorIndex++ % GROUP_COLOR_COUNT],
    tabIds: list.map((t) => t.id),
  }));
}
