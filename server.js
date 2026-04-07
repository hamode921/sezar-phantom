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
        .victus-box { width: 100%; max-width: 450px; background: #000; border: 2px solid #333; padding: 15px; }
        .gold-header { border: 2px double #fbbf24; padding: 10px; text-align: center; margin-bottom: 15px; }
        .gold-header h2 { font-size: 13px; margin: 0; color: #00d2ff; letter-spacing: 1px; }
        .gold-header p { font-size: 10px; margin: 5px 0 0 0; color: #fbbf24; font-weight: bold; }
        .user-bar { border-bottom: 1px dashed #444; padding: 5px 0; margin-bottom: 15px; font-size: 11px; color: #888; text-align: center; }
        .coin-id { font-size: 32px; color: #00d2ff; font-weight: bold; text-align: center; margin: 10px 0; }
        .price-dash { border: 1px dashed #555; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 15px; background: #080808; }
        .wall-title { font-size: 13px; font-weight: bold; border-bottom: 1px solid currentColor; padding-bottom: 5px; margin-bottom: 10px; text-align: center; }
        .row { display: flex; justify-content: space-between; font-size: 13px; padding: 7px 0; border-bottom: 1px solid #111; color: #ccc; }
        .sig-btn { padding: 15px; text-align: center; font-weight: bold; font-size: 18px; margin: 15px 0; border-radius: 4px; border: 1px solid #444; transition: 0.5s; }
        .back-btn { background: #1a1a1a; color: #666; border: 1px solid #434343; padding: 10px; width: 100%; cursor: pointer; font-size: 12px; }
        .footer { display: flex; gap: 8px; margin-top: 15px; width: 100%; max-width: 450px; }
        .btn-nav { flex: 1; text-decoration: none; padding: 12px; font-size: 12px; font-weight: bold; color: white; display: flex; align-items: center; justify-content: center; gap: 8px; border-radius: 4px; }
        .tg { background: #0088cc; } .gm { background: #ea4335; }
        #menu { width: 100%; max-width: 450px; }
        .list-item { border: 1px solid #222; padding: 15px; margin-bottom: 10px; display: flex; justify-content: space-between; cursor: pointer; background: #080808; }
    </style>
</head>
<body>
    <div id="menu">
        <div class="gold-header"><h2>🚀 VICTUS RADAR PRO - BY SEZAR PHANTOM 🛰️</h2></div>
        <div id="list-cont">[ SCANNING MARKET... ]</div>
    </div>

    <div id="radar-ui" style="display:none;">
        <div class="victus-box">
            <div class="gold-header">
                <h2>🚀 VICTUS RADAR PRO - BY SEZAR PHANTOM 🛰️</h2>
                <p>TG: @es44se | sezarphantom@gmail.com</p>
            </div>
            <div class="user-bar">USER: SEZAR_PHANTOM | ID: 49D7A958EEFA</div>
            <div id="coin-name" class="coin-id">---</div>
            <div class="price-dash">PRICE: <span id="p-val">$0.00</span></div>
            
            <div><div class="wall-title" style="color:#ef4444;">🔴 MAJOR SELL WALLS (Liquidity):</div><div id="s-list"></div></div>
            <div style="margin-top:15px;"><div class="wall-title" style="color:#22c55e;">🟢 MAJOR BUY WALLS (Liquidity):</div><div id="b-list"></div></div>
            
            <div id="sig-val" class="sig-btn">SIGNAL: WAIT</div>
            <button class="back-btn" onclick="location.reload()">[ RETURN TO COMMAND CENTER ]</button>
        </div>
    </div>

    <div class="footer">
        <a href="https://t.me/es44se" class="btn-nav tg">Telegram</a>
        <a href="mailto:sezarphantom@gmail.com" class="btn-nav gm">Email</a>
    </div>

    <script>
    const coins = ['BTCUSDT','ETHUSDT','DOGEUSDT','PEPEUSDT','XAUUSDT'];
    let active = '';
    let historySignals = [];

    async function loadCoins(){
        const res = await Promise.all(coins.map(c => fetch('https://api.binance.com/api/v3/ticker/price?symbol='+c).then(r=>r.json())));
        document.getElementById('list-cont').innerHTML = res.map(r => 
            '<div class="list-item" onclick="startRadar(\\''+r.symbol+'\\')"><b>'+r.symbol+'</b><span>$'+parseFloat(r.price).toLocaleString()+'</span></div>'
        ).join('');
    }

    function startRadar(sym){
        active = sym;
        document.getElementById('menu').style.display='none';
        document.getElementById('radar-ui').style.display='block';
        document.getElementById('coin-name').innerText = sym;
        setInterval(update, 3000);
    }

    function getRealWalls(orders, isBuy){
        return orders.map(o => ({
            price: parseFloat(o[0]),
            vol: parseFloat(o[1]),
            liq: parseFloat(o[0]) * parseFloat(o[1])
        }))
        .sort((a,b)=>b.liq-a.liq).slice(0,5)
        .sort((a,b)=> isBuy ? b.price-a.price : a.price-b.price);
    }

    async function update(){
        if(!active) return;
        try{
            const [pR,dR] = await Promise.all([
                fetch('https://api.binance.com/api/v3/ticker/price?symbol='+active).then(r=>r.json()),
                fetch('https://api.binance.com/api/v3/depth?symbol='+active+'&limit=1000').then(r=>r.json())
            ]);
            const p = parseFloat(pR.price);
            document.getElementById('p-val').innerText = '$'+p.toLocaleString();

            const bWalls = getRealWalls(dR.bids, true);
            const sWalls = getRealWalls(dR.asks, false);

            const totalBuy = dR.bids.reduce((a,b)=>a+(parseFloat(b[0])*parseFloat(b[1])),0);
            const totalSell = dR.asks.reduce((a,b)=>a+(parseFloat(b[0])*parseFloat(b[1])),0);
            const bP = (totalBuy/(totalBuy+totalSell))*100;
            const sP = 100 - bP;

            let signal = 'NEUTRAL';
            const strongestBuy = bWalls[0]?.liq || 0;
            const strongestSell = sWalls[0]?.liq || 0;

            if (bP > 60 && strongestBuy > strongestSell) signal = 'STRONG BUY';
            else if (bP > 55) signal = 'BUY';
            else if (sP > 60 && strongestSell > strongestBuy) signal = 'STRONG SELL';
            else if (sP > 55) signal = 'SELL';

            historySignals.push(signal);
            if(historySignals.length > 3) historySignals.shift();

            let finalSignal = 'WAIT';
            if(historySignals.every(s => s === signal)) finalSignal = signal;

            const sigBox = document.getElementById('sig-val');
            sigBox.innerText = 'SIGNAL: ' + finalSignal;
            if(finalSignal.includes('BUY')) { sigBox.style.background='#22c55e'; sigBox.style.color='#000'; }
            else if(finalSignal.includes('SELL')) { sigBox.style.background='#ef4444'; sigBox.style.color='#fff'; }
            else { sigBox.style.background='#333'; sigBox.style.color='#fff'; }

            document.getElementById('s-list').innerHTML = sWalls.map(w =>
                '<div class="row"><span>Vol: '+(w.liq/1000000).toFixed(2)+'M</span><span>$'+w.price.toLocaleString()+' 🚀</span></div>'
            ).join('');
            document.getElementById('b-list').innerHTML = bWalls.map(w =>
                '<div class="row"><span>Vol: '+(w.liq/1000000).toFixed(2)+'M</span><span>$'+w.price.toLocaleString()+' 🛡️</span></div>'
            ).join('');
        }catch(e){}
    }
    loadCoins();
    </script>
</body>
</html>
`);
});

app.listen(3000, () => console.log("Server running..."));