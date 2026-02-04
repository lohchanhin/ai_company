// 開羅風格辦公室場景數據
// 參考: Kairo Office Tycoon
// 設計: 分區佈局 + 成組家具 + 彩色地毯

export interface Employee {
  id: string;
  name: string;
  role: string;
  sprite: string;
  gridX: number;
  gridY: number;
  status: 'working' | 'idle' | 'meeting' | 'break';
}

export interface Furniture {
  id: string;
  type: string;
  gridX: number;
  gridY: number;
}

export interface FloorTile {
  gridX: number;
  gridY: number;
  type: 'wood' | 'gray' | 'blue' | 'green' | 'red';
}

// 地板配置（分區設計）
export const floorLayout: FloorTile[] = [
  // 開發區（藍色地毯，Y=0-2）
  ...Array.from({ length: 3 }, (_, y) =>
    Array.from({ length: 8 }, (_, x) => ({
      gridX: x,
      gridY: y,
      type: 'blue' as const
    }))
  ).flat(),
  
  // 會議區（灰色地毯，Y=3-4）
  ...Array.from({ length: 2 }, (_, y) =>
    Array.from({ length: 8 }, (_, x) => ({
      gridX: x,
      gridY: y + 3,
      type: 'gray' as const
    }))
  ).flat(),
  
  // 休息區（綠色地毯，Y=5-6）
  ...Array.from({ length: 2 }, (_, y) =>
    Array.from({ length: 8 }, (_, x) => ({
      gridX: x,
      gridY: y + 5,
      type: 'green' as const
    }))
  ).flat(),
  
  // 管理區（紅色地毯，Y=7）
  ...Array.from({ length: 8 }, (_, x) => ({
    gridX: x,
    gridY: 7,
    type: 'red' as const
  }))
];

// 家具配置（成組排列）
export const furnitureLayout: Furniture[] = [
  // ===== 開發區（藍色地毯）=====
  // 第一排工位（Y=0）
  { id: 'desk-1', type: 'desk', gridX: 1, gridY: 0 },
  { id: 'chair-1', type: 'chair', gridX: 1, gridY: 1 },
  { id: 'desk-2', type: 'desk', gridX: 3, gridY: 0 },
  { id: 'chair-2', type: 'chair', gridX: 3, gridY: 1 },
  { id: 'desk-3', type: 'desk', gridX: 5, gridY: 0 },
  { id: 'chair-3', type: 'chair', gridX: 5, gridY: 1 },
  
  // 第二排工位（Y=2）
  { id: 'desk-4', type: 'desk', gridX: 1, gridY: 2 },
  { id: 'chair-4', type: 'chair', gridX: 1, gridY: 3 },
  { id: 'desk-5', type: 'desk', gridX: 3, gridY: 2 },
  { id: 'chair-5', type: 'chair', gridX: 3, gridY: 3 },
  { id: 'desk-6', type: 'desk', gridX: 5, gridY: 2 },
  { id: 'chair-6', type: 'chair', gridX: 5, gridY: 3 },
  
  // 開發區設施
  { id: 'bookshelf-1', type: 'bookshelf', gridX: 7, gridY: 1 },
  { id: 'file-cabinet-1', type: 'file-cabinet', gridX: 0, gridY: 1 },
  
  // ===== 會議區（灰色地毯）=====
  { id: 'meeting-table-1', type: 'meeting-table', gridX: 2, gridY: 4 },
  { id: 'meeting-chair-1', type: 'chair', gridX: 1, gridY: 4 },
  { id: 'meeting-chair-2', type: 'chair', gridX: 3, gridY: 4 },
  { id: 'meeting-chair-3', type: 'chair', gridX: 2, gridY: 3 },
  { id: 'meeting-chair-4', type: 'chair', gridX: 2, gridY: 5 },
  
  { id: 'meeting-table-2', type: 'meeting-table', gridX: 5, gridY: 4 },
  { id: 'meeting-chair-5', type: 'chair', gridX: 4, gridY: 4 },
  { id: 'meeting-chair-6', type: 'chair', gridX: 6, gridY: 4 },
  
  // ===== 休息區（綠色地毯）=====
  { id: 'water-dispenser-1', type: 'water-dispenser', gridX: 1, gridY: 5 },
  { id: 'printer-1', type: 'printer', gridX: 3, gridY: 5 },
  { id: 'bookshelf-2', type: 'bookshelf', gridX: 5, gridY: 5 },
  { id: 'file-cabinet-2', type: 'file-cabinet', gridX: 7, gridY: 5 },
  
  // ===== 管理區（紅色地毯）=====
  { id: 'ceo-desk', type: 'desk', gridX: 3, gridY: 7 },
  { id: 'ceo-chair', type: 'chair', gridX: 3, gridY: 8 },
  { id: 'manager-desk', type: 'desk', gridX: 5, gridY: 7 },
  { id: 'manager-chair', type: 'chair', gridX: 5, gridY: 8 }
];

