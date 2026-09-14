'use client'

import type { ComponentType } from 'react'

import { AvatarPortraitPanel } from './panels/avatar-portrait-panel'
import { ImageEditPanel } from './panels/image-edit-panel'
import { MotionSyncPanel } from './panels/motion-sync-panel'
import { MusicPanel } from './panels/music-panel'
import { SoundPanel } from './panels/sound-panel'
import { VideoLipSyncPanel } from './panels/video-lip-sync-panel'
import { VideoMattePanel } from './panels/video-matte-panel'
import { VideoSrPanel } from './panels/video-sr-panel'
import { VoicePanel } from './panels/voice-panel'

/**
 * 能力面板分发器 —— 按左侧导航的 capability id 渲染对应独立面板组件
 * 布局结构对齐参考站 syna.art/workbench:每个能力 = 一组圆角卡片
 */

interface CapabilityPanelsProps {
  /** 当前激活能力 ID(mock capabilities 中的 id) */
  capability: string
  /** config 接口返回的数据(含各能力配置) */
  configs: Workbench.ConfigResponse['data']
}

/** id → 面板组件映射(mock capabilities id 为键) */
const PANELS: Record<string, ComponentType<{ configs: Workbench.ConfigResponse['data'] }>> = {
  'sound-gen': SoundPanel,
  'music-gen': MusicPanel,
  'voice-gen': VoicePanel,
  'image-edit': ImageEditPanel,
  'video-sr': VideoSrPanel,
  'video-matte': VideoMattePanel,
  'video-lip-sync': VideoLipSyncPanel,
  'motion-sync': MotionSyncPanel,
  'avatar-portrait': AvatarPortraitPanel,
}

export function CapabilityPanels({ capability, configs }: CapabilityPanelsProps) {
  const Panel = PANELS[capability]
  if (!Panel) return null
  return <Panel configs={configs} />
}
