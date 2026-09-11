/**
 * 创作工坊(Workbench)页 —— 本地 Mock 数据源
 *   - 左侧能力导航:创作 5 项 + 编辑 6 项(徽标 New/Hot)
 *   - 图片生成模型下拉 15 个选项(provider/名称/徽标/描述/积分)
 *   - 参数字典:宽高比 8 档 / 分辨率 3 档 / 输出格式
 *   - 历史记录(登录墙内 API 401,按 UI 结构构造)+ 空态社群灵感卡
 */

/** 图片生成的模型选项(选项文案逐字对齐参考站) */
const imageModels: Workbench.ModelOption[] = [
  {
    id: 'qwen-image-3.0',
    provider: 'Qwen',
    displayName: 'Qwen Image 3.0',
    description: '千问图像生成与编辑 3.0,支持文生图与 1–3 张参考图的图生图编辑。',
    badge: 'new',
    recommended: true,
    credits: 11,
  },
  {
    id: 'qwen-image-3.0-pro',
    provider: 'Qwen',
    displayName: 'Qwen Image 3.0 Pro',
    description: '千问图像生成与编辑 3.0 Pro,支持文生图与 1–3 张参考图的高质量图像编辑。',
    badge: 'new',
    recommended: true,
    credits: 16,
  },
  {
    id: 'gpt-images-2.0',
    provider: 'OpenAI',
    displayName: 'GPT Images 2.0',
    description: '强语义理解的文生与图生图,擅长按复杂指令组合多张参考图做精细编辑。',
    badge: null,
    recommended: true,
    credits: 18,
  },
  {
    id: 'gpt-image-2.5-flare',
    provider: 'OpenAI',
    displayName: 'GPT Image 2.5 Flare',
    description: '强语义理解的文生与图生图,速度优先,适合快速迭代与日常素材产出。',
    badge: 'new',
    recommended: true,
    credits: 9,
  },
  {
    id: 'gpt-image-2.5-sunburst',
    provider: 'OpenAI',
    displayName: 'GPT Image 2.5 Sunburst',
    description: '强语义理解的文生与图生图,质量优先,适合高完成度成片与细节要求更高的画面。',
    badge: 'new',
    recommended: true,
    credits: 21,
  },
  {
    id: 'midjourney-v8.2',
    provider: 'Midjourney',
    displayName: 'Midjourney v8.2',
    description: '旗舰文生图模型,构图稳定、细节扎实,适合角色立绘与场景概念图等成片产出。',
    badge: 'new',
    recommended: true,
    credits: 14,
  },
  {
    id: 'midjourney-niji-v7',
    provider: 'Midjourney',
    displayName: 'Midjourney Niji V7',
    description: '旗舰文生图模型,构图稳定、细节扎实,适合角色立绘与场景概念图等成片产出。',
    badge: null,
    recommended: false,
    credits: 14,
  },
  {
    id: 'nano-banana-2',
    provider: 'NanoBanana',
    displayName: 'Nano Banana 2',
    description: '响应更快的文生与图生图,适合灵感探索与方案快速预览。',
    badge: null,
    recommended: true,
    credits: 7,
  },
  {
    id: 'nano-banana-2-lite',
    provider: 'NanoBanana',
    displayName: 'Nano Banana 2 Lite',
    description:
      'Nano Banana 2 的轻量版本,支持多参考图和相机控制;仅支持 512、1K 尺寸,不支持联网增强。',
    badge: 'new',
    recommended: false,
    credits: 4,
  },
  {
    id: 'nano-banana-pro',
    provider: 'NanoBanana',
    displayName: 'Nano Banana Pro',
    description: '理解能力更强的旗舰版本,适合复杂创意表达与多元素组合的精细生成。',
    badge: null,
    recommended: false,
    credits: 15,
  },
  {
    id: 'seedream-5.0',
    provider: 'Doubao',
    displayName: 'Seedream 5.0',
    description: '旗舰文生图模型,构图稳定、细节扎实,适合角色立绘与场景概念图等成片产出。',
    badge: null,
    recommended: false,
    credits: 10,
  },
  {
    id: 'seedream-5.0-pro',
    provider: 'Doubao',
    displayName: 'Seedream 5.0 Pro',
    description: '旗舰多图融合文生图,最多 10 张参考图精准控图,适合高完成度角色与场景一致性产出。',
    badge: 'new',
    recommended: true,
    credits: 13,
  },
  {
    id: 'seedream-4.0',
    provider: 'Doubao',
    displayName: 'Seedream 4.0',
    description: '性价比优先的通用文生图,多档分辨率可选,适合分镜草稿与批量素材产出。',
    badge: null,
    recommended: false,
    credits: 6,
  },
  {
    id: 'flux-2-pro',
    provider: 'Black Forest Labs',
    displayName: 'Flux 2 Pro',
    description: '旗舰级文生图与图像编辑模型,画面质感细腻,适合宣传海报与视觉主图等高规格创作。',
    badge: null,
    recommended: false,
    credits: 12,
  },
  {
    id: 'z-image',
    provider: 'Qwen',
    displayName: 'Z-Image',
    description: '聚合 LoRA、ControlNet 与平铺等多种控制模式,适合风格化创作与受控生成。',
    badge: null,
    recommended: false,
    credits: 8,
  },
]

