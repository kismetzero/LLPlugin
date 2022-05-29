//LiteXLoader Dev Helper
/// <reference path="../Library/JS/Api.js" /> 

logger.setTitle("opTools");
logger.setLogLevel(4);

function ST(player, text) {
    player.tell(`§l§d[opTools] ${text}`, 0);
}

let confStrTmp = String.raw`{
    "gm": true,
    "fix": true,
    "opEn": true
}`;
let conf = data.openConfig(".//plugins//Kismet//config//opTools.json", "json", confStrTmp);

if (conf.get("gm")) {
    function getPlayerGameMode(player) {
        let displayMode = player.gameMode;
        if (displayMode == 0) {
            let abil = player.getAbilities();
            if (abil.instabuild == 0 && abil.invulnerable == 0 && abil.mayfly == 1) {
                return 6;
            } else { return displayMode; }
        }
        return displayMode;
    }

    function setPlayerFlying(player, bool = false) {
        let num = Number(bool), nbt = player.getNbt(),
            abilTag = nbt.getTag("abilities");
        abilTag.setByte("flying", num);
        nbt.setTag("abilities", abilTag);
        return player.setNbt(nbt);
    }

    let GAMEMODE = {
        "§3生存模式": 0,
        "§a创造模式": 1,
        "§o§b冒险模式": 2,
        "§5旁观者模式": 6,
        "§e半旁观者模式": 9
    }

    if (mc.getServerProtocolVersion() < 503) {
        logger.warn("警告!协议版本小于503!自动关闭旁观者模式和半旁观者模式!");
        delete GAMEMODE["§5旁观者模式"]; delete GAMEMODE["§e半旁观者模式"];
    } else {
        mc.regPlayerCmd("gm 6", "快捷切换旁观者模式", (player, args) => {
            if (args.length != 0) {
                ST(player, "§c命令异常,请检测后重试!");
                return;
            }
            player.setGameMode(6);
            ST(player, `§b您的游戏模式已修改为 旁观者模式(6)`);
        }, 1);

        mc.regPlayerCmd("gm 9", "快捷切换半旁观者模式", (player, args) => {
            if (args.length != 0) {
                ST(player, "§c命令异常,请检测后重试!");
                return;
            }
            player.setGameMode(9);
            ST(player, `§b您的游戏模式已修改为 半旁观者模式(9)`);
        }, 1);
    }

    mc.regPlayerCmd("gm", "快捷切换模式", (player, args) => {
        if (args.length != 0) {
            ST(player, "§c命令异常,请检测后重试!");
            return;
        }
        let newform = mc.newCustomForm();
        newform.setTitle("§l§dGMMODE");
        newform.addLabel("§l§b请选择游戏模式");
        let gmmds = Object.keys(GAMEMODE),
            gmmNums = Object.values(GAMEMODE);
        newform.addStepSlider("§l§a选择", gmmds, gmmNums.indexOf(getPlayerGameMode(player)));
        player.sendForm(newform, (player, args) => {
            if (args == null) {
                ST(player, "§b表单已放弃");
                return;
            }
            let sel = gmmNums[args[1]];
            player.runcmd(`/gm ${sel}`);
        });
    }, 1);

    mc.regPlayerCmd("gm 0", "快捷切换生存模式", (player, args) => {
        if (args.length != 0) {
            ST(player, "§c命令异常,请检测后重试!");
            return;
        }
        setPlayerFlying(player, false);
        player.setGameMode(0);
        ST(player, `§b您的游戏模式已修改为 生存模式(0)`);
    }, 1);

    mc.regPlayerCmd("gm 1", "快捷切换创造模式", (player, args) => {
        if (args.length != 0) {
            ST(player, "§c命令异常,请检测后重试!");
            return;
        }
        player.setGameMode(1);
        ST(player, `§b您的游戏模式已修改为 创造模式(1)`);
    }, 1);

    mc.regPlayerCmd("gm 2", "快捷切换冒险模式", (player, args) => {
        if (args.length != 0) {
            ST(player, "§c命令异常,请检测后重试!");
            return;
        }
        player.setGameMode(2);
        ST(player, `§b您的游戏模式已修改为 冒险模式(2)`);
    }, 1);
}

if (conf.get("fix")) {
    mc.regPlayerCmd("fix", "修复你手中的物品", (player, args) => {
        if (args.length != 0) {
            ST(player, "§c命令异常,请检测后重试!");
            return;
        }
        let handIt = player.getHand();
        if (handIt.isNull()) {
            ST(player, "§b兄弟,想啥呢,你手里没有物品");
            return;
        }
        let Nbt = handIt.getNbt(), tag = Nbt.getTag("tag");
        if (tag != null && tag.getData("Damage") != 0) {
            tag.setInt("Damage", 0);
            Nbt.setTag("tag", tag);
            handIt.setNbt(Nbt);
            let xuid = player.xuid;
            setTimeout(() => {
                let pl1 = mc.getPlayer(xuid);
                if (pl1 != null) {
                    pl1.refreshItems();
                }
            }, 50);//next tick
            ST(player, "§b修复完成");
        } else {
            ST(player, "§c你手上的物品不需要修复!");
        }
    }, 1);
}

