---
title: "VIII: Functions 内置函数"
description: "坚果的 Hugo 教程"
date: 2020-08-06T12:09:08-04:00
featured_image: "/assets/IMG_20181101_233654_s.jpg"
tags: ["hugo"]
disable_share: false
summary: "Hugo 导出的函数有许多，这里提供一个以内置函数实现的 Markdown 目录生成功能，使用目录生成时，只需要在 MD 文件中定义目录点位符 [TOC] 即可在对应位置生成目录。<!--more-->"
---


Hugo 提供的对象及变量就是 Go 语言实现的各种对象对外公开的函数方法或属性，了解这些对象是用好模板的基础。


# Functions 内置函数


讲几个常用的内置函数，首先是 Markdown processor 函数，必用的，通过调用 **markdownify** 将输入的 MD 字符串转化为 HTML 字符串。

用法如下：

    {{ .Title | markdownify }}
    {{ "[link](http://abc.com/)" | markdownify }}

具体参考 markdownify.md 文档和配置文档。

Blackfriday 是旧版 Hugo 默认的 Markdown 渲染引擎，现在替换为 Goldmark，但还是可以通过 defaultMarkdownHandler 设置使用 blackfriday：

{{<code file="demo.toml">}}
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
{{</code>}}     

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

{{<code file="demo.html">}}    {{$contents := ""}}
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
{{</code>}}     

替换时注意内容是转换后带 HTML 标签的字符串，原始的 Markdown 内容可以通过 **.RawContent** 获取。
