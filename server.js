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
            body { background: var(--bg); color: white; font-family: 'Courier New', Courier, monospace; margin: 0; padding: 15px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
            .logo-text { font-size: 35px; font-weight: 900; background: linear-gradient(to right, #00d2ff, #9d50bb); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 20px 0; letter-spacing: 5px; text-align: center; }
            
            #main-page { width: 100%; max-width: 400px; }
            .coin-btn { background: rgba(30, 41, 59, 0.4); padding: 15px 20px; border-radius: 12px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: 0.3s; }
            .coin-btn:hover { border-color: var(--neon-blue); background: rgba(0, 210, 255, 0.1); }

            #details-page { display: none; width: 100%; max-width: 450px; background: #000; border: 1px solid #333; padding: 15px; border-radius: 8px; }
            .header-info { border-bottom: 1px solid #444; padding-bottom: 10px; margin-bottom: 15px; text-align: center; font-size: 12px; color: #fbbf24; }
            .price-bar { font-size: 20px; color: #fff; background: #111; padding: 8px; margin: 10px 0; border: 1px dashed #555; text-align: center; }
            
            .wall-box { margin: 15px 0; background: #080808; padding: 10px; border-radius: 5px; }
            .sell-title { color: #ef4444; font-weight: bold; font-size: 14px; margin-bottom: 8px; border-bottom: 1px solid #ef4444; }
            .buy-title { color: #22c55e; font-weight: bold; font-size: 14px; margin-bottom: 8px; border-bottom: 1px solid #22c55e; }
            
            .data-row { display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; border-bottom: 1px solid #111; color: #ccc; }
            .back-btn { background: #1e293b; color: white; border: 1px solid #444; padding: 12px; width: 100%; border-radius: 5px; cursor: pointer; margin-top: 20px; font-weight: bold; }
            
            .loader { text-align: center; padding: 40px; color: #64748b; }
        </style>
    </head>
    <body>
        <div id="main-page">
            <h1 class="logo-text">SEZAR PRO</h1>
            <div id="coin-list" class="loader"><i class="fas fa-spinner fa-spin"></i> جاري تشغيل الرادار...</div>
        </div>

        <div id="details-page">
            <div class="header-info">🛰️ VICTUS RADAR PRO - BY SEZAR PHANTOM</div>
            <div id="target-coin" style="text-align:center; font-size:24px; color:var(--neon-blue); font-weight:bold;">BTC</div>
            <div class="price-bar">PRICE: <span id="live-price">$0.00</span></div>
            
            <div class="wall-box">
                <div class="sell-title">🔴 MAJOR SELL WALLS (Targets):</div>
                <div id="sell-walls"></div>
            </div>

            <div class="wall-box">
                <div class="buy-title">🟢 MAJOR BUY WALLS (Supports):</div>
                <div id="buy-walls"></div>
            </div>

            <div id="signal" style="background:#22c55e; color:#000; padding:5px; text-align:center; font-weight:bold; font-size:12px;">SIGNAL: BULLISH</div>
            <button class="back-btn" onclick="showMain()">🏠 العودة للقائمة</button>
        </div>

        <script>
            const symbols = ['BTCUSDT', 'DOGEUSDT', 'PEPEUSDT', 'SHIBUSDT', 'ETHUSDT'];
            let currentSymbol = '';
            let detailInterval;

            async function updateMain() {
                try {
                    const responses = await Promise.all(symbols.map(s => 
                        fetch('https://api.binance.com/api/v3/ticker/price?symbol=' + s).then(res => res.json())
                    ));
                    document.getElementById('coin-list').innerHTML = responses.map(item => \`
                        <div class="coin-btn" onclick="showDetails('\${item.symbol}')">
                            <span style="font-weight:bold;">\${item.symbol.replace('USDT','')}</span>
                            <span style="color:var(--neon-blue)">$\${parseFloat(item.price).toFixed(item.price < 1 ? 6 : 2)}</span>
                        </div>
                    \`).join('');
                } catch (e) { console.log("Error loading prices"); }
            }

            async function updateDetails() {
                if(!currentSymbol) return;
                try {
                    const [priceRes, depthRes] = await Promise.all([
                        fetch('https://api.binance.com/api/v3/ticker/price?symbol=' + currentSymbol).then(r => r.json()),
                        fetch('https://api.binance.com/api/v3/depth?limit=5&symbol=' + currentSymbol).then(r => r.json())
                    ]);

                    document.getElementById('live-price').innerText = '$' + parseFloat(priceRes.price).toFixed(priceRes.price < 1 ? 6 : 2);
                    
                    document.getElementById('sell-walls').innerHTML = depthRes.asks.map(a => \`
                        <div class="data-row"><span>🚀 $\${parseFloat(a[0]).toFixed(priceRes.price < 1 ? 6 : 2)}</span><span>Vol: \${parseFloat(a[1]).toFixed(1)}M</span></div>
                    \`).join('');

                    document.getElementById('buy-walls').innerHTML = depthRes.bids.map(b => \`
                        <div class="data-row"><span>🛡️ $\${parseFloat(b[0]).toFixed(priceRes.price < 1 ? 6 : 2)}</span><span>Vol: \${parseFloat(b[1]).toFixed(1)}M</span></div>
                    \`).join('');
                } catch (e) { console.log("Detail update error"); }
            }

            function showDetails(symbol) {
                currentSymbol = symbol;
                document.getElementById('main-page').style.display = 'none';
                document.getElementById('details-page').style.display = 'block';
                document.getElementById('target-coin').innerText = symbol.replace('USDT','');
                updateDetails();
                detailInterval = setInterval(updateDetails, 2000);
            }

            function showMain() {
                currentSymbol = '';
                clearInterval(detailInterval);
                document.getElementById('main-page').style.display = 'block';
                document.getElementById('details-page').style.display = 'none';
            }

            setInterval(updateMain, 4000);
            updateMain();
        </script>
    </body>
    </html>
    `);
});

module.exports = app;