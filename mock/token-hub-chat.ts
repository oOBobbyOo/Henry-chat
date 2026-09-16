import dayjs from 'dayjs'

/**
 * Agent Chat 控制台 —— 本地 Mock 数据源
 * 字段契约对齐生产网关 `/api/proxy/chat/*` 接口(2026-09 实测快照)
 */

/** 方向建议(空状态起始点) */
export const CHAT_DIRECTIONS: TokenHub.ChatDirection[] = [
  {
    id: 'breakdown',
    title: '梳理一个复杂问题',
    desc: '拆解目标、约束与下一步行动',
  },
  {
    id: 'proposal',
    title: '写一份方案草稿',
    desc: '从目标、步骤到风险快速成稿',
  },
  {
    id: 'explain-code',
    title: '解释一段代码',
    desc: '读懂逻辑，定位问题与改进方向',
  },
]

/** 最近对话(按月分组展示;生产实测仅 8 月一条「新对话」) */
export const CHAT_CONVERSATIONS: TokenHub.ChatConversation[] = [
  {
    id: 'conv-1',
    title: '新对话',
    model: 'Gemini 3.7 Flash',
    workspace: '新工作区',
    last_message_at: dayjs().subtract(1, 'day').toISOString(),
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: '帮我梳理一下「接入多个大模型供应商」这个复杂问题',
        created_at: dayjs().subtract(1, 'day').hour(10).minute(12).toISOString(),
      },
      {
        id: 'm2',
        role: 'assistant',
        content:
          '好的，我们从目标、约束与行动三个角度拆解：\n\n**目标**\n- 统一协议接入多家供应商，降低切换成本\n- 按成本/质量动态路由，保留故障回退能力\n\n**约束**\n- 各家协议(OpenAI / Anthropic / Gemini)与限流策略不同\n- 计费口径与用量归因需要统一\n\n**下一步行动**\n1. 确定网关层协议规范(如统一转 OpenAI 兼容)\n2. 建立供应商健康检查与自动回退策略\n3. 接入用量与成本聚合报表\n\n需要我针对其中某一步展开方案草稿吗？',
        reasoning_content:
          '用户希望梳理多供应商接入问题。先识别三个维度:目标、约束、行动,再给出可执行的步骤。',
        created_at: dayjs().subtract(1, 'day').hour(10).minute(13).toISOString(),
      },
    ],
  },
]

/** 根据用户输入生成模拟回复(控制台演示用,无真实推理) */
export function buildMockReply(input: string, model: string): TokenHub.ChatMessage {
  return {
    id: `mock-${Date.now()}`,
    role: 'assistant',
    content: `已收到你的任务（模型：${model}）：\n\n> ${input.trim()}\n\n这是控制台演示环境的模拟回复。接入真实网关后，这里将返回模型的完整推理结果；启用思考时还会展示推理过程。`,
    reasoning_content: '演示模式: 模拟 Agent 回复,不触发真实推理。',
    created_at: new Date().toISOString(),
  }
}

/** 会话列表响应 */
export function buildChatConversations(): TokenHub.ChatConversationsResponse {
  return { items: CHAT_CONVERSATIONS }
}
