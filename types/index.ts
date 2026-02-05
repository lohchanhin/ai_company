// 伺服器
export interface Server {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  privateKey?: string;
  
  // 視覺屬性
  visual: {
    type: "developer" | "database" | "web" | "generic";
    gridX: number;    // 網格位置 X
    gridY: number;    // 網格位置 Y
  };
  
  // 實時狀態
  status: {
    online: boolean;
    cpu: number;      // 0-100
    memory: number;   // 0-100
    disk: number;     // 0-100
    uptime: number;   // 秒
  };
  
  // 當前任務
  currentTask?: Task;
}

// 任務
export interface Task {
  id: string;
  name: string;
  icon: string;
  command: string;
  workingDir?: string;
  
  // 狀態
  status: "pending" | "running" | "completed" | "failed";
  progress: number;  // 0-100
  
  // 時間
  estimatedTime: number;  // 秒
  startTime?: number;
  endTime?: number;
  
  // 輸出
  logs: string[];
  result?: {
    exitCode: number;
    output: string;
    error?: string;
  };
}

// 任務模板
export interface TaskTemplate {
  id: string;
  name: string;
  icon: string;
  command: string;
  workingDir?: string;
  estimatedTime: number;
  description?: string;
}

// 系統設定
export interface AppSettings {
  servers: Server[];
  taskTemplates: TaskTemplate[];
  
  // 視覺設定
  visual: {
    pixelSize: number;      // 像素縮放
    animationSpeed: number; // 動畫速度
    showStats: boolean;     // 顯示統計
  };
}

// 伺服器統計
export interface ServerStats {
  cpu: number;
  memory: number;
  disk: number;
  uptime: number;
}

export * from "./office";
