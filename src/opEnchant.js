//LiteXLoader Dev Helper
/// <reference path="D:/PF/CODE/VSCODE/Minecraft/LLPlugin/Library/JS/Api.js" /> 


let conf = data.openConfig(".//plugins//Kismet//config//opTools.json", "json", confStrTmp)


function ST(player, text) {
    player.tell(`§l§d[opTools] ${text}`, 0);
}

if (conf.get("opEn")) {
    mc.regPlayerCmd('open', 'OP附魔', function (player, args) {
        if (args.length != 0) {
            ST(player, "§c命令异常,请检测后重试!");
            return;
        }
        ST(player, "§b附魔开始");
        let pXuid = player.xuid;
        mc.runcmd('/enchant ' + pXuid + ' 8 1');
        mc.runcmd('/enchant ' + pXuid + ' 13 2');
        mc.runcmd('/enchant ' + pXuid + ' 21 1');
        mc.runcmd('/enchant ' + pXuid + ' 7 3');
        mc.runcmd('/enchant ' + pXuid + ' 15 5');
        mc.runcmd('/enchant ' + pXuid + ' 2 4');
        mc.runcmd('/enchant ' + pXuid + ' 18 3');
        mc.runcmd('/enchant ' + pXuid + ' 29 5');
        mc.runcmd('/enchant ' + pXuid + ' 22 1');
        mc.runcmd('/enchant ' + pXuid + ' 12 2');
        mc.runcmd('/enchant ' + pXuid + ' 14 3');
        mc.runcmd('/enchant ' + pXuid + ' 31 3');
        mc.runcmd('/enchant ' + pXuid + ' 23 3');
        mc.runcmd('/enchant ' + pXuid + ' 24 3');
        mc.runcmd('/enchant ' + pXuid + ' 26 1');
        mc.runcmd('/enchant ' + pXuid + ' 19 5');
        mc.runcmd('/enchant ' + pXuid + ' 0 4');
        mc.runcmd('/enchant ' + pXuid + ' 20 2');
        mc.runcmd('/enchant ' + pXuid + ' 35 3');
        mc.runcmd('/enchant ' + pXuid + ' 33 1');
        mc.runcmd('/enchant ' + pXuid + ' 6 3');
        mc.runcmd('/enchant ' + pXuid + ' 9 5');
        mc.runcmd('/enchant ' + pXuid + ' 36 3');
        mc.runcmd('/enchant ' + pXuid + ' 5 3');
        mc.runcmd('/enchant ' + pXuid + ' 17 3');
        ST(player, "§b附魔结束");
    }, 1);
}
