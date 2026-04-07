const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SEZAR WHALE RADAR PRO</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <style>
            :root { --blue: #00d2ff; --purple: #9d50bb; --bg: #020617; }
            body { background: var(--bg); color: white; font-family: monospace; margin: 0; padding: 15px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
            .logo { font-size: 35px; font-weight: 900; background: linear-gradient(to right, var(--blue), var(--purple)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 20px 0; text-align: center; letter-spacing: 3px; }
            #main { width: 100%; max-width: 400px; }
            .card { background: #111827; padding: 18px; border-radius: 15px; margin-bottom: 12px; border: 1px solid #1f2937; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
            #details { display: none; width: 100%; max-width: 450px; background: #000; border: 1px solid #333; padding: 15px; border-radius: 10px; }
            .header { border-bottom: 1px solid #444; padding-bottom: 10px; margin-bottom: 15px; text-align: center; color: #fbbf24; font-size: 11px; }
            .price-box { font-size: 24px; color: #fff; background: #080808; padding: 10px; margin: 10px 0; border: 1px dashed #444; text-align: center; font-weight: bold; }
            .stats-bar { display: flex; justify-content: space-around; background: #111; padding: 10px; border-radius: 5px; margin: 10px 0; font-size: 14px; border: 1px solid #222; }
            .buy-text { color: #22c55e; font-weight: bold; } .sell-text { color: #ef4444; font-weight: bold; }
            .wall-container { margin: 15px 0; background: #050505; padding: 10px; border-radius: 5px; }
            .sell-t { color: #ef4444; font-weight: bold; border-bottom: 1px solid #ef4444; margin-bottom: 5px; font-size: 13px; text-align: center; }
            .buy-t { color: #22c55e; font-weight: bold; border-bottom: 1px solid #22c55e; margin-bottom: 5px; font-size: 13px; text-align: center; }
            .row { display: flex; justify-content: space-between; font-size: 12px; padding: 6px 0; border-bottom: 1px solid #111; color: #aaa; }
            #signal-box { padding: 12px; text-align: center; font-weight: bold; border-radius: 8px; margin-top: 10px; font-size: 16px; transition: 0.5s; }
            .contact-btns { display: flex; gap: 10px; margin-top: 20px; width: 100%; max-width: 400px; }
            .btn { flex: 1; text-decoration: none; padding: 12px; border-radius: 8px; text-align: center; font-size: 12px; font-weight: bold; color: white; display: flex; align-items: center; justify-content: center; gap: 8px; }
            .tg { background: #0088cc; } .gm { background: #ea4335; }
            .back-btn { background: #1e293b; color: white; border: 1px solid #444; padding: 12px; width: 100%; border-radius: 8px; cursor: pointer; margin-top: 15px; }
        </style>
    </head>
    <body>
        <div id="main"><div class="logo">SEZAR PRO</div><div id="coin-list" style="text-align:center; color:#64748b;">جاري استدعاء الحيتان...</div></div>
        <div id="details">
            <div class="header">🛰️ VICTUS RADAR PRO - BY SEZAR PHANTOM</div>
            <div id="coin-name" style="text-align:center; font-size:24px; color:var(--blue); font-weight:bold;">BTC</div>
            <div class="price-box">PRICE: <span id="det-price">$0.00</span></div>
            <div class="stats-bar">
                <div>BUY: <span id="buy-perc" class="buy-text">--%</span></div>
                <div>SELL: <span id="sell-perc" class="sell-text">--%</span></div>
            </div>
            <div class="wall-container"><div class="sell-t">🟥 HEAVY SELL WALLS (Targets > $500)</div><div id="sell-list"></div></div>
            <div class="wall-container"><div class="buy-t">🟩 HEAVY BUY WALLS (Supports > $500)</div><div id="buy-list"></div></div>
            <div id="signal-box">ANALYZING...</div>
            <button class="back-btn" onclick="goHome()">🏠 العودة للقائمة</button>
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
                        html += \`<div class="card" onclick="openCoin('\${s}')"><b>\${s.replace('USDT','')}</b><span style="color:var(--blue)">$\${parseFloat(d.price).toLocaleString()}</span></div>\`;
                    } catch(e) {}
                }
                document.getElementById('coin-list').innerHTML = html;
            }
            async function openCoin(s) {
                activeCoin = s; document.getElementById('main').style.display = 'none'; document.getElementById('details').style.display = 'block';
                updateDetails(); loop = setInterval(updateDetails, 3000);
            }
            function goHome() { activeCoin = ''; clearInterval(loop); document.getElementById('main').style.display = 'block'; document.getElementById('details').style.display = 'none'; }
            
            async function updateDetails() {
                try {
                    const [pRes, dRes] = await Promise.all([
                        fetch('https://api.binance.com/api/v3/ticker/price?symbol=' + activeCoin).then(r => r.json()),
                        fetch('https://api.binance.com/api/v3/depth?limit=500&symbol=' + activeCoin).then(r => r.json())
                    ]);
                    const p = parseFloat(pRes.price);
                    document.getElementById('det-price').innerText = '$' + p.toLocaleString();

                    // فلترة وتجميع الجدران البعيدة بفرق 500$ أو 1% للعملات الصغيرة
                    const step = p > 1000 ? 500 : (p * 0.05); 
                    const filterDepth = p > 1000 ? 400 : (p * 0.02);

                    const processWalls = (data, isBuy) => {
                        const filtered = data.filter(wall => isBuy ? (parseFloat(wall[0]) < p - filterDepth) : (parseFloat(wall[0]) > p + filterDepth));
                        const grouped = {};
                        filtered.forEach(w => {
                            const priceKey = (Math.round(parseFloat(w[0]) / 100) * 100);
                            grouped[priceKey] = (grouped[priceKey] || 0) + parseFloat(w[1]);
                        });
                        return Object.entries(grouped)
                            .sort((a,b) => isBuy ? b[0]-a[0] : a[0]-b[0])
                            .slice(0, 5);
                    };

                    const finalAsks = processWalls(dRes.asks, false);
                    const finalBids = processWalls(dRes.bids, true);

                    const totalBuy = dRes.bids.reduce((a, b) => a + parseFloat(b[1]), 0);
                    const totalSell = dRes.asks.reduce((a, b) => a + parseFloat(b[1]), 0);
                    const buyP = ((totalBuy / (totalBuy + totalSell)) * 100).toFixed(1);
                    const sellP = (100 - buyP).toFixed(1);

                    document.getElementById('buy-perc').innerText = buyP + '%';
                    document.getElementById('sell-perc').innerText = sellP + '%';

                    const sig = document.getElementById('signal-box');
                    // تثبيت الإشارة: لا تتغير إلا إذا تجاوزت النسبة 57% لتقليل الضوضاء
                    if(buyP > 57) { sig.innerText = 'SIGNAL: STRONG BUY'; sig.style.background = '#22c55e'; sig.style.color = '#000'; }
                    else if(sellP > 57) { sig.innerText = 'SIGNAL: STRONG SELL'; sig.style.background = '#ef4444'; sig.style.color = '#fff'; }
                    else { sig.innerText = 'SIGNAL: WAITING WHALES...'; sig.style.background = '#334155'; sig.style.color = '#fff'; }

                    document.getElementById('sell-list').innerHTML = finalAsks.map(a => \`<div class="row"><span>$\${parseInt(a[0]).toLocaleString()} 🚀</span><span>Vol: \${parseFloat(a[1]).toFixed(1)}M</span></div>\`).join('');
                    document.getElementById('buy-list').innerHTML = finalBids.map(b => \`<div class="row"><span>$\${parseInt(b[0]).toLocaleString()} 🛡️</span><span>Vol: \${parseFloat(b[1]).toFixed(1)}M</span></div>\`).join('');
                } catch(e) {}
            }
            setInterval(updateMain, 7000); updateMain();
        </script>
    </body>
    </html>
    `);
});

module.exports = app;