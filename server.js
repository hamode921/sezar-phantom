const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SEZAR PHANTOM PRO</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <style>
            :root { --neon-blue: #00d2ff; --neon-purple: #9d50bb; --bg: #020617; }
            body { background: var(--bg); color: white; font-family: monospace; margin: 0; padding: 15px; display: flex; flex-direction: column; align-items: center; }
            .logo-text { font-size: 35px; font-weight: 900; background: linear-gradient(to right, #00d2ff, #9d50bb); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 20px 0; letter-spacing: 5px; }
            
            /* الصفحة الرئيسية */
            #main-page { width: 100%; max-width: 400px; }
            .coin-btn { background: rgba(30, 41, 59, 0.5); padding: 20px; border-radius: 15px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; cursor: pointer; transition: 0.3s; }
            .coin-btn:hover { border-color: var(--neon-blue); transform: scale(1.02); }

            /* صفحة التفاصيل (مثل الصورة اللي ارسلتها) */
            #details-page { display: none; width: 100%; max-width: 450px; background: #000; border: 2px solid #333; padding: 15px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
            .header-info { border-bottom: 2px double #555; padding-bottom: 10px; margin-bottom: 15px; text-align: center; color: #fbbf24; }
            .price-bar { font-size: 22px; color: #fff; background: #111; padding: 10px; margin: 10px 0; border: 1px dashed #444; }
            .wall-box { margin: 15px 0; }
            .sell-title { color: #ef4444; font-weight: bold; border-bottom: 1px solid #ef4444; }
            .buy-title { color: #22c55e; font-weight: bold; border-bottom: 1px solid #22c55e; }
            .data-row { display: flex; justify-content: space-between; font-size: 13px; padding: 5px 0; border-bottom: 1px solid #222; }
            .back-btn { background: #334155; color: white; border: none; padding: 10px; width: 100%; border-radius: 5px; cursor: pointer; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div id="main-page">
            <h1 class="logo-text">SEZAR PRO</h1>
            <div id="coin-list">جاري تحميل الرادار...</div>
        </div>

        <div id="details-page">
            <div class="header-info">
                <div>🛰️ VICTUS RADAR PRO - BY SEZAR</div>
                <div style="font-size:10px; color:#888;">ID: SEZAR_PHANTOM_49D7A</div>
            </div>
            <div id="target-coin" style="text-align:center; font-size:24px; font-weight:bold; color:var(--neon-blue);">BTC</div>
            <div class="price-bar">PRICE: <span id="live-price">$0.00</span> | <span style="color:#22c55e;">BUY: 55.2%</span></div>
            
            <div class="wall-box">
                <div class="sell-title">🔴 MAJOR SELL WALLS (Targets):</div>
                <div id="sell-walls"></div>
            </div>

            <div class="wall-box">
                <div class="buy-title">🟢 MAJOR BUY WALLS (Supports):</div>
                <div id="buy-walls"></div>
            </div>

            <div id="signal" style="background:#22c55e; color:#000; padding:5px; text-align:center; font-weight:bold;">SIGNAL: BULLISH</div>
            <button class="back-btn" onclick="showMain()">🏠 العودة للرئيسية</button>
        </div>

        <script>
            const symbols = ['BTCUSDT', 'DOGEUSDT', 'PEPEUSDT', 'SHIBUSDT', 'XAUUSDT'];
            let currentSymbol = '';

            async function updateMain() {
                const responses = await Promise.all(symbols.map(s => fetch('https://api.binance.com/api/v3/ticker/price?symbol=' + s)));
                const data = await Promise.all(responses.map(r => r.json()));
                document.getElementById('coin-list').innerHTML = data.map(item => \`
                    <div class="coin-btn" onclick="showDetails('\${item.symbol}')">
                        <span>\${item.symbol.replace('USDT','')}</span>
                        <span style="color:var(--neon-blue)">$\${parseFloat(item.price).toFixed(2)}</span>
                    </div>
                \`).join('');
            }

            async function showDetails(symbol) {
                currentSymbol = symbol;
                document.getElementById('main-page').style.display = 'none';
                document.getElementById('details-page').style.display = 'block';
                document.getElementById('target-coin').innerText = symbol.replace('USDT','');
                updateDetails();
            }

            function showMain() {
                document.getElementById('main-page').style.display = 'block';
                document.getElementById('details-page').style.display = 'none';
            }

            async function updateDetails() {
                if(document.getElementById('details-page').style.display === 'none') return;
                
                const res = await fetch('https://api.binance.com/api/v3/depth?limit=5&symbol=' + currentSymbol);
                const depth = await res.json();
                const priceRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=' + currentSymbol);
                const priceData = await priceRes.json();

                document.getElementById('live-price').innerText = '$' + parseFloat(priceData.price).toFixed(2);

                document.getElementById('sell-walls').innerHTML = depth.asks.map(a => \`
                    <div class="data-row">
                        <span>🎯 $\${parseFloat(a[0]).toFixed(2)}</span>
                        <span>Vol: \${parseFloat(a[1]).toFixed(2)}M</span>
                    </div>
                \`).join('');

                document.getElementById('buy-walls').innerHTML = depth.bids.map(b => \`
                    <div class="data-row">
                        <span>🛡️ $\${parseFloat(b[0]).toFixed(2)}</span>
                        <span>Vol: \${parseFloat(b[1]).toFixed(2)}M</span>
                    </div>
                \`).join('');
            }

            setInterval(updateMain, 5000);
            setInterval(updateDetails, 2000);
            updateMain();
        </script>
    </body>
    </html>
    `);
});

module.exports = app;