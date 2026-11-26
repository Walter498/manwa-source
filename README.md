# manwa-source

漫蛙漫画的 Venera 独立源。

- 源文件：`manwa.js`
- 源列表：`index.json`
- 版本：1.0.3

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
