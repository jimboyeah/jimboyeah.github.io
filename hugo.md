

# Hugo Web Framework 
- [Hugo - The world’s fastest framework for building websites](https://gohugo.io)
- [Hugo Quick Start](https://gohugo.io/getting-started/quick-start/)
- [Hugo Release](https://github.com/gohugoio/hugo/releases/)
- [achyons-css](https://github.com/tachyons-css/tachyons/)
- [twbs bootstrap](https://github.com/twbs/bootstrap)
- [Markdown editor for typora](https://typora.io/#windows)
- [Electron Web for Desktop Deplepment](https://github.com/electron/electron)
- [Electron Web for Desktop Deplepment](https://www.electronjs.org/)
- [Electron builder](https://github.com/electron-userland/electron-builder)
- [NW.js (known as node-webkit)](https://nwjs.io/)
- [Node addon examples for C/C++](https://github.com/nodejs/node-addon-examples)
- [从 VSCode 看大型 IDE 技术架构](https://zhuanlan.zhihu.com/p/96041706)

Hugo Framework 是一个静态网站构建工具，以 Go 语言所写，号称**世界上最快的静态网站引擎**。提供文件头，即扉页 front matter 和模板的等基本功能，兼备可伸缩性和可管理性。Hugo 不仅是给开发者设计的，也同样适用于内容管理员和写作人员。

Hugo 编译生成整个静态网站在 public 文件夹，只需要把这些静态网站的文件部署到一个地方即可。推荐免费且稳定的 GitHub Pages 是一个很好的选择，和 Git 代码仓库完美结合，拥有个人二级域名 **username.github.io**。

具体操作如下：

- 在个人 GitHub 账户中新建一个 Repository 命名为 xxx.github.io，其中 xxx 为自己的 GitHub 账户名；
- 将 public 文件夹内容复制到 xxx.github.io 仓库中；
- 访问 xxx.github.io 站点。


以 Windows 环境为例，前置软件要求：

- Git 版本仓库管理工具；
- Chocolatey 模块管理工具；

Chocolatey 安装 Hugo 工具集：

    choco install hugo -confirm
    choco install hugo-extended -confirm

Hugo 提供两个版本，安装 extended 版本支持 Sass/SCSS，一般项目都会用到，通过 **hugo version** 命令可以查看当前安装版本，缺少扩展支持可能导出编译出错：

    error: failed to transform resource: 
    TOCSS: failed to transform "scss/main.scss" (text/x-scss): 
    this feature is not available in your current Hugo version

继续安装 Hugo 框架源代码，及扩展标签支持：

    git clone https://github.com/gohugoio/hugo.git
    cd hugo
    go install --tags extended

创建一个网站模板，并按 Git 模块方式添加主题，相应设置 config.toml：

    hugo new site quickstart

    cd quickstart
    git init
    git submodule add https://github.com/budparr/gohugo-theme-ananke.git themes/ananke

    cat > config.toml <<END
    theme = "ananke"
    baseURL = "https://example.org/"
    languageCode = "en-us"
    title = "My New Hugo Site"
    END

按以下模式添加 MD 文件作为页面：

    hugo new posts/my-first-post.md

    cat > posts/my-first-post.md<<END
    ---
    title: "My First Post"
    date: 2019-03-26T08:47:11+01:00
    draft: true
    ---
    END

启动 Hugo server 并使用 drafts 模式：

    hugo server -D

在浏览器打开测试页面 http://localhost:1313/

Hugo 提供的命令用法参考文档中的 commands hugo_server.md 目录，如 Hugo Server 添加端口和 IP 绑定：

    hugo server -b http://127.0.0.1 --bind 127.0.0.1 --port 1314


最后，构建静态站点：

    hugo -D

Hugo 将内容分成草稿 Draft，将来发布 Future 和过期 Expired 等类型，可以在文件头扉页 front matter 中设置相应状态。

默认 Hugo 不会以发布草稿，可以在命令选项中指定，也可以将这些参数写入配置文件中：

    --buildFuture
    --buildDrafts
    --buildExpired

不同内容对应设置：

- future 设置 publishdate 值
- draft 设置 true 或者 false
- past 设置 expirydate 值

例如 demo.md 文件头扉页 front matter 中设置：

    ---
    title: Base Templates and Blocks
    linktitle:
    description: The base and block constructs ...
    godocref: https://golang.org/pkg/text/template/#example_Template_block
    date: 2017-02-01
    publishdate: 2017-02-01
    lastmod: 2017-02-01
    categories: [templates,fundamentals]
    keywords: [blocks,base]
    menu:
      docs:
        parent: "templates"
        weight: 20
    weight: 20
    sections_weight: 20
    draft: false
    aliases: [/templates/blocks/,/templates/base-templates-and-blocks/]
    toc: true
    ---

服务器默认打开 LiveReload，可以在选项中禁止：

    hugo server --watch=false
    hugo server --disableLiveReload

或者配置到文件 config.toml、config.yml：

    disableLiveReload = true

    disableLiveReload: true

下载好的主题中，通常会自带示例工程 **exampleSite**，如前面安装的 ananke 主题，可以进入子目录下执行，查看主题演示效果：

    >cd themes\gohugo-theme-ananke\exampleSite\
    >hugo server -D

syna 这个主题比较奇葩，强制使用 git，否则 Hugo 编译失败，还缺少 partials content 的定义！

    git submodule init # If you haven't initialized before
    git submodule add https://git.okkur.org/syna themes/syna
    cd themes/syna
    git checkout v0.17 # Latest release as of now is v0.17.0

iris 也不见得好到哪里，还搞了一个 **setup.sh** 脚本去建工程，拜托，你是主题好吗！

    git init
    git submodule add https://github.com/peaceiris/hugo-theme-iris.git ./themes/hugo-theme-iris
    cp -r ./themes/hugo-theme-iris/exampleSite/{config,content,data,scripts,static} .
    git add .
    git commit -m "Add hugo-theme-iris"


Hugo 默认会查找根目录下的 `config.toml`, `config.yaml`, `config.json`，可以指定配置文件，或 **config** 目录中的环境配置：

    hugo --config debugconfig.toml
    hugo --config a.toml,b.toml,c.toml
    hugo --environment staging

Hugo 的使用基础涉及到以下几个部分的内容：

- 内容管理 Content Management
- 基于 Go 的模板 Templates
- 函数 Functions
- 变量 Variables
- 管道处理 Hugo Pipes
- 模块配置 Hugo Modules
- 命令行工具 CLI


## TOML JSON YAML 文件格式

Hugo 中可以使用这三种数据格式用于配置，前置事项和自定义数据，但 TOML 是用于整个项目的推荐格式。

TOML - Tom's Obvious，Minimal Language

TOML 由 Tom - Tom Preston-Werner 编写，确切地说，这是一个在麻省理工学院授权的开源项目，目前在 Github上 有超过 5k 星。2013 年 3 月发布的第一个 TOML 版本，使 TOML 成为三个标准的年轻人。

TOML 的目标是成为最小的配置文件格式，由于精确的语义，这种格式易于阅读。TOML 被设计为无歧义地映射到散列表。TOML 应该很容易用各种语言来解析数据结构。

关于 TOML 语法的简短事实

- TOML 区分大小写。
- TOML 文件只能包含 UTF-8 编码的 Unicode 字符。
- 空格表示制表符 0x09 或空格 0x20 。
- 换行符表示 LF 0x0A 或 CRLF 0x0D0A 。

使用 TOML：

    date = "2016-12-14T21:27:05.454Z"
    publishdate = "2016-12-14T21:27:05.454Z"

    title = "Deep dive into TOML, JSON and YAML"
    tags = ["toml","yaml","json", "front matter"]

    type = "article"

    [amp]
        elements = []
        
    [article]
        lead = "Lorem ipsum."
        category = "frontmatter"
        related = []

    [sitemap]
      changefreq = "monthly"
      priority = 0.5
      filename = "sitemap.xml"

YAML 是一种广泛使用的语言，用于跨不同语言和框架的配置文件。YAML 的创建者和维护者是 Clark C. Evans，起初是 SML-DEV，专注于简化 XML，这是一个功能强大的 XML 子集，为 XML 创建了数据序列化的替代方案，特别是与 Python ，Perl 和 Ruby。该项目始于 2001 年，第一个 1.0 版本于 2009 年 1 月由 Oren Ben-Kiki，Clark Evans 和 Brian Ingerson 发布。自 2009 年以来，当前版本 1.2 正在使用中。

YAML 的语法实在太多了，80 页的规范，而且不是循序渐进的，即便你不需要复杂的功能，为了保证自己的简单功能不出错，也要对那些复杂的语法有所了解并加以避免。比如究竟什么键名可以不加引号，什么字符串可以不加引号；你总不能为了避免歧义全都加上引号，那和 JSON 也就差球不多了。更糟的是，纵使如此复杂，想要配置一段精确的多行字符串（精确控制首尾空行数）时，却显得力不从心。再加上缩进问题，编辑多行文本实在烦不胜烦。如果你还需要转义字符……

关于YAML语法的简短事实

- .yml 文件以 - 开头，标记文档的开始
- 键值对由冒号分隔
- 列表以连字符开头
- YAML 使用具有一个或多个空格的缩进来描述嵌套集合

使用 YAML：

    ---
    date: '2016-12-14T21:27:05.454Z'
    publishdate: '2016-12-14T21:27:05.454Z'
    title: Deep dive into TOML, JSON and YAML
    tags:
    - toml
    - yaml
    - json
    - front matter
    type: article
    amp:
      elements: []
    article:
      lead: Lorem ipsum.
      category: frontmatter
      related: []
    sitemap:
      changefreq: monthly
      priority: 0.5
      filename: sitemap.xml
    ---


在 21 世纪初，Douglas Crockford 引入了数据格式JSON的第一个规范。JSON 是一种轻量级的数据交换格式。由于 JavaScript 和大多数 Serverside 语言本身支持 JSON，因此广泛用于 Web 环境中浏览器和服务器之间的 API 通信。

有关JSON语法的简短事实

- 数据存储在名称/值对中
- 记录用逗号分隔。没有以下属性的尾随逗号是不允许的。
- 双引号包装属性名称和字符串。单引号是不允许的。

由于 JSON 包裹在两个花括号中，{} 因此在 Hugo 的前端内容中没有必要使用特殊的包装：

    {
        "date" : "2016-12-14T21:27:05.454Z",
        "publishdate" : "2016-12-14T21:27:05.454Z",
        "title" : "Deep dive into TOML, JSON and YAML",
        "tags" : ["toml","yaml","json", "front matter"],
        "type" : "article",
        "amp" : {
            "elements" : []
        },
        "article" : {
            "lead" : "Lorem ipsum.",
            "category" : "frontmatter",
            "related" : []
        },
        "sitemap" : {
          "changefreq" : "monthly",
          "priority" : 0.5,
          "filename" : "sitemap.xml"
        }
    }


TOML，YAML 和 JSON 之间最常见用例中的语法和功能集差异。

字符串

任何格式都支持 Strings。唯一的区别在于，JSON 不支持多行字符串。

TOML

    key = "String Value"
    multiline = """\
           The quick brown \
           fox jumps over \
           the lazy dog.\
           """

YAML

    key : String Value
    multilinePreservedLinebreaks:
    |
      L1 - The quick brown
      L2 - fox jumps over
      L3 - the lazy dog.
    multilineReplaceLinebreaksWithWhitespace:
    >
      This sentence ist just too long to keep it
      on the same line.

JSON

    {
      "key" : "String Value"
    }

对象/哈希表/集合
TOML中的表格几乎与YAML中的JSON和Collections中的对象相同。要访问Hugo模板中的集合，请按照.类似方式导航{{ .Params.objectkey.subkey }}。

TOML

    [table_key]
    property = "Value"
    secondProperty = "2nd Value"

    [alternative.direct]
    access = "results in alternative.direct.access for this value"

    alternativeCalledInlineTable = { property = "Value", "etc" = "You got it." }

YAML

    objectKey:
      property: Value
      secondProperty: 2nd Value
    alternative: { subkey: 5.0, another: 123 }

JSON

    {
      "objectKey" : {
        "property" : "Value",
        "secondProperty" : "2nd Value"
      }
    }

数组或列表受所有语言支持。

TOML

    fruits = [ "Apple", "Banana", "Strawberry" ]
    formats = [
      "YAML",
      "JSON",
      "TOML"
    ]

YAML

    fruits:
      - Apple
      - Banana
      - Strawberry
    formats: [ YAML, JSON, TOML ]

JSON

    {
      "fruits": ["Apple","Banana","Strawberry"],
      "formats": [
        "YAML",
        "JSON",
        "TOML"
      ]
    }

为了扩展这些例子，我们可以创建一个对象/表/集合的列表，就像这样：

TOML

    [[fruits]]
    name = "Apple"
    weight = 600

    [[fruits]]
    name = "Banana"
    weight = 300

    [[fruits]]
    name = "Strawberry"
    weight = 40

YAML

    fruits:
    - name: Apple
      weight: 600
    - name: Banana
      weight: 300
    - name: Strawberry
      weight: 40

JSON

    {
      "fruits": [
        {
            "name" : "Apple",
            "weight" : 600
        },
        {
            "name" : "Banana",
            "weight" : 300
        },
        {
            "name" : "Strawberry",
            "weight" : 40
        }
      ]
    }

上面的所有示例都会生成一个可以在 Hugo 模板文件中迭代的列表：

    {{ range .Params.fruits }}
        <strong>{{ .name }}</strong> - Weight: {{ .weight }}
    {{ end }}

我认为你现在对数组和表格是如何协同工作有了很好的理解; 让我们再次扩展以获得完整的概述。

TOML

    [[fruits]]
      name = "Apple"
      weight = 600

      [fruit.physical]
        color = "red"
        shape = "round"

      [[fruit.variety]]
        name = "red delicious"

      [[fruit.variety]]
        name = "granny smith"

    [[fruits]]
      name = "Banana"
      weight = 300

      [fruit.physical]
        color = "yellow"
        shape = "curved"
        
      [[fruit.variety]]
        name = "plantain"
        
    [[fruits]]
      name = "Strawberry"
      weight = 40

      [fruit.physical]
        color = "red"
        shape = "kind-of-oval"
        
      [[fruit.variety]]
        name = "the-good-one"

YAML

    fruits:
    - name: Apple
      weight: 600
      physical:
        color: red
        shape: round
      variety:
      - name: red delicious
      - name: granny smith
    - name: Banana
      weight: 300
      physical:
        color: yellow
        shape: curved
      variety:
      - name: plantain
    - name: Strawberry
      weight: 40
      physical:
        color: red
        shape: kind-of-oval
      variety:
      - name: the-good-one

JSON

    {
      "fruits": [
        {
            "name" : "Apple",
            "weight" : 600,
            "physical": {
              "color": "red",
              "shape": "round"
            },
            "variety": [
              { "name": "red delicious" },
              { "name": "granny smith" }
            ]
        },
        {
            "name" : "Banana",
            "weight" : 300,
            "physical": {
              "color": "yellow",
              "shape": "curved"
            },
            "variety": [
              { "name": "plantain" }
            ]
        },
        {
            "name" : "Strawberry",
            "weight" : 40,
            "physical": {
              "color": "red",
              "shape": "kind-of-oval"
            },
            "variety": [
              { "name": "the-good-one" }
            ]
        }
      ]
    }


数字（整数，浮点数，无穷大等）
所有数据结构中的数字编写都非常相似，但功能集有所不同：

TOML

    explicit_pos = +99
    positive = 42
    zero = 0
    negative = -17

    # For large numbers, you may use underscores to enhance readability.
    # Each underscore must be surrounded by at least one digit.
    large = 1_000
    verylarge = 5_349_221

    # fractional
    float = +1.0
    float_pi = 3.1415
    negative_float = -0.01

    # exponent
    flt4 = 5e+22
    flt5 = 1e6
    flt6 = -2E-2

    # both
    flt7 = 6.626e-34

YAML

    integer: 12
    octal_number: 014
    hexadecimal: 0xC
    float: 18.6
    exponential: 1.2e+32
    infinity: .inf

JSON （Infinity并且NaN在JSON中不受支持）

    {
      "integer": 12,
      "octal_number": 12,
      "hexadecimal": 12,
      "float": 18.6,
      "exponential": 1.2e+32
    }

杂项 - 日期时间，布尔，空

TOML

    bool1 = true
    bool2 = false

    date1 = 1979-05-27T07:32:00Z
    date2 = 1979-05-27T00:32:00-07:00
    date3 = 1979-05-27T00:32:00.999999-07:00

YAML

    bool1: true
    bool2: false

    null1: null
    null2: ~

    date_iso: 2016-12-14T21:59:43.10-05:00 # ISO-8601
    date_simple: 2016-12-14

JSON

    {
      "bool1": true,
      "bool2": false,
      "null1": null,
      "date_iso": "2016-12-14 21:59:43 -0500",
      "date_simple": "2016-12-14"
    }

总结：希望大家能很好地了解这三种数据结构之间的差异，以便使用它们中的任何一种。要简洁同时功能强大，请用yaml， 要在不同语言中交换、共享数据，请用json， 想尝鲜，用toml，还不够的话，请用xml吧。


## Hugo 目录组织

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


✅ **archetypes** 目录

默认，通过 `hugo new` 创建的内容会添加 `date`, `title`, `draft = true` 等扉页 front matter 设置信息，它们就是从 **archetypes** 模板文件中拷贝的。这可以节省时间，同时保证统一性。 

**Archetypes** 作为内容模板，Hugo 官方建议静态站点源码文件按 section 组织，每个 section 使用相应同名的 archetypes，这样 section 下面的 .md 就会自动使用响应 type 的 meta data。

当执行 **hugo new posts/dmeo.md**，Hugo 会到 archetypes 目录下搜索 **posts.md** 文件，找到哪个则使用哪个内容模板：

- `archetypes/posts.md`
- `archetypes/default.md`
- `themes/my-theme/archetypes/posts.md`
- `themes/my-theme/archetypes/default.md`

要明确一点，Hugo 中 MD 文件一般是作为内容文件使用的，只有特殊位置中的 MD 文件才是内容模板，而 **layouts** 目录才是模板存放的专用位置。


✅ **assets** 目录

不是默认创建的资源目录，保存所有需要通过 **Hugo Pipes** 处理的资源，只有那些 `.Permalink` 和 `.RelPermalink` 引用的文件会发布到 `public` 目录中，参考 Hugo 管道处理。


✅ **config** 目录

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


✅ **content** 目录

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



✅ **data** 目录

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



✅ **layouts** 目录

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


✅ **static** 目录

静态资源存放目录，比如想使用 Marmarid 画作模块，或者 jQuery 工具库，或者其它脚本、图像、CSS 等等，就可以将文件放到这里，在 Hugo 编译生成时会自动原样复制到 **public** 目录。注意，可以有多个静态资源目录。


✅ **resources** 目录

资源缓冲目录，非默认创建，用于加速 Hugo 的生成过程，也可以用给模板作者分发构建好的 SASS 文件，因此不必安装预处理器。


✅ **public** 目录

生成静态站点的文件输出目录。


## Hugo Modules 模块
- https://github.com/golang/go/wiki/Modules
- https://blog.golang.org/using-go-modules
- https://zhuanlan.zhihu.com/p/59687626

Hugo Modules 是基于 Go Modules 实现的，模块 Hugo 构建的核心块，一个模块可以一个 Hugo 工程，也可以是 Hugo 定义的 7 种小模块 static, content, layouts, data, assets, i18n, archetypes，可以按喜欢的方式组件使用模块，甚至从工程外部装入模块目录以构建一个大型的虚拟联合文件系统。

Go Modules 有哪些特点：

- Go Modules 是官方正式推出的包依赖管理项目；
- Go Modules 出现的目的之一就是为了解决 GOPATH 的问题，相当替换 GOPATH。旧项目必须在 $GOPATH/src 里进行，现在允许在任何目录下使用 **go.mod** 管理项目依赖。
- 使用模块代理协议 Module proxy protocol，通过这个协议可以使用 Go 模块镜像，使用 github 获取依赖。
- Tag 必须遵循语义化版本控制，如果没有将忽略 Tag，然后根据你的 Commit 时间和哈希值再为你生成一个假定的符合语义化版本控制的版本号。
- Go Modules 默认认为，只要你的主版本号不变，那这个模块版本肯定就不包含 Breaking changes，因为语义化版本控制这么规定。
- Global Caching 全局缓存数据，同一个模块版本的数据只缓存一份，共享使用，位于 **$GOPATH/pkg/mod** 和 **$GOPATH/pkg/sum** 目录下；
- 使用 **go clean -modcache** 清理所有已缓存的模块版本数据。
- 使用 **go mod** 命令管理模块。

另外在 Go1.11 之后 GOCACHE 已经不允许设置为 off 了，默认使用模块数据缓存。

Go Moduels 项目配置文件 **go.mod** 描述了当前项目，也可以看作是当前模块的元信息，每一行都以一个动词开头，目前有以下 5 个动词:

- **module** 用于定义当前项目的模块路径。
- **go** 用于设置预期的 Go 版本。
- **require** 用于设置一个特定的模块版本。
- **exclude** 用于从使用中排除一个特定的模块版本。
- **replace** 用于将一个模块版本替换为另外一个模块版本。

这里的填写格式基本为包引用路径+版本号，另外比较特殊的是 go $version，目前从 Go1.13 的代码里来看，还只是个标识作用。


✅ 模块基本用法

在国内网络访问 proxy.golang.org 会有问题，使用 Go Modules 代理可以解决，使用 **go env** 设置 Go 使用环境变量：

    go env -w GO111MODULE="on"
    go env -w GOPROXY=https://goproxy.io,direct

goget 也是一个常用的模块安装工具，它可以从 github 获取安装 golang.org 上的模块：

    go get github.com/leconio/goget
    goget golang.org/x/xxx

使用 go mod 命令创建模块项目：

    go mod init github.com/islishude/gomodtest

这时可看到目录内多了 go.mod 文件，内容很简单只有两行：

    module github.com/islishude/gomodtest

    go 1.12

首行为当前的模块名称，接下来是 go 的使用版本。这两行和 npm package.json 的 name 和 engine 字段的功能很类似。

创建一个 main.go 来测试模块的管理功能，引用 quote 模块作为测试：

    package main

    import (
        "fmt"

        "rsc.io/quote"
    )

    func main() {
        fmt.Println(quote.Hello())
    }

后面就可以直接使用 go run、go build、go test 等命令，因为使用了 Go Module，它们能自动下载相关依赖包。

    >go build
    go: finding module for package rsc.io/quote
    go: downloading rsc.io/quote v1.5.2
    ...

执行完成，go.mod 会自动更新一个依赖设置：

    module github.com/islishude/gomodtest

    go 1.14

    require rsc.io/quote v1.5.2


✅ Hugo 中的模块

将 Hugo 项目初始为一个模块：

    hugo mod init github.com/gohugoio/myShortcodes

相应地会在模块配置文件上添加当前模块的名称定义：

    module github.com/gohugoio/myShortcodes

在 Hugo 项目中，模块配置错误会出现以下信息：

    Module "xxx" not found

这时，需要检查引用模块名是不是正确的，是否已经安装。比如引用主题目录下的 **gohugo-theme-iris** 模块，但在在配置文件中写成 **hugo-theme-iris**，就会导致模块找不到。


将主题模块导入，Hugo 文档使用的主题是模块方式导入的，见 config.toml 配置文件：

    [module]
      [module.hugoVersion]
        min = "0.56.0"
      [[module.imports]]
        path = "github.com/gohugoio/gohugoioTheme"

模块导入可以设置 Hugo 版本要求 [module.hugoVersion]。

通常，以 Github 仓库创建主题的方式为常用，

    hugo mod init github.com/<your_user>/<your_project>

设置 Module Imports 后会下载主题，可以使用 **hugo mod get** 来管理版本：

    # Update All Modules 
    hugo mod get -u

    # Update All Modules Recursively New in v0.65.0
    hugo mod get -u ./...

    # Update One Module 
    hugo mod get -u github.com/gohugoio/myShortcodes

    # Get a Specific Version 
    hugo mod get github.com/gohugoio/myShortcodes@v1.0.7

    # Print Dependency Graph
    hugo mod graph

使用专用的供应目录来存储 Modules，以下命令会将依赖模块放到 **_vendor** 目录下管理，对后面的构建生效：

    hugo mod vendor 

注意：

- 可以在 module tree 任意层级上使用此命令。
- 供应化管理 Vendoring 不会保存 themes 目录下的模块。
- 大多数命令接收 --ignoreVendor 选项来忽略 **_vendor** 目录。



✅ 管理命令参考

升级次级或补丁版本号：

    go get -u rsc.io/quote

仅升级补丁版本号：

    go get -u=patch rscio/quote

升降级版本号，可以使用比较运算符控制：

    go get foo@'<v1.6.2'

移出所有代码中不需要的包：

    go mod tidy

如果仅仅修改 go.mod 配置文件，比如要移出 crypto 包

    go mod edit --droprequire=golang.org/x/crypto

对文件进行文本格式化。

    go mod edit -fmt


模块发布包的新版本和其它包管理工具基本一致，可以直接打标签，不过打标签之前需要在 go.mod 中写入相应的版本号：

    $ go mod edit --module=github.com/islishude/gomodtest/v2
    $ cat go.mod
    module github.com/islishude/gomodtest/v2

    go 1.12

    require (
        golang.org/x/crypto v0.0.0-20190313024323-a1f597ede03a // indirect
        rsc.io/quote v1.5.2
    )

官方推荐将上述过程在一个新分支来避免混淆，那么类如上述例子可以创建一个 v2 分支，但这个不是强制要求的。

还有一种方式发布新版本，那就是在主线版本种加入 v2 文件夹，相应的也需要内置 go.mod 这个文件。


## Variables 对象变量

File 文件系统对象：

|            属性           |                                        说明                                       |
|---------------------------|-----------------------------------------------------------------------------------|
| .File.Path                | 文件路径，如 `posts/foo.en.md`                                                    |
| .File.LogicalName         | 内容文件页面逻辑名，如 `foo.en.md`                                                |
| .File.TranslationBaseName | 翻译内容的原文件名，如 `foo.md`                                                   |
| .File.ContentBaseName     | 等价 TranslationBaseName 或是所在文件夹名，如果是一个 leaf bundle                 |
| .File.BaseFileName        | 不含扩展名的文件名，如 `foo.en`                                                   |
| .File.Ext                 | 扩展名，如 `md`，同 `.File.Extension`，注意没点号                                 |
| .File.Lang                | 文件关联的语言，如 `en`，参考 Hugo 多语言支持 Multilingual features               |
| .File.Dir                 | 目录路径 `content/posts/dir1/dir2/`，相对于工程目录，注意 `\` 或 `/` 对应不同系统 |
| .File.UniqueID            | 文件路径的 MD5 校验值                                                             |

Hugo 可以使用 Git 一起工作，要求如下：

1. 站点项目是一个 Git 仓库目录。
2. 能在 `PATH` 目录能找到并可以执行 Git 命令。
3. 启用 `.GitInfo` 需要登入 Hugo 命令行参数 `--enableGitInfo` 或配置文件设置 `enableGitInfo = true`。

GitInfo 对象：

|.AbbreviatedHash | 简短的 git commit hash，如 `866cbcc`
|.AuthorName | 作者，对应 `.mailmap`
|.AuthorEmail | 作者邮箱，对应 `.mailmap`
|.AuthorDate | 发布日期
|.Hash | 完整 commit hash，如 `866cbccdab588b9908887ffd3b4f2667e94090c3`
|.Subject | Git 提交的说明信息，如 `tpl: Add custom index function`


Hugo 对象，Page.Hugo 属性已经试用，直接使用全局变量，如 `hugo.Generator`。

|        属性       |                                说明                                |
|-------------------|--------------------------------------------------------------------|
| .Hugo.Generator   | 生成 HTML 标签，如 `<meta name="generator" content="Hugo 0.18" />` |
| .Hugo.Version     | Hugo 版本，如 `0.13-DEV`                                           |
| .Hugo.Environment | 当前的运行环境，即 `--environment` 命令行参数                      |
| .Hugo.CommitHash  | 当前 Hugo 版本的 git commit hash 值                                |
| .Hugo.BuildDate   | Hugo 编译日期，RFC 3339 格式，如 `2002-10-02T10:00:00-05:00`       |


菜单模板中使用的菜单对象：

|     属性    |      说明     |                                                                                      |
|-------------|---------------|--------------------------------------------------------------------------------------|
| .Menu       | string        | 包含此菜单条目的菜单名 **menu** -> **menu entry**                                    |
| .URL        | string        | 菜单设置的 `url` 或者内容文件 front-matter 配置的菜单，默认值是 `.RelPermalink`      |
| .Page       | * Page        | Page 对象引用，如果菜单条目在 front-matter 或者在站点配置文件，它不会为 nil          |
| .Name       | string        | 菜单配置的 `name`，默认值 `.LinkTitle`                                               |
| .Identifier | string        | 菜单配置的 `identifier` 值，如果菜单有同名，那么必需设备                             |
| .Pre        | template.HTML | 菜单配置的 `pre` 值，HTML 标签开始的字符串                                           |
| .Post       | template.HTML | 菜单配置的 `post` 值，HTML 标签结束位置的字符串                                      |
| .Weight     | int           | 菜单配置的 `weight`权重，排序有关，默认值同页面的权重                                |
| .Parent     | string        | 上层菜单条目 **menu entry** 的名字或标识，设置 `parent` 会将菜单嵌入对应的菜单条目下 |
| .Children   | Menu          | 子菜单集合，由 Hugo 自动填充                                                         |


菜单条目还有以下函数方法：

|       方法      | 返回值  |                                 说明                                 |
|-----------------|---------|----------------------------------------------------------------------|
| .HasChildren    | boolean | 返回 `true` 如果 `.Children` 非 nil                                  |
| .KeyName        | string  | 返回 `.Identifier` 如果存在键值，否则返回 `.Name`                    |
| .IsEqual        | boolean | 返回 `true` 如果同一个菜单条目                                       |
| .IsSameResource | boolean | 返回 `true` 如果两个菜单条目有相同 `.URL`                            |
| .Title          | string  | 链接标签的标题，菜单配置的 `title` 属性或者内容文件页面 `.LinkTitle` |

另外，页面对应提供 IsMenuCurrent 和 HasMenuCurrent 方法来判断页面和菜单的关系：

    .IsMenuCurrent(menu string, menuEntry *MenuEntry ) boolean
    .HasMenuCurrent(menu string, menuEntry *MenuEntry) boolean


页面对象 Page 属性：

|            属性           |                                         说明                                        |
|---------------------------|-------------------------------------------------------------------------------------|
| .AlternativeOutputFormats | 包含所有输出格式，在 `<head>` 中列表 `link rel` 有用                                |
| .AllTranslations          | 所有关联的翻译页面，包含当前页面，如果有多语言翻译的内容                            |
| .Aliases                  | 页面别名                                                                            |
| .Content                  | 页面内容，即内容文件 front matter 下面的内容                                        |
| .Data                     | 为此类型页面指定的数据内容                                                          |
| .Date                     | 内容文件的日期信息，和 `.ExpiryDate`, `.PublishDate`, `.Lastmod` 相关               |
| .Description              | 内容配置的描述信息                                                                  |
| .Draft                    | 标记文件是否是草稿状态 `true` 表示草稿，启动 Hugo 时需要 -D 参数                    |
| .ExpiryDate               | 过期日期，当前系统日期超过内容文件配置的 `expirydate` 表示过期                      |
| .File                     | 文件系统对象                                                                        |
| .FuzzyWordCount           | 字符统计，近似值                                                                    |
| .IsHome                   | 标记是否是主页                                                                      |
| .IsNode                   | 总为 `false` 表示正常内容页                                                         |
| .IsPage                   | 总为 `true`  表示正常内容页                                                         |
| .IsTranslated             | `true` 表示此页面有关联的翻译内容页面                                               |
| .Keywords                 | 内容配置的 meta 关键字                                                              |
| .Kind                     | 内容文件配置的页面类型 *kind*                                                       |
| .Language                 | 语言对象，指向配置文件语言配置信息，`.Language.Lang` 就是语言代码                   |
| .Lastmod                  | 文件扉页配置的最后修改日期 `lastmod`，如果启用了 GitInfo 则以其为准                 |
| .LinkTitle                | 内容文件的 `linktitle` 或 `title`                                                   |
| .Next                     | 下一个页面对象，即更新的页面                                                        |
| .NextInSection            | 当前 section 中的下一个页面，如 `/blog` 分区中的页面，按列表模板默认排序            |
| .OutputFormats            | 所有输了格式 OutputFormat 对象集体，参考 `.Get` 方法                                |
| .Pages                    | 相关页面的集合，对于正常页面为 nil                                                  |
| .Permalink                | 页面永久链接 URL                                                                    |
| .Plain                    | 纯文本内容，过滤了 HTML 标签                                                        |
| .PlainWords               | 纯文本字符串数组，不含分行，`[]string`                                              |
| .Prev                     | 上一页面对象，即更旧的页面                                                          |
| .PrevInSection            | 当前 section 中的前一个页面                                                         |
| .PublishDate              | 内容文件设置的 published 发布时间                                                   |
| .RawContent               | 原始 markdown 文件内容无 front matter 部分，和 remarkjs.com 一起很有用              |
| .ReadingTime              | 阅读完需要的时间，分钟                                                              |
| .Resources                | 当前页面关联的资源文件，如图片, CSS                                                 |
| .Ref                      | 返回给定内容文件的 URL 地址，如 `.Ref "sample.md"`，参考 Cross References           |
| .RelPermalink             | 返回当前页面的相对链接地址                                                          |
| .RelRef                   | 返回给内容文件的相对链接地址                                                        |
| .Site                     | 当前站点对象                                                                        |
| .Sites                    | 所有语言的站点，如第一个站点的 URL {{ .Sites.First.Home.RelPermalink }}             |
| .Sites.First              | 第一个语言对应的站点，非多语言站点就返回自身                                        |
| .Summary                  | 内容摘要，默认自动截取，可用 `<!--more-->` 进行分隔摘要部分，或者在扉页配置 summary |
| .TableOfContents          | 内容页面的目录                                                                      |
| .Title                    | 页面标题                                                                            |
| .Translations             | 当前页面的关联翻译内容页面列表                                                      |
| .TranslationKey           | 当前页面翻译内容关联键值                                                            |
| .Truncated                | 标记 `.Summary` 是不是截取的，通常在 "Read more..." 链接中使用                      |
| .Type                     | 内容类型，如 `posts`                                                                |
| .Weight                   | 内容文件配置的权重值                                                                |
| .WordCount                | 单词统计                                                                            |
| .Dir                      | 内容文件的目录路径，相对 `content` 目录，使用 File.Dir 替代                         |
| .Hugo                     | 弃用，建议直接使用 hugo 全局对象                                                    |
| .RSSLink (deprecated)     | RSS 地址，替代 `{{ with .OutputFormats.Get "RSS" }}{{ .RelPermalink }}{{ end }}`.   |
| .UniqueID                 | 弃用，MD5 校验值，使用 `.File.UniqueID` 替代                                        |


.Kind 页面类型有 `page`, `home`, `section`, `taxonomy`, `taxonomyTerm`，还有 `RSS`, `sitemap`, `robotsTXT`, `404` 等，但是它们只有渲染对应类型时有效，在 `Pages` 集合中无效。

在列表页面模板中，可以使用 .Pages 集合的 .Next 和 .Prev 获取前、后页面信息，具体参考 lists.md。


**shortcode** 短代码模板对象中可使用的属性变量，以上面的调用方法作为参考，对应值如下：

|      属性      |                      说明                      |               参考值                |
|----------------|------------------------------------------------|-------------------------------------|
| .Name          | Shortcode 名字                                 | page-kinds                          |
| .Ordinal       | 基于 0 的序号，表示 shortcode 在页面内容的位置 | 1                                   |
| .Parent        | 嵌套的 parent shortcode                        | nil                                 |
| .Position      | 所在页面文件名和行列号，常用于调试             | "C:\content\posts\2nd-post.md:29:5" |
| .IsNamedParams | 指示是否使用命名参数，而不是位置化参数         | false                               |
| .Inner         | 在 shortcode 标签之间的的内容                  | sometext                            |


站点对象是全局对象，如页面中的 `.Site.RegularPages` 方法可以按全局方式调用 `site.RegularPages`。

以下是站点对象的常用变量：

|             属性            |                                  说明                                  |
|-----------------------------|------------------------------------------------------------------------|
| .Site.AllPages              | 包含所有页面的数组，不管是不是翻译页面                                 |
| .Site.Author                | 包含所有作者的映射对象 map                                             |
| .Site.BaseURL               | 站点的基本 URL                                                         |
| .Site.BuildDrafts           | 站点是否启用草稿                                                       |
| .Site.Copyright             | 配置文件中的版权信息 copyright                                         |
| .Site.Data                  | 自定义的数据文件对象                                                   |
| .Site.DisqusShortname       | Disqus shortcode 的短名称字符串                                        |
| .Site.GoogleAnalytics       | Google Analytics 追踪代码字符串                                        |
| .Site.Home                  | 主页面对象的引用                                                       |
| .Site.IsMultiLingual        | 指示是否是多语言站点                                                   |
| .Site.IsServer              | 指示是否在 Hugo 内置服务器中运行，即命令行 hugo server 运行时返回 true |
| .Site.Language.Lang         | 本地化语言代码，如 en                                                  |
| .Site.Language.LanguageName | 完整的语言名称，如 English                                             |
| .Site.Language.Weight       | the weight that defines the order in the `.Site.Languages` list.       |
| .Site.Language              | 当前站点使用的语言对象，在站点配置文件指定的语言                       |
| .Site.LanguageCode          | 当前语言代码，常用于 RSS 链接属性                                      |
| .Site.LanguagePrefix        | 可以在 URL 上使用的语言前缀，参考 absLangURL                           |
| .Site.Languages             | 站点所有语言列表，按 weight 排序                                       |
| .Site.LastChange            | 站点最近更改时间，基于内容文件 front matter 的 `date` 定义             |
| .Site.Menus                 | 站点定义的所有菜单                                                     |
| .Site.Pages                 | 站点当前语言的所有页面，按日期排序                                     |
| .Site.RegularPages          | 一般页面的列表，等价 `where .Site.Pages "Kind" "page"`                 |
| .Site.Sections              | 内容目录下的 Session 列表，即一级子目录                                |
| .Site.Taxonomies            | 当前站点的分类页面，替代了 `.Site.Indexes`                             |
| .Site.Title                 | 站点标题                                                               |

语言对象没有在文档中罗列，可以参考源代码，在站点配置语言时，也需要根据 Language struct 提供的字段配置：

    // Language manages specific-language configuration.
    type Language struct {
        Lang              string
        LanguageName      string
        LanguageDirection string
        Title             string
        Weight            int

        Disabled bool
        ContentDir string
        ...
    }


在站点地图模板使用的 Sitemap 对象也是一个 Page 对象，参考属性：

|         属性        |     说明     |
|---------------------|--------------|
| .Sitemap.ChangeFreq | 页面更改频率 |
| .Sitemap.Priority   | 页面的优先级 |
| .Sitemap.Filename   | 站点地图文件 |


分类页面模板中使用的也是一个页面对象 Page，但是有额外的数据：

|           属性           |                            说明                           |
|--------------------------|-----------------------------------------------------------|
| .Data.Singular           | : The singular name of the taxonomy (e.g., `tags => tag`) |
| .Data.Plural             | : The plural name of the taxonomy (e.g., `tags => tags`)  |
| .Data.Pages              | : The list of pages in the taxonomy                       |
| .Data.Terms              | : The taxonomy itself                                     |
| .Data.Terms.Alphabetical | : The taxonomy terms alphabetized                         |
| .Data.Terms.ByCount      | : The Terms ordered by popularity                         |

注意 `Alphabetical` 和 `ByCount` 的数据可以进行反转排序：

- `.Data.Terms.Alphabetical.Reverse`
- `.Data.Terms.ByCount.Reverse`

在分类模板外，要使用分类就通过 `.Site.Taxonomies` 实现，它包含站点定义的所有分类列表 TaxonomyList，元素是个 map 对象，如：

    {"tags" -> ["tag1", "tag2", "tag3"]}

每个值都是 Taxonomy 对象变量，包含分类列表，而非字符串，列表每个元素对应内容页面。

默认的有目录 **categories** 和标签 **tags** 两个分类，看示范如果列表站点的分类页面：

    <section>
      <ul>
        {{ range $taxonomyname, $taxonomy := .Site.Taxonomies }}
          <li><a href="{{ "/" | relLangURL}}{{ $taxonomyname | urlize }}">{{ $taxonomyname }}</a>
            <ul>
              {{ range $key, $value := $taxonomy }}
              <li> {{ $key }} </li>
                    <ul>
                    {{ range $value.Pages }}
                        <li><a href="{{ .Permalink}}"> {{ .LinkTitle }} </a> </li>
                    {{ end }}
                    </ul>
              {{ end }}
            </ul>
          </li>
        {{ end }}
      </ul>
    </section>





## Hugo Pipes 管道处理

Hugo Pipes 是一组织处理资源目录下的文件函数集，资源目录可以通过 **assetDir** 配置项指定，默认是 assets。

涉及处理的内容：

- 样式脚本 SASS / SCSS
- 构建后期 PostProcess
- 样式加工 PostCSS
- 脚本转译 JavaScript Building
- 脚本转译 Babel
- 资源压缩 Asset minification
- 资源打包 Asset bundling
- 资源指纹 Fingerprinting and SRI
- 资源生成 Resource from Template
- 资源生成 Resource from String

管道处理还应用于模板中串联函数的调用，如，生成 5 个数再将顺序打乱：

    {{ shuffle (seq 1 5) }}

使用管道的语法：

    {{ (seq 1 5) | shuffle }}


资源对象的提供的属性变量或方法参考 Page Resources 文档：

|        属性        |                                       说明                                       |
|--------------------|----------------------------------------------------------------------------------|
| ResourceType       | 资源 MIME 类型，如 `image/jpeg` 对应 ResourceType `image`                        |
| Name               | 资源文件名，相对于当前页面，可以在 front matter 设置                             |
| Title              | 默认和 `.Name` 一样，也可以在 front matter 设置                                  |
| Permalink          | 资源绝对 URL，对于 `page` 资源空值                                               |
| RelPermalink       | 资源相对 URL，对于 `page` 资源空值                                               |
| Content            | 资源内容，通常是字符串内容                                                       |
| MediaType          | MIME 类型，如 `image/jpeg`                                                       |
| MediaType.MainType | 主要 MIME 类型，如 `application/pdf` 的 MainType 就是 `application`              |
| MediaType.SubType  | 次要 MIME 类型，上面 `pdf` 的 SubType 是 `pdf`，而 PPT 文件是 `vnd.mspowerpoint` |
| MediaType.Suffixes | 可能 MIME 列表，切片数据类型                                                     |


如果，有 Go 语言基础，可以试着读 Hugo 源代码，这也是开源的一大好片处，似乎不搞源代码开源就没有意义了：

    // Resource represents a linkable resource, i.e. a content page, image etc.
    type Resource interface {
        ResourceTypeProvider
        MediaTypeProvider
        ResourceLinksProvider
        ResourceMetaProvider
        ResourceParamsProvider
        ResourceDataProvider
    }


使用资源对象方法：

    <script>{{ (.Resources.GetMatch "myscript.js").Content | safeJS }}</script>
    <img src="{{ (.Resources.GetMatch "mylogo.png").Content | base64Encode }}">

如果，文件不一定会存在，那么就需要加条件判断：

    {{ $style := resources.Get "theme/css/main.css" | resources.PostCSS }}
    {{ if $css }}
      {{ printf $style.Content }}
    {{ end }}



✅ 处理 SCSS 样式脚本资源

先将资源文件读入使用：

    {{ $style := resources.Get "sass/main.scss" }}

在 resources.Get 函数读取 SCSS 样式脚本后，就要使用扩展将其转换为 CSS。

资源文件会被打包到 /public 目录下，如果使用了 .Permalink 或 .RelPermalink，即意味使用了资源，Hugo 就会将将其打包。

    {{ $style := resources.Get "sass/main.scss" | resources.ToCSS | resources.Minify | resources.Fingerprint }}
    <link rel="stylesheet" href="{{ $style.Permalink }}">

    {{ $style := resources.Get "sass/main.scss" | toCSS | minify | fingerprint }}
    <link rel="stylesheet" href="{{ $style.Permalink }}">

每个 Hugo Pipes 资源转换方法都使用驼峰式 camelCased 别名，如 **toCSS** 表示 resources.ToCSS，非转换方法就没有这样的别名，如 resources.Get, resources.FromString, resources.ExecuteAsTemplate, resources.Concat 等。

整个 Hugo Pipes 管道链是基于缓存的，即前一级生成的内容缓存后进入下一级处理：

    {{ $mainJs := resources.Get "js/main.js" | js.Build "main.js" | minify | fingerprint }}

在 Hugo 构建站点时，管道链在首次调用后建立，所有资源都会从缓存中获取，不必担心模板执行反反复复地使用资源而引起构建性能问题。


通过 toCSS 进行转换时，可以设置以下参数：

|       选项      |      类型      |                               说明                               |
|-----------------|----------------|------------------------------------------------------------------|
| targetPath      | [string]       | 指定输出路径，默认只修改原 SASS/SCSS 的扩展名为 .css；           |
| outputStyle     | [string]       | 默认是 nested，其它输出风格有 expanded, compact, compressed 等； |
| precision       | [int]          | 浮点值处理精度                                                   |
| enableSourceMap | [bool]         | 是不使用 source map 调试信息映射文件                             |
| includePaths    | [string slice] | 添加 SCSS/SASS 包含目录，注意要使用工程目录中的相对路径      |


示范，给 SCSS/SASS 添加 includePaths 路径参数，注意使用了 dict 字典对象：

    {{ $options := (dict "targetPath" "style.css" "outputStyle" "compressed" "enableSourceMap" true "includePaths" (slice "node_modules/myscss")) }}
    {{ $style := resources.Get "sass/main.scss" | resources.ToCSS $options }}

设置 outputStyle 为 compressed 可以获得比 resources.Minify 更好的 SASS/SCSS 压缩效果。

SASS / SCSS 作为 CSS 的升级版，实现以样式脚本的方式来定义样式表，掌握它们可以极大提高效率。但是学习曲线陡峭，另一个选择是使用 PostCSS 工具。


✅ 构建后期 PostProcess

允许在构建生成后延迟资源到 /public 的转移，使用 **resources.PostProcess** 标记资源资源后，延迟转移生成后的任何文件，通常转换链中的一个或多个步骤取决于生成的结果。

一个基本的后期处理是使用 PostCSS 对样式进行清理，当前有两个限制：

- 只能处理 **.html** 模板文件；
- 不可以操纵由资源对象方法返回的值；

例如，示例中 **upper** 函数的调用就不能正常得到正确结果：

    {{ $css := resources.Get "css/main.css" }}
    {{ $css = $css | resources.PostCSS | minify | fingerprint | resources.PostProcess }}
    {{ $css.RelPermalink | upper }}


配合 PostCSS 清理 CSS，有多种方法实现，考虑简单的实现方法，避免使用 resources.PostProcess 从模板中提取关键字，可以参考 tailwindcss 文档示例。

下面的配置写入项目根目录下的 hugo_stats.json，如果只想在发布时有效，可以将其保存到 config/production 目录。

    [build]
      writeStats = true

配置脚本：

    const purgecss = require('@fullhuman/postcss-purgecss')({
        content: [ './hugo_stats.json' ],
        defaultExtractor: (content) => {
            let els = JSON.parse(content).htmlElements;
            return els.tags.concat(els.classes, els.ids);
        }
    });

    module.exports = {
        plugins: [
            require('tailwindcss'),
            require('autoprefixer'),
            ...(process.env.HUGO_ENVIRONMENT === 'production' ? [ purgecss ] : [])
        ]
    };

上面配置为发布时清理，那么在页面模板中也要相应使用条件进行环境判断：

    {{ $css := resources.Get "css/main.css" }}
    {{ $css = $css | resources.PostCSS }}
    {{ if hugo.IsProduction }}
    {{ $css = $css | minify | fingerprint | resources.PostProcess }}
    {{ end }}

    <link href="{{ $css.RelPermalink }}" rel="stylesheet" />



✅ 样式加工 PostCSS

Hugo Pipes 可以使用 PostCSS 处理样式文件，这是一个非常实用的 CSS 工具。

PostCSS 官方介绍插件功能特性：

- 增加代码可读性 → **autoprefixer**
- 使用先进的 CSS 样式，Use tomorrow's CSS, today! → **postcss-cssnext**
- 全局样式 Global CSS 终结者 → **postcss-modules**
- 保证样式正确性 → **stylelint**
- 强大的 grid CSS → **LostGrid**

一些支持的功能：

- 片断引入 partial imports
- 变量 variables
- 嵌套 nesting
- 混合宏 mixins
- 扩展 extend
- 占位符 placeholder classes
- 颜色函数 darken and rgba color functions
- 压缩 compression

语法支持参考各个插件，大数预处理器由 Syntaxes 语法扩展而来。事实上，Sass、Stylus 和 LESS 很多功能都可以通过 PostCSS 语言的扩展实现，比如说添加 mixin，变量，条件，循环，嵌套和扩展等。

例如，定义以下一个样式：

    :fullscreen { ... }

经过 PostCSS autoprefixer 处理后，自动添加了浏览器前缀：

    :-webkit-full-screen { ... }
    :-ms-fullscreen { ... }
    :fullscreen { ... }


Lost Grid 是一个强大的 PostCSS 网格系统，可与任何预处理器甚至是原生 CSS 一起使用。

在这里有非常好的 demo 展示：http://lostgrid.org/lostgrid-example.html

以下例子根据不同的设备屏幕大小来调整网格的每行格子数，小屏幕一行一格，中小屏幕一行三格，大屏幕一行六格：

    .ColumnSection__grid div {
        lost-column: 1/1;
    }

    @media (min-width: 400px) {
        .ColumnSection__grid div {
            lost-column: 1/3;
        }
    }

    @media (min-width: 900px) {
        .ColumnSection__grid div {
            lost-column: 1/6;
        }
    }


postcss-nested 实现类似 Sass 功能：

    .phone {
        &_title {
            width: 500px;
            @media (max-width: 500px) { width: auto; }
            body.is_dark & { color: white; }
        }
        img { display: block; }
    }

    .title {
      font-size: var( --font );
      @at-root html { --font: 16px }
    }

@at-root 相应为上级节点定义一个新的样式，var (--font) 这样的表示引用变量，只有上级节点的值才能有效引用。

转译生成：

    .phone_title { width: 500px; }

    @media (max-width: 500px) {
        .phone_title { width: auto; }
    }

    body.is_dark .phone_title { color: white; }

    .phone img { display: block; }

    .title { font-size: var(--font); }

    html { --font: 16px }

postcss-nested & postcss-mixins 结合实现 Sass 中最常用的特性：

    @define-mixin clearfix{
        &:after{
            display: table;
            clear: both;
            content: " ";
        }
    }

    .column-container{
        color: #333;
        @mixin clearfix;
    }

编译后：

    .column-container{
        color: #333;
    }

    .column-container:after{
        display: table;
        clear: both;
        content: " ";
    }

postcss-cssnext 语法：

    :root {
      --fontSize: 1rem;
      --mainColor: #12345678;
      --centered: {
          display: flex;
          align-items: center;
          justify-content: center;
      };
    }
    body {
        color: var(--mainColor);
        font-size: var(--fontSize);
        line-height: calc(var(--fontSize) * 1.5);
        padding: calc((var(--fontSize) / 2) + 1px);
    }
    .centered {
        @apply --centered;
    }

生成浏览器可用语法:

    body {
        color: rgba(18, 52, 86, 0.47059);
        font-size: 16px;
        font-size: 1rem;
        line-height: 24px;
        line-height: 1.5rem;
        padding: calc(0.5rem + 1px);
    }
    .centered {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
    }

可以在 baseof.html 模板中引入样式资源：

    {{ $css := resources.Get "css/main.css" }}
    {{ $style := $css | resources.PostCSS }}

或者指定配置：

    {{ $style := resources.Get "css/main.css" | resources.PostCSS (dict "config" "customPostCSS.js" "noMap" true) }}

|      属性     |   类型   |                            说明                           |
|---------------|----------|-----------------------------------------------------------|
| config        | [string] | 指定 PostCSS 配置文件，默认 postcss.config.js             |
| noMap         | [bool]   | 默认 true 不生成调试映射文件                              |
| inlineImports | [bool]   | 默认 false，启用 @import "..." 或 @import url("...") 语句 |
| use           | [string] | 使用的 PostCSS 插件列表                                   |
| parser        | [string] | 指定 PostCSS parser                                       |
| stringifier   | [string] | 指定 PostCSS stringifier                                  |
| syntax        | [string] | 指定 postcss syntax                                       |

安装 postcss-cli 或相应插件模块，以下为全局安装，建议在工程中安装，即去掉 -g 参数：

    npm install -g postcss-cli
    npm install -g autoprefixer postcss-cssnext postcss-import postcss-apply postcss-nested postcss-mixin postcss-sass

使用 Hugo Snap package 则需要在项目中安装 PostCSS 而不是全局安装：

    npm install postcss-cli

安装后可以按以下命令格式试试样式的编译：

    postcss --use autoprefixer -c options.json -o main.css css/*.css

    postcss input.css -o output.css
    postcss src/**/*.css --base src --dir build
    cat input.css | postcss -u autoprefixer  > output.css

可以在 postcss.config.js 进行配置，通过 Node 上下文指定环境。
  
    module.exports = {
      plugins: [
        require('autoprefixer'),
        require('postcss-cssnext'),
        require('postcss-nested'),
        ...process.env.HUGO_ENVIRONMENT === 'production'
          ? [purgecss]
          : []
      ]
    }

参考 https://github.com/postcss/postcss#usage


✅ JavaScript Building 脚本打包

Hugo Pipes 使用 ESBuild 来转译 JavaScript 脚本，Tree Shaking 算法可以有效清除死代码，这是一个高效 JavaScript 转译器：

    {{ $built := resources.Get "js/index.js" | js.Build "main.js" }}

可以通过 target [string] 指定 es5, es2015, es2016, es2017, es2018, es2019, es2020, esnext 行目标输出规范，默认是 esnext。

或使用其它选项，使用 dict 关键字定义两个字典来传入参数：

    {{ $externals := slice "react" "react-dom" }}
    {{ $defines := dict "process.env.NODE_ENV" `"development"` }}

    {{ $opts := dict "targetPath" "main.js" "externals" $externals "defines" $defines }}
    {{ $built := resources.Get "scripts/main.js" | js.Build $opts }}
    <script type="text/javascript" src="{{ $built.RelPermalink }}" defer></script>


✅ Babel 脚本转译

Hugo Pipes 也可以通过 Babel 来转译脚本，任意版本的 JavaScript 可以转译为另一个版本规范。

Babel 使用了 babel cli，需要先进行安装，全局安装或作为工程依赖安装：

    npm install -g @babel/cli @babel/core
    npm install @babel/preset-env --save-dev

如果使用了 Hugo Snap 包则需要在工程中安装，而不是全局安装：

    npm install @babel/cli @babel/core --save-dev


    {{- $transpiled := resources.Get "scripts/main.js" | babel  -}}

    {{ $opts := dict "noComments" true }}
    {{- $transpiled := resources.Get "scripts/main.js" | babel $opts -}}

默认地，Babel 会使用工程中 babel.config.js 作为配置文件。



✅ Asset minification

Hugo Pipes 可以使用 **resources.Minify** 压缩 CSS, JS, JSON, HTML, SVG, XML 等资源：

    {{ $css := resources.Get "css/main.css" }}
    {{ $style := $css | resources.Minify }}

如果需要压缩最终输出到 /public 目录的 HTML 文件，可以使用 **hugo --minify** 命令。



✅ Asset bundling

Hugo Pipes 可以将任意资源打包在一起，相同的 MIME 类型文件就只可以打包为一个文件以减少浏览器请求。

    {{ $plugins := resources.Get "js/plugins.js" }}
    {{ $global := resources.Get "js/global.js" }}
    {{ $js := slice $plugins $global | resources.Concat "js/bundle.js" }}



✅ 为资源文件生成指纹 Fingerprinting

通过 **resources.Fingerprint** 方法生成 sha256 哈希摘要，可以指定其它，如 sha384, sha512, md5 等。

处理后的资源对象会在 .Data.Integrity 属性保存摘要数据，由生成摘要的函数名和摘要数据的 Base64 编码用连字符拼接组成。

    {{ $js := resources.Get "js/global.js" }}
    {{ $secureJS := $js | resources.Fingerprint "sha512" }}

    <script src="{{ $secureJS.Permalink }}" integrity="{{ $secureJS.Data.Integrity }}"></script>

SRI - Subresource Integrity 子资源完整性，用它可以确保站点在客户端运行时，加载的是未经篡改的原始资源。

大部分运营商被劫持，都是因为插入广告代码的需求。如果网站启用了 SRI，篡改后的文件就无法执行，这很可能让页面变得完全不可用。所以 SRI 给我的感觉是：宁为玉碎不为瓦全。

使用 CSP - Content Security Policy 外链白名单机制可以在现代浏览器下减小 XSS 风险。但针对 CDN 内容被篡改而导致的 XSS，CSP 并不能防范，因为网站所使用的 CDN 域名，肯定在 CSP 白名单之中。而 SRI 通过对资源进行摘要签名机制，保证外链资源的完整性。

例如，要引入以下这个资源，并启用 SRI 策略：

    https://example.com/static/js/other/zepto.js

可以使用 sha256 算法生成摘要签名，并进行 Base64 编码：

    curl https://example.com/static/js/other/zepto.js | openssl dgst -sha256 -binary | openssl enc -base64 -A

    b/TAR5GfYbbQ3gWQCA3fxESsvgU4AbP4rZ+qu1d9CuQ=

最终的代码如下：

    <script crossorigin="anonymous" integrity="sha256-b/TAR5GfYbbQ3gWQCA3fxESsvgU4AbP4rZ+qu1d9CuQ=" src="https://example.com/static/js/other/zepto.js"></script>

浏览器拿到资源内容之后，会使用 integrity 所指定的签名算法计算结果，并与 integrity 提供的摘要签名比对，如果二者不一致，就不会执行这个资源。

动态加载的资源使用 SRI 也是类似的，需要指定 crossOrigin 和 integrity 属性。例如：

    var s = document.createElement('script');
    s.crossOrigin = 'anonymous';
    s.integrity = 'sha256-b/TAR5GfYbbQ3gWQCA3fxESsvgU4AbP4rZ+qu1d9CuQ=';
    s.src = 'https://example.com/static/js/other/zepto.js';
    document.head.appendChild(s);


✅ 从字符串中创建资源

示范生成 JS 脚本：

    {{ $string := (printf "var rootURL: '%s'; var apiURL: '%s';" (absURL "/") (.Param "API_URL")) }}
    {{ $targetPath := "js/vars.js" }}
    {{ $vars := $string | resources.FromString $targetPath }}
    {{ $global := resources.Get "js/global.js" | resources.Minify }}

    <script type="text/javascript" src="{{ $vars.Permalink }}"></script>
    <script type="text/javascript" src="{{ $global.Permalink }}"></script>


✅ 从模板中获取创建资源

使用 resources.ExecuteAsTemplate 只将资源作为模板执行：

    // assets/sass/template.scss
    $backgroundColor: {{ .Param "backgroundColor" }};
    $textColor: {{ .Param "textColor" }};
    body{
        background-color:$backgroundColor;
        color: $textColor;
    }
    // [...]

    // some md file
    {{ $sassTemplate := resources.Get "sass/template.scss" }}
    {{ $style := $sassTemplate | resources.ExecuteAsTemplate "main.scss" . | resources.ToCSS }}



## Multilingual 多语言支持

Hugo 的多语言支持是深入各个方面的，包括页面的语言、数据文件的多语言、i18n 多语言字符串转换函数等。

在 config.toml 配置中，DefaultContentLanguage 设置默认的语言，在 **[languages]** 区定义多语言相应配置：

    DefaultContentLanguage = "en"
    copyright = "Everything is mine"

    defaultContentLanguageInSubdirto = true

    [languages]
      [languages.ar]
        LanguageName = "阿拉伯语"
        languagedirection = "rtl"
        title = "مدونتي"
        weight = 2
      [languages.en]
        LanguageName = "英文"
        title = "My blog"
        weight = 1
        [languages.en.params]
          linkedin = "https://linkedin.com/whoever"
      [languages.fr]
        LanguageName = "法语"
        title = "Mon blogue"
        weight = 2
        contentDir = content/french
        [languages.fr.params]
          linkedin = "https://linkedin.com/fr/whoever"
          [languages.fr.params.navigation]
            help = "Aide"

    [params]
      [params.navigation]
        help = "Help"

对应到些没有多语言配置的参数，比如 help 在定义了 fr 语版本，那么在使用 ar 或 en 时就会自动回滚到顶级的 **help = "Help"**。

    <title>{{ .Param "title" }}</title>


Hugo 会为每种语言生成一个站点保存在页面对象的 **.Sites** 属性中，或者通过全局变量 **site.Sites** 访问。

We just covered how you could find any translation of a page, but what about a random page from another language, like the french home for example? Well, we can use a typical range where on .Sites to isolate the french site like so.

    {{ $frSite := false}}
    {{ range where .Sites ".Language.Lang" "fr" }}
      {{ $frSite = . }}
    {{ end }}

    {{/* ⛑️ Safely wrap the result in a with clause and voilà: */}}
    {{ with $frSite }}
      <a href="{{ .Home.RelPermalink }}">🏠 Accueil</a>
    {{ end }}


多语言的内容组织方式有两种，文件名组织和目录结构组织：

- content/about.md
- content/contact.md
- content/about.fr.md
- content/french/about.md

在 config.yaml 配置文件中，**defaultContentLanguageInSubdirto** 可以设置默认的语言也在内容子目录中，而 **contentDir** 参数可以为具体语言指定其内容目录名称。如果，一种语言没有指定目录，那么任务内容目录下，名称不含语言后缀的内容文件都可能成为这种语言的页面看待。

可以配置禁用某些语言：

    disableLanguages = ["fr", "ja"]

通过环境变量可以覆盖禁用配置：

    HUGO_DISABLELANGUAGES="fr ja"
    HUGO_DISABLELANGUAGES=" "

翻译内容连接设置是很重要的步骤，通过在 MD 内容文件的扉页设置 translationKey，具有相同值的文件表示同一内容的不同翻译：

    # From all three pages: about.md, a-propos.fr.md, acerda.es.md
    ---
    translationKey: about
    ---

Hugo 将关连的翻译内容保存在页面对象的两个变量中：

- .Translations 包含已关连的页面；
- .AllTranslations 包含已经关连的页面，包括当前翻译的页面。

这两个集合按 language Weight 设置的值排序，值小的靠前。**.IsTranslated** 表示当前查看的页面是否有相应的翻译内容页面，如果有，就可以在以上两个页面变量集合中获取。

    {{ if .IsTranslated }}
      {{ range .Translations }}
      <link rel="alternate" hreflang="{{ .Language.Lang }}" href="{{ .Permalink }}" title="{{ .Language.LanguageName }}">
      {{ end }}
    {{ end }}

    {{ if .IsTranslated }}
      <nav class="LangNav">
      {{ range .Translations }}
        <a href="{{ .Permalink }}">{{ .Name }} - {{ .Title }}</a>
      {{ end}}
      </nav>
    {{ end }}


菜单的多语言配置：

    defaultContentLanguage = "en"

    [languages.en]
      weight = 0
      languageName = "English"

      [[languages.en.menu.main]]
        url    = "/"
        name   = "Home"
        weight = 0

    [languages.de]
      weight = 10
      languageName = "Deutsch"

      [[languages.de.menu.main]]
        url    = "/"
        name   = "Startseite"
        weight = 0

配置好菜单，通过 .Site.Menus 来获取当前语言的菜单数据，注意 **absLangURL** 可以正确处理多语言版页面的链接，不使用它，就指向默认语言设置，即 English 版本，作为默认语言，其内容文件存入在 content 目录下，而不是语言子目录，除非设置 **defaultContentLanguageInSubdirto = true**。

    <ul>
        {{- $currentPage := . -}}
        {{ range .Site.Menus.main -}}
        <li class="{{ if $currentPage.IsMenuCurrent "main" . }}active{{ end }}">
            <a href="{{ .URL | absLangURL }}">{{ .Name }}</a>
        </li>
        {{- end }}
    </ul>


设置语言后，模板文件的搜索会按语言调整，例如加载一个 AMP 页面，`index.fr.amp.html` 会优先于 `index.amp.html` 被选中，但 `index.fr.html` 会作为前两个模板的备选，只有它们缺失时有效。

[AMP - Accelerated Mobile Pages](https://www.ampproject.org/) 是 Google 联合 8 家科技公司发起的移动页面加速开源项目。它带来的结果就是，你真的可以瞬时打开一个网页了，速度快到第一次使用的人难以相信这竟然是 Web 页面。

从技术方面来说，采用 AMP 技术的网页之所以可以打开的这么快，这主要得益于它剔除了网页代码中各种可能会拖慢速度的部分，比如第三方的脚本文件、一些 HTML 标签、广告追踪器等等，所有脚本按异步执行。

在页面加速这方面，Facebook 开发了交互式媒体内容创建工具 Instant Articles，目标都是要使用户浏览 Web 的体验得到提升，使用户感觉就像在使用本地应用程序一样。


为了获得更好 SEO 效果，多语言页面的 URL 可以在页面中配置扉页的 slug 参数进行相应的修改：

    # about.fr.md
    title: À Propos
    slug: a-propos

    # acerda.es.md
    title: Acerda
    slug: acerda

这样，模板目录结构就有了一些变化，相应在页面 URL 也相应改变：

    fr/a-propos/index.html 🇫🇷 👌
    es/acerda/index.html   🇪🇸 👌

Taxonomies and Blackfriday 多语言配置：

    [Taxonomies]
      tag = "tags"

    [blackfriday]
      angledQuotes = true
      hrefTargetBlank = true

    [languages]
      [languages.en]
        title = "English"
        weight = 1
        [languages.en.blackfriday]
          angledQuotes = false
      [languages.fr]
        title = "Français"
        weight = 2
        [languages.fr.Taxonomies]
          plaque = "plaques"



数据文件的多语言组织：

    data
      ├── en
      │   └── team.yaml
      └── fr
          └── team.yaml

多语言数据的使用，先通过 index 函数获取站点配置的语言对应的数据文件，再使用：

    {{ $data := index .Site.Data .Site.Language.Lang }}
    {{ range $data.team }}
        <a href="{{ .url }}">{{ .name }}</a>
    {{ end }}

模板中不能使用 [] 操作，实现 index 函数作为替代方法。



多语言主机配置，以下示范根据主机域名使用不同的语言：

    [languages]
      [languages.en]
        baseURL = "https://example.com"
        languageName = "English"
        title = "In English"
        weight = 2
      [languages.fr]
        baseURL = "https://example.fr"
        languageName = "Français"
        title = "En Français"
        weight = 1

这两个语言配置对应生成两个发布内容目录：

    public
    ├── en
    └── fr

使用主题字符串也能实现内容的多语言转换，具体参考 i18n 函数。



## Menus 菜单组织

Hugo 中的菜单就是命名的一组件菜单项，使用菜单可以：

- 将内容页面的链接放到任意个菜单之中；
- 使用菜单项的 **parent** 嵌套，层级限制；
- 创建菜单项而不必关联具体内容；
- 区别当前的所在的菜单项及层级；
- 配合多语言，可以为不同语言的站点配置专用菜单；


列如在配置文件中定义非内容页面的菜单：

    [[menu.main]]
        name = "about hugo"
        pre = "<i class='fa fa-heart'></i>"
        weight = -110
        identifier = "about"
        url = "/about/"

    [[menu.main]]
        name = "getting started"
        pre = "<i class='fa fa-road'></i>"
        post = "<span class='alert'>New!</span>"
        weight = -100
        url = "/getting-started/"

可以从 `.Site.Menus.main` 属性获取到菜单设置的数据。


内容文件中 Front matter 区域也可以定义菜单，如下面定义的菜单项就是 about 菜单的子菜单，注意嵌套的菜单项必需是在同一个菜单下：

    ---
    menu:
      main:
        parent: "about"
        weight: 30
    ---

甚至，更简单的菜单定义，只需要指定菜单名字：

    ---
    title: about
    menu: main
    ---

菜单的嵌套是通过菜单条目的 `parent` 属性指定的，将其指定为其它菜单的标识即成为其子菜单。

菜单标识的确定：

    .Name > .LinkTitle > .Title

可以为内容目录下的一级子目录生成对应的 Section Menu，只需要在配置文件中设置：

    sectionPagesMenu = "main"

The menu name can be anything, but take a note of what it is.

This will create a menu with all the sections as menu items and all the sections' pages as "shadow-members". The _shadow_ implies that the pages isn't represented by a menu-item themselves, but this enables you to create a top-level menu like this:

    <nav class="sidebar-nav">
        {{ $currentPage := . }}
        {{ range .Site.Menus.main }}
        <a class="sidebar-nav-item{{if or ($currentPage.IsMenuCurrent "main" .) ($currentPage.HasMenuCurrent "main" .) }} active{{end}}" href="{{ .URL }}" title="{{ .Title }}">{{ .Name }}</a>
        {{ end }}
    </nav>

菜单的 URL 是基于 content 的，假如 `baseURL` 定义为 `https://example.com/mysite/`，那么菜单 URL 必需将后面的 mysite 去掉。使用绝对 URL 地址会覆盖掉 baseURL。


在模板中使用菜单，涉及的属性参考菜单对象的变量文档：

    <aside>
        <ul>
            {{ $currentPage := . }}
            {{ range .Site.Menus.main }}
                {{ if .HasChildren }}
                    <li class="{{ if $currentPage.HasMenuCurrent "main" . }}active{{ end }}">
                        <a href="#"> {{ .Pre }} <span>{{ .Name }}</span> </a>
                    </li>
                    <ul class="sub-menu">
                        {{ range .Children }}
                            <li class="{{ if $currentPage.IsMenuCurrent "main" . }}active{{ end }}">
                                <a href="{{ .URL }}">{{ .Name }}</a>
                            </li>
                        {{ end }}
                    </ul>
                {{ else }}
                    <li>
                        <a href="{{ .URL }}"> {{ .Pre }} <span>{{ .Name }}</span> </a>
                    </li>
                {{ end }}
            {{ end }}
            <li>
                <a href="#" target="_blank">Hardcoded Link 1</a>
            </li>
            <li>
                <a href="#" target="_blank">Hardcoded Link 2</a>
            </li>
        </ul>
    </aside>



## Functions 内置函数


讲几个常用的内置函数，首先是 Markdown processor 函数，必用的，通过调用 **markdownify** 将输入的 MD 字符串转化为 HTML 字符串。

用法如下：

    {{ .Title | markdownify }}
    {{ "[link](http://abc.com/)" | markdownify }}

具体参考 markdownify.md 文档和配置文档。

Blackfriday 是旧版 Hugo 默认的 Markdown 渲染引擎，现在替换为 Goldmark，但还是可以通过 defaultMarkdownHandler 设置使用 blackfriday：
     
    [markup]
      [markup.blackFriday]
        angledQuotes = false
        footnoteAnchorPrefix = ""
        footnoteReturnLinkContents = ""
        fractions = true
        hrefTargetBlank = false
        latexDashes = true
        nofollowLinks = false
        noreferrerLinks = false
        plainIDAnchors = true
        skipHTML = false
        smartDashes = true
        smartypants = true
        smartypantsQuotesNBSP = false
        taskLists = true

Goldmark 中提供了 Markdown Render Hooks 回调实现自定义的内容渲染，目前支持 image、link、heading：

    layouts
    └── _default
        └── _markup
            ├── render-image.html
            ├── render-image.rss.xml
            └── render-link.html


国际化函数 i18n 参考 multilingual.md。

Hugo 使用类似 PHP 系统中的 .po 文件来实现字符串在不同语言间的转换，字符串定义文件保存在 /i18n 目录下。

假设配置文件 /i18n/en-US.toml:

    [home]
    other = "Home"

    [wordCount]
    other = "This article has {{ .WordCount }} words."

    [readingTime]
    one = "One minute to read"
    other = "{{.Count}} minutes to read"

那么，获取 ID 为 home 的字符串这样表达：

    {{ i18n "home" }}
    {{ T "home" }}.

字符串中可以使用模板，用变量去替换生成，比如单数、复数 singular、plural 处理：

    {{ i18n "wordCount" . }}
    {{ i18n "readingTime" .ReadingTime }}

i18n 函数并不判断数值，而是通过传入参数来使用 other 关联的字符串，然后将传入参数远的 **{{.Count}}** 点位符号。

    if i18 integer argument == 1 👉 one
    else - - - - - - - - - - - - 👉 other

还好，可以使用 Nick Snyder 实现的 go-i18n，它提供了更丰富的支持，zero one two few many other 等。


config.toml 配置中，设置默认的语言：

    DefaultContentLanguage = "zh"



MD5 摘要生成函数，参考 functions\md5.md 文档：

    {{ md5 "Hello world, gophers!" }}
    <!-- returns the string "b3029f756f98f79e7f1b7f1d1f0dd53b" -->

如果用到 [Gravatar](https://en.gravatar.com/) 头像服务，那么这个函数非常有用：

    <img src="https://www.gravatar.com/avatar/{{ md5 "your@email.com" }}?s=100&d=identicon">


**htmlEscape** 和 **htmlUnescape** 进行 HTML 编码和解码:

    {{ htmlEscape "Hugo & Caddy > WordPress & Apache" }}

    "Hugo &amp; Caddy &gt; WordPress &amp; Apache"

    {{ htmlUnescape "Hugo &amp; Caddy &gt; WordPress &amp; Apache" }}

    "Hugo & Caddy > WordPress & Apache"

编码后 & 变成 `&amp;`，还有 <, >, &, ', " 等符号，解码过程中为了输出原样 HTML 可以再通过 safeHTML 函数处理。


Hugo 导出的函数有许多，可以参考文档列表，这里以内置函数来实现 Markdown 的目录生成功能。

首先，在 MD 文件中定义目录点位符：

    [TOC]

然后，在 single.html 即页面模板文件中添加目录生成代码，列表页面不用不考虑：

    {{$contents := ""}}
    {{range (split .RawContent "\n")}}
      {{if (hasPrefix . "# ")}}
        {{ $item := replace (lower .) "#" ""}}
        {{ $item = trim $item " \n\r"}}
        {{- $trimed := replace $item " " "-" -}}
        {{ $contents = printf "%s<a href=\"#%s\">%s</a><br>" $contents $trimed .}} 
        {{else if hasPrefix . "## "}}
        {{ $item := replace (lower .) "##" ""}}
        {{ $item = trim $item " \n\r"}}
        {{- $trimed := replace $item " " "-" -}}
        {{ $contents = printf "%s<a href=\"#%s\">%s</a><br>" $contents $trimed .}} 
      {{end}}
    {{end}}
    {{- replaceRE "<p>\\[TOC\\]</p>" (printf "<div class=\"contents\">%s</div>" $contents) .Content | safeHTML -}}

替换时注意内容是转换后带 HTML 标签的字符串，原始的 Markdown 内容可以通过 **.RawContent** 获取。


# Templates 模板
- [Go html/template 模板文档](https://godoc.org/html/template)
- [Go text/template 模板文档](https://godoc.org/text/template)
- [Hugo 主题](https://themes.gohugo.io/)
- [Hugo 模板的基本语法](https://gohugo.io/templates/introduction/)

整个 Hugo 静态站点系统中，按基本架构可以分成两分部来看待：

- 数据部分，如 data 目录下的数据文件，典型的是 MD 提供的 front-matter 数据和内容数据；
- 模板部分，这是 Hugo 中核心的功能，结合多语言、函数及各种对象提供的功能，将数据装入到模板，最终生成页面输出；

工程中的各 Markdown 文件就是一个数据文件，提供两部分数据，front-matter 的属性数据和其它的内容数据，和模板之间形成一个逻辑上的隔离。

    ---
    title: "相册"
    description: "这里有我觉得比较有有意思的一些照片或音乐"
    summary: "
        这里有我觉得比较有有意思的一些照片、音乐
        <!--more-->
        或者收集到的一些素材
        "
    featured_image: ''
    featured_class: 'bg-near-black'
    lastmod: 2020-08-06T20:14:08-04:00
    categories: [content management]
    keywords: ["front matter", "yaml", "toml", "json", "metadata", "archetypes"]
    audio: ["/assets/if-rym.mp3"]
    videos: ["/assets/2018-12-02-112213751.mp4"]
    menu:
      docs:
        parent: "about"
        weight: 30

    aliases: [/content/slide/]
    toc: false
    ---
    其它内容数据 ....


Hugo 直接使用了 Golang 的模板语法，表达能力很强大，配合 Hugo 预定义变量或自定义变量实现非常强大的静态站点功能，语法参考官方文档 templates introduction.md 文件。

关于 Hugo 模板的使用，参考模板介绍文档 introduction.md，其它模板类型文档如下：

    | alternatives.md   | lists.md                 | robots.md                | template-debugging.md |
    | base.md           | lookup-order.md          | rss.md                   | views.md              |
    | data-templates.md | menu-templates.md        | section-templates.md     |                       |
    | files.md          | ordering-and-grouping.md | shortcode-templates.md   |                       |
    | homepage.md       | output-formats.md        | single-page-templates.md |                       |
    | internal.md       | pagination.md            | sitemap-template.md      |                       |
    | introduction.md   | partials.md              | taxonomy-templates.md    |                       |

基本上，一套简单的模板下来，就有好几个文件：

- **layouts/_default/baseof.html** 页面骨架模板 Base Template，包含 HTML 的 Head、Body 或者页面基本布局结构； 
- **layouts/_default/list.html** 与 **_index.md** 等列表页面对应的列表模板，包括首页、分类页面、分类术语也属性列表；
- **layouts/_default/page.html** 与 page 目录对应的 session 模板；
- **layouts/_default/single.html** 与 md 内容对应的单面面模板；
- **layouts/_default/taxonomy.html** 分类列表页面模板；
- **layouts/_default/terms.html** 分类术语页面模板；

所有模板文件在加载时，都涉及到模板文件的定位这一步骤，具体可以查阅 lookup-order.md 文档，或者直接翻 docs.json 数据，找里的 Template Lookup Order。


所有页面 Page 对象都有一个 .Kind 属性变量，查找模板的规则与它密切相关。

部分页面对象变量参考如下：

|    Kind    |      说明      |                              例子                              | 默认输出格式 |
|------------|----------------|----------------------------------------------------------------|--------------|
| `home`     | 加载首页       | `/index.html`                                                  | HTML, RSS    |
| `page`     | 加载页面       | `my-post` page (`/posts/my-post/index.html`)                   | HTML         |
| `section`  | 加载分区类型   | `posts` section (`/posts/index.html`)                          | HTML, RSS    |
| `taxonomy` | 加载分类页     | `tags` taxonomy (`/tags/index.html`)                           | HTML, RSS    |
| `term`     | 加载分类术语页 | term `awesome` in `tags` taxonomy (`/tags/awesome/index.html`) | HTML, RSS    |


除了 .King 属性，还有以下相关设置：

- 内容文件扉页设置的 Layout 属性；

- 输出内容格式设置 Output，参考 output-formats.md 文档，`name` (e.g. `rss`, `amp`, `html`) and a `suffix` (e.g. `xml`, `html`). We prefer matches with both (e.g. `index.amp.html`, but look for less specific templates.

- 语言设置 Language，比如设置 language: "fr", 那么`index.fr.amp.html` 优先于 `index.amp.html` 被选中，但 `index.fr.html` 会作为前两个模板的备选，只有它们缺失时有效。

- 页面扉页数据设置 Type 类型，如 **type: "blog"**，默认值是 "page"。

- Section 类型 `section`, `taxonomy`, `term` 等类型。


以下几个模板是最基本的要求，主题目录都会设置它们：

    ├── _default
    │   ├── baseof.html
    │   ├── list.html
    │   └── single.html
    └── index.html


Hugo 使用的是 Go 语言自带的模板引擎，有 Go 语言基础理解起来就更容易。模板的标签为 **{{}}**, 其中包含的内容叫动作 Action，动作分为两种类型：

- 数据求值
- 控制结构

求值的结果会直接输出到模板中, 控制结构主要包含条件、循环、函数调用等。

列如，以下这段 Go 代码演示了其内置模板的使用：

    package main

    import (
        "text/template"
        "os"
    )

    func main() {
        v := struct{A,B string}{ "foo", "bar" }

        tmpl, _ := template.New("foo").Parse(`{{define "T"}}Hello, {{.A}} and {{.B}}!{{end}}`)
        _ = tmpl.ExecuteTemplate(os.Stdout, "T", v)

        t2, _ := template.New("foo").Parse(`{{define "T"}}Hello, {{.}}!{{end}}`)
        _ = t2.ExecuteTemplate(os.Stdout, "T", "<script>alert('you have been pwned')</script>")
    }

    // Hello, foo and bar!Hello, <script>alert('you have been pwned')</script>!

在这段代码里，模板部分用反引号包括：

    {{define "T"}}Hello, {{.}}!{{end}}

点 `.` 代表传递给模板的数据，表示模板当前的上下文对象，这个数据可以 Go 语言中的任何类型，如字符串、数组、结构体等，一些模板用法参考：

    // 注解
    {{/* comment */}}
    {{</* figure src="/media/spf13.jpg" title="Steve Francia" */>}}

    // 清除 pipeline 前后的空格
    {{- pipeline -}}

    // 清除 pipeline 前面的空格
    {{- pipeline }}

    // 清除 pipeline 后面的空格
    {{ pipeline -}}

    // 变量名赋值
    {{$var := "value"}}

    // 条件判断流程
    // 下面这些情况 pipeline 的值为空, false, 0, nil 指针或接口, 长度为 0 的数组、切片、map 和字符串，执行 T0
    {{if pipeline}} T1 {{end}} 
    {{if pipeline}} T1 {{else}} T0 {{end}}
    {{if pipeline}} T1 {{else if pipeline}} T0 {{end}}

    // 遍历 pipeline 必须是数组, 切片, map, channel，在 T1 中上下文就是当前访问到的元素
    {{range pipeline}} T1 {{end}}

    // with 设置上下文值为 pipeline
    // 如果 pipeline 的值为空，点`.`的值不受影响，输出T1，否则点`.`的值设置成 pipeline 的值, 输出T0
    {{with pipeline}} T1 {{end}}
    {{with pipeline}} T1 {{else}} T0 {{end}}

    // 使用 define 定义一个特定名称的模板
    {{define "name"}} T1 {{end}}

    // 使用 template 引入指定名称的模板, 不传入任何数据
    {{template "name"}}

    // 引入指定名称的模板, 设置模板上下文值为 pipeline 的值
    {{template "name" pipeline}}

    // block 定义特定名称的模板区块，并在当前位置引入该名称的模板
    // 将 pipline  作为上下文值传入 
    // 如果该名称的模板未实现(不存在), 则输出 T1 就相当于在基础模板页中定义了一个子模板占位符.
    {{block "name" pipeline}} T1 {{end}}

这里再解析一下 with 关键字的用法，结合 Hugo 内置的 figure 说明，它的模板定义如下：

    <figure{{ with .Get "class" }} class="{{ . }}"{{ end }}>
        {{- if .Get "link" -}}
            <a href="{{ .Get "link" }}"{{ with .Get "target" }} target="{{ . }}"{{ end }}{{ with .Get "rel" }} rel="{{ . }}"{{ end }}>
        {{- end }}
        <img src="{{ .Get "src" }}"
             {{- if or (.Get "alt") (.Get "caption") }}
             alt="{{ with .Get "alt" }}{{ . }}{{ else }}{{ .Get "caption" | markdownify| plainify }}{{ end }}"
             {{- end -}}
             {{- with .Get "width" }} width="{{ . }}"{{ end -}}
             {{- with .Get "height" }} height="{{ . }}"{{ end -}}
        /> <!-- Closing img tag -->
        {{- if .Get "link" }}</a>{{ end -}}
        {{- if or (or (.Get "title") (.Get "caption")) (.Get "attr") -}}
            <figcaption>
                {{ with (.Get "title") -}}
                    <h4>{{ . }}</h4>
                {{- end -}}
                {{- if or (.Get "caption") (.Get "attr") -}}<p>
                    {{- .Get "caption" | markdownify -}}
                    {{- with .Get "attrlink" }}
                        <a href="{{ . }}">
                    {{- end -}}
                    {{- .Get "attr" | markdownify -}}
                    {{- if .Get "attrlink" }}</a>{{ end }}</p>
                {{- end }}
            </figcaption>
        {{- end }}
    </figure>

在页面中使用时，如下，传入的参数就是命名的参数，那么在 figure 模板内部就可以使用 .Get 来获取这些参数，只需要给定参数名字：

    {{< figure src="/assets/mmqrcode1559674455213.png" title="坚果个人微信" width="50%">}}

如果，传入的是一个数组，那么可以使用数字表示要获取的元素序号：

    {{ $quality := default "100" (.Get 1) }}


模板中常用的数据类型有字典 dict 和切片 slice：

    {{ $style := resources.Get "css/main.css" | resources.PostCSS (dict "config" "customPostCSS.js" "noMap" true) }}



## Base Template 页面骨架模板

这是最基础的模板，为所有页面定义 HTML 标签基本结构，主要是 **head**、**body** 和页面设计布局定义。

通过 block 关键字设置区块定义：

    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>{{ block "title" . }}
          <!-- Blocks may include default content. -->
          {{ .Site.Title }}
        {{ end }}</title>
      </head>
      <body>
        <!-- Code that all your templates share, like a header -->
        {{ block "main" . }}
          <!-- The part of the page that begins to differ between templates -->
        {{ end }}
        {{ block "footer" . }}
          <!-- More shared code, perhaps a footer but that can be overridden if need be in  -->
        {{ end }}
      </body>
    </html>

然后，在页面模板中覆盖这些区块，比如在列表中：

    {{ define "main" }}
      <h1>Posts</h1>
      {{ range .Pages }}
        <article>
          <h2>{{ .Title }}</h2>
          {{ .Content }}
        </article>
      {{ end }}
    {{ end }}

前面的 block "title" 提供了默认的 **{{ .Site.Title }}** 模板，所以后续没有其它模板定义覆盖这个区块也没有问题，默认显示标题。


参考 Ananke 主题的 baseof.html 的定义，可以看到模板中引用了 **data** 目录下的数据，即样式定义：

    {{ $stylesheet := .Site.Data.webpack_assets.app }}
    {{ with $stylesheet.css }}
      <link href="{{ relURL (printf "%s%s" "dist/" .) }}" rel="stylesheet">
    {{ end }}

webpack_assets.json 数据文件内容：

    {
      "app": {
        "js": "js/app.3fc0f988d21662902933.js",
        "css": "css/app.4fc0b62e4b82c997bb0041217cd6b979.css"
      }
    }

Ananke 使用的 CSS 样式库是 tachyons，这个库很像我刚开始做的 Web 开发的样式组织风格，特别熟悉的味道。样式表中按不同表现的 CSS 属性进行分类提供定义，使用时在 HTML 标签上写上相应的 CSS 样式那么就有对应的效果。比如说，样式表中定义了表格的各种样式类，其中 .collapse 用来塌陷边框，在 HTML 的 table 标签上使用它就使用表格获得相应的效果。

在站点配置文件 config.toml 中

    {{ block "favicon" . }}
      {{ partialCached "site-favicon.html" . }}
    {{ end }}



模板文件内容：

    <!DOCTYPE html>
    <html lang="{{ $.Site.LanguageCode | default "en" }}">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        {{/* NOTE: the Site's title, and if there is a page title, that is set too */}}
        <title>{{ block "title" . }}{{ with .Params.Title }}{{ . }} | {{ end }}{{ .Site.Title }}{{ end }}</title>
        <meta name="viewport" content="width=device-width,minimum-scale=1">
        {{ hugo.Generator }}
        {{/* NOTE: For Production make sure you add `HUGO_ENV="production"` before your build command */}}
        {{ if eq (getenv "HUGO_ENV") "production" | or (eq .Site.Params.env "production")  }}
          <META NAME="ROBOTS" CONTENT="INDEX, FOLLOW">
        {{ else }}
          <META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
        {{ end }}

        {{ $stylesheet := .Site.Data.webpack_assets.app }}
        {{ with $stylesheet.css }}
          <link href="{{ relURL (printf "%s%s" "dist/" .) }}" rel="stylesheet">
        {{ end }}

        {{ range .Site.Params.custom_css }}
          <link rel="stylesheet" href="{{ relURL (.) }}">
        {{ end }}

        {{ block "favicon" . }}
          {{ partialCached "site-favicon.html" . }}
        {{ end }}

        {{ if .OutputFormats.Get "RSS" }}
        {{ with .OutputFormats.Get "RSS" }}
          <link href="{{ .RelPermalink }}" rel="alternate" type="application/rss+xml" title="{{ $.Site.Title }}" />
          <link href="{{ .RelPermalink }}" rel="feed" type="application/rss+xml" title="{{ $.Site.Title }}" />
          {{ end }}
        {{ end }}
        
        {{/* NOTE: These Hugo Internal Templates can be found starting at https://github.com/spf13/hugo/blob/master/tpl/tplimpl/template_embedded.go#L158 */}}
        {{- template "_internal/opengraph.html" . -}}
        {{- template "_internal/schema.html" . -}}
        {{- template "_internal/twitter_cards.html" . -}}

        {{ if eq (getenv "HUGO_ENV") "production" | or (eq .Site.Params.env "production")  }}
          {{ template "_internal/google_analytics_async.html" . }}
        {{ end }}
        {{ block "head" . }}{{ partial "head-additions.html" }}{{ end }}
      </head>

      <body class="ma0 {{ $.Param "body_classes"  | default "avenir bg-near-white"}}{{ with getenv "HUGO_ENV" }} {{ . }}{{ end }}">

        {{ block "header" . }}{{ partial "site-header.html" .}}{{ end }}
        <main class="pb7" role="main">
          {{ block "main" . }}{{ end }}
        </main>
        {{ block "footer" . }}{{ partialCached "site-footer.html" . }}{{ end }}
        {{ block "scripts" . }}{{ partialCached "site-scripts.html" . }}{{ end }}
      </body>
    </html>


## Homepage Template 主页模板

根据不同的内容，对应的不同的主页面，下面是其中的 Home 和 JSON 的主页定位方式，这里并没有列出主题目录，因为主题的 layouts 目录结构意义是一样的：

      {
        "Example": "Home page",
        "Kind": "home",
        "OutputFormat": "HTML",
        "Suffix": "html",
        "Template Lookup Order": [
          "layouts/index.html.html",
          "layouts/home.html.html",
          "layouts/list.html.html",
          "layouts/index.html",
          "layouts/home.html",
          "layouts/list.html",
          "layouts/_default/index.html.html",
          "layouts/_default/home.html.html",
          "layouts/_default/list.html.html",
          "layouts/_default/index.html",
          "layouts/_default/home.html",
          "layouts/_default/list.html"
        ]
      },
      {
        "Example": "JSON home",
        "Kind": "home",
        "OutputFormat": "JSON",
        "Suffix": "json",
        "Template Lookup Order": [
          "layouts/index.json.json",
          "layouts/home.json.json",
          "layouts/list.json.json",
          "layouts/index.json",
          "layouts/home.json",
          "layouts/list.json",
          "layouts/_default/index.json.json",
          "layouts/_default/home.json.json",
          "layouts/_default/list.json.json",
          "layouts/_default/index.json",
          "layouts/_default/home.json",
          "layouts/_default/list.json"
        ]
      },


一个主页面模板参考：

    {{ define "main" }}
        <main aria-role="main">
          <header class="homepage-header">
            <h1>{{.Title}}</h1>
            {{ with .Params.subtitle }}
            <span class="subtitle">{{.}}</span>
            {{ end }}
          </header>
          <div class="homepage-content">
            <!-- Note that the content for index.html, as a sort of list page, will pull from content/_index.md -->
            {{.Content}}
          </div>
          <div>
            {{ range first 10 .Site.RegularPages }}
                {{ .Render "summary"}}
            {{ end }}
          </div>
        </main>
    {{ end }}



## shortcode 短代码模板

短代码模板 **shortcode** 用来生成定义一段功能代码，再供页面调用。

Hugo 提供了几个内置的 shortcode，可是在国内网络环境却不太好用：

- *figure* 使用语法及对应生成

        {{< figure src="/media/spf13.jpg" title="Steve Francia" >}}

        <figure>
            <img src="/media/spf13.jpg"  />
            <figcaption>
                <h4>Steve Francia</h4>
            </figcaption>
        </figure>

- *gist* 用于生成 Git 版本仓库中的 URL

        {{< gist spf13 7896402 >}}

        https://gist.github.com/spf13/7896402

        {{< gist spf13 7896402 "img.html" >}}

        <script type="application/javascript" src="https://gist.github.com/spf13/7896402.js"></script>

- *param* 获取页面扉页参数

    假设，设置了页面扉页参数 **testparam: Hugo Rocks!** 那么就可以通过将其输出到页面：

        {{< param testparam >}}

        {{< param "my.nested.param" >}}

- *ref* 和 **relref** 根据页面文件生成相对或绝对页面引用 URL

        [Neat]({{< ref "blog/neat.md" >}})
        [Who]({{< relref "about.md#who" >}})

        <a href="/blog/neat">Neat</a>
        <a href="/about/#who:c28654c202e73453784cfd2c5ab356c0">Who</a>

- *highlight* 生成高亮代码块

- *instagram* 生成 Instagram 图片 URL，国内墙

        {{< instagram BWNjjyYFxVx hidecaption >}}

        https://www.instagram.com/p/BWNjjyYFxVx/

- *tweet* 国内墙
- *vimeo* 国内墙
- *youtube*  国内墙


这些被墙的应用可能会导致 Hugo 运行失败，因为网站访问超时导致，如 twitter.html 定义使用了 **api.twitter.com**：

    {{- $pc := .Page.Site.Config.Privacy.Twitter -}}
    {{- if not $pc.Disable -}}
    {{- if $pc.Simple -}}
    {{ template "_internal/shortcodes/twitter_simple.html" . }}
    {{- else -}}
    {{- $url := printf "https://api.twitter.com/1/statuses/oembed.json?id=%v&dnt=%t" (index .Params 0) $pc.EnableDNT -}}
    {{- $json := getJSON $url -}}
    {{ $json.html | safeHTML }}
    {{- end -}}
    {{- end -}}

可以将有问题 API 调用注解掉，Hugo Docs 项目就使用了它们：

    {{/*< instagram_simple BGvuInzyFAe hidecaption >*/}}
    {{/*< twitter_simple 1085870671291310081 >*/}}
    {{/*< youtube ZJthWmvUzzc >*/}}
    {{/*< vimeo_simple 48912912 >*/}}


另外，对于 MD 生成的标准的 HTML 标签，像表格，或列表，无法直接在 MD 设置样式：

    {{< table >}}
    | Key | Value |
    |---|---|
    | Static Site Generator | Hugo |
    | Language | Go |
    {{< /table >}}

那么可以通过定义 **shortcodes** 的方式来加外层 DIV 通过 CSS 级联样式去定义，也可以使用

    {{ $table := .Inner | markdownify | safeHTML }}
    {{ $tableBulma := $table | replaceRE "<table>" "<table class=\"table is-striped is-hoverable\">" }}
    {{ $tableBulma | safeHTML }}


用户定义短代码模板的定位按以下顺序：

- `/layouts/shortcodes/<SHORTCODE>.html`
- `/themes/<THEME>/layouts/shortcodes/<SHORTCODE>.html`


先定义一个 **shortcode** 模板 **layouts\shortcodes\page-kinds.html**：

    所有页面 Page 对象都有一个 .Kind 属性变量，如下：

    |    Kind    |          说明          |                              例子                              |
    |------------|------------------------|----------------------------------------------------------------|
    | `home`     | 正在加载的是首页       | `/index.html`                                                  |
    | `page`     | 正在加载的指定页面     | `my-post` page (`/posts/my-post/index.html`)                   |
    | `section`  | 正在加载的是分区页     | `posts` section (`/posts/index.html`)                          |
    | `taxonomy` | 正在加载的是分类页     | `tags` taxonomy (`/tags/index.html`)                           |
    | `term`     | 正在加载的是分类术语页 | term `awesome` in `tags` taxonomy (`/tags/awesome/index.html`) |

然后在 MD 内容页面中调用 shortcode 以生成对应的内容：

    {{% page-kinds %}}
        sometext
    {{% /page-kinds %}}

**shortcode** 短代码模板可使用的属性变量，以上面的调用方法作为参考，对应值如下：

|      属性      |                      说明                      |                     参考值                     |
|----------------|------------------------------------------------|------------------------------------------------|
| .Name          | Shortcode 名字                                 | page-kinds                                     |
| .Ordinal       | 基于 0 的序号，表示 shortcode 在页面内容的位置 | 1                                              |
| .Parent        | 嵌套的 parent shortcode                        | <nil>                                          |
| .Position      | 所在页面文件名和行列号，常用于调试             | "C:\quickstart\content\posts\2nd-post.md:29:5" |
| .IsNamedParams | 指示是否使用命名参数，而不是位置化参数         | false                                          |
| .Inner         | 在 shortcode 标签之间的的内容                  | sometext                                       |


Hugo 官方文档项目中提供了很好的 **shortcode** 模板学习示例，例如，最常用来展示高亮代码片段 **code** 为例，当你在查看官方文档 MD 文件时，看到以下这样的内容：

    {{< code file="layouts/_default/section.html" download="section.html" >}}
    ...
    {{< /code >}}

这就表示，MD 文件正使用 **code** 生成相应的内容，来看看它的定义 **layouts\_default\shortcodes\code.html**：

    {{ $file := .Get "file" }}
    {{ $codeLang := "" }}
    {{ $suffix := findRE "(\\.[^.]+)$" $file 1 }}
    {{ with  $suffix }}
    {{ $codeLang = (index . 0 | strings.TrimPrefix ".") }}
    {{ end }}
    {{ with .Get "codeLang" }}{{ $codeLang = . }}{{ end }}
    {{ if eq $codeLang "html"}}
    {{ $codeLang = "go-html-template" }}
    {{ end }}
    <div class="code relative" id="{{ $file | urlize}}">
        {{- with $file -}}
            <div class="filename san-serif f6 dib lh-solid pl2 pv2">{{.}}</div>
        {{- end -}}

        {{ if ne (.Get "copy") "false" }}
            <button class="needs-js copy bg-accent-color-dark f6 absolute top-0 right-0 lh-solid hover-bg-primary-color-dark bn white ph3 pv2" title="Copy this code to your clipboard." data-clipboard-action="copy" aria-label="copy button">
            </button>
            {{/* Functionality located within filesaver.js The copy here is located in the css with .copy class so it can be replaced with JS on success */}}
        {{end}}
        <div class="code-copy-content nt3" {{with .Get "download"}}id="{{.}}"{{end}}>
            {{ if  .Get "nocode" }}{{ $.Inner }}{{ else }}{{ with $codeLang }}{{- highlight $.Inner . "" | -}}{{ else }}
            <pre><code>{{- .Inner | string -}}</code></pre>{{ end }}{{ end }}
        </div>
    </div>

这里最主要的是 **highlight** 这个内置函数，对代码片断进行处理得到高亮效果。也可以直接使用 highlight 像以下这样输出带行高的代码高亮代码块：

    {{< highlight go "linenos=table,hl_lines=8 15-17,linenostart=199" >}}
    // GetTitleFunc returns a func that can be used to transform a string to
    // title case.
    //
    // The supported styles are
    //
    // - "Go" (strings.Title)
    // - "AP" (see https://www.apstylebook.com/)
    // - "Chicago" (see https://www.chicagomanualofstyle.org/home.html)
    //
    // If an unknown or empty style is provided, AP style is what you get.
    func GetTitleFunc(style string) func(s string) string {
      switch strings.ToLower(style) {
      case "go":
        return strings.Title
      case "chicago":
        return transform.NewTitleConverter(transform.ChicagoStyle)
      default:
        return transform.NewTitleConverter(transform.APStyle)
      }
    }
    {{< / highlight >}}


又以 **note** 短代码模板为例，它在文档页面中用来生成注解信息块：

    {{ $_hugo_config := `{ "version": 1 }` }}
    <aside class="admonition note">
        <div class="note-icon">
            {{partial "svg/exclamation.svg" (dict "size" "20px" ) }}
        </div>
        <!-- <h2 id="{{if .Get 0}}{{.Get 0 | urlize}}{{else}}note{{end}}">{{if .Get 0}}{{.Get 0 | markdownify}}{{else}}Note{{end}}</h2> -->
        <!-- <h3>Note</h3> -->
        <div class="admonition-content">{{- .Inner -}}</div>
    </aside>

首先，模板中对 `_hugo_config` 变量进行赋值，但没有使用它。然后生成一个 note-icon 图标，然后再将注解内容 .Inner 输出到 div.admonition-content 标签上。

其中，注释掉的部分没用起作用，但是这里调用了几个 Hugo 函数，**urlize** 用来将一个字符串进行 URL 合法化编码，参考 urlize.md 文档。

注意，{{- .Inner -}} 模板中的负号用来移除内容的前缀、后缀空格。


## Partials 模板

Partials 片断模板用来引用片断内容到页面中显示。

模板文件定位：

- `layouts/partials/*<PARTIALNAME>.html`
- `themes/<THEME>/layouts/partials/*<PARTIALNAME>.html`


Hugo 工程的所有片断模板都位 `layouts/partials` 这一个目录，可以下设多个子目录，参考如下：

    .
    └── layouts
        └── partials
            ├── footer
            │   ├── scripts.html
            │   └── site-footer.html
            ├── head
            │   ├── favicons.html
            │   ├── metadata.html
            │   ├── prerender.html
            │   └── twitter.html
            └── header
                ├── site-header.html
                └── site-nav.html

然后，在页面中引用上面这些片断模板，参考语法格式：

    {{ partial "<PATH>/<PARTIAL>.html" . }}

后面的点号表示将当前的上下文数据对象传入去。

可以将 partial 模板当作自定义函数来使用，参考 Ananke 的 func/GetFeaturedImage.html：

    {{/* 
        GetFeaturedImage

        @return Permalink to featured image, or an empty string if not found.

    */}}

    {{ $linkToCover := "" }}

    {{/* Use the value from front matter if present */}}
    {{ if .Params.featured_image }}
        {{ $linkToCover = .Params.featured_image }}

    {{/* Find the first image with 'cover' in the name in this page bundle. */}}
    {{ else }}
        {{ $img := (.Resources.ByType "image").GetMatch "*cover*" }}
        {{ with $img }}
            {{ $linkToCover = .Permalink }}
        {{ end }}
    {{ end }}

    {{/* return either a permalink, or an empty string. Note that partials can only have a single
    return statement, so this needs to be at the end of the partial (and not in the if block) */}}
    {{ return $linkToCover }}

然后，在需要使用的模板中调用：

    {{ $featured_image := partial "func/GetFeaturedImage.html" . }}




## Pagination 分页模板

分页也可以当作菜单一样使用，在列表页面、Sessions、taxonomies 中进行分页呈现条目，让静态站点看下来更像是动态的站点。

配合 SQL-like 一样的操作函数 first, last, after 可以对条目进行排序。

在 config.toml 配置分页，设置每一页显示的条目数量和分页参数在 URL 中的 path 显示配置，默认样式 **/page/1/**：

    Paginate = 10
    PaginatePath = page

分页将 homepage, sections, taxonomies 页面数据分成一小块加载显示，有两种方式使用 **.Paginator** 生成分布标签：

- 在模板中直接调用 **.Paginator.Pages**；
- 调用分页函数和排序再生成分页标签；

示例：

    {{ .Paginate.Pages }}
    {{ range (.Paginate ( first 50 .Pages.ByTitle )).Pages }}

配置文件中的 Paginate 可以在模板中覆盖，最后一个参数指定：

    {{ range (.Paginator 5).Pages }}
    {{ $paginator := .Paginate (where .Pages "Type" "posts") 5 }}

还可以使用 GroupBy 函数进行分组：

    {{ range (.Paginate (.Pages.GroupByDate "2006")).PageGroups  }}

分布模板的最简单方法就是引入内置的分页模板 **pagination.html**，它兼容 Bootstrap 样式：

    {{ $paginator := .Paginate (where .Pages "Type" "posts") }}
    {{ template "_internal/pagination.html" . }}
    {{ range $paginator.Pages }}
       {{ .Title }}
    {{ end }}

参考 .Paginator 对象提个的数据属性：

|          属性         |                             说明                             |
|-----------------------|--------------------------------------------------------------|
| PageNumber            | The current page’s number in the pager sequence              |
| URL                   | The relative URL to the current pager                        |
| Pages                 | The pages in the current pager                               |
| NumberOfElements      | The number of elements on this page                          |
| HasPrev               | Whether there are page(s) before the current                 |
| Prev                  | The pager for the previous page                              |
| HasNext               | Whether there are page(s) after the current                  |
| Next                  | The pager for the next page                                  |
| First                 | The pager for the first page                                 |
| Last                  | The pager for the last page                                  |
| Pagers                | A list of pagers that can be used to build a pagination menu |
| PageSize              | Size of each pager                                           |
| TotalPages            | The number of pages in the paginator                         |
| TotalNumberOfElements | The number of elements on all pages in this paginator        |

页面对像提供了大量变量，如 .Title, .Permalink 等，具体参考 page.md 文档。

Hugo 内置分页模板定义如下：

    {{ $pag := $.Paginator }}
    {{ if gt $pag.TotalPages 1 -}}
    <ul class="pagination">
      {{ with $pag.First -}}
      <li class="page-item">
        <a href="{{ .URL }}" class="page-link" aria-label="First"><span aria-hidden="true">&laquo;&laquo;</span></a>
      </li>
      {{ end -}}
      <li class="page-item{{ if not $pag.HasPrev }} disabled{{ end }}">
        <a {{ if $pag.HasPrev }}href="{{ $pag.Prev.URL }}"{{ end }} class="page-link" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>
      </li>
      {{- $ellipsed := false -}}
      {{- $shouldEllipse := false -}}
      {{- range $pag.Pagers -}}
      {{- $right := sub .TotalPages .PageNumber -}}
      {{- $showNumber := or (eq .TotalPages 5) (le .PageNumber 3) (eq $right 0) -}}
      {{- if $showNumber -}}
        {{- $ellipsed = false -}}
        {{- $shouldEllipse = false -}}
      {{- else -}}
        {{- $shouldEllipse = not $ellipsed -}}
        {{- $ellipsed = true -}}
      {{- end -}}
      {{- if $showNumber }}
      <li class="page-item{{ if eq . $pag }} active{{ end }}">
        <a class="page-link" href="{{ .URL }}">{{ .PageNumber }}</a>
      </li>
      {{- else if $shouldEllipse }}
      <li class="page-item disabled">
        <span aria-hidden="true">&nbsp;&hellip;&nbsp;</span>
      </li>
      {{- end -}}
      {{- end }}
      <li class="page-item{{ if not $pag.HasNext }} disabled{{ end }}">
        <a {{ if $pag.HasNext }}href="{{ $pag.Next.URL }}"{{ end }} class="page-link" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>
      </li>
      {{- with $pag.Last }}
      <li class="page-item">
        <a href="{{ .URL }}" class="page-link" aria-label="Last"><span aria-hidden="true">&raquo;&raquo;</span></a>
      </li>
      {{- end }}
    </ul>
    {{ end }}

**$.Paginator** 这种表示和 **.Paginator** 是等价的。


## Menu Templates 菜单模板

定义一个 **layouts/partials/sidebar.html**

    <!-- sidebar start -->
    <aside>
        <ul>
            {{ $currentPage := . }}
            {{ range .Site.Menus.main }}
                {{ if .HasChildren }}
                    <li class="{{ if $currentPage.HasMenuCurrent "main" . }}active{{ end }}">
                        <a href="#">
                            {{ .Pre }}
                            <span>{{ .Name }}</span>
                        </a>
                    </li>
                    <ul class="sub-menu">
                        {{ range .Children }}
                            <li class="{{ if $currentPage.IsMenuCurrent "main" . }}active{{ end }}">
                                <a href="{{ .URL }}">{{ .Name }}</a>
                            </li>
                        {{ end }}
                    </ul>
                {{ else }}
                    <li>
                        <a href="{{ .URL }}">
                            {{ .Pre }}
                            <span>{{ .Name }}</span>
                        </a>
                    </li>
                {{ end }}
            {{ end }}
            <li>
                <a href="#" target="_blank">Hardcoded Link 1</a>
            </li>
            <li>
                <a href="#" target="_blank">Hardcoded Link 2</a>
            </li>
        </ul>
    </aside>

内置函数 **absLangURL** 和 **relLangURL** 可以正确处理多语言配置的站点，此外，可以使用 absURL 和 relURL，它们会将语言前缀在 URL 上。


在配置文件中设置 Section Menu 以将分区页面做为菜单数据：

    sectionPagesMenu = "main"

然后在内页中呈现：

    <nav class="sidebar-nav">
        {{ $currentPage := . }}
        {{ range .Site.Menus.main }}
        <a class="sidebar-nav-item{{if or ($currentPage.IsMenuCurrent "main" .) ($currentPage.HasMenuCurrent "main" .) }} active{{end}}" href="{{ .URL }}" title="{{ .Title }}">{{ .Name }}</a>
        {{ end }}
    </nav>

配置站点菜单 config.toml：

    [menu]

      [[menu.main]]
        identifier = "blog"
        name = "This is the blog section"
        title = "blog section"
        url = "/blog/"
        weight = -110

或者，在页面中定义菜单数据：

    ---
    title: Menu Templates
    linktitle: Menu Templates
    menu:
      docs:
        title: "how to use menus in templates"
        parent: "templates"
        weight: 130
    ---
    ...

在菜单中使用 .Page 获取页面对象：

    <nav class="sidebar-nav">
      {{ range .Site.Menus.main }}
        <a href="{{ .URL }}" title="{{ .Title }}">
          {{- .Name -}}
          {{- with .Page -}}
            <span class="date">
            {{- dateFormat " (2006-01-02)" .Date -}}
            </span>
          {{- end -}}
        </a>
      {{ end }}
    </nav>



## Single Page Template

内容页面类型指定为 `page`，那么就会有相应的 page variables 和  site variables，在它们的模板文件中可以使用这些变量：


具体变量列表需要查阅 pages.md 和 site.md。

模板定位，参考 docs.json 给出的数据部分数据，如果页面在 posts 目录下就适用以下定位：

    {
    "Example": "Single page in \"posts\" section",
    "Kind": "page",
    "OutputFormat": "HTML",
    "Suffix": "html",
    "Template Lookup Order": [
      "layouts/posts/single.html.html",
      "layouts/posts/single.html",
      "layouts/_default/single.html.html",
      "layouts/_default/single.html"
    ]
    },

那么，在建立一个单页面模板 **layouts/posts/single.html** 就会有效：

    {{ define "main" }}
    <section id="main">
      <h1 id="title">{{ .Title }}</h1>
      <div>
            <article id="content">
               {{ .Content }}
            </article>
      </div>
    </section>
    <aside id="meta">
        <div>
        <section>
          <h4 id="date"> {{ .Date.Format "Mon Jan 2, 2006" }} </h4>
          <h5 id="wordcount"> {{ .WordCount }} Words </h5>
        </section>
        {{ with .Params.topics }}
        <ul id="topics">
          {{ range . }}
            <li><a href="{{ "topics" | absURL}}{{ . | urlize }}">{{ . }}</a> </li>
          {{ end }}
        </ul>
        {{ end }}
        {{ with .Params.tags }}
        <ul id="tags">
          {{ range . }}
            <li> <a href="{{ "tags" | absURL }}{{ . | urlize }}">{{ . }}</a> </li>
          {{ end }}
        </ul>
        {{ end }}
        </div>
        <div>
            {{ with .PrevInSection }}
              <a class="previous" href="{{.Permalink}}"> {{.Title}}</a>
            {{ end }}
            {{ with .NextInSection }}
              <a class="next" href="{{.Permalink}}"> {{.Title}}</a>
            {{ end }}
        </div>
    </aside>
    {{ end }}


## List Templates 列表模板

参考 Hugo 文档的函数列表部分实现，在函数索引列表页面中，将各个函数 MD 内容中的 linktitle 和 description 呈现在页面上，例如 **content\en\functions\md5.md** 内容中扉页数据定义如下：

    ---
    title: md5
    linktitle: md5
    description: hashes the given input and returns its MD5 checksum.
    godocref:
    date: 2017-02-01
    publishdate: 2017-02-01
    lastmod: 2017-02-01
    categories: [functions]
    menu:
      docs:
        parent: "functions"
    keywords: []
    signature: ["md5 INPUT"]
    workson: []
    hugoversion:
    relatedfuncs: [sha]
    deprecated: false
    aliases: []
    ---

Hugo 文档使用的主题是模块方式导入的，见 config.toml 配置文件：

    [module]
      [module.hugoVersion]
        min = "0.56.0"
      [[module.imports]]
        path = "github.com/gohugoio/gohugoioTheme"


在 **_vendor** 目录下的 gohugoioTheme 定义了一个 **layouts\partials\docs\functions-signature.html** 片断，它会在每个函数页面模板中呈现函数的语法内容：

    {{ if isset .Params "signature" -}}
      {{- with .Params.signature }}
        <h2 class="minor mb1 pt4 primary-color-dark">Syntax</h2>
        {{- range . }}
          <pre class="f5 mb4 ph3 pv2 bg-light-gray" style="border-left:4px solid #0594CB;">
            {{- . -}}
          </pre>
        {{- end }}
      {{- end -}}
    {{ end }}
    {{/* The inline style overrides `pre` styling defaults */}}

然后在页面 section 模板中 **layouts/_default/page.html** 使用它来呈现函数语法信息：

    <div class="prose" id="prose">
      {{- partial "docs/functions-signature.html" . -}}
      {{ .Content }}
    </div>






## 使用第三方评论服务

Hugo 作为静态生成器，没有内置评论功能，要增加评论功能需要集成第三方评论服务，比如国外最流行的 Disqus。

使用 **hyde** 主题，它内置了 disqus 评论插件，不过需要你按如下操作配置一下，否则页面下方的 disqus 插件总是显示无法连接。

这里用 disqus 主账号 login 后，add a newsite to disqus，比如加入 xxx.github.io，这样你的 disqusShortname 就为 xxx；

在 config.toml 中配置 disqusShortname:

    [params]
        disqusShortname = "xxx"

如果你要使用国内的评论服务，比如：用多说提供的 install code 替换 disqus：

    <!-- 多说评论框 start -->
    <div class="ds-thread" data-thread-key="{{ .URL }}" data-title="{{ .Title }}" data-url="{{ .Permalink }}"></div>
    <!-- 多说评论框 end -->

    <!-- 多说公共JS代码 start (一个网页只需插入一次) -->
    <script type="text/javascript">
        var duoshuoQuery = {short_name:"{{.Site.Params.duoshuoShortname}}"};

        (function() {
         var ds = document.createElement('script');
         ds.type = 'text/javascript';ds.async = true;
         ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
         ds.charset = 'UTF-8';
         (document.getElementsByTagName('head')[0]
          || document.getElementsByTagName('body')[0]).appendChild(ds);
         })();
        </script>
    <!-- 多说公共JS代码 end -->

再将 **themes/hyde/layouts/_default/single.html** 内容替换成下面的代码：

    {{ if and (isset .Site.Params "disqusShortname") (ne .Site.Params.disqusShortname "") }}
        <h2>Comments</h2>
        {{ partial "disqus" . }}
    {{ end }}

为类似下面的代码：

    {{ if and (isset .Site.Params "duoshuoShortname") (ne .Site.Params.duoshuoShortname"") }}
        <h2>Comments</h2>
        {{ partial "duoshuo" . }}
    {{ end }}

注意：一旦用上面多说代码，config.toml 中就需要配置 duoshuoShortname 了：

    [params]
        duoshuoShortname = "xxx"

