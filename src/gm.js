//LiteXLoader Dev Helper
/// <reference path="../Library/JS/Api.js" /> 


let conf = data.openConfig(".//plugins//Kismet//config//opTools.json");


function ST(player, text) {
    player.tell(`§l§d[opTools] ${text}`, 0);
}


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
