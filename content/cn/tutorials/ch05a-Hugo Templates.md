---
title: "V: Templates 模板机制"
description: "坚果的 Hugo 教程"
date: 2020-08-06T20:14:08-04:00
featured_image_: "/assets/IMG_20190117_123248_s1.jpg"
summary: Hugo 直接使用了 Golang 的模板语法，表达能力很强大，配合 Hugo 预定义变量或自定义变量实现非常强大的静态站点功能。Mardown 文件提共内容数据，而模板则是数据的消化系统。关于模板的第一部分内容，主要讲解模板的加载流程。
tags: ["hugo", "menu"]
---

目录：

[TOC]

## 模板加载流程

这里对 Hugo 静态站点框架作一个简要的流程分析，主要是分析数据流向。

首先，Hugo 是基于 Go 语言实现的静态站点生成器，并且利用了 GO html/template 模板、Go Modules 等多项技术。

静态站点的数据内容主要来源有四个：

- 一是 Markdown 文件，每个 MD 文件顶部可以设置参数，这个区域叫做扉页 Front Matter，文件后面的是内容；
- 二是 config.toml 站点的配置文件；
- 三是 data 目录下的数据文件
- 最后是通过 Ajax 技术，还可以在页面中请求外部服务器的数据服务，比如表单数据、评论数据等等。

这些就是 Hugo 静态站点工程中的主要数据来源。

有了数据，接下来就是将数据套用到模板中，而模板与页面类型密切相关。Hugo 的页面是一个大概念，比如浏览看到的页面就是一般意义 Page 概念，Hugo 还细分成 Home Page 页面、RSS 页面、单页 Single、列表页 List、分类页 Taxonomy、站点地图页 Sitemap 等。

工程目录下的 **content** 就是存放各种页面内容文件的地方，参考下面的内容目录结构与 URL 对应关系参考：

    .
    └─ content
       ├─ index.md       <-- https://example.com/
       ├─ about
       |  └─ index.md    <-- https://example.com/about/
       ├─ posts
       |  ├─ _index.md   <-- https://example.com/posts/
       |  ├─ index.md    <-- https://example.com/posts/
       |  ├─ firstpost.md<-- https://example.com/posts/firstpost/
       |  ├─ happy
       |  |  └─ ness.md  <-- https://example.com/posts/happy/ness/
       |  └─ secondpost.md <-- https://example.com/posts/secondpost/
       └─ quote
          ├─ first.md    <-- https://example.com/quote/first/
          └─ second.md   <-- https://example.com/quote/second/

以上的文件中，**index.md** 或 **_index.md** 这样的文件称为列表内容页面，或称为主页，顶级的 **index.md** 称为站点主页。一级子目录 about、posts、quote 称为分区 Sessions，每个区对应一个列表页面和任意的内容页，它们和 **layouts** 目录下的模板匹配关系如下：

    ├── _default
    │   ├── baseof.html
    │   ├── list.html
    │   └── single.html
    └── index.html

这些不同的页面类型会匹配到不同的模板文件，而模板文件根据将获取到的数据进行渲染成页面，经过 Hugo 转译处理后生成 **public** 目录下的静态站点文件。


以请求首页为例，先看看模板匹配及加载流程图：

![hugo-templates.jpg](/assets/hugo-templates.jpg)

<!-- 
{{<rawhtml>}}
  <div class="mermaid">
graph TD
    B(装入 baseof.html 模板)
    B --> C{匹配其它模板}
    C -->| 0 | D[ /index.html ]
    C -->| 1 | E[ /list.html ]
    C -->| 2 | F[ /_default/index.html]
    C -->| 2 | G[ /_default/list.html]
  D --> Z
  E --> Z
  F --> Z
  Z[将上下文数据装入模板生成页面文件]
  </div>
{{</rawhtml>}} -->


Hugo 提供了丰富的模板匹配候选项，主要提供的匹配规则有三点：

- 目录结构匹配，即 Sections 匹配，比如，内容子目录 posts 下的页面会匹配 **layouts** 下同名子目录的模板；
- 默认目录匹配，模板目录下的 **_default** 子目录是存放最终候选模板文件的目录；
- 页面类型匹配，主页、列表页、分类页等都会匹配列表模板 **list.html**，主页还会优先匹配 **index.html** 模板；

并且，工程根目录下和主题目录下的 **layouts** 具有同样组织结构，Hugo 首先会在项目根目录下的 **layouts** 中搜索要匹配的模板，如果在 **layouts** 顶层找不到，就进入 **_default** 子目录下找，如果还没找不到，就到主题目录下去找继续。

