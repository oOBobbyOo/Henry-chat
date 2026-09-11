/**
 * 资产库(Assets)页 —— 本地 Mock 数据源
 *   - 范围 segment 4 项:当前工作区/我收藏的/分享给我/我分享的
 *   - 类型 pills:全部/图片/视频/音频/3D;密度:紧凑/标准/宽松
 *   - 时间 pills:全部时间/今天/近 7 天/近 30 天/自定义
 *   - facets:系统分类 + 标签;云空间配额 0 B / 3.0 GB(参考站空态;本地给少量资产让网格可见)
 *   - 参考站登录墙内 API(/api/v1/assets 等)401,payload 按 UI 结构对齐构造
 */

/** 范围选项(顺序对齐参考站) */
const scopes: Assets.ScopeOption[] = [
  { id: 'workspace', labelKey: 'Current workspace' },
  { id: 'favorites', labelKey: 'My favorites' },
  { id: 'shared-with-me', labelKey: 'Shared with me' },
  { id: 'shared-by-me', labelKey: 'Shared by me' },
]

/** 类型 pills(顺序对齐参考站) */
const types: Assets.TypeOption[] = [
  { id: 'all', labelKey: 'All' },
  { id: 'image', labelKey: 'Images' },
  { id: 'video', labelKey: 'Videos' },
  { id: 'audio', labelKey: 'Audio' },
  { id: '3d', labelKey: '3D' },
]

/** 密度 segment */
const densities: Assets.DensityOption[] = [
  { id: 'compact', labelKey: 'Compact' },
  { id: 'standard', labelKey: 'Standard' },
  { id: 'comfortable', labelKey: 'Comfortable' },
]

/** 时间 pills(顺序对齐参考站) */
const timeRanges: Assets.TimeRangeOption[] = [
  { id: 'all', labelKey: 'All time' },
  { id: 'today', labelKey: 'Today' },
  { id: '7d', labelKey: 'Last 7 days' },
  { id: '30d', labelKey: 'Last 30 days' },
  { id: 'custom', labelKey: 'Custom' },
]

/** 快速筛选 facets(系统分类 + 标签) */
const facets: Assets.FacetGroup[] = [
  {
    id: 'system-category',
    labelKey: 'System categories',
    items: [
      { id: 'portrait', labelKey: 'Category portrait', count: 4 },
      { id: 'product', labelKey: 'Category product', count: 3 },
      { id: 'scene', labelKey: 'Category scene', count: 3 },
      { id: 'sound', labelKey: 'Category sound', count: 2 },
      { id: 'model', labelKey: 'Category model', count: 2 },
    ],
  },
  {
    id: 'tags',
    labelKey: 'Tags',
    items: [
      { id: 'cyberpunk', labelKey: 'Tag cyberpunk', count: 3 },
      { id: 'watercolor', labelKey: 'Tag watercolor', count: 2 },
      { id: 'cinematic', labelKey: 'Tag cinematic', count: 2 },
      { id: 'lofi', labelKey: 'Tag lofi', count: 1 },
    ],
  },
]

/** 云空间配额(3.0 GB,参考站默认值) */
const storage: Assets.StorageQuota = {
  usedBytes: 18_632_704,
  totalBytes: 3 * 1024 * 1024 * 1024,
}

/** 生成时间(相对当天回退,保证「今天/近 7 天」筛选可演示) */
function daysAgo(days: number, hours = 10): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hours, 24, 0, 0)
  return d.toISOString()
}

/** 资产条目(覆盖 4 种类型,字段对齐参考站资产卡展示位) */
const items: Assets.AssetItem[] = [
  {
    id: 'ast-001',
    name: '赛博街景 · 雨夜霓虹',
    assetType: 'image',
    format: 'JPG',
    sizeBytes: 3_932_160,
    modelName: 'Seedream 5.0 Pro',
    createdAt: daysAgo(0, 9),
    dimensions: '2048x2048',
  },
  {
    id: 'ast-002',
    name: '人像特写 · 侧光',
    assetType: 'image',
    format: 'JPG',
    sizeBytes: 2_621_440,
    modelName: 'Nano Banana 2 Pro',
    createdAt: daysAgo(0, 11),
    dimensions: '1536x2048',
  },
  {
    id: 'ast-003',
    name: '产品渲染 · 香水瓶',
    assetType: 'image',
    format: 'PNG',
    sizeBytes: 5_242_880,
    modelName: 'GPT Images 2.0',
    createdAt: daysAgo(2),
    dimensions: '2048x1536',
  },
  {
    id: 'ast-004',
    name: '水彩风景 · 晨雾',
    assetType: 'image',
    format: 'JPG',
    sizeBytes: 1_835_008,
    modelName: 'Qwen Image 3.0 Pro',
    createdAt: daysAgo(4),
    dimensions: '2048x1152',
  },
  {
    id: 'ast-005',
    name: '城市延时 · 天际线',
    assetType: 'video',
    format: 'MP4',
    sizeBytes: 24_117_248,
    modelName: 'Kling V3',
    createdAt: daysAgo(1, 15),
    dimensions: '1920x1080',
  },
  {
    id: 'ast-006',
    name: '产品旋开展示',
    assetType: 'video',
    format: 'MP4',
    sizeBytes: 15_728_640,
    modelName: 'Veo 3.1',
    createdAt: daysAgo(6),
    dimensions: '1080x1920',
  },
  {
    id: 'ast-007',
    name: 'Lofi 循环 · 深夜书桌',
    assetType: 'audio',
    format: 'WAV',
    sizeBytes: 8_388_608,
    modelName: 'MusicGen 2',
    createdAt: daysAgo(3),
    dimensions: '2:14',
  },
  {
    id: 'ast-008',
    name: '科幻无人机音效',
    assetType: 'audio',
    format: 'WAV',
    sizeBytes: 4_194_304,
    modelName: 'SFX Studio',
    createdAt: daysAgo(9),
    dimensions: '0:38',
  },
  {
    id: 'ast-009',
    name: '机甲角色 · 高模',
    assetType: '3d',
    format: 'GLB',
    sizeBytes: 12_582_912,
    modelName: 'Tripo3D 3.1',
    createdAt: daysAgo(5),
    dimensions: '92K faces',
  },
  {
    id: 'ast-010',
    name: '复古电视机模型',
    assetType: '3d',
    format: 'GLB',
    sizeBytes: 7_340_032,
    modelName: 'TripoSplat',
    createdAt: daysAgo(12),
    dimensions: '48K faces',
  },
  {
    id: 'ast-011',
    name: '概念海报 · 星际港口',
    assetType: 'image',
    format: 'JPG',
    sizeBytes: 4_718_592,
    modelName: 'Flux 2 Pro',
    createdAt: daysAgo(31),
    dimensions: '2048x2880',
  },
  {
    id: 'ast-012',
    name: '短片配音 · 旁白',
    assetType: 'audio',
    format: 'MP3',
    sizeBytes: 2_097_152,
    modelName: 'Voice Forge',
    createdAt: daysAgo(33),
    dimensions: '1:06',
  },
]

export const assetsMock: {
  scopes: Assets.ScopeOption[]
  types: Assets.TypeOption[]
  densities: Assets.DensityOption[]
  timeRanges: Assets.TimeRangeOption[]
  facets: Assets.FacetGroup[]
  storage: Assets.StorageQuota
  items: Assets.AssetItem[]
} = {
  scopes,
  types,
  densities,
  timeRanges,
  facets,
  storage,
  items,
}
