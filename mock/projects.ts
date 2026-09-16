/**
 * 项目(Projects)页 —— 本地 Mock 数据源
 *   - GET /api/v1/skills/market?limit=24(技能市场)
 *   - 最近项目:本地会话态,初始为空(未登录展示"登录并开始创作"引导卡)
 */

export const projectsMock: Projects.MockData = {
  /** 最近项目(空 = 展示"登录并开始创作"虚线引导卡) */
  recentProjects: [],
  skills: [
    {
      id: 'f4f738e1-75f4-42eb-a681-807e1be52585',
      slug: 'short-drama-studio',
      displayName: '短剧创作工作室',
      description:
        '面向短剧/竖屏短视频的一站式创作：从故事构思到分镜、镜头画面、配音配乐的全流程支持。',
      marketCategory: 'drama',
      featured: true,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/short-drama-studio-v2.png?sign=1789034400-0-0-c8ac8bd1a7e4429ec74731587d3da85d',
    },
    {
      id: 'c9ef2b1f-524a-46cb-b85d-1b2da7d891e2',
      slug: 'ecommerce-creative',
      displayName: '电商创意工作室',
      description:
        '面向电商场景的广告平面设计、产品宣传图、上架主图/详情图、带货短视频一站式生成。',
      marketCategory: 'ecommerce',
      featured: true,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/ecommerce-creative-v2.png?sign=1789034400-0-0-ce4d8e371380123d357b7d4f9e979347',
    },
    {
      id: 'e827f8df-7e55-46b0-9833-23dda28a2881',
      slug: 'game-dev-pipeline',
      displayName: '游戏研发美术管线',
      description:
        '面向游戏研发的角色/场景原画、UI 界面、3D 模型资产一站式生成，覆盖从概念到可用素材的流程。',
      marketCategory: 'game',
      featured: true,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/game-dev-pipeline-v2.png?sign=1789034400-0-0-21fd857a30c88cf2705e36c7f9cf40da',
    },
    {
      id: 'd237b951-4df3-4eb7-90b2-f67ebc19c198',
      slug: 'character-portrait',
      displayName: '角色立绘设计',
      description:
        '生成游戏角色立绘、半身像、全身设定图。支持动漫/写实/古风/赛博朋克等多种风格，输出可用于角色选择界面或卡面的高品质立绘。',
      marketCategory: 'game',
      featured: true,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/character-portrait-v2.png?sign=1789034400-0-0-c000e64318632b3112c004b29df03819',
    },
    {
      id: '485f9266-2fc1-4393-bca6-c89eaae0c63a',
      slug: 'logo-design',
      displayName: 'Logo设计',
      description:
        '生成品牌Logo设计，支持文字Logo、图形Logo、字母Logo、组合Logo。适合企业品牌、产品品牌、个人品牌的Logo创作。',
      marketCategory: 'design',
      featured: true,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/logo-design-v2.png?sign=1789034400-0-0-9aaaab64638db1ac31df511a2602f5e8',
    },
    {
      id: 'e4af2fde-0f46-46e7-b7e5-05f75acc9ada',
      slug: 'premium-female-drama',
      displayName: '精品女频短剧导演',
      description: '告别粗糙流水线成片，纯精品短剧工业化全流程一键出片',
      marketCategory: 'drama',
      featured: true,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/premium-female-drama-v2.png?sign=1789034400-0-0-49059d815d472d6fb9c8b3d7332f03ca',
    },
    {
      id: 'f15c8bce-bab7-48a6-a87d-cb560e8d229f',
      slug: 'symmetric-pastel-aesthetics',
      displayName: '对称柔彩电影美学',
      description: '对称构图、糖果色调、平面化景深，打造童话感电影短片或广告。',
      marketCategory: 'drama',
      featured: true,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/symmetric-pastel-aesthetics-v2.png?sign=1789034400-0-0-97e2c605d5bcc85d38492686c596f6f8',
    },
    {
      id: '0e39ef44-4964-4427-a931-e29d04e4967c',
      slug: 'neon-noir-aesthetics',
      displayName: '霓虹都市电影美学',
      description: '浓郁霓虹光影、抽帧慢门、都市孤独感，打造港风电影短片。',
      marketCategory: 'drama',
      featured: true,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/neon-noir-aesthetics-v2.png?sign=1789034400-0-0-116d555bdd3ec1d1a341d2d8ab5674da',
    },
    {
      id: 'b149ffbe-2bd7-465a-abe7-fd2d349f8278',
      slug: 'luminous-sky-anime-aesthetics',
      displayName: '光影天空动漫美学',
      description: '壮阔光影与天空、细腻青春情感，打造唯美动画短片。',
      marketCategory: 'drama',
      featured: true,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/luminous-sky-anime-aesthetics-v2.png?sign=1789034400-0-0-bc004c6dd9f90216556f795c8f18efd4',
    },
    {
      id: '84312488-1d13-4327-869a-6ea0f1e4c852',
      slug: 'casting-director',
      displayName: '选角导演',
      description: '你的专属选角导演，一键为你挑选最合适的角色',
      marketCategory: 'game',
      featured: true,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/casting-director-v2.png?sign=1789034400-0-0-1465d18ff799bdf25b0dadbc9ab1bb20',
    },
    {
      id: 'aa60c532-8740-4b34-9faa-8e4fec0e7436',
      slug: 'concept-character-showcase',
      displayName: '概念角色设计',
      description: '输入一个角色想法，自动生成原创概念角色、角色板和15秒视频',
      marketCategory: 'game',
      featured: true,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/concept-character-showcase-v2.png?sign=1789034400-0-0-00b82fdfbb604dc9a1d85875527cc0d7',
    },
    {
      id: '6e19453c-fc49-404f-af21-a13e5646c5e6',
      slug: 'product-selling-drama',
      displayName: '带货短剧导演',
      description: '把一张商品图转化为一条 3 分镜、约 15 秒的带货短剧成片',
      marketCategory: 'ecommerce',
      featured: true,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/product-selling-drama-v2.png?sign=1789034400-0-0-00edc34c341802790b924a5ff66aaf05',
    },
    {
      id: 'efce34b9-5571-42fa-9df1-60494e4286e0',
      slug: 'ugc-product-videos',
      displayName: 'UGC 带货视频导演',
      description: '真实口播种草、生活化镜头、角色场景参考，打造高转化短视频。',
      marketCategory: 'ecommerce',
      featured: true,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/ugc-product-videos-v2.png?sign=1789034400-0-0-7631ae4d62ad691342ce14647f6c2183',
    },
    {
      id: 'b797066f-0a48-4e34-a038-6421242d4554',
      slug: 'luxury-tvc',
      displayName: '高奢品牌广告导演',
      description: '奢牌级视觉表达，电影级视听语言，打造国际化高级感品牌TVC。',
      marketCategory: 'ecommerce',
      featured: true,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/luxury-tvc-v2.png?sign=1789034400-0-0-05841c53c63e2bb3217bf3e1bd7f2c06',
    },
    {
      id: '58695335-d2a4-4716-b62c-165564ed1db8',
      slug: 'handdrawn-healing-animation',
      displayName: '手绘治愈动画导演',
      description: '把剧情拍成有温度的手绘动画大片，自然与童真交织。',
      marketCategory: 'game',
      featured: true,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/handdrawn-healing-animation-v2.png?sign=1789034400-0-0-5e1d253d5b1f23cc4aaddd819a192cd6',
    },
    {
      id: 'a5a2c58c-3eeb-40d4-992a-84640d8a770e',
      slug: 'vertical-talking-video',
      displayName: '竖屏口播视频导演',
      description: '制作无真人出镜的竖屏短视频，一键打造自媒体口播爆款短片',
      marketCategory: 'general',
      featured: true,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/vertical-talking-video-v2.png?sign=1789034400-0-0-cfed4b16320ba7abdebb1e1430d5d304',
    },
    {
      id: 'dad6737d-2d6f-4ae1-b4c9-32f40c4fd4d1',
      slug: 'cinematic-image-pro',
      displayName: '电影质感图像生成',
      description: '一句大白话就能生成超质感电影级多风格图片',
      marketCategory: 'design',
      featured: true,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/cinematic-image-pro-v2.png?sign=1789034400-0-0-74def978ada2d1e12e268b1ac844bea3',
    },
    {
      id: '350000b2-7d6d-41bb-830a-89b2e9004fec',
      slug: 'game-ui-design',
      displayName: '游戏UI设计',
      description:
        '生成游戏UI界面、图标、按钮、弹窗设计。适合主界面、背包界面、设置面板、战斗HUD等UI元素的视觉设计。',
      marketCategory: 'game',
      featured: false,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/game-ui-design-v2.png?sign=1789034400-0-0-c882612e5bcf33de8b4121e85ca8fd06',
    },
    {
      id: 'be6d7c8b-e50c-45cf-a09a-786f0be2d2b3',
      slug: 'weapon-equipment-design',
      displayName: '武器装备设计',
      description:
        '生成游戏武器、装备、道具的概念设计图。支持冷兵器、热兵器、魔法武器、防具等，适合游戏道具系统设计。',
      marketCategory: 'game',
      featured: false,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/weapon-equipment-design-v2.png?sign=1789034400-0-0-c1131ff1c49b8acd171cd0e2990a287b',
    },
    {
      id: '6d76c59d-c15e-4b26-bc2d-bc0beb4a4341',
      slug: 'social-media-poster',
      displayName: '社交媒体海报',
      description:
        '生成社交媒体营销海报，包括朋友圈广告、小红书配图、Instagram帖文、Facebook广告图。支持多种尺寸和风格。',
      marketCategory: 'design',
      featured: false,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/social-media-poster-v2.png?sign=1789034400-0-0-a25f1beb2d15fac039dcf873bf25baf0',
    },
    {
      id: '3443cbcd-de40-4f04-8d61-ae7911fd8af8',
      slug: 'product-packaging',
      displayName: '产品包装设计',
      description:
        '生成产品包装设计概念图，包括盒装、瓶装、袋装等包装形式。适合快消品、美妆、食品等产品的包装视觉设计。',
      marketCategory: 'design',
      featured: false,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/product-packaging-v2.png?sign=1789034400-0-0-585b17caa7a17ee435bf79eee0b925b6',
    },
    {
      id: 'bf37df35-f548-464c-98aa-b6d7507af11e',
      slug: 'brand-color-system',
      displayName: '品牌配色方案',
      description:
        '生成品牌配色系统，包括主色、辅助色、中性色、功能色。输出完整的色值表和配色应用示例。',
      marketCategory: 'design',
      featured: false,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/brand-color-system-v2.png?sign=1789034400-0-0-fedb3b91cfd91cba6ca06cc70ac8618c',
    },
    {
      id: '5fe198e2-d785-43ff-81fc-11c598b5bf9f',
      slug: 'business-card-design',
      displayName: '名片设计',
      description:
        '生成名片设计，包括正面和背面。支持多种风格（极简、商务、创意、科技），适合企业名片和个人名片。',
      marketCategory: 'design',
      featured: false,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/business-card-design-v2.png?sign=1789034400-0-0-0805e07e8c3b2e297200d628a4652a3f',
    },
    {
      id: '800c4ea5-4929-4b52-b42f-cdc7eae4ce19',
      slug: 'avatar-design',
      displayName: '头像设计',
      description:
        '生成个性化头像，支持动漫风、写实风、Q版、油画风等多种风格。适合社交媒体、游戏、论坛等场景的头像创作。',
      marketCategory: 'general',
      featured: false,
      coverUrl:
        'https://assetscdn.syna.art/prod/skill-covers/avatar-design-v2.png?sign=1789034400-0-0-f9bfdf8d86da27f0a19d260ce7422587',
    },
  ],
}
