/** @type {import('./_venera_.js')} */

/**
 * 漫蛙（manwa）独立漫画源
 *
 * 协议来自暮色 1.0.4 的 mw 模块（Flutter AOT 静态还原）：
 *   - 列表    /booklist?page=&gender=&area=&end=&sort=&tag=
 *   - 搜索    /search/?keyword=&page=
 *   - 详情    /book/<bookId>      （.detail-main-info-* / ul.detail-list-select）
 *   - 章节    /chapter/<chapterId>（.img-content img[data-r-src]）
 *   - 图片    AES-128-CBC，key=iv="my2ecret782ecret"（见 decrypt_image_byte.dart: /module/mw 分支）
 *   - 筛选值  gender:-1 全部/2 一般向/0 BL/1 禁漫/3 TL/4 GL
 *             area: "" 全部/2 韩国/3 日漫/4 国漫/5 台漫/6 其他/1 未分类
 *             end:  "" 全部/2 连载中/1 完结
 *             sort: -1 最新/0 最旧/1 收藏/2 新漫
 */
class Manwa extends ComicSource {
    name = "漫蛙";
    key = "manwa";
    version = "1.0.3";
    minAppVersion = "1.0.0";
    url = "https://raw.githubusercontent.com/Walter498/manwa-source/main/manwa.js";

    static hosts = ["https://manwa.me", "https://www.manwa.me"];
    static imgKey = "my2ecret782ecret";
    static ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

    static _host = null;

    settings = {
        mirror: {
            title: "镜像域名（留空自动探测）",
            type: "input",
            placeholder: "https://manwa.me",
            default: "",
        },
    };

    static header(extra) {
        return Object.assign({
            "User-Agent": Manwa.ua,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.9",
        }, extra || {});
    }

    static candidates() {
        let list = [];
        try {
            let custom = (this.loadSetting("mirror") || "").trim();
            if (custom) list.push(custom.replace(/\/+$/, ""));
        } catch (_) {}
        if (Manwa._host) list.push(Manwa._host);
        for (let i = 0; i < Manwa.hosts.length; i++) list.push(Manwa.hosts[i]);
        let out = [];
        for (let i = 0; i < list.length; i++) if (out.indexOf(list[i]) < 0) out.push(list[i]);
        return out;
    }

    static async get(path, extraHeaders) {
        let err = null;
        let hosts = Manwa.candidates();
        for (let i = 0; i < hosts.length; i++) {
            let base = hosts[i];
            try {
                let res = await Network.get(base + path, Manwa.header(Object.assign({
                    "Referer": base + "/",
                }, extraHeaders || {})));
                if (res.status !== 200 || !res.body) {
                    err = new Error("HTTP " + res.status + " " + base);
                    continue;
                }
                Manwa._host = base;
                return res.body;
            } catch (e) {
                err = e;
            }
        }
        throw err || new Error("漫蛙站点不可达");
    }

    static abs(url) {
        if (!url) return "";
        let u = String(url).trim();
        if (u.indexOf("//") === 0) return "https:" + u;
        if (u.indexOf("http") === 0) return u;
        let host = Manwa._host || Manwa.hosts[0];
        if (u.charAt(0) === "/") return host + u;
        return host + "/" + u;
    }

