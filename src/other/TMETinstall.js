//LiteXLoader Dev Helper
/// <reference path="../Library/JS/Api.js" /> 


let ISNJS = false;
(() => {
    if (typeof (network) == "undefined") {
        network = new function () {
            this.httpGet = (url, callback) => {
                request(url, 'GET', '', (e) => {
                    callback((e == null ? -1 : 200), e);
                    return;
                });
            };
            this.httpPost = (url, dataStr, type, callback) => {
                request("" + url + "/" + type + "", 'POST', dataStr, (e) => {
                    callback((e == null ? -1 : 200), e);
                });
            };
        }();
        file = new function () {
            this.mkdir = (dir) => {
                dir = dir.replace(////g, '/');
                let dirArr = dir.split('/'),
                    nowDir = dirArr.shift(),
                    l = dirArr.length;
                if (nowDir != ".") {
                    mkdir(nowDir);
                }
                for (let i = 0; i < l; i++) {
                    nowDir += `/${dirArr.shift()}`;
                    mkdir(nowDir);
                }
                return true;
            };
            this.readFrom = (path) => {
                return fileReadAllText(path);
            };
            this.writeTo = (path, str) => {
                return fileWriteAllText(path, str);
            };
            this.getFilesList = (dir) => {
                dir = dir.replace(////g, '/');
                systemCmd("cd " + dir + " && dir /b >> " + getWorkingPath() + "/files.txt", (e) => { });
                for (let i = 0; i < 50000; i++) { }
                let txts = fileReadAllText(getWorkingPath() + "/files.txt");
                if (txts == null) {
                    txts = "";
                }
                fileDelete(getWorkingPath() + "/files.txt");
                let arr = txts.split('/r/n');
                arr.pop();
                return arr;
            };
            this.checkIsDir = (pd) => {
                return dirExists(pd);
            };
            this.delete = (pd) => {
                return systemCmd("del " + pd + "", (e) => { });
            };
            this.writeLine = (path, str) => {
                return fileWriteLine(path, str);
            }
        }();
        data = new function () {
            function newJsonConfig(path, defaultt = "{}") {
                if (typeof (path) !== "string") {
                    throw new Error("Path should be a string!!!");
                } else if (typeof (defaultt) != "string") {
                    throw new Error("Default should be a string!!!");
                } else {
                    let jsontmp = JSON.parse(defaultt), Tpath = path.replace(/[/]/g, '//'), newData = file.readFrom(path), TMParr = Tpath.split('//');
                    TMParr.pop();
                    let dir = TMParr.join('//');
                    if (newData == null) {
                        file.mkdir(dir);
                        newData = JSON.stringify(jsontmp, null, 2);
                        file.writeTo(path, newData);
                    }
                    return new function (data, path, dir) {
                        this.asyncSave = function () {
                            let Tpath = path.replace(/[/]/g, '//'),
                                Path = path,
                                dat = data;
                            setTimeout(function () {

                                let TMParr = Tpath.split('//');
                                TMParr.pop();
                                let dir = TMParr.join('//');
                                file.mkdir(dir);
                                file.writeTo(Path, JSON.stringify(JSON.parse(dat), null, 2));

                            }, 1);
                        };
                        this.init = function (name, defaul) {

                            let Data = JSON.parse(data);
                            if (Data[name] == null) {
                                Data[name] = defaul;
                                data = JSON.stringify(Data, null, 2);
                                this.asyncSave();
                                return defaul;
                            } else {
                                return Data[name];
                            }

                        };
                        this.set = function (name, aata) {

                            let Data = JSON.parse(data);
                            Data[name] = aata;
                            data = JSON.stringify(Data, null, 2);
                            this.asyncSave();
                            return true;

                        };
                        this.get = function (name, defaul = null) {

                            let Data = JSON.parse(data);
                            if (Data[name] == null) {
                                return defaul;
                            } else {
                                return Data[name];
                            }

                        };
                        this.delete = function (name) {

                            let Data = JSON.parse(data);
                            delete Data[name];
                            data = JSON.stringify(Data, null, 2);
                            this.asyncSave();
                            return true;

                        };
                        this.reload = function () {

                            file.mkdir(dir);
                            let newData = file.readFrom(path);
                            data = newData;
                            return true;

                        };
                        this.close = function () {

                            let ks = Object.keys(this),
                                i = 0,
                                l = ks.length;
                            while (i < l) {
                                delete this[ks[i]];
                                i++;
                            }
                            return true;

                        };
                        this.getPath = function () {
                            return path;
                        };
                        this.read = function () {
                            return data;
                        };
                        this.write = function (content) {

                            if (typeof (content) == "string") {
                                file.mkdir(dir);
                                file.writeTo(path, content);
                                data = content;
                                return true;
                            } else {
                                throw new Error("content should be a string!!!");
                            }

                        };
                    }(newData, path, dir);
                }
            }
            function newINIConfig(path, defaultt = "") {
                if (typeof (path) !== "string") {
                    throw new Error("Path should be a string!!!");
                } else if (typeof (defaultt) != "string") {
                    throw new Error("Default should be a string!!!");
                } else {
                    let jsontmp = parseINIToOBJ(defaultt),
                        Tpath = path.replace(/[/]/g, '//'),
                        newData = file.readFrom(path),
                        TMParr = Tpath.split('//');
                    TMParr.pop();
                    let dir = TMParr.join('//');
                    if (newData == null) {
                        file.mkdir(dir);
                        newData = parseOBJToINI(jsontmp);
                        file.writeTo(path, newData);
                    }
                    return new function (data, path, dir) {
                        this.asyncSave = function () {
                            let Tpath = path.replace(/[/]/g, '//'),
                                Path = path,
                                dat = data;
                            setTimeout(function () {

                                let TMParr = Tpath.split('//');
                                TMParr.pop();
                                let dir = TMParr.join('//');
                                file.mkdir(dir);
                                file.writeTo(Path, parseOBJToINI(dat));

                            }, 1);
                        };
                        this.init = function (sec, name, defaul) {

                            let Data = parseINIToOBJ(data);
                            if (Data[sec] == null || Data[sec][name] == null) {
                                if (Data[sec] == null) {
                                    Data[sec] = {};
                                }
                                Data[sec][name] = defaul;
                                data = parseOBJToINI(Data);
                                this.asyncSave();
                                return defaul;
                            } else {
                                return Data[sec][name];
                            }

                        };
                        this.set = function (sec, name, aata) {

                            let Data = parseINIToOBJ(data);
                            if (Data[sec] == null) {
                                Data[sec] = {};
                            }
                            Data[sec][name] = aata;
                            data = parseOBJToINI(data);
                            this.asyncSave();
                            return true;

                        };
                        this.get = function (sec, name, defaul = null) {

                            let Data = parseINIToOBJ(data);
                            if (Data[sec] == null || Data[sec][name] == null) {
                                return defaul;
                            } else {
                                return Data[sec][name];
                            }

                        };
                        this.delete = function (sec, name) {

                            let Data = parseINIToOBJ(data);
                            if (Data[sec] != null) {
                                delete Data[sec][name];
                                data = parseOBJToINI(Data);
                                this.asyncSave();
                                return true;
                            } else {
                                return false;
                            }

                        };
                        this.reload = function () {

                            file.mkdir(dir);
                            let newData = file.readFrom(path);
                            data = newData;
                            return true;

                        };
                        this.close = function () {

                            let ks = Object.keys(this),
                                i = 0,
                                l = ks.length;
                            while (i < l) {
                                delete this[ks[i]];
                                i++;
                            }
                            return true;

                        };
                        this.getPath = function () {
                            return path;
                        };
                        this.read = function () {
                            return data;
                        };
                        this.write = function (content) {

                            if (typeof (content) == "string") {
                                file.mkdir(dir);
                                file.writeTo(path, content);
                                data = content;
                                return true;
                            } else {
                                throw new Error("content should be a string!!!");
                            }

                        };
                    }(newData, path, dir);
                }
            }
            function parseINIToOBJ(data) {
                let arr = (function () {
                    let aa = data.split('/r/n');
                    if (aa.length == 1) {
                        aa = aa[0].split('/r');
                    }
                    if (aa.length == 1) {
                        aa = aa[0].split('/n');
                    }
                    return aa;
                })(),
                    obj = {},
                    l = arr.length,
                    i = 0,
                    nowObj = "";
                while (i < l) {
                    let lineData = arr[i];
                    if (lineData != "") {
                        if (lineData.search(/[[]/) != -1 && lineData.search(/]/) != -1) {
                            nowObj = lineData.replace(/[[]/, "").replace(/]/, "");
                            obj[nowObj] = {};
                        }
                        if (lineData.search(/=/) != -1) {
                            let cut = lineData.split(/=/);
                            obj[nowObj][cut[0]] = cut[1];
                        }
                    }
                    i++;
                }
                return obj;
            }
            function parseOBJToINI(obj) {
                let keys = Object.keys(obj),
                    l = keys.length,
                    i = 0,
                    str = "";
                while (i < l) {
                    let key = keys[i];
                    if (isObject(obj[key])) {
                        if (str == "") {
                            str += `[${key}]`;
                        } else {
                            str += `/r/n/r/n[${key}]`;
                        }
                        let kes = Object.keys(obj[key]),
                            l = kes.length,
                            i = 0;
                        while (i < l) {
                            str += `/r/n${kes[i]}=${obj[key][kes[i]]}`;
                            i++;
                        }
                    } else {
                        throw new Error("Can't parse object to ini string!");
                    }
                    i++;
                }
                return str;
            }
            this.openConfig = (path, type, de) => {
                if (type == "ini") {
                    return newINIConfig(path, de);
                } else if (type == "json") {
                    return newJsonConfig(path, de);
                }
            };
        }();
        ISNJS = true;
    }
})();

function getLoadPath() {
    let dir = "",
        ISPF = false;
    try {
        aaa();
    } catch (e) {
        ISPF = (e.stack == null);
    }
    if (ISPF) {
        let PFConf = data.openConfig(".//plugins//PFJSR//config.json", "json");
        dir = PFConf.get("JSR")["Path"];
    } else {
        let NetConf = data.openConfig(".//plugins//settings//netjs.ini", "ini");
        dir = NetConf.get("NETJS", "jsdir");
    }
    return dir;
}

network.httpGet('https://gitee.com/timidine/mcbe-lite-xloader-tmessential/raw/master/version.txt', function (sta, da) {
    if (sta == 200) {
        log("[TMETinstall]获取TMET成功,版本:" + da + "");
        log("[TMETinstall]开始自动下载...");
        network.httpGet('https://gitee.com/timidine/mcbe-lite-xloader-tmessential/raw/master/TMEssential.js', function (st, dat) {
            if (st == 200) {
                if (!ISNJS) {
                    let plugin = dat.replace(//r/g, '');
                    let LoaderPath = ".//plugins";
                    file.writeTo(`${LoaderPath}//TMEssential.js`, plugin);
                    log("[TMETinstall]下载完成,开始加载...");
                    mc.runcmdEx('ll load ' + LoaderPath + '//TMEssential.js');
                    log('[TMETinstall]脚本退出...');
                    setTimeout(() => {
                        mc.runcmdEx('ll unload TMETinstall.js');
                        file.delete(LoaderPath + '//TMETinstall.js');
                    }, 1);
                } else {
                    let LoadPath = getLoadPath();
                    file.writeTo(`${LoadPath}//TMEssential.js`, dat);
                    log('[TMETinstall]下载完成,请重启服务器以运行TMET');
                    file.delete(`${LoadPath}//TMETinstall.js`);
                }
            }
        })
    }
})