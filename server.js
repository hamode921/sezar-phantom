const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SEZAR WHALE HUNTER PRO</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <style>
            :root { --blue: #00d2ff; --purple: #9d50bb; --bg: #020617; }
            body { background: var(--bg); color: white; font-family: 'Courier New', monospace; margin: 0; padding: 15px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
            .logo { font-size: 35px; font-weight: 900; background: linear-gradient(to right, var(--blue), var(--purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 20px 0; text-align: center; letter-spacing: 5px; }
            #main { width: 100%; max-width: 400px; }
            .card { background: #111827; padding: 18px; border-radius: 15px; margin-bottom: 12px; border: 1px solid #1f2937; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
            #details { display: none; width: 100%; max-width: 450px; background: #000; border: 2px solid #222; padding: 15px; border-radius: 10px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 15px; text-align: center; color: #fbbf24; font-size: 11px; font-weight: bold; }
            .price-box { font-size: 26px; color: #fff; background: #080808; padding: 15px; margin: 10px 0; border: 1px dashed var(--blue); text-align: center; font-weight: bold; }
            .wall-container { margin: 20px 0; background: #050505; padding: 12px; border-radius: 8px; border: 1px solid #111; }
            .sell-t { color: #ef4444; font-weight: bold; border-bottom: 2px solid #ef4444; margin-bottom: 10px; font-size: 14px; text-align: center; }
            .buy-t { color: #22c55e; font-weight: bold; border-bottom: 2px solid #22c55e; margin-bottom: 10px; font-size: 14px; text-align: center; }
            .row { display: flex; justify-content: space-between; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #111; color: #eee; }
            .vol-text { color: #94a3b8; font-size: 12px; }
            .price-text { font-weight: bold; letter-spacing: 1px; }
            #signal-box { padding: 15px; text-align: center; font-weight: bold; border-radius: 8px; margin-top: 15px; font-size: 18px; border: 1px solid rgba(255,255,255,0.1); }
            .back-btn { background: #1e293b; color: white; border: 1px solid #444; padding: 15px; width: 100%; border-radius: 8px; cursor: pointer; margin-top: 20px; font-weight: bold; }
            .contact-btns { display: flex; gap: 10px; margin-top: 20px; width: 100%; max-width: 400px; }
            .btn { flex: 1; text-decoration: none; padding: 12px; border-radius: 8px; text-align: center; font-size: 12px; font-weight: bold; color: white; display: flex; align-items: center; justify-content: center; gap: 8px; }
            .tg { background: #0088cc; } .gm { background: #ea4335; }
        </style>
    </head>
    <body>
        <div id="main"><div class="logo">SEZAR PRO</div><div id="coin-list" style="text-align:center; color:#64748b;">Loading Whale Data...</div></div>
        
        <div id="details">
            <div class="header">🛰️ WHALE HUNTER RADAR - BY SEZAR PHANTOM</div>
            <div id="coin-name" style="text-align:center; font-size:28px; color:var(--blue); font-weight:bold;">BTC</div>
            <div class="price-box" id="det-price">$0.00</div>
            
            <div class="wall-container">
                <div class="sell-t">🟥 HEAVY SELL WALLS (Resistance)</div>
                <div id="sell-list"></div>
            </div>

            <div class="wall-container">
                <div class="buy-t">🟩 HEAVY BUY WALLS (Support)</div>
                <div id="buy-list"></div>
            </div>

            <div id="signal-box">ANALYZING MARKET...</div>
            <button class="back-btn" onclick="goHome()">🏠 RETURN TO LIST</button>
        </div>

        <div class="contact-btns">
            <a href="https://t.me/es44se" class="btn tg"><i class="fab fa-telegram"></i> Telegram</a>
            <a href="mailto:sezarphantom@gmail.com" class="btn gm"><i class="fas fa-envelope"></i> Email</a>
        </div>

        <script>
            const coins = ['BTCUSDT', 'DOGEUSDT', 'PEPEUSDT', 'SHIBUSDT', 'ETHUSDT'];
            let activeCoin = ''; let loop;

            async function updateMain() {
                if(activeCoin) return;
                let html = '';
                for (let s of coins) {
                    try {
                        const r = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=' + s);
                        const d = await r.json();
                        const p = parseFloat(d.price);
                        html += \`<div class="card" onclick="openCoin('\${s}')"><b>\${s.replace('USDT','')}</b><span style="color:var(--blue)">$\${p.toLocaleString()}</span></div>\`;
                    } catch(e) {}
                }
                document.getElementById('coin-list').innerHTML = html;
            }

            async function openCoin(s) {
                activeCoin = s; document.getElementById('main').style.display = 'none'; document.getElementById('details').style.display = 'block';
                updateDetails(); loop = setInterval(updateDetails, 3000);
            }

            function goHome() { activeCoin = ''; clearInterval(loop); document.getElementById('main').style.display = 'block'; document.getElementById('details').style.display = 'none'; }

            function groupHeavyWalls(data, isBuy, currentPrice) {
                const grouped = {};
                // التجميع بمدى 50 دولار للبيتكوين ونسبي للعملات البقية لتجنب الضوضاء
                const step = currentPrice > 1000 ? 50 : (currentPrice * 0.01); 
                
                data.forEach(item => {
                    const price = parseFloat(item[0]);
                    const vol = parseFloat(item[1]);
                    // فقط الأوردرات اللي قيمتها الدولارية محترمة (فلتر الحيتان)
                    if (vol * price > 10000) { 
                        const key = (Math.round(price / step) * step).toFixed(0);
                        grouped[key] = (grouped[key] || 0) + vol;
                    }
                });

                return Object.entries(grouped)
                    .sort((a, b) => isBuy ? b[0] - a[0] : a[0] - b[0])
                    .filter(entry => isBuy ? entry[0] < currentPrice : entry[0] > currentPrice) // استبعاد السعر الحالي
                    .slice(0, 5);
            }

            async function updateDetails() {
                try {
                    const [pRes, dRes] = await Promise.all([
                        fetch('https://api.binance.com/api/v3/ticker/price?symbol=' + activeCoin).then(r => r.json()),
                        fetch('https://api.binance.com/api/v3/depth?limit=500&symbol=' + activeCoin).then(r => r.json())
                    ]);
                    const p = parseFloat(pRes.price);
                    document.getElementById('det-price').innerText = '$' + p.toLocaleString();

                    const finalAsks = groupHeavyWalls(dRes.asks, false, p);
                    const finalBids = groupHeavyWalls(dRes.bids, true, p);

                    document.getElementById('sell-list').innerHTML = finalAsks.map(a => \`
                        <div class="row"><span class="price-text">$\${parseInt(a[0]).toLocaleString()} 🟥</span><span class="vol-text">Vol: \${parseFloat(a[1]).toFixed(1)}</span></div>
                    \`).join('');

                    document.getElementById('buy-list').innerHTML = finalBids.map(b => \`
                        <div class="row"><span class="price-text">$\${parseInt(b[0]).toLocaleString()} 🟩</span><span class="vol-text">Vol: \${parseFloat(b[1]).toFixed(1)}</span></div>
                    \`).join('');

                    const sig = document.getElementById('signal-box');
                    const buyStrength = finalBids.reduce((a,b) => a + b[1], 0);
                    const sellStrength = finalAsks.reduce((a,b) => a + b[1], 0);

                    if(buyStrength > sellStrength * 1.2) { sig.innerText = 'WHALE SIGNAL: BULLISH'; sig.style.background = '#064e3b'; sig.style.color = '#10b981'; }
                    else if(sellStrength > buyStrength * 1.2) { sig.innerText = 'WHALE SIGNAL: BEARISH'; sig.style.background = '#450a0a'; sig.style.color = '#ef4444'; }
                    else { sig.innerText = 'WHALE SIGNAL: NEUTRAL'; sig.style.background = '#1e293b'; sig.style.color = '#fff'; }

                } catch(e) {}
            }
            setInterval(updateMain, 10000); updateMain();
        </script>
    </body>
    </html>
    `);
});

module.exports = app;