这里提一下 **baseof.html** 这个模板，它是骨架模板，在装入这个骨架模板之后，才会继装入其它模板。在 **baseof.html** 中可以定义 block 内容块，只提供简单的默认内容，然后由其它模板用 define 关键字去实现这个内容块的具体内容：

{{<code file="demo.html">}} <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>{{ .Site.Title }}</title>
        {{ block "favicon" . }}
        {{ block "head" . }}{{ partial "head-additions.html" }}{{ end }}
      </head>
      <body>
        {{ block "header" . }}{{ partial "site-header.html" .}}{{ end }}
        {{ block "main" . }}{{ end }}
        {{ printf "%#v" . }}
        {{ block "footer" . }}{{ partialCached "site-footer.html" . }}{{ end }}
        {{ block "scripts" . }}{{ partialCached "site-scripts.html" . }}{{ end }}
      </body>
    </html>
{{</code>}}

在模板中，可以使用 **{{ printf "%#v" . }}** 打印当前上下文对象的详细信息，是一个调试方法。

另外，404 处理中，一般 Web 服务器都会有一个默认 404 页面地址，通常配置为站点根目录下的 404.html 文件。如 GitHub Pages 的 404 页面是自动处理的，Apache 一般在 .htaccess 配置为 /404.html，还有 Nginx 也是。


注意，在模板匹配规则中，需要搞清楚 TYPE、VIEW 概念，它们是模板匹配规则的基本数据：

- 页面类型 TYPE 决定了从什么目录中搜索模板文件；
- 视图类型 VIEW 决定了加载什么名字的模板；

比如列表、主页、分类页面加载的是 list.html、index.html、taxonomy.html、terms.html 这种模板文件。而对于一般的 Page 页面类型，加载的是 single.html 这样的模板文件。 

如下目录结构：

    content
    └── blog        <-- Section, because first-level dir under content/
        ├── posts
        │   ├── mypost.md       <--- Page
        │   └── kittens         <-- Section, because contains _index.md
        │       └── _index.md
        └── tech                <-- Section, because contains _index.md
            └── _index.md

所有页面 Page 对象都有一个 .Kind 属性变量，它代表的是页面类型，即模板匹配中需要用到的 TYPE 类型，如下：

{{<table>}}
|    Kind    |        说明        |                          生成对应页面                          |
|------------|--------------------|----------------------------------------------------------------|
| `home`     | 加载首页       | `/index.html`                                                  |
| `page`     | 加载定页面     | `my-post` page (`/posts/my-post/index.html`)                   |
| `section`  | 加载分区页     | `posts` section (`/posts/index.html`)                          |
| `taxonomy` | 加载分类页     | `tags` taxonomy (`/tags/index.html`)                           |
| `term`     | 加载分类术语页 | term `awesome` in `tags` taxonomy (`/tags/awesome/index.html`) |
{{</table>}}

TYPE 指页面的类型，首先，明确 **content** 一级子目录的类型就是 section，其次，包含 **_index.md** 的目录也是 section 类型。

TYPE 还可以在内容文件中指定：

    ---
    title: Front Matter
    type: page
    ---

不在内容文件中指定页面类型的情况下，会默认自动从目录继承页面类型属性。


前面简单理了一遍 baseof.html 模板的搜索定位，其实，根据不同的页面类型，骨架模板还可以有更多的匹配选择：

1. `/layouts/section/<TYPE>-baseof.html`
2. `/themes/<THEME>/layouts/section/<TYPE>-baseof.html`
3. `/layouts/<TYPE>/baseof.html`
4. `/themes/<THEME>/layouts/<TYPE>/baseof.html`
5. `/layouts/section/baseof.html`
6. `/themes/<THEME>/layouts/section/baseof.html`
7. `/layouts/_default/<TYPE>-baseof.html`
8. `/themes/<THEME>/layouts/_default/<TYPE>-baseof.html`
9. `/layouts/_default/baseof.html`
10. `/themes/<THEME>/layouts/_default/baseof.html`

类型占位符号 TYPE 根据页面指定的类型改变，默认行为类型是 session，假设有个 section 名称即目录名是 posts，Hugo 会按以下顺序搜索其骨架模板：

