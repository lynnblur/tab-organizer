import { describe, it, expect } from "vitest";
import { deduplicateTabs } from "../../src/background/deduplicator";
import type { TabInfo } from "../../src/shared/types";

function makeTab(id: number, url: string, lastAccessed: number): TabInfo {
  return { id, url, title: "", lastAccessed, windowId: 1 };
}

describe("deduplicateTabs", () => {
  it("keeps all tabs when no duplicates", () => {
    const tabs = [
      makeTab(1, "https://example.com/a", 100),
      makeTab(2, "https://example.com/b", 200),
    ];
    const { keep, closeIds } = deduplicateTabs(tabs);
    expect(keep.length).toBe(2);
    expect(closeIds).toEqual([]);
  });

  it("keeps the most recently accessed tab among duplicates", () => {
    const tabs = [
      makeTab(1, "https://example.com/page", 100),
      makeTab(2, "https://example.com/page", 300),
      makeTab(3, "https://example.com/page", 200),
    ];
    const { keep, closeIds } = deduplicateTabs(tabs);
    expect(keep.length).toBe(1);
    expect(keep[0].id).toBe(2); // lastAccessed=300 is newest
    expect(closeIds).toEqual(expect.arrayContaining([1, 3]));
  });

  it("skips about:blank tabs", () => {
    const tabs = [
      makeTab(1, "about:blank", 100),
      makeTab(2, "https://example.com", 200),
    ];
    const { keep, closeIds } = deduplicateTabs(tabs);
    expect(keep.length).toBe(1);
    expect(closeIds).toEqual([]);
  });

  it("handles mixed duplicates and uniques", () => {
    const tabs = [
      makeTab(1, "https://a.com", 100),
      makeTab(2, "https://a.com", 300),
      makeTab(3, "https://b.com", 200),
    ];
    const { keep, closeIds } = deduplicateTabs(tabs);
    expect(keep.length).toBe(2);
    expect(closeIds).toEqual([1]);
  });
});
