export type ZoneType = "work" | "meet" | "rest" | "admin" | "walkway";

export interface VmSpec {
  vCPU: number;
  ramGB: number;
  diskGB: number;
  netMbps: number;
}

export interface GridSpec {
  width: number;
  height: number;
  tileW: number;
  tileH: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Zone {
  id: string;
  type: ZoneType;
  rect: Rect;
}

export interface ObjectFootprint {
  w: number;
  h: number;
}

export interface ObjectTile {
  x: number;
  y: number;
}

export interface OfficeObject {
  id: string;
  type: string;
  spriteKey: string;
  tile: ObjectTile;
  rotation: 0 | 90 | 180 | 270;
  layer: number;
  footprint: ObjectFootprint;
  meta?: Record<string, unknown>;
}

export interface Employee {
  id: string;
  displayName: string;
  nodeRef: string;
  role: string;
  managerId?: string;
  seatObjectId?: string;
  status: "idle" | "busy" | "rest" | "offline";
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

export type TaskStatus = "todo" | "in_progress" | "blocked" | "done";

export interface Task {
  id: string;
  goalId?: string;
  title: string;
  description: string;
  assigneeId?: string;
  status: TaskStatus;
  progress: number;
  blockedReason?: string;
  priority: "low" | "medium" | "high";
  createdAt: number;
  updatedAt: number;
}

export interface LayoutSaveFile {
  version: "1.0";
  vmSpec: VmSpec;
  grid: GridSpec;
  zones: Zone[];
  objects: OfficeObject[];
  employees: Employee[];
  goals: Goal[];
  tasks: Task[];
}
