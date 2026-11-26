# manwa-source

漫蛙漫画的 Venera 独立源。

- 源文件：`manwa.js`
- 源列表：`index.json`
- 版本：1.3.0

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
- 详情页返回 `updateTime`（取自 `.detail-list-title-3`，如 `2026-11-26更新`）。
- 新增 `loadChapterMetadata`：站点只在详情页给出整本最近更新日期，章节列表本身不带日期，
  因此该日期只落在最新章节；章节标题中若显式带 `YYYY-MM-DD` 会被解析出来。

## 1.1.1 变更

- 修复首页/榜单封面不显示：条目图实际用 `data-home-src`（懒加载），此前只读 `data-original`/`src`，
  取到的是 `static/images/*` 占位图或被丢弃。现按 data-home-src → data-src → data-original → src 取值。
- 补全标签：新增「标签」分类分组，688 个站点原生标签（取自 `/booklist` 标签弹层 data-val），
  参数 `t:<tag>`，可与分级/地区/状态/排序组合。
- 新增 `comic.loadThumbnails`：按批（8 章/次）返回各章节首图，供详情页章节网格封面。

## 1.2.0 变更

- 移除 `comic.loadThumbnails`：宿主会把它渲染成详情页底部的独立「預覽」区，
  章节卡片反而空着。移除后由宿主按章节惰性调用 `loadEp` 取该话首图，封面回到章节卡片。
- 标签组允许多选：`multiSelectGroups` 增加「标签」。站点 `/booklist` 只接受单个 `tag=`
  （重复参数会被忽略），因此多标签在源侧做**交集**：并行取各标签列表，按 id 求交，
  maxPage 取各列表最小值。实测 `巨乳` 45 条、`巨乳 ∩ 中文` 15 条。

## 1.3.0 变更

- 移除评论功能：删除 `loadComments` / `loadChapterComments` 与「章节评论排序」「阅读器显示章节评论」两个设置项。
  漫蛙评论区自 2026 年起已由站方整体关闭（`/commentmore` 只回管理员公告），保留入口只剩公告，遂移除。
- 源设置页不再有设置项（此前「镜像域名」已删）。
