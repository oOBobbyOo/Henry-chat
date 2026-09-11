/**
 * 3D 建模(Studio 3D)页 —— 本地 Mock 数据源
 *   - 左侧能力导航 7 项:模型生成可用,纹理生成/减面重拓扑/部件分割/部件补全/自动绑骨/动画重定向禁用
 *   - 模型下拉:TripoSplat / Tripo3D 3.1 / Tripo3D P2 / Hyper3d-Gen2(前三个 新+推荐)
 *   - 参数:纹理质量 2K/4K/8K,几何质量 标准/超清,面数 500–1,500,000,拓扑 quad/triangle
 *   - 资产列表(登录墙内 API 401,按 UI 结构构造,格式 GLB/FBX/OBJ/STL)
 */

/** 3D 生成模型选项(选项文案逐字对齐参考站) */
const models: Studio3d.ModelOption[] = [
  {
    id: 'tripo3d-triposplat',
    provider: 'Tripo',
    displayName: 'TripoSplat',
    badge: 'new',
    recommended: true,
    credits: 10,
  },
  {
    id: 'tripo3d-3.1',
    provider: 'Tripo',
    displayName: 'Tripo3D 3.1',
    badge: 'new',
    recommended: true,
    credits: 10,
  },
  {
    id: 'tripo3d-p2',
    provider: 'Tripo',
    displayName: 'Tripo3D P2',
    badge: 'new',
    recommended: true,
    credits: 20,
  },
  {
    id: 'hyper3d-gen2',
    provider: 'Volcengine',
    displayName: 'Hyper3d-Gen2',
    badge: null,
    recommended: false,
    credits: 15,
  },
]

export const studio3dMock: {
  capabilities: Studio3d.Capability[]
  models: Studio3d.ModelOption[]
  textureQualities: Studio3d.TextureQualityOption[]
  geometryQualities: Studio3d.GeometryQualityOption[]
  topologies: Studio3d.TopologyOption[]
  assets: Studio3d.AssetItem[]
} = {
  /** 左侧能力导航(enabled 对齐参考站:仅「模型生成」可用) */
  capabilities: [
    {
      id: 'model-generation',
      nameKey: 'Model generation',
      titleKey: 'Model generation hint',
      enabled: true,
    },
    {
      id: 'texture-generation',
      nameKey: 'Texture generation',
      titleKey: 'Texture generation hint',
      enabled: false,
    },
    { id: 'retopology', nameKey: 'Retopology', titleKey: 'Retopology hint', enabled: false },
    {
      id: 'part-segmentation',
      nameKey: 'Part segmentation',
      titleKey: 'Part segmentation hint',
      enabled: false,
    },
    {
      id: 'part-completion',
      nameKey: 'Part completion',
      titleKey: 'Part completion hint',
      enabled: false,
    },
    { id: 'auto-rigging', nameKey: 'Auto rigging', titleKey: 'Auto rigging hint', enabled: false },
    {
      id: 'animation-retargeting',
      nameKey: 'Animation retargeting',
      titleKey: 'Animation retargeting hint',
      enabled: false,
    },
  ],
  /** 3D 生成模型列表 */
  models,
  /** 纹理质量字典 */
  textureQualities: [
    { value: '2K', hint: 'Detailed generates higher resolution textures' },
    { value: '4K', hint: 'Detailed generates higher resolution textures' },
    { value: '8K', hint: 'Detailed generates higher resolution textures' },
  ],
  /** 几何质量字典 */
  geometryQualities: [
    { value: 'standard', extraCost: false },
    { value: 'ultra', extraCost: true },
  ],
  /** 拓扑字典 */
  topologies: [
    { value: 'quad', labelKey: 'Quad faces' },
    { value: 'triangle', labelKey: 'Triangle faces' },
  ],
  /** 资产列表(我的资产 + 公共资源混合,面板内按 isPublic 过滤) */
  assets: [
    {
      id: 'asset-mech-bird',
      name: '机械飞鸟 · 绑定版',
      format: 'GLB',
      faceCountK: 186,
      isPublic: false,
    },
    { id: 'asset-helmet', name: '科幻头盔 · PBR', format: 'GLB', faceCountK: 92, isPublic: false },
    {
      id: 'asset-cafe-prop',
      name: '街角咖啡车道具',
      format: 'FBX',
      faceCountK: 340,
      isPublic: false,
    },
    {
      id: 'asset-stylized-tree',
      name: '风格化乔木',
      format: 'OBJ',
      faceCountK: 45,
      isPublic: true,
    },
    {
      id: 'asset-drone',
      name: '四旋翼无人机基础模',
      format: 'GLB',
      faceCountK: 128,
      isPublic: true,
    },
    { id: 'asset-vase', name: '陶罐器形参考', format: 'STL', faceCountK: 18, isPublic: true },
  ],
}
