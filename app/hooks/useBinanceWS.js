"use client";

import { useEffect, useRef, useState } from "react";

export function useBinanceWS(stream) {
  const [data, setData] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const url = `wss://stream.binance.com:9443/ws/${stream}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        setData(json);
      } catch (e) {
        console.error("Error parsing WS message", e);
      }
    };

    ws.onerror = (err) => {
      console.error("WS error", err);
    };

    ws.onclose = () => {
      console.log("WS closed:", stream);
    };

    return () => ws.close();
  }, [stream]);

  return data;
}
