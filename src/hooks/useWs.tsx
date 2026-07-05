// #region IMPORTS -> /////////////////////////////////////
import { useCallback, useEffect, useRef, useState } from 'react';
import configManager from '~/managers/configManager';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////

interface WebSocketRequest<T = unknown> {
    action: string;
    payload: T;
}

interface UseWebSocketOptions {
    url: string;
    onMessage?: (message: unknown) => void;
    reconnectIntervalMs?: number;
}
// #endregion SINGLETON --> /////////////////////////////////

export default function useWs({ url, onMessage, reconnectIntervalMs = 5000 }: UseWebSocketOptions): IUseWs {
    // #region STATE --> ///////////////////////////////////////
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    // eslint-disable-next-line no-undef
    const reconTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const onMessageRef = useRef(onMessage);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const connect = useCallback(() => {
        setIsConnecting(true);
        setError(null);
        const route = `ws://${configManager.getConfig.WS_BASEURL}/${url}`;
        const ws = new WebSocket(route);
        ws.onopen = (): void => {
            setIsConnected(true);
            setIsConnecting(false);
        };
        ws.onmessage = (e): void => {
            try {
                const data = JSON.parse(e.data);
                onMessageRef.current?.(data);
            } catch (e) {
                console.error('[WebSocket] Error parsing message: ', e);
            }
        };
        ws.onerror = (): void => {
            // console.error('[WebSocket] Error: ', e.);
            setError('WebSocket error');
            try {
                ws.close(); // <- coupe proprement la WebSocket sinon elle reste bancale
            } catch {
                null;
            }
        };

        ws.onclose = (event): void => {
            console.warn('[WebSocket] Disconnected', event);

            setIsConnected(false);
            setIsConnecting(false);

            const isCleanClosure = event.wasClean || event.code === 1000; // 1000 = Normal Closure

            if (!isCleanClosure) {
                console.warn('[WebSocket] Abnormal closure, not reconnecting automatically');
                return; // STOP ici si fermeture anormale
            }

            // if (reconnectIntervalMs > 0) {
            //     reconTimeoutRef.current = setTimeout(() => {
            //         connect();
            //     }, reconnectIntervalMs);
            // }
        };

        wsRef.current = ws;
    }, [url, reconnectIntervalMs]);

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    const send = useCallback((action: string, payload: unknown = {}): void => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            const message: WebSocketRequest = { action, payload };
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.warn('[WebSocket] Cannot send, socket not connected');
        }
    }, []);

    const close = (): void => {
        wsRef.current.close();
    };

    useEffect(() => {
        connect();
        return (): void => {
            if (reconTimeoutRef.current) {
                clearTimeout(reconTimeoutRef.current);
            }
            close();
        };
    }, [url]);
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return {
        isConnected,
        isConnecting,
        error,
        send,
        close,
    };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseWs {
    isConnected: boolean;
    isConnecting: boolean;
    error?: string;
    send: (action: string, payload: unknown) => void;
    close: () => void;
}
// #enderegion IPROPS --> //////////////////////////////////
