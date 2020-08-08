---
title: "III: Hugo Modules 模块"
description: "坚果的 Hugo 教程"
date: 2020-08-06T20:14:08-04:00
featured_image_: "/assets/IMG_20181101_233654_s.jpg"
thumb_image_: "/assets/micro_s.png"
summary: Hugo Modules 是基于 Go Modules 实现的，模块 Hugo 构建的核心块，一个模块可以一个 Hugo 工程，也可以是 Hugo 定义的 7 种小模块 static, content, layouts, data, assets, i18n, archetypes，可以按喜欢的方式组件使用模块，甚至从工程外部装入模块目录以构建一个大型的虚拟联合文件系统。
tags: ["hugo"]
---
# Hugo Modules 模块
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
