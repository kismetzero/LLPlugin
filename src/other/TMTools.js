//LiteLoaderScript Dev Helper
/// <reference path="../Library/JS/Api.js" /> 


let confStr = String.raw`{
    "gm": true,
    "fix": true,
    "talkas": true,
    "maintenance": true,
    "nbt": true,
    "itdebug": true
}`;

logger.setTitle("TMTools");
logger.setLogLevel(4);

let conf = data.openConfig(".//plugins//Timiya//config//TMTools.json", "json", confStr),
    database = data.openConfig(".//plugins//Timiya//data//TMTools.json", "json", "{}");

function ST(pl, text) {
    pl.tell(`§l§d[TMTools] ${text}`, 0);
}

function getPlayerList() {
    let newArr = [];
    mc.getOnlinePlayers.forEach((pl) => {
        newArr.push(pl.realName);
    });
    return newArr;
}

function getPlayerGameMode(pl) {
    let displayMode = pl.gameMode;
    if (displayMode == 0) {
        let abil = pl.getAbilities();
        if (abil.instabuild == 0 && abil.invulnerable == 0 && abil.mayfly == 1) {
            return 6;
        } else { return displayMode; }
    }
    return displayMode;
}

function setPlayerFlying(pl, bool = false) {
    let num = Number(bool), nbt = pl.getNbt(),
        abilTag = nbt.getTag("abilities");
    abilTag.setByte("flying", num);
    nbt.setTag("abilities", abilTag);
    return pl.setNbt(nbt);
}

if (conf.get("gm")) {
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
        mc.regPlayerCmd("gm 6", "快捷切换旁观者模式", (pl, args) => {
            if (args.length != 0) {
                ST(pl, "§c命令异常,请检测后重试!");
                return;
            }
            pl.setGameMode(6);
            ST(pl, `§b您的游戏模式已修改为 旁观者模式(6)`);
        }, 1);

        mc.regPlayerCmd("gm 9", "快捷切换半旁观者模式", (pl, args) => {
            if (args.length != 0) {
                ST(pl, "§c命令异常,请检测后重试!");
                return;
            }
            pl.setGameMode(9);
            ST(pl, `§b您的游戏模式已修改为 半旁观者模式(9)`);
        }, 1);
    }
    mc.regPlayerCmd("gm", "快捷切换模式", (pl, args) => {
        if (args.length != 0) {
            ST(pl, "§c命令异常,请检测后重试!");
            return;
        }
        let newform = mc.newCustomForm();
        newform.setTitle("§l§dGMMODE");
        newform.addLabel("§l§b请选择游戏模式");
        let gmmds = Object.keys(GAMEMODE),
            gmmNums = Object.values(GAMEMODE);
        newform.addStepSlider("§l§a选择", gmmds, gmmNums.indexOf(getPlayerGameMode(pl)));
        pl.sendForm(newform, (pl, args) => {
            if (args == null) {
                ST(pl, "§b表单已放弃");
                return;
            }
            let sel = gmmNums[args[1]];
            pl.runcmd(`/gm ${sel}`);
        });
    }, 1);

    mc.regPlayerCmd("gm 0", "快捷切换生存模式", (pl, args) => {
        if (args.length != 0) {
            ST(pl, "§c命令异常,请检测后重试!");
            return;
        }
        setPlayerFlying(pl, false);
        pl.setGameMode(0);
        ST(pl, `§b您的游戏模式已修改为 生存模式(0)`);
    }, 1);

    mc.regPlayerCmd("gm 1", "快捷切换创造模式", (pl, args) => {
        if (args.length != 0) {
            ST(pl, "§c命令异常,请检测后重试!");
            return;
        }
        pl.setGameMode(1);
        ST(pl, `§b您的游戏模式已修改为 创造模式(1)`);
    }, 1);

    mc.regPlayerCmd("gm 2", "快捷切换冒险模式", (pl, args) => {
        if (args.length != 0) {
            ST(pl, "§c命令异常,请检测后重试!");
            return;
        }
        pl.setGameMode(2);
        ST(pl, `§b您的游戏模式已修改为 冒险模式(2)`);
    }, 1);
}

