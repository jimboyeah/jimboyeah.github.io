---
title: "II: Hugo 目录组织"
description: "坚果的 Hugo 教程"
date: 2020-08-06T20:14:08-04:00
featured_image_: "/assets/IMG_20181016_130158.jpg"
thumb_image_: "/assets/micro_s.png"
summary: Hugo 仓库提供的文档项目本身就是一个很好的示范，理解 Hogo 工程的目录结构是为了更好地利用 Hugo 的静态站点生成能力，比如语言支持与目录结构的关系、页面模板与 Markdown 文件的关系与文件的组织方式。
tags: ["hugo", "menu"]
---
# Hugo 目录组织

Hugo 仓库提供的文档项目本身就是一个很好的示范，以下内容摘自下面文档：

    hugo\docs\content\en\getting-started\quick-start.md

使用 **hugo new site** 生成的项目模板目录结构：

    .
    ├── archetypes 
    ├── config.toml
    ├── content
    ├── data
    ├── layouts
    ├── static
    └── themes


## ✅ archetypes 目录

默认，通过 `hugo new` 创建的内容会添加 `date`, `title`, `draft = true` 等扉页 front matter 设置信息，它们就是从 **archetypes** 模板文件中拷贝的。这可以节省时间，同时保证统一性。 

**Archetypes** 作为内容模板，Hugo 官方建议静态站点源码文件按 section 组织，每个 section 使用相应同名的 archetypes，这样 section 下面的 .md 就会自动使用响应 type 的 meta data。

当执行 **hugo new posts/dmeo.md**，Hugo 会到 archetypes 目录下搜索 **posts.md** 文件，找到哪个则使用哪个内容模板：

- `archetypes/posts.md`
- `archetypes/default.md`
- `themes/my-theme/archetypes/posts.md`
- `themes/my-theme/archetypes/default.md`

要明确一点，Hugo 中 MD 文件一般是作为内容文件使用的，只有特殊位置中的 MD 文件才是内容模板，而 **layouts** 目录才是模板存放的专用位置。


## ✅ assets 目录

不是默认创建的资源目录，保存所有需要通过 **Hugo Pipes** 处理的资源，只有那些 `.Permalink` 和 `.RelPermalink` 引用的文件会发布到 `public` 目录中，参考 Hugo 管道处理。


## ✅ config 目录

配置目录，非默认创建，Hugo 有大量的配置指令，此目录用于保存 JSON, YAML, TOML 等配置文件。最简单的项目只需要一个根目录下的配置文件 `config.toml`。 Every root setting object can stand as its own file and structured by environments.

- 每个配置文件代表一个配置根对象 configuration root object，如 `Params`, `Menus`, `Languages` 等等。
- 每个目录保存一组配置文件，针对独一的环境提供设置。
- 文件可以本地化为特定语言。

参考以下的配置文件目录结构：

    ├── config
    │   ├── _default
    │   │   ├── config.toml
    │   │   ├── languages.toml
    │   │   ├── menus.en.toml
    │   │   ├── menus.zh.toml
    │   │   └── params.toml
    │   ├── production
    │   │   ├── config.toml
    │   │   └── params.toml
    │   └── staging
    │       ├── config.toml
    │       └── params.toml

当运行 `hugo --environment staging`，Hugo 会将 `config/_default` 合并到 `staging`。

开发中默认环境为 **development** 即对应 `hugo serve` 运行命令，而编译生成时的环境为 **production** 对应 `hugo` 命令，参考 configuration.md 文档。

内容目录可以根据语言设置来调整，以下是 Hugo 文档中的 **_default\languages.toml** 配置：

      [en]
        contentDir = "content/en"
        languageName = "English"
        weight = 1
      
      [zh]
        contentDir = "content/zh"
        languageName = "中文"
        weight = 2

多语言支持参考 multilingual.md 文档。


## ✅ content 目录

参考内容管理 types.md, organization 文档。

所有内容页面存放目录，content 下的一级子目录看作一个对应的 **section** 内容分类区 content section。比如，为博客设置一个 `blog` 目录，为文章设置一个 `articles` 目录，为教程设置一个 `tutorials` 目录等，Hugo 使用内容分类区分作为默认**内容类型** content type，如果在扉页 front matter 设置了 `type` 则以具体设置的类型为准。

内容目录结构与 URL 对应关系参考：

    .
    └── content
        └── about
        |   └── index.md       // <- https://example.com/about/
        ├── posts
        |   ├── _index.md      // <- https://example.com/posts/
        |   ├── index.md       // <- https://example.com/posts/
        |   ├── firstpost.md   // <- https://example.com/posts/firstpost/
        |   ├── happy
        |   |   └── ness.md    // <- https://example.com/posts/happy/ness/
        |   └── secondpost.md  // <- https://example.com/posts/secondpost/
        └── quote
            ├── first.md       // <- https://example.com/quote/first/
            └── second.md      // <- https://example.com/quote/second/

每个目录下的 **_index.md** 和 **index.md** 是特殊的索引页面，二选一使用。可以在其扉页 front matter 为模板提供元数据，如 list templates, section templates, taxonomy templates, taxonomy terms templates, homepage template 等等。

在模板文件中，可以使用 **.Site.GetPage** 函数来获取数据。

而 **index.md** 页面呈现是较特殊的一个，假设在 section 目录下无其它 md 文件时，默认就展现 index.md 页面。如果，包含其它页面，那么就会在列表中展示 index.md，但默认它就是链接到列表本身。

