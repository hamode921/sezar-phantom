const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>VICTUS RADAR PRO - BY SEZAR</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <style>
            body { background: #000; color: #fff; font-family: monospace; margin: 0; padding: 10px; display: flex; flex-direction: column; align-items: center; }
            
            .victus-container { width: 100%; max-width: 450px; background: #000; border: 2px solid #333; padding: 15px; border-radius: 4px; box-shadow: 0 0 15px rgba(0,0,0,1); }
            
            .header-banner { border: 2px double #efbf04; padding: 8px; text-align: center; margin-bottom: 15px; }
            .header-banner h2 { font-size: 13px; margin: 0; color: #00d2ff; letter-spacing: 1px; }
            .header-banner p { font-size: 10px; margin: 4px 0 0 0; color: #fbbf24; }

            .user-id-bar { border-bottom: 1px dashed #444; padding: 4px 0; margin-bottom: 15px; font-size: 11px; color: #888; text-align: center; }
            
            .coin-id { font-size: 26px; color: #00d2ff; font-weight: bold; text-align: center; margin: 10px 0; }
            .price-display { border: 1px dashed #555; padding: 12px; text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 15px; background: #080808; }
            
            .ratio-box { display: flex; justify-content: space-around; font-size: 13px; padding: 8px 0; border-bottom: 1px solid #222; margin-bottom: 15px; color: #aaa; }
            .sell-val { color: #ef4444; } .buy-val { color: #22c55e; }

            .wall-title { font-size: 13px; font-weight: bold; border-bottom: 1px solid currentColor; padding-bottom: 4px; margin-bottom: 10px; text-align: center; }
            .wall-data { display: flex; justify-content: space-between; font-size: 13px; padding: 3px 0; color: #ccc; }
            
            .signal-btn { background: #22c55e; color: #000; padding: 12px; text-align: center; font-weight: bold; font-size: 16px; margin: 15px 0; border-radius: 2px; }
            
            .home-btn { background: #1a1a1a; color: #666; border: 1px solid #333; padding: 10px; width: 100%; cursor: pointer; font-family: monospace; font-size: 12px; }

            .contact-section { display: flex; gap: 8px; margin-top: 15px; width: 100%; max-width: 450px; }
            .c-link { flex: 1; text-decoration: none; padding: 12px; font-size: 12px; font-weight: bold; color: white; display: flex; align-items: center; justify-content: center; gap: 6px; border-radius: 4px; }
            .tg-b { background: #0088cc; } .gm-b { background: #ea4335; }
            
            #main-menu { width: 100%; max-width: 450px; }
            .coin-row { border: 1px solid #222; padding: 15px; margin-bottom: 8px; display: flex; justify-content: space-between; cursor: pointer; background: #050505; }
        </style>
    </head>
    <body>

        <div id="main-menu">
            <div class="header-banner">
                <h2>🚀 VICTUS RADAR PRO - BY SEZAR PHANTOM 🛰️</h2>
            </div>
            <div id="coin-list">[ INITIALIZING SCANNER... ]</div>
        </div>

        <div id="radar-view" style="display:none;">
            <div class="victus-container">
                <div class="header-banner">
                    <h2>🚀 VICTUS RADAR PRO - BY SEZAR PHANTOM 🛰️</h2>
                    <p>TG: @es44se | ✉ sezarphantom@gmail.com</p>
                </div>
                <div class="user-id-bar">USER: SEZAR_PHANTOM | ID: 49D7A958EEFA</div>
                <div id="active-name" class="coin-id">BTC</div>
                <div class="price-display">PRICE: <span id="cur-price">$0.00</span></div>
                
                <div class="ratio-box">
                    <span>SELL: <span id="s-perc" class="sell-val">--%</span></span>
                    <span>BUY: <span id="b-perc" class="buy-val">--%</span></span>
                </div>

                <div style="margin-bottom:15px;">
                    <div class="wall-title" style="color:#ef4444;">🔴 MAJOR SELL WALLS (Targets):</div>
                    <div id="s-walls"></div>
                </div>

                <div style="margin-bottom:15px;">
                    <div class="wall-title" style="color:#22c55e;">🟢 MAJOR BUY WALLS (Supports):</div>
                    <div id="b-walls"></div>
                </div>

                <div id="signal-text" class="signal-btn">SIGNAL: BULLISH</div>
                <button class="home-btn" onclick="showMenu()">[ RETURN TO LIST ]</button>
            </div>
        </div>

        <div class="contact-section">
            <a href="https://t.me/es44se" class="c-link tg-b"><i class="fab fa-telegram"></i> Telegram</a>
            <a href="mailto:sezarphantom@gmail.com" class="c-link gm-b"><i class="fas fa-envelope"></i> Email</a>
        </div>

        <script>
            const coins = ['BTCUSDT', 'DOGEUSDT', 'PEPEUSDT', 'SHIBUSDT', 'ETHUSDT'];
            let active = ''; let loop;

            async function loadList() {
                if(active) return;
                const res = await Promise.all(coins.map(s => fetch('https://api.binance.com/api/v3/ticker/price?symbol='+s).then(r=>r.json())));
                document.getElementById('coin-list').innerHTML = res.map(i => \`
                    <div class="coin-row" onclick="openRadar('\${i.symbol}')">
                        <b>\${i.symbol.replace('USDT','')}</b>
                        <span style="color:#00d2ff;">$\${parseFloat(i.price).toLocaleString()}</span>
                    </div>
                \`).join('');
            }

            async function openRadar(s) {
                active = s;
                document.getElementById('main-menu').style.display = 'none';
                document.getElementById('radar-view').style.display = 'block';
                document.getElementById('active-name').innerText = s.replace('USDT','');
                updateData();
                loop = setInterval(updateData, 3000);
            }

            function showMenu() {
                active = ''; clearInterval(loop);
                document.getElementById('main-menu').style.display = 'block';
                document.getElementById('radar-view').style.display = 'none';
            }

            async function updateData() {
                try {
                    const [pR, dR] = await Promise.all([
                        fetch('https://api.binance.com/api/v3/ticker/price?symbol='+active).then(r=>r.json()),
                        fetch('https://api.binance.com/api/v3/depth?limit=10&symbol='+active).then(r=>r.json())
                    ]);
                    const p = parseFloat(pR.price);
                    document.getElementById('cur-price').innerText = '$' + p.toLocaleString();
                    
                    const bV = dR.bids.reduce((a,b)=>a+parseFloat(b[1]),0);
                    const sV = dR.asks.reduce((a,b)=>a+parseFloat(b[1]),0);
                    const bP = ((bV/(bV+sV))*100).toFixed(1);
                    const sP = (100 - bP).toFixed(1);

                    document.getElementById('b-perc').innerText = bP + '%';
                    document.getElementById('s-perc').innerText = sP + '%';

                    const sig = document.getElementById('signal-text');
                    if(bP > 50) { sig.innerText = 'SIGNAL: BULLISH'; sig.style.background='#22c55e'; sig.style.color='#000'; }
                    else { sig.innerText = 'SIGNAL: BEARISH'; sig.style.background='#ef4444'; sig.style.color='#fff'; }

                    document.getElementById('s-walls').innerHTML = dR.asks.slice(0,5).map(a => \`
                        <div class="wall-data"><span>🚀 $\${parseFloat(a[0]).toLocaleString()}</span><span>Vol: \${parseFloat(a[1]).toFixed(2)}M</span></div>
                    \`).join('');

                    document.getElementById('b-walls').innerHTML = dR.bids.slice(0,5).map(b => \`
                        <div class="wall-data"><span>🛡️ $\${parseFloat(b[0]).toLocaleString()}</span><span>Vol: \${parseFloat(b[1]).toFixed(2)}M</span></div>
                    \`).join('');
                } catch(e) {}
            }

            setInterval(loadList, 8000);
            loadList();
        </script>
    </body>
    </html>
    `);
});

module.exports = app;