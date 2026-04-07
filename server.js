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
            body { background: #000; color: #fff; font-family: monospace; margin: 0; padding: 10px; display: flex; flex-direction: column; align-items: center; }
            .victus-box { width: 100%; max-width: 450px; background: #000; border: 2px solid #333; padding: 15px; }
            .gold-header { border: 2px double #fbbf24; padding: 10px; text-align: center; margin-bottom: 15px; }
            .gold-header h2 { font-size: 13px; margin: 0; color: #00d2ff; letter-spacing: 1px; }
            .user-bar { border-bottom: 1px dashed #444; padding: 5px 0; margin-bottom: 15px; font-size: 11px; color: #888; text-align: center; }
            .coin-id { font-size: 32px; color: #00d2ff; font-weight: bold; text-align: center; margin: 10px 0; }
            .price-dash { border: 1px dashed #555; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 15px; background: #080808; }
            .stats { display: flex; justify-content: space-around; font-size: 14px; padding: 10px 0; border-bottom: 1px solid #222; margin-bottom: 15px; }
            .wall-title { font-size: 13px; font-weight: bold; border-bottom: 1px solid currentColor; padding-bottom: 5px; margin-bottom: 10px; text-align: center; }
            .row { display: flex; justify-content: space-between; font-size: 13px; padding: 7px 0; border-bottom: 1px solid #111; color: #ccc; }
            .sig-btn { padding: 15px; text-align: center; font-weight: bold; font-size: 18px; margin: 15px 0; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); }
            .back-btn { background: #1a1a1a; color: #666; border: 1px solid #434343; padding: 10px; width: 100%; cursor: pointer; font-size: 12px; }
            .footer { display: flex; gap: 8px; margin-top: 15px; width: 100%; max-width: 450px; }
            .btn-nav { flex: 1; text-decoration: none; padding: 12px; font-size: 12px; font-weight: bold; color: white; display: flex; align-items: center; justify-content: center; gap: 8px; border-radius: 4px; }
            .tg { background: #0088cc; } .gm { background: #ea4335; }
            .list-item { border: 1px solid #222; padding: 15px; margin-bottom: 10px; display: flex; justify-content: space-between; cursor: pointer; background: #080808; width: 100%; max-width: 450px; }
        </style>
    </head>
    <body>
        <div id="menu">
            <div class="gold-header"><h2>🚀 VICTUS RADAR PRO - BY SEZAR PHANTOM 🛰️</h2></div>
            <div id="list-cont">[ SCANNING... ]</div>
        </div>
        <div id="radar-ui" style="display:none;">
            <div class="victus-box">
                <div class="gold-header">
                    <h2>🚀 VICTUS RADAR PRO - BY SEZAR PHANTOM 🛰️</h2>
                    <p style="font-size:10px; color:#fbbf24; margin-top:5px;">TG: @es44se | ✉ sezarphantom@gmail.com</p>
                </div>
                <div class="user-bar">USER: SEZAR_PHANTOM | ID: 49D7A958EEFA</div>
                <div id="coin-name" class="coin-id">BTC</div>
                <div class="price-dash">PRICE: <span id="p-val">$0.00</span></div>
                <div class="stats">
                    <span>BUY: <span id="b-p" style="color:#22c55e;">--%</span></span>
                    <span>SELL: <span id="s-p" style="color:#ef4444;">--%</span></span>
                </div>
                <div><div class="wall-title" style="color:#ef4444;">🔴 HEAVY SELL WALLS (Targets):</div><div id="s-list"></div></div>
                <div style="margin-top:15px;"><div class="wall-title" style="color:#22c55e;">🟢 HEAVY BUY WALLS (Supports):</div><div id="b-list"></div></div>
                <div id="sig-val" class="sig-btn">SIGNAL: ANALYZING</div>
                <button class="back-btn" onclick="goHome()">[ RETURN TO COMMAND CENTER ]</button>
            </div>
        </div>
        <div class="footer"><a href="https://t.me/es44se" class="btn-nav tg"><i class="fab fa-telegram"></i> Telegram</a><a href="mailto:sezarphantom@gmail.com" class="btn-nav gm"><i class="fas fa-envelope"></i> Email</a></div>
        <script>
            const coins = ['BTCUSDT', 'DOGEUSDT', 'PEPEUSDT', 'SHIBUSDT', 'ETHUSDT'];
            let active = ''; let loop;
            async function getList() {
                if(active) return;
                const r = await Promise.all(coins.map(s => fetch('https://api.binance.com/api/v3/ticker/price?symbol='+s).then(res=>res.json())));
                document.getElementById('list-cont').innerHTML = r.map(i => \`
                    <div class="list-item" onclick="startRadar('\${i.symbol}')"><b>\${i.symbol.replace('USDT','')}</b><span style="color:#00d2ff;">$\${parseFloat(i.price).toLocaleString()}</span></div>\`).join('');
            }
            async function startRadar(s) {
                active = s; document.getElementById('menu').style.display='none'; document.getElementById('radar-ui').style.display='block';
                document.getElementById('coin-name').innerText = s.replace('USDT',''); update(); loop = setInterval(update, 3000);
            }
            function goHome() { active = ''; clearInterval(loop); document.getElementById('menu').style.display='block'; document.getElementById('radar-ui').style.display='none'; }
            
            async function update() {
                try {
                    const [pR, dR] = await Promise.all([
                        fetch('https://api.binance.com/api/v3/ticker/price?symbol='+active).then(res=>res.json()),
                        fetch('https://api.binance.com/api/v3/depth?limit=1000&symbol='+active).then(res=>res.json())
                    ]);
                    const p = parseFloat(pR.price);
                    document.getElementById('p-val').innerText = '$' + p.toLocaleString();
                    
                    const scanRange = (data, isBuy) => {
                        const step = p > 1000 ? 500 : p * 0.05;
                        const walls = [];
                        for(let i=1; i<=4; i++) {
                            const target = isBuy ? p-(step*i) : p+(step*i);
                            // البحث عن أكبر سيولة في نطاق 250$ حول الهدف (Deep Scan)
                            const area = data.filter(w => Math.abs(parseFloat(w[0]) - target) < 250);
                            const vol = area.reduce((a, b) => a + parseFloat(b[1]), 0);
                            walls.push({ price: target, vol: vol.toFixed(1) });
                        }
                        return walls;
                    };

                    const sWalls = scanRange(dR.asks, false);
                    const bWalls = scanRange(dR.bids, true);
                    const bV = dR.bids.reduce((a,b)=>a+parseFloat(b[1]),0);
                    const sV = dR.asks.reduce((a,b)=>a+parseFloat(b[1]),0);
                    const bP = ((bV/(bV+sV))*100).toFixed(1);
                    const sP = (100 - bP).toFixed(1);
                    document.getElementById('b-p').innerText = bP + '%';
                    document.getElementById('s-p').innerText = sP + '%';

                    const sig = document.getElementById('sig-val');
                    if(bP > 56) { sig.innerText = 'WHALE SIGNAL: BULLISH'; sig.style.background='#22c55e'; sig.style.color='#000'; }
                    else if(sP > 56) { sig.innerText = 'WHALE SIGNAL: BEARISH'; sig.style.background='#ef4444'; sig.style.color='#fff'; }
                    else { sig.innerText = 'WHALE SIGNAL: NEUTRAL'; sig.style.background='#1e293b'; sig.style.color='#fff'; }

                    document.getElementById('s-list').innerHTML = sWalls.map(w => \`<div class="row"><span style="color:#888;">Vol: \${w.vol}</span><span>$\${parseInt(w.price).toLocaleString()} 🚀</span></div>\`).join('');
                    document.getElementById('b-list').innerHTML = bWalls.map(w => \`<div class="row"><span style="color:#888;">Vol: \${w.vol}</span><span>$\${parseInt(w.price).toLocaleString()} 🛡️</span></div>\`).join('');
                } catch(e) {}
            }
            setInterval(getList, 8000); getList();
        </script>
    </body>
    </html>
    `);
});

module.exports = app;