例如，Hugo 文档中的 **_index.md** 示范，title 和 description 这些数据就会在列表页面模板中呈现出来：

    ---
    title: Get Started
    linktitle: Get Started Overview
    description: Quick start and guides for installing Hugo on your preferred operating system.
    date: 2017-02-01
    publishdate: 2017-02-01
    lastmod: 2017-02-01
    categories: [getting started]
    keywords: [usage,docs]
    menu:
      docs:
        parent: "getting-started"
        weight: 1
    weight: 0001    #rem
    draft: false
    aliases: [/overview/introduction/]
    toc: false
    ---

    If this is your first time using Hugo and you've [already installed Hugo on your machine][installed], we recommend the [quick start][]. You can also use [external learning resources][] to learn Hugo.

    [installed]: /getting-started/installing/
    [quick start]: /getting-started/quick-start/
    [external learning resources]: /getting-started/external-learning-resources/

参考各种列表模板文件的使用：

- 分类术语页 Taxonomy terms pages
- 分类列表页 Taxonomy list pages
- 分区列表页 Section list pages
- 简易信息聚合 RSS - Really Simple Syndication



## ✅ data 目录

数据模板目录，Hugo 静态网站不会连接像 MySQL 这样的数据库，而此目录保存的数据相当于 Hugo 使用的数据库，生成过程用到的配置数据，可以用 YAML, JSON, TOML 等格式文件。数据模板除了在此的文件定义，还可以从动态内容中生成。通过 **getJSON** 和 **getCSV** 两个函数是模板函数加载外部数据，或者访问数据接口，在外部数据加载完成以前，Hugo 会暂停渲染模板文件。

    {{ $dataJ := getJSON "url" }}
    {{ $dataC := getCSV "separator" "url" }}
    {{ $dataJ := getJSON "url prefix" "arg1" "arg2" "arg n" }}
    {{ $dataC := getCSV  "separator" "url prefix" "arg1" "arg2" "arg n" }}

假设 `data/jazz/bass/jacopastorius.toml` 数据模板文件包含如下贝斯手数据：

    discography = [
    "1974 – Modern American Music … Period! The Criteria Sessions",
    "1974 – Jaco",
    "1976 - Jaco Pastorius",
    "1981 - Word of Mouth",
    "1981 - The Birthday Concert (released in 1995)",
    "1982 - Twins I & II (released in 1999)",
    "1983 - Invitation",
    "1986 - Broadway Blues (released in 1998)",
    "1986 - Honestly Solo Live (released in 1990)",
    "1986 - Live In Italy (released in 1991)",
    "1986 - Heavy'n Jazz (released in 1992)",
    "1991 - Live In New York City, Volumes 1-7.",
    "1999 - Rare Collection (compilation)",
    "2003 - Punk Jazz: The Jaco Pastorius Anthology (compilation)",
    "2007 - The Essential Jaco Pastorius (compilation)"
    ]

那么，可以通过 `.Site.Data.jazz.bass.jacopastorius` 来使用它，在模板中将数据列表渲染出来：

    {{ range $.Site.Data.jazz.bass }}
       {{ partial "artist.html" . }}
    {{ end }}

然后在 `partials/artist.html`:

    <ul>
    {{ range .discography }}
      <li>{{ . }}</li>
    {{ end }}
    </ul>



## ✅ layouts 目录

布局模板文件目录，存放 `.html` 布局模板文件，对应不同的内容，模板有多种，data-templates、homepage、lists、menu-templates、partials、section-templates 等等。

站点的首页模板在主题目录中 **layouts/index.html**，除首页外，Hugo 有两类基本页面：

- Single page 单体页面，如 **hugo new demo.md** 创建的 Post 页面；
- List page 列表页面，如 tags 或 categories 页面；

这两种页面的默认模板都在主题目录中 **layouts/_default**，分别对应着 single.html 和 list.html。参考单页面内容模板 single-page-templates.md 和 lists.md 文档。

项目源码文件的目录布局影响着最终生成的 HTML 文件的结构布局，通常分成若干个部分，每部分都用一个目录管理，比如 content 下的 posts 目录对应所有 post 页面。编译后生成的 .html 文件也会在 public 的 posts 目录下，那么这里的 **posts** 就是一个 **section** 概念。

Hugo 会为每个 section 生成 index.html，采用主题布局中的 index.html 模板。

至于是否采用 **layouts/_default/list.html**，这要看 host 的匹配顺序，官方给出的布局模板匹配参考顺序：

    /layouts/section/SECTION.html
    /layouts/_default/section.html
    /layouts/_default/list.html
    /themes/THEME/layouts/section/SECTION.html
    /themes/THEME/layouts/_default/section.html
    /themes/THEME/layouts/_default/list.html

这个例子中 THEME=ananke, SECTION=posts，如果根目录下的 layouts 是空的，就进入主题目录下搜索 **layouts/section/posts.html** 模板，如果也不存在，因此用的是主题目录下的 **_default/list.html**。


## ✅ static 目录

静态资源存放目录，比如想使用 Marmarid 画作模块，或者 jQuery 工具库，或者其它脚本、图像、CSS 等等，就可以将文件放到这里，在 Hugo 编译生成时会自动原样复制到 **public** 目录。注意，可以有多个静态资源目录。


## ✅ resources 目录

资源缓冲目录，非默认创建，用于加速 Hugo 的生成过程，也可以用给模板作者分发构建好的 SASS 文件，因此不必安装预处理器。


## ✅ public 目录

生成静态站点的文件输出目录。

