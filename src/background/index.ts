import { organize } from "./organizer";
import { report } from "./reporter";

// 点击工具栏图标 → 整理
chrome.action.onClicked.addListener(async () => {
  try {
    const result = await organize();
    await report(result);
  } catch (err) {
    console.error("[Tab Organizer] organize failed:", err);
  }
});

// 快捷键 Ctrl+Shift+O / Cmd+Shift+O → 整理
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "organize") {
    try {
      const result = await organize();
      await report(result);
    } catch (err) {
      console.error("[Tab Organizer] organize failed:", err);
    }
  }
});
