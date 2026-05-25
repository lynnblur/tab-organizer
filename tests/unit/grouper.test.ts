import { describe, it, expect } from "vitest";
import { groupTabs } from "../../src/background/grouper";
import type { TabInfo } from "../../src/shared/types";

function makeTab(id: number, url: string, lastAccessed: number): TabInfo {
  return { id, url, title: "", lastAccessed, windowId: 1 };
}

describe("groupTabs", () => {
  it("groups tabs by domain", () => {
    const tabs = [
      makeTab(1, "https://google.com/search", 100),
      makeTab(2, "https://github.com/abc", 200),
      makeTab(3, "https://google.com/maps", 300),
    ];
    const groups = groupTabs(tabs);
    expect(groups.length).toBe(2);
    const googleGroup = groups.find((g) => g.name === "Google")!;
    expect(googleGroup.tabIds).toEqual([1, 3]);
  });

  it("sorts tabs within group by lastAccessed ascending", () => {
    const tabs = [
      makeTab(1, "https://example.com/c", 300),
      makeTab(2, "https://example.com/a", 100),
      makeTab(3, "https://example.com/b", 200),
    ];
    const groups = groupTabs(tabs);
    expect(groups.length).toBe(1);
    expect(groups[0].tabIds).toEqual([2, 3, 1]);
  });

  it("sorts groups by their earliest tab", () => {
    const tabs = [
      makeTab(1, "https://beta.com", 300),
      makeTab(2, "https://alpha.com", 100),
      makeTab(3, "https://gamma.com", 200),
    ];
    const groups = groupTabs(tabs);
    expect(groups[0].name).toBe("Alpha");
    expect(groups[1].name).toBe("Gamma");
    expect(groups[2].name).toBe("Beta");
  });

  it("assigns different colors to different groups", () => {
    const tabs = [
      makeTab(1, "https://a.com", 100),
      makeTab(2, "https://b.com", 200),
    ];
    const groups = groupTabs(tabs);
    expect(groups[0].color).not.toBe(groups[1].color);
  });

  it("skips about:blank tabs", () => {
    const tabs = [
      makeTab(1, "about:blank", 100),
      makeTab(2, "https://example.com", 200),
    ];
    const groups = groupTabs(tabs);
    expect(groups.length).toBe(1);
  });

  it("returns empty array for no valid tabs", () => {
    const tabs = [makeTab(1, "about:blank", 100)];
    const groups = groupTabs(tabs);
    expect(groups).toEqual([]);
  });

  it("handles single tab", () => {
    const tabs = [makeTab(1, "https://example.com", 100)];
    const groups = groupTabs(tabs);
    expect(groups.length).toBe(1);
    expect(groups[0].tabIds).toEqual([1]);
  });
});
