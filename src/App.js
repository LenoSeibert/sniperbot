import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import './App.css'

function App() {
  const [ticker, setTicker] = useState({})
  const [tradingView, setTradingView] = useState({})
  const { lastJsonMessage } = useWebSocket(
    'wss://stream.binance.com:9443/stream?streams=btcusdt@ticker',
    {
      onMessage: () => {
        if (lastJsonMessage && lastJsonMessage.data) {
          if (lastJsonMessage.stream === 'btcusdt@ticker') {
            setTicker(lastJsonMessage.data)
          }
        }
      },
      onError: (event) => {
        alert(event)
      },
    }
  )

  useEffect(() => {
    const tv = new window.TradingView.widget({
      autosize: true,
      symbol: 'BINANCE:BTCUSDT',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'br',
      toolbar_bg: '#f1f3f6',
      enable_publishing: true,
      withdateranges: true,
      range: 'ALL',
      hide_side_toolbar: false,
      allow_symbol_change: true,
      details: true,
      hotlist: true,
      calendar: true,
      container_id: 'tradingview_f658d',
    })
    setTradingView(tv)
  }, [])

  return (
    <div className="">
      <h2>SniperBot 1.0</h2>
      <div className="tradingview-widget-container">
        <div id="tradingview_f658d"></div>
      </div>
      <div className="dashboard">
        <div className="a">
          <b>Snipe:</b> <br />
          Symbol:
          <select name="" id="symbol" defaultValue={'BTCUSDT'}>
            <option value="">BTCUSDT</option>
            <option value="">ETHUSDT</option>
          </select>
          <br />
          Buy at: <input type="number" name="" id="buy" defaultValue={0} />{' '}
          <br />
          Sell at: <input type="number" name="" id="sell" defaultValue={0} />
        </div>
        <div>
          <b>Ticker 24H</b>
          <br />
          Open:{ticker && ticker.o} <br />
          Hight:{ticker && ticker.h} <br />
          Low:{ticker && ticker.l} <br />
          Last:{ticker && ticker.c} <br />
          Change %:{ticker && ticker.P} <br />
        </div>
      </div>
    </div>
  )
}

export default App
