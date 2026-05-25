import type { TabInfo } from "../shared/types";

/**
 * 合并逻辑：将所有标签页移动到当前活动窗口，关闭空窗口。
 *
 * 规则：
 * - 找到当前活动窗口（用户正在用的那个）
 * - 其他窗口的标签页全部移到当前窗口
 * - 移完后关闭空窗口
 * - 返回移动和关闭操作的元信息
 */
export async function mergeWindows(
  allTabs: TabInfo[],
  currentWindowId: number
): Promise<{ movedCount: number; closedWindowIds: number[] }> {
  // 找出需要移动的标签页（不在当前窗口的）
  const tabsToMove = allTabs.filter((t) => t.windowId !== currentWindowId);
  const tabIdsToMove = tabsToMove.map((t) => t.id);

  let movedCount = 0;
  if (tabIdsToMove.length > 0) {
    try {
      await chrome.tabs.move(tabIdsToMove, { windowId: currentWindowId, index: -1 });
      movedCount = tabIdsToMove.length;
    } catch {
      // 某些标签页可能在移动前已被关闭，跳过
    }
  }

  // 找出需要检查的窗口（有标签页被移走的窗口）
  const otherWindowIds = new Set(
    allTabs
      .filter((t) => t.windowId !== currentWindowId)
      .map((t) => t.windowId)
  );

  const closedWindowIds: number[] = [];
  for (const windowId of otherWindowIds) {
    try {
      const tabs = await chrome.tabs.query({ windowId });
      if (tabs.length === 0) {
        await chrome.windows.remove(windowId);
        closedWindowIds.push(windowId);
      }
    } catch {
      // 窗口可能已被 Chrome 自动关闭，跳过
    }
  }

  return { movedCount, closedWindowIds };
}
