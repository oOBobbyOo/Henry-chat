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
    description: 'Nano Banana 2 的轻量版本,支持多参考图和相机控制;仅支持 512、1K 尺寸,不支持联网增强。',
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
  qualityTiers: Workbench.QualityTierOption[]
  backgrounds: Workbench.BackgroundOption[]
  compressions: Workbench.CompressionOption[]
  video: Workbench.VideoCapabilityConfig
  sound: Workbench.SoundCapabilityConfig
  music: Workbench.MusicCapabilityConfig
  voice: Workbench.VoiceCapabilityConfig
  imageEdit: Workbench.ImageEditCapabilityConfig
  videoUpscale: Workbench.VideoUpscaleCapabilityConfig
  videoRemoveBg: Workbench.VideoRemoveBgCapabilityConfig
  lipsync: Workbench.LipsyncCapabilityConfig
  digitalHuman: Workbench.DigitalHumanCapabilityConfig
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
  /** 质量档位字典 */
  qualityTiers: [
    { value: 'standard', labelKey: 'Standard' },
    { value: 'high', labelKey: 'High' },
    { value: 'ultra', labelKey: 'Ultra' },
  ],
  /** 生成背景字典 */
  backgrounds: [
    { value: 'auto', labelKey: 'Auto match' },
    { value: 'transparent', labelKey: 'Transparent' },
    { value: 'opaque', labelKey: 'Opaque' },
  ],
  /** 输出压缩档位字典 */
  compressions: [
    { value: 'high', labelKey: 'High quality' },
    { value: 'balanced', labelKey: 'Balanced' },
    { value: 'small', labelKey: 'Small size' },
  ],
  /** 视频生成能力配置(模型选项逐字对齐参考站实测) */
  video: {
    models: [
      {
        id: 'wan-3.0',
        provider: 'Qwen',
        displayName: 'Wan 3.0',
        description: '支持文生、首帧/首尾帧与全能参考;全能参考支持图片、视频、音频、文件和公网链接。',
        badge: 'new',
        recommended: true,
        credits: 40,
      },
      {
        id: 'wan-3.0-prime',
        provider: 'Qwen',
        displayName: 'Wan 3.0 Prime',
        description: 'Wan 3.0 Prime 支持文生、首帧/首尾帧与全能参考;参考素材支持图片、视频、音频、文件和公网链接。',
        badge: 'new',
        recommended: true,
        credits: 55,
      },
      {
        id: 'happyhorse-1.1',
        provider: 'HappyHorse',
        displayName: 'HappyHorse 1.1',
        description: '三模式视频生成,支持文生、首帧图生与参考图驱动,适合直接升级 HappyHorse 主力出片模型。',
        badge: 'new',
        recommended: true,
        credits: 30,
      },
      {
        id: 'happyhorse-1.0',
        provider: 'HappyHorse',
        displayName: 'HappyHorse 1.0',
        description: '四模式视频生成,支持参考图驱动与视频编辑,适合多参考素材组合与镜头改写。',
        badge: 'new',
        recommended: true,
        credits: 26,
      },
      {
        id: 'minimax-h3',
        provider: 'Minimax',
        displayName: 'MiniMax H3',
        description: '会员旗舰视频生成,支持文生 / 图生 / 首尾帧与全能参考(图片 / 视频 / 音频),768P / 2K 直出。',
        badge: 'new',
        recommended: true,
        credits: 60,
      },
      {
        id: 'seedance-2.5',
        provider: 'ByteDance',
        displayName: 'Seedance 2.5',
        description: '覆盖文生、图生、首尾帧、全能参考(图 / 视频 / 音频)与视频编辑;最多 30 图 / 10 视频 / 10 音频,生成时长 4–30 秒。',
        badge: 'new',
        recommended: true,
        credits: 65,
      },
      {
        id: 'seedance-2.0',
        provider: 'ByteDance',
        displayName: 'Seedance 2.0',
        description: '品质优先的视频生成,支持多模态输入与联网搜索,适合高完成度镜头与成片表达。',
        badge: null,
        recommended: true,
        credits: 50,
      },
      {
        id: 'seedance-2.0-fast',
        provider: 'ByteDance',
        displayName: 'Seedance 2.0 Fast',
        description: '速度与成本优先的快速版,能力等同 2.0 主力,适合高频试镜头与方案迭代。',
        badge: null,
        recommended: true,
        credits: 24,
      },
      {
        id: 'seedance-2.0-mini',
        provider: 'ByteDance',
        displayName: 'Seedance 2.0 Mini',
        description: '速度与成本优先的快速版,能力等同 2.0 主力,适合高频试镜头与方案迭代。',
        badge: null,
        recommended: true,
        credits: 14,
      },
      {
        id: 'veo-3.1',
        provider: 'Gemini',
        displayName: 'Veo 3.1',
        description: '高规格视频生成,覆盖文生 / 图生 / 首尾帧 / 视频延长等模式,适合预演级镜头创作。',
        badge: null,
        recommended: false,
        credits: 90,
      },
      {
        id: 'veo-3.1-fast',
        provider: 'Gemini',
        displayName: 'Veo 3.1 Fast',
        description: 'Veo 3.1 的高速版本,覆盖完整四种生成模式与多档分辨率,适合快速产出预演镜头。',
        badge: null,
        recommended: false,
        credits: 45,
      },
      {
        id: 'kling-v3',
        provider: 'Kling',
        displayName: 'Kling V3',
        description: '常规文生与图生视频,叙事感强,适合短片镜头与故事化分镜起片。',
        badge: null,
        recommended: false,
        credits: 35,
      },
      {
        id: 'kling-o3',
        provider: 'Kling',
        displayName: 'Kling O3',
        description: '支持文生视频、首尾帧与全能参考,适合需要角色与场景一致性的镜头。',
        badge: null,
        recommended: false,
        credits: 42,
      },
    ],
    /** 创作模式字典 */
    createModes: [
      { value: 't2v', labelKey: 'Text to video' },
      { value: 'first-last-frame', labelKey: 'First-last frame' },
      { value: 'omni-reference', labelKey: 'Omni reference' },
    ],
    /** 分辨率字典 */
    resolutions: [{ value: '480P' }, { value: '720P' }, { value: '1080P' }],
    /** 画幅比例字典(自动 + 固定档,width/height 供展示比例用) */
    aspectRatios: [
      { value: 'auto', width: 0, height: 0 },
      { value: '16:9', width: 16, height: 9 },
      { value: '4:3', width: 4, height: 3 },
      { value: '1:1', width: 1, height: 1 },
      { value: '3:4', width: 3, height: 4 },
      { value: '9:16', width: 9, height: 16 },
    ],
    /** 时长字典(参考站 segment:更短 ← 5 秒 → 更长) */
    durations: [{ seconds: 5 }],
  },
  /** 音效生成配置 */
  sound: {
    /** 生成方式(文案走 i18n) */
    generateModes: ['text-to-sound', 'video-to-sound', 'video-dub-sound'],
    /** 目标时长(秒) */
    durations: [3, 5, 10, 15, 30],
    /** 输出格式 */
    formats: ['AAC', 'MP3', 'WAV'],
  },
  /** 音乐生成配置 */
  music: {
    models: [
      {
        id: 'music-2.6',
        provider: 'MusicLM',
        displayName: 'music-2.6',
        description: '支持歌词成曲与纯音乐创作,可配合智能写词快速产出完整歌曲草稿。',
        badge: null,
        recommended: true,
        credits: 20,
      },
    ],
    /** 创作形态(歌词成曲/纯音乐) */
    forms: ['lyrics-to-song', 'instrumental'],
    /** 采样率 */
    sampleRates: ['44100 Hz', '48000 Hz'],
    /** 比特率 */
    bitrates: ['256 kbps', '320 kbps'],
    /** 输出格式 */
    formats: ['MP3', 'WAV'],
  },
  /** 配音生成配置 */
  voice: {
    models: [
      {
        id: 'qwen-audio-3.0-tts-plus',
        provider: 'Qwen',
        displayName: 'qwen-audio-3.0-tts-plus',
        description: '多语种语音合成,支持情感与拟声标签,音色自然、节奏可控。',
        badge: null,
        recommended: true,
        credits: 5,
      },
    ],
    /** 音色 */
    voices: ['plain-everyday', 'female-zh'],
    /** 输出格式 */
    formats: ['MP3', 'WAV', 'AAC'],
    /** 采样率 */
    sampleRates: ['22050 Hz', '44100 Hz'],
    /** Opus 码率(仅 Opus 支持,单位为 kbps) */
    opusBitrates: ['32 kbps', '48 kbps', '64 kbps'],
    /** 目标语言 */
    languages: ['zh', 'en', 'ja'],
  },
  /** 图片编辑工具 */
  imageEdit: {
    tools: ['inpaint', 'crop', 'super-resolution', 'scratch-removal', 'extract-subject', 'extract-lineart', 'remove-bg'],
  },
  /** 视频超分配置 */
  videoUpscale: {
    models: [
      {
        id: 'proteus',
        provider: 'Upscale',
        displayName: 'Proteus',
        description: '全手动模式,读取全部精调滑块,适合逐项微调压缩、噪点、光晕与细节。',
        badge: null,
        recommended: true,
        credits: 15,
      },
    ],
    /** 放大倍率 */
    scales: ['2×', '4×'],
    /** 目标帧率 */
    frameRates: ['24 fps', '30 fps', '60 fps'],
  },
  /** 视频去背景配置 */
  videoRemoveBg: {
    /** 输出背景 */
    outputs: ['transparent', 'green', 'white'],
  },
  /** 视频对口型配置 */
  lipsync: {
    /** 对齐模型 */
    models: ['sync-lipsync', 'kling-lipsync'],
    /** 对齐模式 */
    alignModes: ['truncate', 'loop-fill', 'pingpong-fill', 'silence-fill', 'duration-remap'],
  },
  /** 数字人像生成参数 */
  digitalHuman: {
    resolutions: ['1080p', '720p'],
  },
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