    static decode(s) {
        if (!s) return "";
        let named = {
            amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", nbsp: " ",
            middot: "·", hellip: "…", zwnj: "", zwj: "", mdash: "—",
            ndash: "–", ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’",
            times: "×", copy: "©", reg: "®", deg: "°", gt2: ">",
        };
        return String(s)
            .replace(/&#x([0-9a-fA-F]+);/g, (m, h) => String.fromCharCode(parseInt(h, 16)))
            .replace(/&#(\d+);/g, (m, d) => String.fromCharCode(parseInt(d, 10)))
            .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (m, n) => {
                let k = n.toLowerCase();
                return named[k] !== undefined ? named[k] : m;
            })
            .replace(/<[^>]*>/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    static attr(tag, name) {
        let m = new RegExp(name + "\\s*=\\s*\"([^\"]*)\"").exec(tag);
        if (!m) m = new RegExp(name + "\\s*=\\s*'([^']*)'").exec(tag);
        return m ? Manwa.decode(m[1]) : "";
    }

    /** 解析 manga-list-2 / book-list / rank-list 三种条目块 */
    static parseList(html) {
        let comics = [];
        let seen = {};
        let re = /<a\s+href="\/book\/(\d+)"([^>]*)>/g;
        let m;
        while ((m = re.exec(html)) !== null) {
            let id = m[1];
            if (seen[id]) continue;
            let start = m.index;
            let next = re.lastIndex;
            let end = html.indexOf("<a ", next);
            if (end < 0 || end - start > 1600) end = start + 1600;
            let block = html.substring(start, end);
            let imgM = /<img[^>]*>/i.exec(block);
            if (!imgM) continue;
            let img = imgM[0];
            let cover = Manwa.attr(img, "data-original") || Manwa.attr(img, "src");
            if (!cover || cover.indexOf("images/") > 0) continue;
            let title = m[2] ? Manwa.attr(m[2], "title") : "";
            if (!title) {
                let t = /<p[^>]*class="[^"]*(?:manga-list-2-title|book-list-info-title|rank-list-info-right-title)[^"]*"[^>]*>([\s\S]*?)<\/p>/.exec(block);
                if (t) title = Manwa.decode(t[1]);
            }
            if (!title) continue;
            let tip = /<p[^>]*class="[^"]*(?:manga-list-2-tip|book-list-info-desc|rank-list-info-right-subtitle)[^"]*"[^>]*>([\s\S]*?)<\/p>/.exec(block);
            seen[id] = 1;
            comics.push(new Comic({
                id: id,
                title: title,
                cover: Manwa.abs(cover),
                subtitle: tip ? Manwa.decode(tip[1]) : "",
                tags: [],
            }));
        }
        return comics;
    }

    static maxPage(html) {
        let seg = /<ul class="pagination2"[^>]*>([\s\S]*?)<\/ul>/.exec(html);
        if (!seg) return 1;
        let re = /data-page="(\d+)"/g;
        let m, max = 1;
        while ((m = re.exec(seg[1])) !== null) {
            let v = parseInt(m[1], 10);
            if (v > max) max = v;
        }
        return max < 1 ? 1 : max;
    }

    /** 首页按 manga-list-title 分段 */
    static parseSections(html) {
        let marks = [];
        let re = /<div class="manga-list-title[^"]*"[^>]*>/g;
        let m;
        while ((m = re.exec(html)) !== null) marks.push({ at: m.index, head: m.index + m[0].length });
        let parts = [];
        for (let i = 0; i < marks.length; i++) {
            let start = marks[i].head;
            let stop = i + 1 < marks.length ? marks[i + 1].at : html.length;
            let titleArea = html.substring(start, Math.min(stop, start + 900));
            let tm = /<span[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/span>/.exec(titleArea);
            let title = tm ? Manwa.decode(tm[1]) : "";
            if (!title) {
                let tm2 = /<h3[^>]*>([\s\S]*?)<\/h3>/.exec(titleArea);
                title = tm2 ? Manwa.decode(tm2[1]) : "";
            }
            if (!title) {
                let raw = Manwa.decode(html.substring(start, Math.min(stop, start + 200)));
                title = raw.split(" ")[0] || "";
            }
            let comics = Manwa.parseList(html.substring(start, stop));
            if (title && comics.length) parts.push({ title: title, comics: comics });
        }
        return parts;
    }

    get explore() {
        return [{
            title: "漫蛙",
            type: "multiPartPage",
            load: async (page) => {
                let home = await Manwa.get("/");
                let parts = Manwa.parseSections(home);
                let out = [];
                for (let i = 0; i < parts.length; i++) {
                    out.push({
                        title: parts[i].title,
                        comics: parts[i].comics,
                        viewMore: "category:" + parts[i].title + "@sec:" + encodeURIComponent(parts[i].title),
                    });
                }
                try {
                    let rank = await Manwa.get("/rank");
                    let seg = /<ul class="rank-list" id="rankList_2"[\s\S]*?<\/ul>/.exec(rank);
                    let comics = Manwa.parseList(seg ? seg[0] : rank);
                    if (comics.length) {
                        out.unshift({
                            title: "人气榜",
                            comics: comics.slice(0, 30),
                            viewMore: "category:排行榜@rank:hot",
                        });
                    }
                } catch (_) {}
                if (!out.length) {
                    let list = Manwa.parseList(home);
                    if (list.length) out.push({ title: "最近更新", comics: list });
                }
                if (!out.length) throw new Error("漫蛙首页解析为空");
                return out;
            },
        }];
    }

    category = {
        title: "漫蛙",
        parts: [
            {
                name: "分级",
                type: "fixed",
                categories: ["全部", "一般向", "BL向", "禁漫", "TL向", "GL向"],
                categoryParams: ["g:-1", "g:2", "g:0", "g:1", "g:3", "g:4"],
                itemType: "category",
            },
            {
                name: "地区",
                type: "fixed",
                categories: ["全部", "韩国", "日漫", "国漫", "台漫", "其他", "未分类"],
                categoryParams: ["a:", "a:2", "a:3", "a:4", "a:5", "a:6", "a:1"],
                itemType: "category",
            },
            {
                name: "状态",
                type: "fixed",
                categories: ["全部", "连载中", "完结"],
                categoryParams: ["e:", "e:2", "e:1"],
                itemType: "category",
            },
            {
                name: "排序",
                type: "fixed",
                categories: ["最新", "最旧", "收藏", "新漫"],
                categoryParams: ["s:-1", "s:0", "s:1", "s:2"],
                itemType: "category",
            },
            {
                name: "专区",
                type: "fixed",
                categories: ["最近更新", "女主逆袭", "悬疑系列", "完结优选", "排行榜"],
                categoryParams: ["sec:最近更新", "sec:女主逆袭", "sec:悬疑系列", "sec:完结优选", "rank:hot"],
                itemType: "category",
            },
        ],
        enableRankingPage: false,
    };

    static queryFrom(param, options, page) {
        let q = { page: String(page || 1) };
        let tag = "";
        let p = String(param || "");
        let segs = p.split("|");
        for (let i = 0; i < segs.length; i++) {
            let s = segs[i];
            if (s.indexOf("g:") === 0) q.gender = s.substring(2);
            else if (s.indexOf("a:") === 0) q.area = s.substring(2);
            else if (s.indexOf("e:") === 0) q.end = s.substring(2);
            else if (s.indexOf("s:") === 0) q.sort = s.substring(2);
            else if (s.indexOf("t:") === 0) tag = s.substring(2);
        }
        if (tag) q.tag = tag;
        if (options && options.length && options[0]) q.sort = String(options[0]);
        let kv = [];
        let keys = ["page", "gender", "area", "end", "sort", "tag"];
        for (let i = 0; i < keys.length; i++) {
            let k = keys[i];
            if (q[k] !== undefined && q[k] !== "" && q[k] !== null) kv.push(k + "=" + encodeURIComponent(q[k]));
        }
        return kv.join("&");
    }

    get categoryComics() {
        return {
            load: async (category, param, options, page) => {
                let p = String(param || "");
                if (p.indexOf("rank:") === 0) {
                    let body = await Manwa.get("/rank");
                    let which = p.substring(5) === "end" ? "3" : (p.substring(5) === "new" ? "1" : "2");
                    let seg = new RegExp("<ul class=\"rank-list\" id=\"rankList_" + which + "\"[\\s\\S]*?</ul>").exec(body);
                    let comics = Manwa.parseList(seg ? seg[0] : body);
                    return { comics: comics, maxPage: 1 };
                }
                if (p.indexOf("sec:") === 0) {
                    let want = decodeURIComponent(p.substring(4));
                    let home = await Manwa.get("/");
                    let sections = Manwa.parseSections(home);
                    let picked = null;
                    for (let i = 0; i < sections.length; i++) {
                        if (sections[i].title === want) { picked = sections[i]; break; }
                    }
                    if (picked) return { comics: picked.comics, maxPage: 1 };
                    let tagMap = { "女主逆袭": "大女主", "悬疑系列": "悬疑", "完结优选": "" };
                    if (want === "完结优选") {
                        let body = await Manwa.get("/booklist?page=" + (page || 1) + "&end=1&sort=1");
                        return { comics: Manwa.parseList(body), maxPage: Manwa.maxPage(body) };
                    }
                    let tag = tagMap[want] || want;
                    let body = await Manwa.get("/booklist?page=" + (page || 1) + "&tag=" + encodeURIComponent(tag));
                    return { comics: Manwa.parseList(body), maxPage: Manwa.maxPage(body) };
                }
                let qs = Manwa.queryFrom(param, options, page);
                let body = await Manwa.get("/booklist?" + qs);
                return { comics: Manwa.parseList(body), maxPage: Manwa.maxPage(body) };
            },
            optionList: [],
        };
    }

    search = {
        load: async (keyword, options, page) => {
            let p = page || 1;
            let body = await Manwa.get("/search/?keyword=" + encodeURIComponent(keyword) + "&page=" + p);
            let comics = Manwa.parseList(body);
            return { comics: comics, maxPage: Manwa.maxPage(body) };
        },
        optionList: [],
    };

    get comic() {
        return {
            loadInfo: async (id) => {
                let body = await Manwa.get("/book/" + id);
                let title = "";
                let tm = /<h1[^>]*class="[^"]*detail-main-info-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/.exec(body);
                if (tm) title = Manwa.decode(tm[1]);
                if (!title) {
                    let mt = /<title>([\s\S]*?)<\/title>/.exec(body);
                    title = mt ? Manwa.decode(mt[1]).split("-")[0] : String(id);
                }
                let cover = "";
                let coverBlock = /<div class="detail-main-cover"[\s\S]{0,400}?<img[^>]*>/.exec(body);
                if (coverBlock) {
                    let img = /<img[^>]*>/.exec(coverBlock[0]);
                    cover = img ? (Manwa.attr(img[0], "data-original") || Manwa.attr(img[0], "src")) : "";
                }
                let desc = "";
                let dm = /<p class="detail-desc"[^>]*>([\s\S]*?)<\/p>/.exec(body);
                if (dm) desc = Manwa.decode(dm[1]);

                let tags = {};
                let rows = body.match(/<p class="detail-main-info-author"[\s\S]*?<\/p>/g) || [];
                let status = "";
                for (let i = 0; i < rows.length; i++) {
                    let row = rows[i];
                    let fm = /<span class="detail-main-info-author-field"[^>]*>([\s\S]*?)<\/span>/.exec(row);
                    let vm = /<span class="detail-main-info-value"[^>]*>([\s\S]*?)<\/span>/.exec(row);
                    if (!fm || !vm) continue;
                    let label = Manwa.decode(fm[1]).replace(/[：:]/g, "").trim();
                    let value = Manwa.decode(vm[1]);
                    if (!label || !value) continue;
                    if (label === "作者") tags["作者"] = [value];
                    else if (label === "地区") tags["地区"] = [value];
                    else if (label === "类别") tags["类别"] = [value];
                    else if (label === "更新状态") {
                        status = value;
                        tags["状态"] = [value];
                    } else if (label === "最新章节") {
                        tags["最新章节"] = [value];
                    }
                }

                let chapters = {};
                let chapBlock = /<ul[^>]*class="[^"]*detail-list-select[^"]*"[^>]*>([\s\S]*?)<\/ul>/.exec(body);
                let chapHtml = chapBlock ? chapBlock[1] : "";
                let cre = /<a\s+href="\/chapter\/(\d+)"([^>]*)>([\s\S]*?)<\/a>/g;
                let cm;
                let index = 0;
                while ((cm = cre.exec(chapHtml)) !== null) {
                    index++;
                    let cid = cm[1];
                    let name = cm[2] ? Manwa.attr(cm[2], "title") : "";
                    if (!name) name = Manwa.decode(cm[3]);
                    if (!name) name = "第" + index + "话";
                    chapters[cid] = name;
                }

                return new ComicDetails({
                    title: title,
                    cover: Manwa.abs(cover),
                    description: desc,
                    tags: tags,
                    chapters: chapters,
                    status: status,
                    url: (Manwa._host || Manwa.hosts[0]) + "/book/" + id,
                });
            },

            loadEp: async (comicId, epId) => {
                let body = await Manwa.get("/chapter/" + epId, {
                    "Referer": (Manwa._host || Manwa.hosts[0]) + "/book/" + comicId,
                });
                let imgs = [];
                let re = /<img[^>]*>/g;
                let m;
                while ((m = re.exec(body)) !== null) {
                    let tag = m[0];
                    let u = Manwa.attr(tag, "data-r-src") || Manwa.attr(tag, "data-original");
                    if (!u) continue;
                    if (u.indexOf("/static/images/") >= 0) continue;
                    if (imgs.indexOf(u) >= 0) continue;
                    imgs.push(u);
                }
                if (!imgs.length) throw new Error("该章节未解析到图片（可能需要登录或章节受限）");
                return { images: imgs };
            },

            onImageLoad: (url, comicId, epId) => {
                let cfg = {
                    headers: {
                        "User-Agent": Manwa.ua,
                        "Referer": (Manwa._host || Manwa.hosts[0]) + "/",
                        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
                    },
                };
                if (String(url).indexOf("_zb.") >= 0) {
                    cfg.onResponse = (buffer) => {
                        let key = Convert.encodeUtf8(Manwa.imgKey);
                        return Convert.decryptAesCbc(buffer, key, key);
                    };
                }
                return cfg;
            },
        };
    }
}
