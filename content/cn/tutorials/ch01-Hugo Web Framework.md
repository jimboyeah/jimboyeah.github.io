---
title: "I: Hugo Web Framework"
description: "坚果的 Hugo 教程"
date: 2020-08-06T20:14:08-04:00
featured_image: "./assets/IMG_20181101_233654_s.jpg"
summary: Hugo Framework 是一个静态网站构建工具，以 Go 语言所写，号称**世界上最快的静态网站引擎**。提供文件头，即扉页 front matter 和模板的等基本功能，兼备可伸缩性和可管理性。Hugo 不仅是给开发者设计的，也同样适用于内容管理员和写作人员。
tags: ["hugo"]
---



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
