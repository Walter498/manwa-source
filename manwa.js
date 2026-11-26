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
 *   - 评论    /commentmore?comment_id=&chapter_id=&book_id=&sort=&page=（comment.js: getMoreComment）
 *   - 更新    .detail-list-title-3 形如 "2026-11-26更新"
 */
class Manwa extends ComicSource {
    name = "漫蛙";
    key = "manwa";
    version = "1.2.0";
    minAppVersion = "1.0.0";
    url = "https://raw.githubusercontent.com/Walter498/manwa-source/main/manwa.js";

    static hosts = ["https://manwa.me", "https://www.manwa.me"];
    static imgKey = "my2ecret782ecret";
    static ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

    static _host = null;

    static tags = ["中文", "巨乳", "中出", "口交", "19R", "透视", "全彩", "日漫", "群交", "校服", "日文", "女性向", "乳交", "韩漫", "肛交", "熟女", "马尾", "强暴", "3D", "调教", "C100", "泳装", "校园", "萝莉", "乱伦", "C101", "完整版", "黑肉", "纯爱", "人妻", "束缚", "项圈", "NTR", "眼镜", "出轨", "职场", "催眠", "露出", "手套", "年下", "怀孕", "处女", "乳汁", "扶他", "恋爱", "内衣", "手淫", "百合", "巨尻", "多毛", "会员专区", "年龄差", "野炮", "都市", "触手", "女仆", "遮眼", "腹黑攻", "后宫", "青梅竹马", "魔法/奇幻", "贫乳", "穿刺", "辣妹", "滑稽搞笑", "三角关系", "拍摄", "傲娇受", "出汗", "高颜值", "超乳", "足交", "妖精", "执著攻", "热血", "办公室恋情", "CG", "非H", "同居", "自慰", "OL", "穿越", "兽耳", "忠犬攻", "原神", "援交", "甜文", "剧情", "ABO", "15R", "抖S", "古风", "重逢", "搞笑", "和服", "师生", "少女", "性感", "放尿", "教师", "药物", "丰满", "猎奇", "玄幻", "剧情向", "无码", "3P/多P", "偶像", "日常", "女装", "猫女", "短裤", "单恋", "黑道", "本子", "旧情复燃", "堕落", "诱受‧袭受", "溺爱", "奇幻", "睡奸", "美人受", "人外", "色气受", "冒险", "同人", "童贞", "反差", "掰弯", "颜射", "潮吹", "体型差", "手交", "C99", "过膝袜", "虐心", "兽人", "乳贴", "出产", "虐杀", "拘束", "玩具", "上司&middot;部下", "勾引", "小说改编", "制服", "修女", "SM/BDSM", "国漫", "狐娘", "吸奶", "重生", "一见钟情", "完结", "宅系", "爱情", "治愈", "台版", "兽娘", "幻想", "美人攻", "巨屌", "强攻", "壮受", "奴隶", "可爱受", "大女主", "大叔", "凌辱", "其他", "转化", "诱受&middot;袭受", "魔幻", "兽交", "排泄", "重口", "巨根", "虐待", "非现代", "母子", "大尺度", "豪门", "连载中", "戏剧", "巫女", "黑皮", "前辈&middot;后辈", "醉酒", "初体验", "性转", "禁断&middot;背德", "筋肉", "短篇合集", "动作", "护士", "生活", "主仆关系", "初恋", "画册", "惊悚/悬疑", "一夜情", "眼罩", "肌肉", "围裙", "娱乐圈", "无口", "抹油", "年下男子", "伪娘", "同级生", "温柔攻", "花嫁", "附身", "固执受", "强受", "母亲", "复仇", "皮物", "魅魔", "旗袍", "夹腿", "鬼族", "男公关", "窒息", "邻居", "逆袭", "总裁", "痴汉", "悬疑", "异世界", "淫纹", "硬派攻", "肉食系", "监禁", "正妹", "轻熟女", "科幻", "酷刑", "变态", "双马尾", "连载", "傲娇", "人妖", "深情攻", "阿黑颜", "职业女性", "病娇", "医生", "忠犬受", "吸血鬼", "男孕", "无修正", "张口", "少男", "浪漫", "C97", "上班族", "灌肠", "多CP", "动图", "宫廷", "COSPLAY", "青春", "放屁", "正太", "女王受", "契约关系", "内射", "排尿", "饮精", "警察", "美漫", "寡妇", "唯美", "短篇集", "台漫", "战斗", "王族&middot;贵族", "伦理", "疯批攻", "股交", "王子", "青年漫", "傲娇攻", "出版", "灵异", "抖M", "恶魔", "暴力", "傲慢攻", "壁尻", "单行本", "女警", "双向暗恋", "病娇攻", "丸吞", "恐怖", "系统", "女巫", "犬娘", "新娘", "幽灵", "强奸", "女性支配", "骨科/伪骨科", "肉欲", "武侠", "重口味", "淫荡", "异种族", "产卵", "见本", "妈妈", "天然受", "雀斑", "淫乱", "腹黑", "连裤袜", "换身", "浴衣", "相亲&middot;联谊", "寄生", "改编", "C96", "少年", "爆笑", "拳交", "欲望", "侄女", "强制", "御姐", "天然系", "忠犬", "失忆", "痴女", "异能", "健气受", "淫荡受", "FF39", "NP", "惊悚", "天使", "办公室", "微码", "C95", "寡默攻", "野外", "瘙痒", "YAOI", "纯情少女", "恋爱生活", "条漫", "和风", "霸总", "格斗", "耽美", "喝尿", "双子", "修真", "架空", "后悔攻", "年上男子", "性玩具", "C94", "鼻钩", "生子", "呆萌受", "怪物女孩", "微虐", "菁英", "萌系", "轮奸", "育儿", "长条", "心机攻", "女学生", "大小姐", "执事", "黑白", "火影", "恋尸", "绿帽", "富二代", "热血机战", "魔法奇幻", "美食", "直男受", "逆后宫", "丝袜", "霸道攻", "有夫之妇", "真人", "偷情", "推理", "纯情受", "电击", "扶她", "科幻未来", "女大学生", "舔阴", "追妻火葬场", "知音漫客", "昆虫", "冰释前嫌", "漫画家&middot;作家", "C92", "哭包攻", "推理悬疑", "小说", "禁漫汉化组", "诱惑", "召唤", "励志", "架空历史", "纯情攻", "超能力", "连续高潮", "财阀", "兄妹", "异国之恋", "橘味", "跟踪狂", "不伦", "长篇", "丧尸", "SM", "多攻", "体育竞技", "情趣用品", "军服", "舔足", "纯真受", "天然攻", "互攻", "兔女郎", "王公贵族", "创伤受", "家教", "毛绒绒", "鬼怪", "接吻", "性爱", "恐怖惊悚", "假期性爱系列", "暗恋", "怯懦攻", "PIXIV", "脑洞", "JK", "绝伦攻", "办公女郎", "古装", "粪便", "媚药", "狼女", "洗脑", "FOCUS", "血腥", "枷刑", "契约", "新作", "执着攻", "捆绑", "石化", "大乳晕", "马娘", "C93", "偏执攻", "虐文", "动画化", "C86", "耽美人生", "鞭打", "黑人", "魔法", "高甜", "强迫", "C90", "装逼", "渣攻", "C91", "敌对关系", "转生", "春药", "吊带袜", "伤疤", "鬼畜", "不良", "平凡受", "不良少年", "女高中生", "踩踏", "轻浮受", "类型:", "浪漫爱情", "C88", "游戏", "战争", "炮友", "婊子受", "妄想系", "性勒索", "道具", "淫乱受", "扩张", "可爱攻", "不伦/劈腿", "女扮男装", "3P", "特殊职业", "精灵", "运动", "彩虹", "好友", "日生佑稀", "高潮", "女大生", "长腿", "姐妹", "模特儿", "狂攻系列", "恶役千金", "成人", "直男攻", "禁断", "AV男优", "修仙", "S", "软萌受", "占有欲", "女神", "本崎月子", "极力推荐", "风俗", "神鬼", "上司", "兄弟情", "虫洞", "强制爱", "老师", "假小子", "按摩", "姐弟", "面瘫攻", "FF40", "妹妹", "外国人", "连体衣", "宫斗", "自卑受", "硬派受", "惊奇", "淫魔", "竞技", "C89", "腹黑受", "黑丝", "源一実", "近亲", "异种奸", "蛇女", "漫客栈", "女恶魔", "兄弟丼", "背叛", "上流社会", "非人", "鬼畜攻", "C87", "母狗", "性欲", "紧缚", "教授", "兄弟", "双胞胎", "英文", "养成", "年上", "木马", "秘书", "淫魔&middot;魅魔", "绷带", "姫屋", "RYONA", "历史", "通奸", "发交", "漫画", "婊子", "帅气女", "魔法少女", "哭包受", "团藤さや", "堕胎", "疗愈", "律师", "姐姐", "单纯受", "鲨鱼", "性奴", "年下攻", "山本ともみつ", "口交脸", "圈养", "格差", "下克上", "山口ねね", "C78", "报仇", "父女", "CG杂图", "AI作画", "黑长直", "后入", "骑乘", "汗水", "二穴", "幽默", "绝区零", "短篇", "Love Live", "肛内中出", "蹦坏脸", "碧蓝航线", "横切面", "连裤丝袜", "二棒同穴", "窒息式性爱", "鸣潮", "吞精", "比基尼", "崩坏：星穹铁道", "游泳池", "湿身", "野外 / 露出", "温泉", "原神:甘雨", "绳束", "精子浴", "少女前线", "原神: 妮露", "啦啦队", "人偶", "乳头责", "洗脑 / 催眠", "肉便器", "舔舐", "礼服", "英雄联盟", "英雄联盟: 阿璃", "英雄联盟: 奈德丽", "英雄联盟: 索娜", "英雄联盟: 阿卡莉", "英雄联盟: 露璐", "女狐", "RE: 从零开始的异世界生活", "RE: 艾米莉娅", "阿嘿颜", "雏田", "女忍", "19r", "生肉", "指交", "非人类", "POKEMON", "长筒丝袜", "晒黑/日烧", "情趣内衣", "护理师", "欲求不满", "性别地位逆转", "打工仔", "百合花园", "东方", "禁书目录", "东方: 灵梦", "东方: 八云紫", "女性主导", "原神:神里绫华", "教室", "C105", "淫魔/梦魔", "短发", "TL", "姐姐系", "C85", "女仆装", "COMIC1☆28"];