if (conf.get("opEn")) {
    let enchNbt = NBT.parseSNBT('{"tou":[{"id":26s,"lvl":1s},{"id":17s,"lvl":3s},{"id":3s,"lvl":4s},{"id":1s,"lvl":4s},{"id":4s,"lvl":4s},{"id":0s,"lvl":4s},{"id":8s,"lvl":1s},{"id":6s,"lvl":3s}],"xiong":[{"id":26s,"lvl":1s},{"id":17s,"lvl":3s},{"id":3s,"lvl":4s},{"id":1s,"lvl":4s},{"id":4s,"lvl":4s},{"id":0s,"lvl":4s}],"ku":[{"id":26s,"lvl":1s},{"id":17s,"lvl":3s},{"id":3s,"lvl":4s},{"id":1s,"lvl":4s},{"id":4s,"lvl":4s},{"id":0s,"lvl":4s}],"xie":[{"id":26s,"lvl":1s},{"id":17s,"lvl":3s},{"id":3s,"lvl":4s},{"id":1s,"lvl":4s},{"id":4s,"lvl":4s},{"id":0s,"lvl":4s},{"id":7s,"lvl":3s},{"id":2s,"lvl":4s},{"id":6s,"lvl":3s}],"jian":[{"id":26s,"lvl":1s},{"id":17s,"lvl":3s},{"id":11s,"lvl":5s},{"id":13s,"lvl":2s},{"id":12s,"lvl":2s},{"id":14s,"lvl":3s},{"id":9s,"lvl":5s},{"id":10s,"lvl":5s}],"fu":[{"id":26s,"lvl":1s},{"id":17s,"lvl":3s},{"id":11s,"lvl":5s},{"id":15s,"lvl":5s},{"id":18s,"lvl":3s},{"id":9s,"lvl":5s},{"id":10s,"lvl":5s}],"gao":[{"id":26s,"lvl":1s},{"id":17s,"lvl":3s},{"id":15s,"lvl":5s},{"id":18s,"lvl":3s}],"qiu":[{"id":26s,"lvl":1s},{"id":17s,"lvl":3s},{"id":15s,"lvl":5s},{"id":18s,"lvl":3s}],"chu":[{"id":26s,"lvl":1s},{"id":17s,"lvl":3s},{"id":15s,"lvl":5s},{"id":18s,"lvl":3s}],"nu":[{"id":26s,"lvl":1s},{"id":17s,"lvl":3s},{"id":33s,"lvl":1s},{"id":34s,"lvl":4s},{"id":35s,"lvl":3s}],"gong":[{"id":26s,"lvl":1s},{"id":17s,"lvl":3s},{"id":21s,"lvl":1s},{"id":22s,"lvl":1s},{"id":19s,"lvl":5s},{"id":20s,"lvl":2s}]}');
    let enchOP = NBT.parseSNBT('{"tou":[{"id":26s,"lvl":99s},{"id":17s,"lvl":99s},{"id":3s,"lvl":99s},{"id":1s,"lvl":99s},{"id":4s,"lvl":99s},{"id":0s,"lvl":99s},{"id":8s,"lvl":99s},{"id":6s,"lvl":99s}],"xiong":[{"id":26s,"lvl":99s},{"id":17s,"lvl":99s},{"id":3s,"lvl":99s},{"id":1s,"lvl":99s},{"id":4s,"lvl":99s},{"id":0s,"lvl":99s}],"ku":[{"id":26s,"lvl":99s},{"id":17s,"lvl":99s},{"id":3s,"lvl":99s},{"id":1s,"lvl":99s},{"id":4s,"lvl":99s},{"id":0s,"lvl":99s}],"xie":[{"id":26s,"lvl":99s},{"id":17s,"lvl":99s},{"id":3s,"lvl":99s},{"id":1s,"lvl":99s},{"id":4s,"lvl":99s},{"id":0s,"lvl":99s},{"id":7s,"lvl":99s},{"id":2s,"lvl":99s},{"id":6s,"lvl":99s}],"jian":[{"id":26s,"lvl":99s},{"id":17s,"lvl":99s},{"id":11s,"lvl":99s},{"id":13s,"lvl":99s},{"id":12s,"lvl":99s},{"id":14s,"lvl":99s},{"id":9s,"lvl":99s},{"id":10s,"lvl":99s}],"fu":[{"id":26s,"lvl":99s},{"id":17s,"lvl":99s},{"id":11s,"lvl":99s},{"id":15s,"lvl":99s},{"id":18s,"lvl":99s},{"id":9s,"lvl":99s},{"id":10s,"lvl":99s}],"gao":[{"id":26s,"lvl":99s},{"id":17s,"lvl":99s},{"id":15s,"lvl":99s},{"id":18s,"lvl":99s}],"qiu":[{"id":26s,"lvl":99s},{"id":17s,"lvl":99s},{"id":15s,"lvl":99s},{"id":18s,"lvl":99s}],"chu":[{"id":26s,"lvl":99s},{"id":17s,"lvl":99s},{"id":15s,"lvl":99s},{"id":18s,"lvl":99s}],"nu":[{"id":26s,"lvl":99s},{"id":17s,"lvl":99s},{"id":33s,"lvl":99s},{"id":34s,"lvl":99s},{"id":35s,"lvl":99s}],"gong":[{"id":26s,"lvl":99s},{"id":17s,"lvl":99s},{"id":21s,"lvl":99s},{"id":22s,"lvl":99s},{"id":19s,"lvl":99s},{"id":20s,"lvl":99s}]}');
    let openStr = ["tou", "xiong", "ku", "xie", "jian", "fu", "gao", "qiu", "chu", "nu", "gong"];

    mc.regPlayerCmd('openall', 'OP快捷通用附魔', function (player, args) {
        if (args.length != 0) {
            ST(player, "§c命令异常,请检测后重试!");
            return;
        }
        let handIt = player.getHand();
        if (handIt.isNull()) {
            ST(player, "§b兄弟,想啥呢,你手里没有物品");
            return;
        }
        ST(player, "§b附魔开始");
        let pName = player.name;
        mc.runcmd('/enchant ' + pName + ' 8 1');
        mc.runcmd('/enchant ' + pName + ' 13 2');
        mc.runcmd('/enchant ' + pName + ' 21 1');
        mc.runcmd('/enchant ' + pName + ' 7 3');
        mc.runcmd('/enchant ' + pName + ' 15 5');
        mc.runcmd('/enchant ' + pName + ' 2 4');
        mc.runcmd('/enchant ' + pName + ' 18 3');
        mc.runcmd('/enchant ' + pName + ' 29 5');
        mc.runcmd('/enchant ' + pName + ' 22 1');
        mc.runcmd('/enchant ' + pName + ' 12 2');
        mc.runcmd('/enchant ' + pName + ' 14 3');
        mc.runcmd('/enchant ' + pName + ' 31 3');
        mc.runcmd('/enchant ' + pName + ' 23 3');
        mc.runcmd('/enchant ' + pName + ' 24 3');
        mc.runcmd('/enchant ' + pName + ' 26 1');
        mc.runcmd('/enchant ' + pName + ' 19 5');
        mc.runcmd('/enchant ' + pName + ' 0 4');
        mc.runcmd('/enchant ' + pName + ' 20 2');
        mc.runcmd('/enchant ' + pName + ' 35 3');
        mc.runcmd('/enchant ' + pName + ' 33 1');
        mc.runcmd('/enchant ' + pName + ' 6 3');
        mc.runcmd('/enchant ' + pName + ' 9 5');
        mc.runcmd('/enchant ' + pName + ' 36 3');
        mc.runcmd('/enchant ' + pName + ' 5 3');
        mc.runcmd('/enchant ' + pName + ' 17 3');
        ST(player, "§b附魔结束");
    }, 1);

    mc.regPlayerCmd("opensnbt", "SNBT自定义附魔", (player, args) => {
        if (args.length != 1) {
            ST(player, "§c命令异常,请检测后重试!");
            return;
        }
        let handIt = player.getHand();
        if (handIt.isNull()) {
            ST(player, "§b兄弟,想啥呢,你手里没有物品");
            return;
        }
        let snbtStrTmp = args[0];
        ST(player, snbtStrTmp);
        let snbtTmp = NBT.parseSNBT(snbtStrTmp);
        let Nbt = handIt.getNbt(), tag = Nbt.getTag("tag");
        if (tag != null) {
            let ench = snbtTmp.getTag("ench");
            tag.setTag("ench", ench);
            tag.setInt("Damage", 0);
            Nbt.setTag("tag", tag);
            handIt.setNbt(Nbt);
            let xuid = player.xuid;
            setTimeout(() => {
                let pl1 = mc.getPlayer(xuid);
                if (pl1 != null) {
                    pl1.refreshItems();
                }
            }, 50);//next tick
            ST(player, "§b附魔完成");
        } else {
            ST(player, "§c你手上的物品不需要附魔!");
        }
    }, 1);

    mc.regPlayerCmd("open", "OP附魔", (player, args) => {
        if (args.length < 1 && args.length > 2 && openStr.includes(args[0])) {
            ST(player, "§c命令异常,请检测后重试!");
            return;
        }
        let handIt = player.getHand();
        if (handIt.isNull()) {
            ST(player, "§b兄弟,想啥呢,你手里没有物品");
            return;
        }
        let enTag = args[0];
        let ench;
        let Nbt = handIt.getNbt(), tag = Nbt.getTag("tag");
        if (tag != null) {
            if (args.length == 1) {
                ench = enchNbt.getTag(enTag);
            } else {
                ench =enchOP.getTag(enTag);
            }
            tag.setTag("ench", ench);
            tag.setInt("Damage", 0);
            Nbt.setTag("tag", tag);
            handIt.setNbt(Nbt);
            let xuid = player.xuid;
            setTimeout(() => {
                let pl1 = mc.getPlayer(xuid);
                if (pl1 != null) {
                    pl1.refreshItems();
                }
            }, 50);//next tick
            ST(player, "§b附魔完成");
        } else {
            ST(player, "§c你手上的物品不需要附魔!");
        }
    }, 1);
}