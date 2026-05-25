const COMPOUND_TLDS = new Set([
  "co.uk", "com.au", "co.jp", "co.nz", "co.kr", "com.br",
  "org.uk", "ac.uk", "gov.uk", "co.in", "com.mx", "co.il",
  "com.tw", "co.th", "com.sg", "co.za", "com.hk", "com.cn",
]);

/**
 * 从 URL 提取主域名。
 * 例如 "https://www.google.com/search?q=hello" → "google.com"
 * "about:blank" → "other"
 */
export function extractDomain(url: string): string {
  if (!url || url.startsWith("about:") || url.startsWith("chrome://") || url.startsWith("edge://")) {
    return "other";
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    if (host.startsWith("www.")) return host.slice(4);
    return host;
  } catch {
    return "other";
  }
}

/**
 * 根据域名生成标签页组名称。
 * 例如 "google.com" → "Google", "docs.google.com" → "Google Docs"
 */
export function getGroupTitle(domain: string): string {
  if (domain === "other") return "其他";

  let parts = domain.split(".");

  // 处理复合 TLD（如 co.uk），去掉最后 2 段
  if (parts.length >= 3) {
    const lastTwo = parts.slice(-2).join(".");
    if (COMPOUND_TLDS.has(lastTwo)) {
      parts = parts.slice(0, -2);
    } else {
      parts = parts.slice(0, -1);
    }
  } else if (parts.length >= 2) {
    // 简单域名：去掉 TLD
    parts = parts.slice(0, -1);
  }

  if (parts.length === 0) return "其他";

  return parts
    .reverse()
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}
