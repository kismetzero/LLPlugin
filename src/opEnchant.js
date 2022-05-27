//LiteXLoader Dev Helper
/// <reference path="../Library/JS/Api.js" /> 


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
}
