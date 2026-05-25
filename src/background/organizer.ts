import type { TabInfo, TabGroup, OrganizeReport } from "../shared/types";
import { deduplicateTabs } from "./deduplicator";
import { groupTabs } from "./grouper";
import { mergeWindows } from "./merger";

/**
 * 主整理流程：
 *  1. 获取所有标签页和窗口
 *  2. 去重
 *  3. 合并窗口
 *  4. 按域名分组
 *  5. 创建标签页组
 *  6. 返回整理报告
 */
export async function organize(currentWindowId?: number): Promise<OrganizeReport> {
  // 1. 获取所有标签页
  const allTabs = await chrome.tabs.query({});
  const tabsBefore = allTabs.length;

  const tabs: TabInfo[] = allTabs.map((t) => ({
    id: t.id!,
    url: t.url || "",
    title: t.title || "",
    lastAccessed: t.lastAccessed || Date.now(),
    windowId: t.windowId,
  }));

  // 2. 去重
  const { closeIds } = deduplicateTabs(tabs);

  if (closeIds.length > 0) {
    try {
      await chrome.tabs.remove(closeIds);
    } catch {
      // 某些标签页可能在处理前已被关闭，跳过
    }
  }

  // 3. 获取当前窗口 ID
  const targetWindowId = currentWindowId ?? (await chrome.windows.getCurrent()).id!;

  // 4. 合并窗口
  const tabsAfterDedup = (await chrome.tabs.query({})).map((t) => ({
    id: t.id!,
    url: t.url || "",
    title: t.title || "",
    lastAccessed: t.lastAccessed || Date.now(),
    windowId: t.windowId,
  }));
  const { movedCount, closedWindowIds } = await mergeWindows(tabsAfterDedup, targetWindowId);

  // 5. 重新查询并分组
  let tabsForGrouping: TabInfo[];
  try {
    const mergedTabs = await chrome.tabs.query({ windowId: targetWindowId });
    tabsForGrouping = mergedTabs.map((t) => ({
      id: t.id!,
      url: t.url || "",
      title: t.title || "",
      lastAccessed: t.lastAccessed || Date.now(),
      windowId: t.windowId,
    }));
  } catch {
    // 目标窗口可能已被关闭，改用全部标签页
    const allTabsFallback = await chrome.tabs.query({});
    tabsForGrouping = allTabsFallback.map((t) => ({
      id: t.id!,
      url: t.url || "",
      title: t.title || "",
      lastAccessed: t.lastAccessed || Date.now(),
      windowId: t.windowId,
    }));
  }

  const groups = groupTabs(tabsForGrouping);

  // 6. 创建标签页组
  for (const group of groups) {
    if (group.tabIds.length === 0) continue;

    try {
      const groupId = await chrome.tabs.group({ tabIds: group.tabIds });
      await chrome.tabGroups.update(groupId, {
        title: group.name,
        color: group.color,
      });
    } catch {
      // 某些标签页可能已被关闭或无法分组，跳过
    }
  }

  const tabsAfter = tabsBefore - closeIds.length;

  return {
    groupsCreated: groups.length,
    duplicatesClosed: closeIds.length,
    windowsMerged: closedWindowIds.length,
    totalTabsBefore: tabsBefore,
    totalTabsAfter: tabsAfter,
  };
}
