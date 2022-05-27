//LiteLoaderScript Dev Helper
/// <reference path="D:/PF/CODE/VSCODE/Minecraft/LLPlugin/Library/JS/Api.js" /> 



let c1 = {
    "Money": true,
    "time": 1000,
    "sidebar": {
        "title": "§l§dTSC",
        "json": {
            "§l§b欢迎加入TSC": 8,
            "§3******玩家信息******": 7,
            "    §b玩家:§e$player": 6,
            "    §a余额:§e$money§f$yuan": 5,
            "§3******网络状况******": 4,
            "    §aPing:$pingms": 3,
            "    §aLoss:$loss%": 2,
            "§l§e22222": 1,
            "$X,$Y,$Z $dim($dimid)":0
        }
    }
},
    config = data.openConfig('.\\plugins\\Timiya\\config\\Tsidebar.json', 'json', JSON.stringify(c1)),
    sdisplay = new Map(), toney, SID, tick = 0,
    time_new = new Date().getTime(),
    time_old = new Date().getTime();

function Tick() {
    tick++;
    if (tick == 20) {
        tick = 0;
        time_old = time_new;
        time_new = new Date().getTime();
    }
}

function plgcmd(pl, cmd) {
    if (sdisplay.has(pl.xuid)) {
        sdisplay.delete(pl.xuid);
        pl.removeSidebar();
        pl.tell('§l§d[Tsidebar] §b个人侧边栏显示已关闭', 0);
    } else {
        sdisplay.set(pl.xuid, true);
        pl.tell('§l§d[Tsidebar] §b个人侧边栏显示已开启', 0);
    }
}

function plqcmd(pl, cmd) {
    if (SID != null) {
        clearInterval(SID);
        SID = null;
        let list = mc.getOnlinePlayers();
        for (let i = 0; i < list.length; i++) {
            list[i].removeSidebar();
        }
        pl.tell('§l§d[Tsidebar] §b全局侧边栏显示已关闭', 0);
    } else {
        SID = setInterval(StartSet, config.get("time"));
        pl.tell('§l§d[Tsidebar] §b全局侧边栏显示已开启', 0);
    }
}

function consolecmd(cmd) {
    if (SID != null) {
        clearInterval(SID);
        SID = null;
        let list = mc.getOnlinePlayers();
        for (let i = 0; i < list.length; i++) {
            list[i].removeSidebar();
        }
        mc.sendCmdOutput('[Tsidebar] 全局侧边栏显示已关闭');
    } else {
        SID = setInterval(StartSet, config.get("time"));
        mc.sendCmdOutput('[Tsidebar] 全局侧边栏显示已开启');
    }
}

function StartSet() {
    try {
        if (SID != null) {
            let time = system.getTimeObj(),
                all = config.get("sidebar"), tit = all["title"],
                pls = mc.getOnlinePlayers(),
                content = JSON.stringify(all["json"])
                    .replace(/\$TMY/g, time.Y)
                    .replace(/\$TMM/g, time.M).replace(/\$TMD/g, time.D)
                    .replace(/\$TMh/g, time.h).replace(/\$TMm/g, time.m)
                    .replace(/\$TMs/g, time.s).replace(/\$bdsv/g, mc.getBDSVersion())
                    .replace(/\$tps/g, (1000 * 20 / (time_new - time_old)).toFixed(1))
                    .replace(/\$pllen/g, JSON.stringify(pls.length));
            for (let xuid of sdisplay.keys()) {
                let pl = mc.getPlayer(xuid);
                if (pl == null) { continue; }//miss
                let info = pl.getDevice(), hand = pl.getHand(), pos = pl.pos,
                    con = content.replace(/\$loss/g, info.avgPacketLoss)
                        .replace(/\$health/g, pl.health).replace(/\$player/g, pl.name)
                        .replace(/\$speed/g, pl.speed.toFixed(2)).replace(/\$ping/g, info.avgPing)
                        .replace(/\$handitname/g, (hand.name || "Air"))
                        .replace(/\$handittype/g, (hand.type || "minecraft:air"))
                        .replace(/\$X/g, pos.x.toFixed(2)).replace(/\$Y/g, pos.y.toFixed(2)).replace(/\$Z/g, pos.z.toFixed(2))
                        .replace(/\$dimid/g, pos.dimid).replace(/\$dim/g, pos.dim);
                if (toney != null) {
                    con = con.replace(/\$money/g, toney('getmoney', pl.realName))
                        .replace(/\$yuan/g, toney('moneyname'));
                }
                pl.removeSidebar();
                pl.setSidebar(tit, JSON.parse(SScore(con, pl)));
            }
        }
    } catch (_) { }
}

function SScore(str, pl) {
    let line = str.search(/\$score\[/) + 7;
    while ((line - 7) != -1) {
        let line1 = line;
        while (str[line1] != ']') {
            line1 += 1;
        }
        let score = str.substr(line, (line1 - line));
        str = replacepos(str, (line - 7), (line1 + 1), JSON.stringify(pl.getScore(score)));
        line = str.search(/\$score\[/) + 7;
    }
    return str;
}

function replacepos(text, start, stop, replacetext) {
    let arr = text.split('');
    for (let i = start; i < stop; i++) {
        arr[i] = '';
    }
    arr[start] = replacetext;
    return arr.join('');
}

function join(pl) {
    sdisplay.set(pl.xuid, true);
}

function left(pl) {
    if (sdisplay.has(pl.xuid)) {
        sdisplay.delete(pl.xuid);
    }
}

function load() {
    logger.setTitle("Tsidebar");
    logger.setConsole(true, 4);
    mc.listen("onJoin", join);
    mc.listen("onLeft", left);
    mc.listen("onTick", Tick);
    mc.listen("onServerStarted", () => {
        if (config.get("Money")) {
            try {
                toney = lxl.import('MONEY');
            } catch (_) { }
            if (toney('version') != null || toney('version') != undefined) {
                logger.info('ECAPI imported successfully');
            } else {
                logger.fatal('ECAPI import failed');
                toney = null;
            }
        }
    });
    mc.regPlayerCmd('tsidebar', '开启(关闭)个人侧边栏', plgcmd, 0);
    mc.regPlayerCmd('tsidebar_op', '开启(关闭)全局侧边栏', plqcmd, 1);
    mc.regConsoleCmd('tsidebar_c', '开启(关闭)全局侧边栏', consolecmd);
    SID = setInterval(StartSet, config.get("time"));
    logger.info('Tsidebar LOADED! version: 2.0.0');
}
load();