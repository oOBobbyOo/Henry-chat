import { NextResponse } from 'next/server'

import { workbenchMock } from '@/mock/workbench'

/** 能力导航 + 模型 + 参数字典 */
export async function GET() {
  return NextResponse.json<Workbench.ConfigResponse>({
    success: true,
    data: {
      capabilities: workbenchMock.capabilities,
      models: workbenchMock.models,
      aspectRatios: workbenchMock.aspectRatios,
      resolutions: workbenchMock.resolutions,
      formats: workbenchMock.formats,
      qualityTiers: workbenchMock.qualityTiers,
      backgrounds: workbenchMock.backgrounds,
      compressions: workbenchMock.compressions,
      video: workbenchMock.video,
      sound: workbenchMock.sound,
      music: workbenchMock.music,
      voice: workbenchMock.voice,
      libraryAssets: workbenchMock.libraryAssets,
      imageEdit: workbenchMock.imageEdit,
      videoUpscale: workbenchMock.videoUpscale,
      videoRemoveBg: workbenchMock.videoRemoveBg,
      lipsync: workbenchMock.lipsync,
      digitalHuman: workbenchMock.digitalHuman,
    },
  })
}
