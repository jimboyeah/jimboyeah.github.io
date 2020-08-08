---
title: "V: Templates 其它模板"
description: "坚果的 Hugo 教程"
date: 2020-08-06T20:14:08-04:00
featured_image_: "/assets/IMG_20190117_123248_s1.jpg"
summary: Hugo 直接使用了 Golang 的模板语法，表达能力很强大，配合 Hugo 预定义变量或自定义变量实现非常强大的静态站点功能。Mardown 文件提共内容数据，而模板则是数据的消化系统。这部分介绍其它各种模板的使用。
tags: ["hugo", "menu"]
---

# 目录

[TOC]


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

        {{&lt figure src="/media/spf13.jpg" title="Steve Francia" >}}

        <figure>
            <img src="/media/spf13.jpg"  />
            <figcaption>
                <h4>Steve Francia</h4>
            </figcaption>
        </figure>

- *gist* 用于生成 Git 版本仓库中的 URL

        {{&lt gist spf13 7896402 >}}

        https://gist.github.com/spf13/7896402

        {{&lt gist spf13 7896402 "img.html" >}}

        <script type="application/javascript" src="https://gist.github.com/spf13/7896402.js"></script>

- *param* 获取页面扉页参数

    假设，设置了页面扉页参数 **testparam: Hugo Rocks!** 那么就可以通过将其输出到页面：

        {{&lt param testparam >}}

        {{&lt param "my.nested.param" >}}

- *ref* 和 **relref** 根据页面文件生成相对或绝对页面引用 URL

        [Neat]({{&lt; ref "blog/neat.md" >}})
        [Who]({{&lt; relref "about.md#who" >}})

        <a href="/blog/neat">Neat</a>
        <a href="/about/#who:c28654c202e73453784cfd2c5ab356c0">Who</a>

- *highlight* 生成高亮代码块

- *instagram* 生成 Instagram 图片 URL，国内墙

        {{&lt instagram BWNjjyYFxVx hidecaption >}}

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

    {{&lt table >}}
    | Key | Value |
    |---|---|
    | Static Site Generator | Hugo |
    | Language | Go |
    {{&lt /table >}}

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

    {{&#25 page-kinds %}}
        sometext
    {{&#25 /page-kinds %}}

**shortcode** 短代码模板可使用的属性变量，以上面的调用方法作为参考，对应值如下：

{{<table>}}
|      属性      |                      说明                      |                     参考值                     |
|----------------|------------------------------------------------|------------------------------------------------|
| .Name          | Shortcode 名字                                 | page-kinds                                     |
| .Ordinal       | 基于 0 的序号，表示 shortcode 在页面内容的位置 | 1                                              |
| .Parent        | 嵌套的 parent shortcode                        | <nil>                                          |
| .Position      | 所在页面文件名和行列号，常用于调试             | "C:\quickstart\content\posts\2nd-post.md:29:5" |
| .IsNamedParams | 指示是否使用命名参数，而不是位置化参数         | false                                          |
| .Inner         | 在 shortcode 标签之间的的内容                  | sometext                                       |
{{</table>}}


Hugo 官方文档项目中提供了很好的 **shortcode** 模板学习示例，例如，最常用来展示高亮代码片段 **code** 为例，当你在查看官方文档 MD 文件时，看到以下这样的内容：

    {{&lt code file="layouts/_default/section.html" download="section.html" >}}
    ...
    {{&lt /code >}}

这就表示，MD 文件正使用 **code** 生成相应的内容，来看看它的定义 **layouts\_default\shortcodes\code.html**：

{{<code file="demo.html">}}

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
{{</code>}}

这里最主要的是 **highlight** 这个内置函数，对代码片断进行处理得到高亮效果。也可以直接使用 highlight 像以下这样输出带行高的代码高亮代码块：

 {{<code file="demo.html">}}
    {{&lt highlight go "linenos=table,hl_lines=8 15-17,linenostart=199" >}}
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
    {{&lt / highlight >}}
{{</code>}}


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

{{<code file="demo.html">}}

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
{{</code>}}

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

{{<table>}}
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
{{</table>}}

页面对像提供了大量变量，如 .Title, .Permalink 等，具体参考 page.md 文档。

Hugo 内置分页模板定义如下：

{{<code file="demo.html">}}

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
{{</code>}}


## Menu Templates 菜单模板

定义一个 **layouts/partials/sidebar.html**

{{<code file="demo.html">}}

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
{{</code>}}

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

{{<code file="demo.html">}}

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
{{</code>}}


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