export const workbenchMock: {
  capabilities: Workbench.Capability[]
  models: Workbench.ModelOption[]
  aspectRatios: Workbench.AspectRatioOption[]
  resolutions: Workbench.ResolutionOption[]
  formats: Workbench.FormatOption[]
  history: Workbench.HistoryItem[]
  communityCases: Workbench.CommunityCase[]
} = {
  /** 左侧功能导航(创作 + 编辑两组,徽标对齐参考站) */
  capabilities: [
    {
      id: 'image-gen',
      group: 'create',
      nameKey: 'Image generation',
      modality: 'image',
      badge: 'new',
    },
    {
      id: 'video-gen',
      group: 'create',
      nameKey: 'Video generation',
      modality: 'video',
      badge: 'new',
    },
    {
      id: 'sound-gen',
      group: 'create',
      nameKey: 'Sound generation',
      modality: 'sound',
      badge: null,
    },
    {
      id: 'music-gen',
      group: 'create',
      nameKey: 'Music generation',
      modality: 'music',
      badge: 'hot',
    },
    {
      id: 'voice-gen',
      group: 'create',
      nameKey: 'Voice generation',
      modality: 'voice',
      badge: null,
    },
    { id: 'image-edit', group: 'edit', nameKey: 'Image editing', modality: 'image', badge: 'hot' },
    {
      id: 'video-sr',
      group: 'edit',
      nameKey: 'Video super resolution',
      modality: 'video',
      badge: null,
    },
    {
      id: 'video-matte',
      group: 'edit',
      nameKey: 'Video background removal',
      modality: 'video',
      badge: null,
    },
    {
      id: 'video-lip-sync',
      group: 'edit',
      nameKey: 'Video lip sync',
      modality: 'video',
      badge: null,
    },
    { id: 'motion-sync', group: 'edit', nameKey: 'Motion sync', modality: 'video', badge: null },
    {
      id: 'avatar-portrait',
      group: 'edit',
      nameKey: 'Digital avatar',
      modality: 'video',
      badge: null,
    },
  ],
  /** 图片生成的模型列表 */
  models: imageModels,
  /** 宽高比字典 */
  aspectRatios: [
    { value: '1:1', width: 1024, height: 1024 },
    { value: '4:3', width: 1024, height: 768 },
    { value: '3:4', width: 768, height: 1024 },
    { value: '16:9', width: 1024, height: 576 },
    { value: '9:16', width: 576, height: 1024 },
    { value: '3:2', width: 1024, height: 683 },
    { value: '2:3', width: 683, height: 1024 },
    { value: '21:9', width: 1024, height: 439 },
  ],
  /** 分辨率字典 */
  resolutions: [
    { value: '1K', base: 1024 },
    { value: '2K', base: 2048 },
    { value: '4K', base: 4096 },
  ],
  /** 输出格式字典 */
  formats: [
    { value: 'JPEG', qualityLabel: '标准格式' },
    { value: 'PNG', qualityLabel: '无损格式' },
    { value: 'WEBP', qualityLabel: '轻量格式' },
  ],
  /** 创作历史(空数组 = 参考站默认空态 + 社群推荐) */
  history: [],
  /** 空态社群灵感卡 */
  communityCases: [
    {
      id: 'case-poster-s',
      modality: 'image',
      title: '中式极简 S 形海报',
      coverUrl: '',
      featured: true,
    },
    {
      id: 'case-product-hero',
      modality: 'image',
      title: '电商产品主图 · 晨光玻璃器皿',
      coverUrl: '',
      featured: true,
    },
    {
      id: 'case-city-loop',
      modality: 'video',
      title: '赛博城市夜景循环运镜',
      coverUrl: '',
      durationSeconds: 9,
      featured: true,
    },
  ],
}