// 員工配置（12位員工）
export const employeeLayout: Employee[] = [
  // 開發區（藍色地毯）
  {
    id: 'emp-1',
    name: 'Alice',
    role: '程式設計師',
    sprite: 'programmer',
    gridX: 1,
    gridY: 1,
    status: 'working'
  },
  {
    id: 'emp-2',
    name: 'Bob',
    role: 'UI/UX設計師',
    sprite: 'ux-designer',
    gridX: 3,
    gridY: 1,
    status: 'working'
  },
  {
    id: 'emp-3',
    name: 'Charlie',
    role: 'DevOps工程師',
    sprite: 'devops',
    gridX: 5,
    gridY: 1,
    status: 'working'
  },
  {
    id: 'emp-4',
    name: 'Diana',
    role: '設計師',
    sprite: 'designer',
    gridX: 1,
    gridY: 3,
    status: 'working'
  },
  {
    id: 'emp-5',
    name: 'Eve',
    role: 'QA測試員',
    sprite: 'qa-tester',
    gridX: 3,
    gridY: 3,
    status: 'working'
  },
  {
    id: 'emp-6',
    name: 'Frank',
    role: '資料科學家',
    sprite: 'data-scientist',
    gridX: 5,
    gridY: 3,
    status: 'working'
  },
  
  // 會議區（灰色地毯）
  {
    id: 'emp-7',
    name: 'Grace',
    role: '專案經理',
    sprite: 'manager',
    gridX: 1,
    gridY: 4,
    status: 'meeting'
  },
  {
    id: 'emp-8',
    name: 'Henry',
    role: '行銷專員',
    sprite: 'marketer',
    gridX: 3,
    gridY: 4,
    status: 'meeting'
  },
  
  // 休息區（綠色地毯）
  {
    id: 'emp-9',
    name: 'Iris',
    role: '實習生',
    sprite: 'intern',
    gridX: 2,
    gridY: 6,
    status: 'break'
  },
  {
    id: 'emp-10',
    name: 'Jack',
    role: '人資專員',
    sprite: 'hr',
    gridX: 4,
    gridY: 6,
    status: 'break'
  },
  
  // 管理區（紅色地毯）
  {
    id: 'emp-11',
    name: 'Kevin',
    role: 'CEO',
    sprite: 'ceo',
    gridX: 3,
    gridY: 8,
    status: 'working'
  },
  {
    id: 'emp-12',
    name: 'Lisa',
    role: '安全專家',
    sprite: 'security',
    gridX: 5,
    gridY: 8,
    status: 'working'
  }
];

// 統計資訊
export const officeStats = {
  totalEmployees: employeeLayout.length,
  totalFurniture: furnitureLayout.length,
  totalFloorTiles: floorLayout.length,
  zones: {
    development: { color: 'blue', area: 24, employees: 6 },
    meeting: { color: 'gray', area: 16, employees: 2 },
    break: { color: 'green', area: 16, employees: 2 },
    management: { color: 'red', area: 8, employees: 2 }
  }
};
