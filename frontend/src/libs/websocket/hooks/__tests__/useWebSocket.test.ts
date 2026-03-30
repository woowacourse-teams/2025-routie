import { act, renderHook, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';

import { chatHandlers } from '@/mocks/handlers/chat';

import { useWebSocket } from '../useWebSocket';

const server = setupServer(...chatHandlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const WS_URL = 'ws://localhost:8080/ws/chat/v1';
const SUBSCRIBE_DEST = '/topic/chat/room/1';
const PUBLISH_DEST = '/app/chat/room/1';

describe('useWebSocket', () => {
  it('연결 시 onConnect가 호출된다', async () => {
    const onConnect = vitest.fn();

    renderHook(() =>
      useWebSocket({
        url: WS_URL,
        token: 'test-token',
        subscribeDestination: SUBSCRIBE_DEST,
        publishDestination: PUBLISH_DEST,
        onConnect,
      }),
    );

    await waitFor(() => expect(onConnect).toHaveBeenCalledTimes(1));
  });

  it('연결 전 send는 false를 반환한다', () => {
    const { result } = renderHook(() =>
      useWebSocket({
        url: WS_URL,
        token: 'test-token',
        subscribeDestination: SUBSCRIBE_DEST,
        publishDestination: PUBLISH_DEST,
      }),
    );

    expect(result.current.send({ type: 'CHAT' })).toBe(false);
  });

  it('연결 후 send는 true를 반환한다', async () => {
    const onConnect = vitest.fn();

    const { result } = renderHook(() =>
      useWebSocket({
        url: WS_URL,
        token: 'test-token',
        subscribeDestination: SUBSCRIBE_DEST,
        publishDestination: PUBLISH_DEST,
        onConnect,
      }),
    );

    await waitFor(() => expect(onConnect).toHaveBeenCalledTimes(1));

    let sent = false;
    act(() => {
      sent = result.current.send({ type: 'CHAT', tempId: 'temp-0', content: '테스트' });
    });

    expect(sent).toBe(true);
  });

  it('CHAT 전송 시 CHAT_ACK를 수신한다', async () => {
    const onMessage = vitest.fn();
    const onConnect = vitest.fn();

    const { result } = renderHook(() =>
      useWebSocket({
        url: WS_URL,
        token: 'test-token',
        subscribeDestination: SUBSCRIBE_DEST,
        publishDestination: PUBLISH_DEST,
        onMessage,
        onConnect,
      }),
    );

    await waitFor(() => expect(onConnect).toHaveBeenCalledTimes(1));

    act(() => {
      result.current.send({ type: 'CHAT', tempId: 'temp-1', content: '안녕' });
    });

    await waitFor(() =>
      expect(onMessage).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'CHAT_ACK', tempId: 'temp-1' }),
      ),
    );
  });

  it('CHAT_ACK 이후 브로드캐스트 CHAT 메시지를 수신한다', async () => {
    const onMessage = vitest.fn();
    const onConnect = vitest.fn();

    const { result } = renderHook(() =>
      useWebSocket({
        url: WS_URL,
        token: 'test-token',
        subscribeDestination: SUBSCRIBE_DEST,
        publishDestination: PUBLISH_DEST,
        onMessage,
        onConnect,
      }),
    );

    await waitFor(() => expect(onConnect).toHaveBeenCalledTimes(1));

    act(() => {
      result.current.send({ type: 'CHAT', tempId: 'temp-2', content: '테스트 메시지' });
    });

    await waitFor(
      () =>
        expect(onMessage).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'CHAT',
            senderName: '루티봇',
            content: '"테스트 메시지" 받았어요!',
          }),
        ),
      { timeout: 2000 },
    );
  });
});
