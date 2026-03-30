import { ws } from 'msw';

const WS_CHAT_URL = `${process.env.REACT_APP_API_URL?.replace(/^http/, 'ws') ?? 'ws://localhost:8080'}/ws/chat/v1`;

// STOMP 프레임 파싱
// 형식: COMMAND\nheader:value\n\nbody\0
const parseStompFrame = (raw: string) => {
  const nullStripped = raw.replace(/\0$/, '');
  const newlineIdx = nullStripped.indexOf('\n');
  const command = nullStripped.slice(0, newlineIdx).trim();
  const rest = nullStripped.slice(newlineIdx + 1);
  const bodyIdx = rest.indexOf('\n\n');
  const headerStr = rest.slice(0, bodyIdx);
  const body = rest.slice(bodyIdx + 2);

  const headers: Record<string, string> = {};
  headerStr.split('\n').forEach((line) => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    headers[line.slice(0, colonIdx).trim()] = line.slice(colonIdx + 1).trim();
  });

  return { command, headers, body };
};

// STOMP 프레임 빌드
const buildStompFrame = (
  command: string,
  headers: Record<string, string> = {},
  body = '',
) => {
  const headerStr = Object.entries(headers)
    .map(([k, v]) => `${k}:${v}`)
    .join('\n');
  return `${command}\n${headerStr}\n\n${body}\0`;
};

const chatWs = ws.link(WS_CHAT_URL);

export const chatHandlers = [
  chatWs.addEventListener('connection', ({ client }) => {
    let subscriptionId = '';

    client.addEventListener('message', (event) => {
      const raw = event.data as string;

      // STOMP heartbeat(\n)는 무시
      if (raw === '\n') return;

      const { command, headers, body } = parseStompFrame(raw);

      // 1. CONNECT → CONNECTED 응답
      if (command === 'CONNECT') {
        client.send(buildStompFrame('CONNECTED', { version: '1.2' }));
        return;
      }

      // 2. SUBSCRIBE → subscriptionId 저장
      if (command === 'SUBSCRIBE') {
        subscriptionId = headers['id'] ?? '';
        return;
      }

      // 3. SEND → 메시지 처리
      if (command === 'SEND') {
        let data: Record<string, unknown>;
        try {
          data = JSON.parse(body);
        } catch {
          console.error('[MSW] SEND body 파싱 실패:', body);
          return;
        }

        if (data['type'] === 'CHAT') {
          const destination = headers['destination'] ?? '';

          // CHAT_ACK
          client.send(
            buildStompFrame(
              'MESSAGE',
              {
                destination,
                subscription: subscriptionId,
                'message-id': crypto.randomUUID(),
              },
              JSON.stringify({
                type: 'CHAT_ACK',
                tempId: data['tempId'],
                messageId: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
              }),
            ),
          );

          // 다른 유저 브로드캐스트 시뮬레이션
          setTimeout(() => {
            client.send(
              buildStompFrame(
                'MESSAGE',
                {
                  destination,
                  subscription: subscriptionId,
                  'message-id': crypto.randomUUID(),
                },
                JSON.stringify({
                  type: 'CHAT',
                  messageId: crypto.randomUUID(),
                  senderId: 'user_mock',
                  senderName: '루티봇',
                  content: `"${data['content']}" 받았어요!`,
                  timestamp: new Date().toISOString(),
                }),
              ),
            );
          }, 500);
        }
      }
    });
  }),
];
