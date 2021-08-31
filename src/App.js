import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import './App.css'

function App() {
  const [ticker, setTicker] = useState({})
  const [tradingView, setTradingView] = useState({})
  const [config, setConfig] = useState({
    buy: 0,
    sell: 0,
    side: 'BUY',
    symbol: 'BTCUSDT',
  })

  const [profit, setProfit] = useState({
    value: 0,
    perc: 0,
    lastBuy: 0,
  })

  function processData(ticker) {
    const lastPrice = parseFloat(ticker.c)
    if (config.side === 'BUY' && config.buy > 0 && lastPrice <= config.buy) {
      console.log('BUY ' + lastPrice)
      config.side = 'SELL'

      setProfit({
        value: profit.value,
        perc: profit.perc,
        lasBuy: lastPrice,
      })
    } else if (
      config.side === 'SELL' &&
      config.sell > profit.lastBuy &&
      lastPrice >= config.sell
    ) {
      console.log('SELL ' + lastPrice)
      config.side = 'BUY'
      const lastProfit = lastPrice - profit.lastBuy

      setProfit({
        value: profit.value + lastProfit,
        perc: profit.perc + ((lastPrice * 100) / profit.lastBuy - 100),
        lasBuy: 0,
      })
    }
  }

  const { lastJsonMessage } = useWebSocket(
    'wss://stream.binance.com:9443/stream?streams=' +
      config.symbol.toLowerCase() +
      '@ticker',
    {
      onMessage: () => {
        if (lastJsonMessage && lastJsonMessage.data) {
          if (
            lastJsonMessage.stream ===
            config.symbol.toLowerCase() + '@ticker'
          ) {
            setTicker(lastJsonMessage.data)
            processData(lastJsonMessage.data)
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
      symbol: 'BINANCE:' + config.symbol,
      interval: '60',
      timezone: 'Etc/UTC',
      theme: 'dark',

      style: '1',
      locale: 'br',
      toolbar_bg: '#f1f3f6',
      enable_publishing: true,
      withdateranges: true,

      hide_side_toolbar: false,
      allow_symbol_change: true,
      details: true,
      hotlist: true,
      calendar: true,
      container_id: 'tradingview_f658d',
    })
    setTradingView(tv)
  }, [config.symbol])

  function onSymbolChange(event) {
    setConfig((prevState) => ({ ...prevState, symbol: event.target.value }))
  }
  function onValueChange(event) {
    setConfig((prevState) => ({
      ...prevState,
      [event.target.id]: parseFloat(event.target.value),
    }))
  }

  return (
    <div>
      <h2>SniperBot 1.0</h2>
      <div className="tradingview-widget-container">
        <div id="tradingview_f658d"></div>
      </div>
      <div className="dashboard">
        <div className="a">
          <b>Snipe:</b> <br />
          Symbol:
          <select
            id="symbol"
            defaultValue={config.symbol}
            onChange={onSymbolChange}
          >
            <option>BTCUSDT</option>
            <option>ETHUSDT</option>
          </select>
          <br />
          Buy at:
          <input
            type="number"
            id="buy"
            defaultValue={config.buy}
            onChange={onValueChange}
          />
          <br />
          Sell at:
          <input
            type="number"
            id="sell"
            defaultValue={config.sell}
            onChange={onValueChange}
          />
        </div>
        <div>
          <b>Profit</b> <br />
          Profit: {profit && profit.value.toFixed(8)} <br />
          Profit %: {profit && profit.perc.toFixed(2)}
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