    settings = {
        commentSort: {
            title: "章节评论排序",
            type: "select",
            options: [
                { value: "1", text: "最新" },
                { value: "2", text: "最热" },
            ],
            default: "1",
        },
        chapterComments: {
            title: "阅读器显示章节评论",
            type: "select",
            options: [
                { value: "on", text: "显示" },
                { value: "off", text: "关闭" },
            ],
            default: "on",
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

    static base() {
        return Manwa._host || Manwa.hosts[0];
    }

    static abs(url) {
        if (!url) return "";
        let u = String(url).trim();
        if (u.indexOf("//") === 0) return "https:" + u;
        if (u.indexOf("http") === 0) return u;
        let host = Manwa.base();
        if (u.charAt(0) === "/") return host + u;
        return host + "/" + u;
    }

    static decode(s) {
        if (!s) return "";
        let named = {
            amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", nbsp: " ",
            middot: "·", hellip: "…", zwnj: "", zwj: "", mdash: "—",
            ndash: "–", ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’",
            times: "×", copy: "©", reg: "®", deg: "°",
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
            let cover = Manwa.attr(img, "data-home-src") || Manwa.attr(img, "data-src") || Manwa.attr(img, "data-original") || Manwa.attr(img, "src");
            if (cover && cover.indexOf("/static/images/") >= 0) cover = "";
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

    /** 详情页 "2026-11-26更新" */
    static bookUpdateTime(html) {
        let m = /<span[^>]*class="[^"]*detail-list-title-3[^"]*"[^>]*>([\s\S]*?)<\/span>/.exec(html);
        if (!m) return "";
        let text = Manwa.decode(m[1]);
        let d = /(\d{4}-\d{2}-\d{2})/.exec(text);
        return d ? d[1] : text.replace(/更新/g, "").trim();
    }

    /** 评论列表 JSON → Comment[] */
    static parseComments(body, requestPage) {
        let data = null;
        try {
            data = JSON.parse(body);
        } catch (e) {
            return { comments: [], maxPage: requestPage };
        }
        let list = data && data.list ? data.list : [];
        let comments = [];
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            if (item.is_black === 1) continue;
            let name = item.nick_name ? item.nick_name : (item.username || "");
            let avatar = item.cover ? item.cover : "";
            if (!avatar && item.user && item.user.avatar) avatar = item.user.avatar;
            let content = item.content || "";
            if (item.chapter_name) content += '<br/><span style="font-size:12px">— ' + item.chapter_name + "</span>";
            let reply = typeof item.reply_count === "number" ? item.reply_count : 0;
            comments.push(new Comment({
                userName: name,
                avatar: avatar ? Manwa.abs(avatar) : undefined,
                content: content,
                time: item.date || item.create_time || "",
                replyCount: reply,
                id: item.id ? String(item.id) : undefined,
                isLiked: item.liked === 1,
                score: typeof item.vote_like === "number" ? item.vote_like : undefined,
                voteStatus: item.liked === 1 ? 1 : (item.disliked === 1 ? -1 : 0),
            }));
        }
        let maxPage = list.length >= 5 ? requestPage + 1 : requestPage;
        return { comments: comments, maxPage: maxPage };
    }

    commentSort() {
        try {
            let v = this.loadSetting("commentSort");
            return v === "2" ? "2" : "1";
        } catch (_) {
            return "1";
        }
    }

    chapterCommentsOn() {
        try {
            return this.loadSetting("chapterComments") !== "off";
        } catch (_) {
            return true;
        }
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
            {
                name: "标签",
                type: "fixed",
                categories: Manwa.tags,
                categoryParams: Manwa.tags.map((t) => "t:" + t),
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

    /** 把一组过滤条件（可来自多个分组）合并成一次 /booklist 请求 */
    static async loadByFilters(filters, page) {
        let q = { page: String(page || 1) };
        let tag = "";
        let section = "";
        let rank = "";
        for (let i = 0; i < filters.length; i++) {
            let p = String(filters[i].param || "");
            if (!p) continue;
            if (p.indexOf("sec:") === 0) section = decodeURIComponent(p.substring(4));
            else if (p.indexOf("rank:") === 0) rank = p.substring(5);
            else if (p.indexOf("t:") === 0) tag = p.substring(2);
            else if (p.indexOf("g:") === 0) q.gender = p.substring(2);
            else if (p.indexOf("a:") === 0) q.area = p.substring(2);
            else if (p.indexOf("e:") === 0) q.end = p.substring(2);
            else if (p.indexOf("s:") === 0) q.sort = p.substring(2);
        }

        if (rank) {
            let body = await Manwa.get("/rank");
            let which = rank === "end" ? "3" : (rank === "new" ? "1" : "2");
            let seg = new RegExp("<ul class=\"rank-list\" id=\"rankList_" + which + "\"[\\s\\S]*?</ul>").exec(body);
            return { comics: Manwa.parseList(seg ? seg[0] : body), maxPage: 1 };
        }

        if (section) {
            let home = await Manwa.get("/");
            let sections = Manwa.parseSections(home);
            for (let i = 0; i < sections.length; i++) {
                if (sections[i].title === section) return { comics: sections[i].comics, maxPage: 1 };
            }
            if (section === "完结优选") {
                let body = await Manwa.get("/booklist?page=" + (page || 1) + "&end=1&sort=1");
                return { comics: Manwa.parseList(body), maxPage: Manwa.maxPage(body) };
            }
            let tagMap = { "女主逆袭": "大女主", "悬疑系列": "悬疑" };
            let t = tagMap[section] || section;
            let body = await Manwa.get("/booklist?page=" + (page || 1) + "&tag=" + encodeURIComponent(t));
            return { comics: Manwa.parseList(body), maxPage: Manwa.maxPage(body) };
        }

        if (tag) q.tag = tag;

        // 站点 /booklist 只接受一个 tag（重复 tag= 会被忽略），多选标签用交集实现
        let tags = [];
        for (let i = 0; i < filters.length; i++) {
            let p2 = String(filters[i].param || "");
            if (p2.indexOf("t:") === 0) {
                let t2 = p2.substring(2);
                if (t2 && tags.indexOf(t2) < 0) tags.push(t2);
            }
        }
        if (tags.length > 1) {
            let pages = await Promise.all(tags.map((t2) => {
                let kv2 = [];
                let keys2 = ["page", "gender", "area", "end", "sort"];
                for (let j = 0; j < keys2.length; j++) {
                    let k2 = keys2[j];
                    if (q[k2] !== undefined && q[k2] !== "" && q[k2] !== null) kv2.push(k2 + "=" + encodeURIComponent(q[k2]));
                }
                kv2.push("tag=" + encodeURIComponent(t2));
                return Manwa.get("/booklist?" + kv2.join("&")).then((body) => ({
                    comics: Manwa.parseList(body),
                    maxPage: Manwa.maxPage(body),
                }));
            }));
            let first = pages[0].comics;
            let sets = pages.map((pp) => {
                let m2 = {};
                for (let i2 = 0; i2 < pp.comics.length; i2++) m2[pp.comics[i2].id] = 1;
                return m2;
            });
            let inter = [];
            for (let i2 = 0; i2 < first.length; i2++) {
                let id2 = first[i2].id;
                let inAll = true;
                for (let j2 = 0; j2 < sets.length; j2++) if (!sets[j2][id2]) { inAll = false; break; }
                if (inAll) inter.push(first[i2]);
            }
            let maxP = pages[0].maxPage;
            for (let j2 = 1; j2 < pages.length; j2++) if (pages[j2].maxPage < maxP) maxP = pages[j2].maxPage;
            return { comics: inter, maxPage: maxP };
        }

        let kv = [];
        let keys = ["page", "gender", "area", "end", "sort", "tag"];
        for (let i = 0; i < keys.length; i++) {
            let k = keys[i];
            if (q[k] !== undefined && q[k] !== "" && q[k] !== null) kv.push(k + "=" + encodeURIComponent(q[k]));
        }
        let body = await Manwa.get("/booklist?" + kv.join("&"));
        return { comics: Manwa.parseList(body), maxPage: Manwa.maxPage(body) };
    }

    get categoryComics() {
        return {
            load: async (category, param, options, page) => {
                let p = String(param || "");
                if (p.indexOf("rank:") === 0 || p.indexOf("sec:") === 0) {
                    return await Manwa.loadByFilters([{ param: p }], page);
                }
                let qs = Manwa.queryFrom(param, options, page);
                let body = await Manwa.get("/booklist?" + qs);
                return { comics: Manwa.parseList(body), maxPage: Manwa.maxPage(body) };
            },
            loadWithFilters: async (request) => {
                let filters = request && request.filters ? request.filters : [];
                let page = request && request.page ? request.page : 1;
                return await Manwa.loadByFilters(filters, page);
            },
            multiSelectGroups: ["分级", "地区", "状态", "排序", "专区", "标签"],
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
                    else if (label === "更新状态") tags["状态"] = [value];
                    else if (label === "最新章节") tags["最新章节"] = [value];
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
                    updateTime: Manwa.bookUpdateTime(body),
                    url: Manwa.base() + "/book/" + id,
                });
            },

            loadEp: async (comicId, epId) => {
                let body = await Manwa.get("/chapter/" + epId, {
                    "Referer": Manwa.base() + "/book/" + comicId,
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
                        "Referer": Manwa.base() + "/",
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

            /** 详情页评论（漫蛙站点评论区） */
            loadComments: async (comicId, subId, page, replyTo) => {
                let p = Math.max(1, page || 1);
                let sort = this.commentSort ? this.commentSort() : "1";
                let url = "/commentmore?comment_id=" + (replyTo ? replyTo : 0) +
                    "&chapter_id=&book_id=" + encodeURIComponent(comicId) +
                    "&sort=" + sort + "&page=" + (p - 1);
                let body = await Manwa.get(url, { "Referer": Manwa.base() + "/book/" + comicId });
                return Manwa.parseComments(body, p);
            },

            /** 阅读器内章节评论 */
            loadChapterComments: async (comicId, epId, page, replyTo) => {
                if (!this.chapterCommentsOn || !this.chapterCommentsOn()) {
                    return { comments: [], maxPage: 1 };
                }
                let p = Math.max(1, page || 1);
                let sort = this.commentSort ? this.commentSort() : "1";
                let url = "/commentmore?comment_id=" + (replyTo ? replyTo : 0) +
                    "&chapter_id=" + encodeURIComponent(epId) +
                    "&book_id=" + encodeURIComponent(comicId) +
                    "&sort=" + sort + "&page=" + (p - 1);
                let body = await Manwa.get(url, { "Referer": Manwa.base() + "/chapter/" + epId });
                return Manwa.parseComments(body, p);
            },

            /**
             * 章节日期。
             * 漫蛙只在详情页给出整本的最近更新时间（.detail-list-title-3，
             * 例 "2026-11-26更新"），章节列表本身不带日期，因此这里把该日期
             * 赋给最新章节，并从章节标题中解析形如 2026-01-02 的日期。
             */
            loadChapterMetadata: async (id, chapterIds) => {
                let result = {};
                let ids = chapterIds || [];
                                for (let i = 0; i < ids.length; i++) {
                    let name = String(ids[i]);
                    let m = /(20\d{2})-(\d{2})-(\d{2})/.exec(name);
                    if (m) {
                        result[name] = { updateTime: m[1] + "-" + m[2] + "-" + m[3] };
                    }
                }
                let body = await Manwa.get("/book/" + id);
                let date = Manwa.bookUpdateTime(body);
                let chapBlock = /<ul[^>]*class="[^"]*detail-list-select[^"]*"[^>]*>([\s\S]*?)<\/ul>/.exec(body);
                let chapHtml = chapBlock ? chapBlock[1] : "";
                let cre = /<a\s+href="\/chapter\/(\d+)"([^>]*)>/g;
                let cm;
                let lastId = "";
                let names = {};
                while ((cm = cre.exec(chapHtml)) !== null) {
                    lastId = cm[1];
                    names[cm[1]] = Manwa.attr(cm[2], "title");
                }
                for (let key in names) {
                    let m = /(20\d{2})-(\d{2})-(\d{2})/.exec(names[key] || "");
                    if (m && !result[key]) result[key] = { updateTime: m[1] + "-" + m[2] + "-" + m[3] };
                }
                if (date && lastId) result[lastId] = { updateTime: date };
                return result;
            },
        };
    }
}
