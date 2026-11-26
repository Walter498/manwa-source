# manwa-source

漫蛙漫画的 Venera 独立源。

- 源文件：`manwa.js`
- 源列表：`index.json`
- 版本：1.1.1

## 协议来源（静态还原，暮色 1.0.4 / mw 模块）

| 功能 | 请求 | 解析位置 |
|---|---|---|
| 首页分区 | `GET /` | `div.manga-list-title` + `manga-list-2-cover` |
| 分类列表 | `GET /booklist?page=&gender=&area=&end=&sort=&tag=` | `manga-list-2-cover` / `pagination2` |
| 搜索 | `GET /search/?keyword=&page=` | `book-list-cover` + `book-list-info-title` |
| 详情 | `GET /book/<id>` | `.detail-main-info-title` / `.detail-main-info-author` / `.detail-desc` / `ul.detail-list-select` |
| 章节图片 | `GET /chapter/<id>` | `.img-content img[data-r-src]` |
| 图片解密 | — | AES-128-CBC，key=iv=`my2ecret782ecret`（`decrypt_image_byte.dart` 的 `/module/mw` 分支） |

筛选参数原值：
- `gender`: -1 全部 / 2 一般向 / 0 BL / 1 禁漫 / 3 TL / 4 GL
- `area`: 空 全部 / 2 韩国 / 3 日漫 / 4 国漫 / 5 台漫 / 6 其他 / 1 未分类
- `end`: 空 全部 / 2 连载中 / 1 完结
- `sort`: -1 最新 / 0 最旧 / 1 收藏 / 2 新漫

## 导入

Venera → 漫画源 → 添加源：
```
https://raw.githubusercontent.com/Walter498/manwa-source/main/index.json
```
或直接添加单个源：
```
https://raw.githubusercontent.com/Walter498/manwa-source/main/manwa.js
```

## 1.1.0 变更

- 分类页支持多条件组合：新增 `categoryComics.loadWithFilters` 与 `multiSelectGroups`，
  解决「此來源未提供多條件分類查詢，請一次選擇一個條件」。
- 移除源设置里的「镜像域名」，改为内置域名自动探测。
- 新增评论：`loadComments` / `loadChapterComments`，命中站点 `/commentmore` 接口；
  设置项为「章节评论排序（最新/最热）」与「阅读器显示章节评论」。
- 详情页返回 `updateTime`（取自 `.detail-list-title-3`，如 `2026-11-26更新`）。
- 新增 `loadChapterMetadata`：站点只在详情页给出整本最近更新日期，章节列表本身不带日期，
  因此该日期只落在最新章节；章节标题中若显式带 `YYYY-MM-DD` 会被解析出来。

## 1.1.1 变更

- 修复首页/榜单封面不显示：条目图实际用 `data-home-src`（懒加载），此前只读 `data-original`/`src`，
  取到的是 `static/images/*` 占位图或被丢弃。现按 data-home-src → data-src → data-original → src 取值。
- 补全标签：新增「标签」分类分组，688 个站点原生标签（取自 `/booklist` 标签弹层 data-val），
  参数 `t:<tag>`，可与分级/地区/状态/排序组合。
- 新增 `comic.loadThumbnails`：按批（8 章/次）返回各章节首图，供详情页章节网格封面。
