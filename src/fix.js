//LiteXLoader Dev Helper
/// <reference path="../Library/JS/Api.js" /> 


let conf = data.openConfig(".//plugins//Kismet//config//opTools.json");


function ST(player, text) {
    player.tell(`§l§d[opTools] ${text}`, 0);
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
