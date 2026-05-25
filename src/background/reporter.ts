import type { OrganizeReport } from "../shared/types";

/**
 * 生成整理报告：显示徽章 + 通知
 */
export async function report(report: OrganizeReport): Promise<void> {
  // 徽章显示新的分组数
  const badgeText = String(report.groupsCreated);
  await chrome.action.setBadgeText({ text: badgeText });
  await chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });

  // 3 秒后清除徽章
  setTimeout(() => {
    chrome.action.setBadgeText({ text: "" });
  }, 3000);

  // 发送通知
  let message: string;
  if (report.duplicatesClosed > 0 && report.groupsCreated > 0) {
    message = `已去除重复标签页 ${report.duplicatesClosed} 个，剩余 ${report.totalTabsAfter} 个标签页已分为 ${report.groupsCreated} 组`;
  } else if (report.groupsCreated > 0) {
    message = `剩余 ${report.totalTabsAfter} 个标签页已分为 ${report.groupsCreated} 组`;
  } else {
    message = "不需要整理，一切井井有条";
  }

  await chrome.notifications.create({
    type: "basic",
    iconUrl: "src/icons/icon-128.png",
    title: "Tab Organizer",
    message,
  });
}
