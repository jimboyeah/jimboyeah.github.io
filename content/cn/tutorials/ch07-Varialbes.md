---
title: "VII: Variables 对象变量"
description: "坚果的 Hugo 教程"
date: 2020-08-06T20:14:08-04:00
featured_image_: "/assets/IMG_20181101_233654_s.jpg"
tags: ["hugo", "menu"]
disable_share: false
summary: "Hugo 的多语言支持是深入各个方面的，包括页面的语言、数据文件的多语言、i18n 多语言字符串转换函数等。多语言的内容组织方式有两种，文件名组织和目录结构组织。多语言可以与菜单很好地结合，让静态站点也可以拥有动态站在一样的效果。"
---
Hugo 提供的对象及变量就是 Go 语言实现的各种对象对外公开的函数方法或属性，了解这些对象是用好模板的基础。

<!--more-->

# Variables 对象变量

File 文件系统对象：


{{<table>}}
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
{{</table>}}

Hugo 可以使用 Git 一起工作，要求如下：

1. 站点项目是一个 Git 仓库目录。
2. 能在 `PATH` 目录能找到并可以执行 Git 命令。
3. 启用 `.GitInfo` 需要登入 Hugo 命令行参数 `--enableGitInfo` 或配置文件设置 `enableGitInfo = true`。

GitInfo 对象：

{{<table>}}
|        属性       |                                说明                                |
|-------------------|--------------------------------------------------------------------|
|.AbbreviatedHash | 简短的 git commit hash，如 `866cbcc`
|.AuthorName | 作者，对应 `.mailmap`
|.AuthorEmail | 作者邮箱，对应 `.mailmap`
|.AuthorDate | 发布日期
|.Hash | 完整 commit hash，如 `866cbccdab588b9908887ffd3b4f2667e94090c3`
|.Subject | Git 提交的说明信息，如 `tpl: Add custom index function`


Hugo 对象，Page.Hugo 属性已经试用，直接使用全局变量，如 `hugo.Generator`。

{{<table>}}
|        属性       |                                说明                                |
|-------------------|--------------------------------------------------------------------|
| .Hugo.Generator   | 生成 HTML 标签，如 `<meta name="generator" content="Hugo 0.18" />` |
| .Hugo.Version     | Hugo 版本，如 `0.13-DEV`                                           |
| .Hugo.Environment | 当前的运行环境，即 `--environment` 命令行参数                      |
| .Hugo.CommitHash  | 当前 Hugo 版本的 git commit hash 值                                |
| .Hugo.BuildDate   | Hugo 编译日期，RFC 3339 格式，如 `2002-10-02T10:00:00-05:00`       |
{{</table>}}


菜单模板中使用的菜单对象：

{{<table>}}
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
{{</table>}}


菜单条目还有以下函数方法：

|       方法      | 返回值  |                                 说明                                 |
|-----------------|---------|----------------------------------------------------------------------|
| .HasChildren    | boolean | 返回 `true` 如果 `.Children` 非 nil                                  |
| .KeyName        | string  | 返回 `.Identifier` 如果存在键值，否则返回 `.Name`                    |
| .IsEqual        | boolean | 返回 `true` 如果同一个菜单条目                                       |
| .IsSameResource | boolean | 返回 `true` 如果两个菜单条目有相同 `.URL`                            |
| .Title          | string  | 链接标签的标题，菜单配置的 `title` 属性或者内容文件页面 `.LinkTitle` |
{{</table>}}

另外，页面对应提供 IsMenuCurrent 和 HasMenuCurrent 方法来判断页面和菜单的关系：

    .IsMenuCurrent(menu string, menuEntry *MenuEntry ) boolean
    .HasMenuCurrent(menu string, menuEntry *MenuEntry) boolean


页面对象 Page 属性：

{{<table>}}
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
{{</table>}}


.Kind 页面类型有 `page`, `home`, `section`, `taxonomy`, `taxonomyTerm`，还有 `RSS`, `sitemap`, `robotsTXT`, `404` 等，但是它们只有渲染对应类型时有效，在 `Pages` 集合中无效。

在列表页面模板中，可以使用 .Pages 集合的 .Next 和 .Prev 获取前、后页面信息，具体参考 lists.md。


**shortcode** 短代码模板对象中可使用的属性变量，以上面的调用方法作为参考，对应值如下：
{{<table>}}

|      属性      |                      说明                      |               参考值                |
|----------------|------------------------------------------------|-------------------------------------|
| .Name          | Shortcode 名字                                 | page-kinds                          |
| .Ordinal       | 基于 0 的序号，表示 shortcode 在页面内容的位置 | 1                                   |
| .Parent        | 嵌套的 parent shortcode                        | nil                                 |
| .Position      | 所在页面文件名和行列号，常用于调试             | "C:\content\posts\2nd-post.md:29:5" |
| .IsNamedParams | 指示是否使用命名参数，而不是位置化参数         | false                               |
| .Inner         | 在 shortcode 标签之间的的内容                  | sometext                            |
{{</table>}}


站点对象是全局对象，如页面中的 `.Site.RegularPages` 方法可以按全局方式调用 `site.RegularPages`。

以下是站点对象的常用变量：

{{<table>}}
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
{{</table>}}

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

{{<table>}}
|         属性        |     说明     |
|---------------------|--------------|
| .Sitemap.ChangeFreq | 页面更改频率 |
| .Sitemap.Priority   | 页面的优先级 |
| .Sitemap.Filename   | 站点地图文件 |
{{</table>}}


分类页面模板中使用的也是一个页面对象 Page，但是有额外的数据：

{{<table>}}
|           属性           |                            说明                           |
|--------------------------|-----------------------------------------------------------|
| .Data.Singular           | : The singular name of the taxonomy (e.g., `tags => tag`) |
| .Data.Plural             | : The plural name of the taxonomy (e.g., `tags => tags`)  |
| .Data.Pages              | : The list of pages in the taxonomy                       |
| .Data.Terms              | : The taxonomy itself                                     |
| .Data.Terms.Alphabetical | : The taxonomy terms alphabetized                         |
| .Data.Terms.ByCount      | : The Terms ordered by popularity                         |
{{</table>}}

注意 `Alphabetical` 和 `ByCount` 的数据可以进行反转排序：

- `.Data.Terms.Alphabetical.Reverse`
- `.Data.Terms.ByCount.Reverse`

在分类模板外，要使用分类就通过 `.Site.Taxonomies` 实现，它包含站点定义的所有分类列表 TaxonomyList，元素是个 map 对象，如：

    {"tags" -> ["tag1", "tag2", "tag3"]}

每个值都是 Taxonomy 对象变量，包含分类列表，而非字符串，列表每个元素对应内容页面。

默认的有目录 **categories** 和标签 **tags** 两个分类，看示范如果列表站点的分类页面：

{{<code>}}
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
{{</code>}}


