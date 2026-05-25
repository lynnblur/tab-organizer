import { describe, it, expect } from "vitest";
import { extractDomain, getGroupTitle } from "../../src/shared/domain";

describe("extractDomain", () => {
  it("extracts domain from standard URL", () => {
    expect(extractDomain("https://www.google.com/search?q=hello")).toBe("google.com");
  });

  it("strips www prefix", () => {
    expect(extractDomain("https://www.github.com")).toBe("github.com");
  });

  it("handles subdomains", () => {
    expect(extractDomain("https://docs.google.com/document/d/1")).toBe("docs.google.com");
  });

  it("handles URL without www", () => {
    expect(extractDomain("https://example.com/page")).toBe("example.com");
  });

  it("returns 'other' for invalid URLs", () => {
    expect(extractDomain("about:blank")).toBe("other");
    expect(extractDomain("")).toBe("other");
    expect(extractDomain("chrome://settings")).toBe("other");
  });

  it("handles URLs with ports", () => {
    expect(extractDomain("http://localhost:3000/page")).toBe("localhost");
  });
});

describe("getGroupTitle", () => {
  it("capitalizes simple domain", () => {
    expect(getGroupTitle("google.com")).toBe("Google");
  });

  it("handles subdomains with reverse order", () => {
    expect(getGroupTitle("docs.google.com")).toBe("Google Docs");
  });

  it("handles multi-part subdomains with country TLD", () => {
    expect(getGroupTitle("support.example.co.uk")).toBe("Example Support");
  });

  it("handles single word domain", () => {
    expect(getGroupTitle("localhost")).toBe("Localhost");
  });

  it("returns 'other' for other domain", () => {
    expect(getGroupTitle("other")).toBe("其他");
  });
});
