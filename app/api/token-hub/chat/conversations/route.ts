import { NextResponse } from 'next/server'

import { buildChatConversations } from '@/mock/token-hub-chat'

/**
 * GET /api/token-hub/chat/conversations
 * Agent Chat 最近对话列表
 */
export async function GET() {
  return NextResponse.json(buildChatConversations())
}