if (conf.get("fix")) {
    mc.regPlayerCmd("fix", "修复你手中的物品", (pl, args) => {
        if (args.length != 0) {
            ST(pl, "§c命令异常,请检测后重试!");
            return;
        }
        let handIt = pl.getHand();
        if (handIt.isNull()) {
            ST(pl, "§b兄弟,想啥呢,你手里没有物品");
            return;
        }
        let Nbt = handIt.getNbt(), tag = Nbt.getTag("tag");
        if (tag != null && tag.getData("Damage") != 0) {
            tag.setInt("Damage", 0);
            Nbt.setTag("tag", tag);
            handIt.setNbt(Nbt);
            let xuid = pl.xuid;
            setTimeout(() => {
                let pl1 = mc.getPlayer(xuid);
                if (pl1 != null) {
                    pl1.refreshItems();
                }
            }, 50);//next tick
            ST(pl, "§b修复完成");
        } else {
            ST(pl, "§c你手上的物品不需要修复!");
        }
    }, 1);
}

if (conf.get("talkas")) {
    mc.regPlayerCmd("talkas", "/talkas [<input:playername> <input:text>] 代替某人发言", (pl, args) => {
        if (args.length == 0) {
            let newform = mc.newCustomForm(),
                pls = getPlayerList();
            newform.setTitle("§l§dTALKAS");
            newform.addDropdown("§l§b请选择玩家对象", pls, 0);
            newform.addInput("§l§a请输入玩家说出的内容", "wdnmd", "");
            pl.sendForm(newform, (pl, args) => {
                if (args == null) {
                    ST(pl, "§b表单已放弃");
                    return;
                }
                pl.runcmd(`/talkas "${pls[args[0]]}" "${args[1]}"`);
            });
        } else if (args.length == 2) {
            let selpl = mc.getPlayer(args[0]);
            if (selpl != null) {
                selpl.talkAs(args[1]);
                ST(pl, "§a操作完成");
            } else {
                ST(pl, "§c玩家对象未找到!");
            }
        } else {
            ST(pl, "§c命令异常,请检测后重试!");
        }
    }, 1);
}

if (conf.get("maintenance")) {
    function plPrejoin(pl) {
        if (!pl.isOP() && !!database.get("mtMode")) {
            mc.broadcast(`§c服务器正在维护中......玩家§e${pl.realName}§c试图进入服务器已被拦截!`);
            logger.info(`服务器正在维护中......玩家${pl.realName}试图进入游戏已被拦截!`);
            pl.kick('§e服务器正在维护中....../n§d腐竹手动关闭了服务器/n§b请稍等几分钟再来玩吧!/n§a注意:这不是崩服!');
        }
    }
    function StartmtMode(pl) {
        let plName = pl.realName, num = 10,
            reNum = () => {
                mc.broadcast(`>>> §c服务器即将关闭维护...§d操作人:§b${plName}...§e${num}s`);
                if (num != 0) {
                    num--;
                    setTimeout(reNum, 1000);
                } else {
                    database.set("mtMode", true);
                    setTimeout(() => {
                        logger.info("kick all player...");
                        let pls = mc.getOnlinePlayers();
                        pls.forEach((pl) => { plPrejoin(pl); });
                    }, 1000);
                }
            };
        mc.runcmdEx("title @a title 服务器准备维护...");
        reNum();
    }
    mc.regPlayerCmd("mt", "维护模式开关", (pl, args) => {
        let newform = mc.newCustomForm(),
            nowMode = (!database.get("mtMode") ? 0 : 1);
        newform.setTitle("§l§dMAINTENANCEMODE");
        newform.addStepSlider("§l§b维护模式", ["§c关闭", "§a开启"], nowMode);
        pl.sendForm(newform, (pl, args) => {
            if (args == null) {
                ST(pl, "§b表单已放弃");
                return;
            }
            let sel = args[0];
            if (nowMode != sel) {
                if (sel == 0) {
                    database.set("mtMode", false);
                    ST(pl, "§b维护模式已关闭");
                } else {
                    ST(pl, "§b维护模式正在开启...");
                    StartmtMode(pl);
                }
            }
        });
    }, 1);
    mc.listen("onPreJoin", (pl) => { let xuid = pl.xuid; setTimeout(() => { let pl1 = mc.getPlayer(xuid); if (pl1 != null) { plPrejoin(pl1); } }, 1000); });
}