1. `/layouts/section/posts-baseof.html`
2. `/themes/mytheme/layouts/section/posts-baseof.html`
3. `/layouts/posts/baseof.html`
4. `/themes/mytheme/layouts/posts/baseof.html`
5. `/layouts/section/baseof.html`
6. `/themes/mytheme/layouts/section/baseof.html`
7. `/layouts/_default/posts-baseof.html`
8. `/themes/mytheme/layouts/_default/posts-baseof.html`
9. `/layouts/_default/baseof.html`
10. `/themes/mytheme/layouts/_default/baseof.html`

对于内容页面，适用以下模板定位规则：

1. `/layouts/<TYPE>/<VIEW>.html`
2. `/layouts/_default/<VIEW>.html`
3. `/themes/<THEME>/layouts/<TYPE>/<VIEW>.html`
4. `/themes/<THEME>/layouts/_default/<VIEW>.html`

即，加载名称为 posts 的 section 目录下的内容页面时，会搜索以下这样的模板文件，它们分别对应列表模板和单页面模板：

- **/layout/posts/posts.html**
- **/layout/posts/single.html** 

而，默认的类型是 page，所以加载默认类型页面时，会搜索以下这些模板文件，包括加载主页：

- **/layout/page/page.html**
- **/layout/page/single.html** 

这些规则可以参考文档中的 docs.json 数据文件，里面有完整的参考数据。



总结一下，学习使用模板一是为了解内容文件夹下的内容如何通过模板文件呈现为页面。另一方面是解决，如何为指定的一个内容文件定义模板。比如，有一个内容文件 **/about/slideshow.md** 想要做成幻灯片展示页面，与其它页面区别开来。

如果是 **/about/index.md** 那么，可以直接定义 **/_default/about.html** 实现，从另一个角度看，可以将 slideshow.md 改成其它目录下的 **index.md** 就可以实现要求的模板指定要求。

又或者，在文件的 Front Matter 区指定 type 类型，再接着建立 **layouts** 下同名的子目录，并建立一个 **single.html** 模板，这样做意味可以完全构造整个 HTML 页面。


## Templates 模板语法
- [Go html/template 模板文档](https://godoc.org/html/template)
- [Go text/template 模板文档](https://godoc.org/text/template)
- [Hugo 主题](https://themes.gohugo.io/)
- [Hugo 模板的基本语法](https://gohugo.io/templates/introduction/)

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

{{< table >}}
|    Kind    |      说明      |                              例子                              | 默认输出格式 |
|------------|----------------|----------------------------------------------------------------|--------------|
| `home`     | 加载首页       | `/index.html`                                                  | HTML, RSS    |
| `page`     | 加载页面       | `my-post` page (`/posts/my-post/index.html`)                   | HTML         |
| `section`  | 加载分区类型   | `posts` section (`/posts/index.html`)                          | HTML, RSS    |
| `taxonomy` | 加载分类页     | `tags` taxonomy (`/tags/index.html`)                           | HTML, RSS    |
| `term`     | 加载分类术语页 | term `awesome` in `tags` taxonomy (`/tags/awesome/index.html`) | HTML, RSS    |
{{< /table >}}


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

{{<code file="demo.go">}}
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
{{</code>}}

在这段代码里，模板部分用反引号包括：

    {{define "T"}}Hello, {{.}}!{{end}}

点 `.` 代表传递给模板的数据，表示模板当前的上下文对象，这个数据可以 Go 语言中的任何类型，如字符串、数组、结构体等，一些模板用法参考：

{{<code file="demo.html">}}
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
{{</code>}}

这里再解析一下 with 关键字的用法，结合 Hugo 内置的 figure 说明，它的模板定义如下：

{{<code file="demo.html">}}

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
{{</code>}}

在页面中使用时，如下，传入的参数就是命名的参数，那么在 figure 模板内部就可以使用 .Get 来获取这些参数，只需要给定参数名字：

    {{&lt figure src="/assets/demo.png" title="demo" width="50%">}}

如果，传入的是一个数组，那么可以使用数字表示要获取的元素序号：

    {{ $quality := default "100" (.Get 1) }}


模板中常用的数据类型有字典 dict 和切片 slice：

    {{ $style := resources.Get "css/main.css" | resources.PostCSS (dict "config" "customPostCSS.js" "noMap" true) }}



## Base Template 页面骨架模板

这是最基础的模板，为所有页面定义 HTML 标签基本结构，主要是 **head**、**body** 和页面设计布局定义。

通过 block 关键字设置区块定义：

 {{<code file="demo.html">}}
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
{{</code>}}

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

{{<code file="demo.html">}}

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
{{</code>}}

