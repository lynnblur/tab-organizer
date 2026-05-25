import { organize } from "../background/organizer";

const infoEl = document.getElementById("info")!;
const btnEl = document.getElementById("organizeBtn")! as HTMLButtonElement;
const resultEl = document.getElementById("result")!;

// 进入页面时显示标签页数量
chrome.tabs.query({}).then((tabs) => {
  infoEl.textContent = `当前打开 ${tabs.length} 个标签页`;
  btnEl.disabled = false;
});

// 点击整理
btnEl.addEventListener("click", async () => {
  btnEl.disabled = true;
  btnEl.classList.add("loading");
  btnEl.textContent = "整理中...";

  try {
    const r = await organize();
    let message: string;
    if (r.duplicatesClosed > 0 && r.groupsCreated > 0) {
      message = `已去除重复标签页 <span class="highlight">${r.duplicatesClosed}</span> 个，剩余 <span class="highlight">${r.totalTabsAfter}</span> 个标签页已分为 <span class="highlight">${r.groupsCreated}</span> 组`;
    } else if (r.groupsCreated > 0) {
      message = `剩余 <span class="highlight">${r.totalTabsAfter}</span> 个标签页已分为 <span class="highlight">${r.groupsCreated}</span> 组`;
    } else {
      message = "不需要整理，一切井井有条";
    }

    resultEl.innerHTML = `<strong>整理完成</strong><br>${message}`;
    resultEl.classList.remove("hidden");
    infoEl.textContent = `当前 ${r.totalTabsAfter} 个标签页 / ${r.groupsCreated} 个分组`;
  } catch (err) {
    resultEl.innerHTML = `<strong>整理失败</strong><br>${err}`;
    resultEl.classList.remove("hidden");
  } finally {
    btnEl.disabled = false;
    btnEl.classList.remove("loading");
    btnEl.textContent = "一键整理";
  }
});