if (conf.get("nbt")) {
    mc.regPlayerCmd("itemop", "操作手中物品特殊nbt", (pl, args) => {
        if (args.length != 0) {
            ST(pl, "§c命令异常,请检查后重试");
            return;
        }
        let it = pl.getHand();
        if (it.isNull()) {
            ST(pl, "§b兄弟,想啥呢,你手里没有物品");
            return;
        }
        let Nbt = it.getNbt(), tag = (Nbt.getTag("tag") || new NbtCompound({})),
            haveDK = (tag.getData("minecraft:keep_on_death") != null ? 1 : 0),
            itLockM = (tag.getData("minecraft:item_lock") || 0),//0~2
            canDestroy = JSON.parse((Nbt.getTag("CanDestroy") || new NbtList([])).toString()),
            newform = mc.newSimpleForm();
        newform.setTitle("§l§dITEMOP");
        newform.setContent(`Item:[${it.type}]`);
        newform.addButton("§l§2修改是否死亡保留(keep_on_death)", "textures/ui/regeneration_effect.png");
        newform.addButton("§l§c修改物品锁(item_lock)", "textures/ui/icon_lock.png");
        newform.addButton("§l§0修改冒险模式可破坏方块(can_destroy)", "textures/ui/smithing_icon.png");
        pl.sendForm(newform, (pl, sel) => {
            if (sel == null) {
                ST(pl, "§b表单已放弃");
                return;
            }
            if (sel == 0) {
                let newform = mc.newCustomForm(), Enum = ["§o§c否", "§o§a是"];
                newform.setTitle("§l§dITEMOP[KEEP_ON_DEATH]");
                newform.addStepSlider("§l§a是否死亡保留", Enum, haveDK);
                pl.sendForm(newform, (pl, args) => {
                    if (args == null) {
                        ST(pl, "§b表单已放弃");
                        return;
                    }
                    if (args[0] == haveDK) {
                        ST(pl, "§b未作出更改");
                        return;
                    }
                    if (args == 1) {
                        tag.setByte("minecraft:keep_on_death", 1);
                    } else {
                        tag.removeTag("minecraft:keep_on_death");
                    }
                    Nbt.setTag("tag", tag);
                    it.setNbt(Nbt);
                    let xuid = pl.xuid;
                    setTimeout(() => {
                        let pl1 = mc.getPlayer(xuid);
                        if (pl1 != null) {
                            pl1.refreshItems();
                        }
                    }, 50);//next tick
                    ST(pl, `§b该物品的死亡保留已设置为[${Enum[args[0]]}§r§l§b]`);
                });
            } else if (sel == 1) {
                let newform = mc.newCustomForm(), Enum = ["§o§f不锁定", "§o§c锁定至物品栏格子", "§o§b锁定至背包"];
                newform.setTitle("§l§dITEMOP[ITEM_LOCK]");
                newform.addStepSlider("§l§a锁定模式", Enum, itLockM);
                pl.sendForm(newform, (pl, args) => {
                    if (args == null) {
                        ST(pl, "§b表单已放弃");
                        return;
                    }
                    if (args[0] == itLockM) {
                        ST(pl, "§b未作出更改");
                        return;
                    }
                    if (args[0] == 0) {
                        tag.removeTag("minecraft:item_lock");
                    } else {
                        tag.setByte("minecraft:item_lock", args[0]);
                    }
                    Nbt.setTag("tag", tag);
                    it.setNbt(Nbt);
                    let xuid = pl.xuid;
                    setTimeout(() => {
                        let pl1 = mc.getPlayer(xuid);
                        if (pl1 != null) {
                            pl1.refreshItems();
                        }
                    }, 50);//next tick
                    ST(pl, `§b该物品的物品锁定已设置为[${Enum[args[0]]}§r§l§b]`);
                });
            } else if (sel == 2) {
                let newform = mc.newCustomForm();
                newform.setTitle("§l§dITEMOP[CAN_DESTROY]");
                newform.addInput("§l§a[添加列表]/n输入方块类型(不需要[minecraft:]前缀)/n§4请不要输入奇怪的内容!/n这里的数据是直接传入MC NBT的!!!/n§b留空不添加/n下方的开关是管理列表,关闭为删除", "grass", "");
                let l = canDestroy.length, i = 0;
                while (i < l) {
                    newform.addSwitch(canDestroy[i++], true);
                }
                pl.sendForm(newform, (pl, args) => {
                    if (args == null) {
                        ST(pl, "§b表单已放弃");
                        return;
                    }
                    let op = [[], []], input = args.shift(),
                        l = canDestroy.length, i = 0;
                    if (input != "") {
                        if (canDestroy.indexOf(input) == -1) {
                            canDestroy.push(input);
                            op[0].push(`§l§b[+]${input}`);
                            op[1].push(["+", input]);
                        } else {
                            op[0].push(`§l§6[R]${input}`);
                            op[1].push(["R", input]);
                        }
                    }
                    while (i < l) {
                        let str = canDestroy[i],
                            line = i++;
                        if (!args[line]) {
                            canDestroy.splice(line, 1);
                            op[0].push(`§l§b[-]${str}`);
                            op[1].push(["-", str]);
                        }
                    }
                    let newNbtList = new NbtList(), xuid = pl.xuid;
                    l = canDestroy.length; i = 0;
                    while (i < l) {
                        newNbtList.addTag(new NbtString(canDestroy[i++]));
                    }
                    if (newNbtList.getSize() != 0) {
                        Nbt.setTag("CanDestroy", newNbtList);
                    } else {
                        Nbt.removeTag("CanDestroy");
                    }
                    it.setNbt(Nbt);
                    setTimeout(() => {
                        let pl1 = mc.getPlayer(xuid);
                        if (pl1 != null) {
                            pl1.refreshItems();
                        }
                        setTimeout(CheckSu, 100);
                    }, 50);//next tick
                    function CheckSu() {
                        let newform = mc.newCustomForm();
                        newform.setTitle("§l§dITEMOP[CAN_DESTROY]CALLBACK");
                        let nowCanDe = JSON.parse((it.getNbt().getTag("CanDestroy") || new NbtList([])).toString());
                        l = op[0].length; i = 0;
                        while (i < l) {
                            let nowArr = op[1][i];
                            if (nowArr[0] == "+") {
                                if (nowCanDe.indexOf(nowArr[1]) != -1) {
                                    op[0][i] = op[0][i] + "--§asuccess";
                                } else {
                                    op[0][i] = op[0][i] + "--§cfail";
                                }
                            } else if (nowArr[0] == "-") {
                                if (nowCanDe.indexOf(nowArr[1]) == -1) {
                                    op[0][i] = op[0][i] + "--§asuccess";
                                } else {
                                    op[0][i] = op[0][i] + "--§cfail";
                                }
                            } else {
                                op[0][i] = op[0][i] + "--§ewarn";
                            }
                            i++;
                        }
                        newform.addLabel(op[0].join("/n"));
                        pl.sendForm(newform, (_) => { });
                    }
                });
            }
        });
    }, 1);
}

if (conf.get("itdebug")) {
    let sw = new Map();
    mc.regPlayerCmd("itdebug", "开启或者关闭itemDebug", (pl, args) => {
        if (args.length != 0) {
            ST(pl, "§c命令错误,请检查后重试!");
            return;
        }
        if (!sw.has(pl.xuid)) {
            sw.set(pl.xuid, true);
            ST(pl, "§bItDebug已开启,手持物品点击地面可输出基本信息!");
        } else {
            sw.delete(pl.xuid);
            ST(pl, "§bItDebug已关闭");
        }
    }, 1);
    mc.listen("onUseItemOn", (pl, it, bl) => {
        if (sw.has(pl.xuid)) {
            ST(pl, `/n§a[手持物品]/n§bname:${it.name},/n§btype:${it.type},/n§baux:${it.aux},/n§bid:${it.id}/n§a[目标方块]/n:${bl.name},/n§btype:${bl.type},/n§bid:${bl.id}`);
            return false;
        }
    }, 1);
}

logger.info("快捷工具集已装载!作者:提米吖,版本:1.14.517");