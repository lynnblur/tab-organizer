import type { GroupColor } from "./constants";

export interface TabInfo {
  id: number;
  url: string;
  title: string;
  lastAccessed: number;
  windowId: number;
}

export interface TabGroup {
  name: string;
  color: GroupColor;
  tabIds: number[];
}

export interface OrganizeReport {
  groupsCreated: number;
  duplicatesClosed: number;
  windowsMerged: number;
  totalTabsBefore: number;
  totalTabsAfter: number;
}
