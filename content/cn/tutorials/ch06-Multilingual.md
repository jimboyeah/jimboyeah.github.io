---
title: "VI: Multilingual 多语言支持"
description: "坚果的 Hugo 教程"
date: 2020-08-06T20:14:08-04:00
featured_image: "/assets/IMG_20181101_233654_s.jpg"
summary: Hugo 的多语言支持是深入各个方面的，包括页面的语言、数据文件的多语言、i18n 多语言字符串转换函数等。多语言的内容组织方式有两种，文件名组织和目录结构组织。多语言可以与菜单很好地结合，让静态站点也可以拥有动态站在一样的效果。
tags: ["hugo"]
disable_share: false
---

## Multilingual 多语言支持

Hugo 的多语言支持是深入各个方面的，包括页面的语言、数据文件的多语言、i18n 多语言字符串转换函数等。

在 config.toml 配置中，DefaultContentLanguage 设置默认的语言，在 **[languages]** 区定义多语言相应配置：

{{< code file="config.toml">}}
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
{{< /code >}}
对应到些没有多语言配置的参数，比如 help 在定义了 fr 语版本，那么在使用 ar 或 en 时就会自动回滚到顶级的 **help = "Help"**。

    <title>{{ .Param "title" }}</title>

多语言的内容组织方式有两种，文件名组织和目录结构组织：

- content/about.md
- content/contact.md
- content/about.fr.md ✅
- content/french/about.md ✅
- content/french/a-propos.md  🚫

在 config.yaml 配置文件中，**defaultContentLanguageInSubdirto** 可以设置默认的语言也在内容子目录中，而 **contentDir** 参数可以为具体语言指定其内容目录名称。

可以配置禁用某些语言：

    disableLanguages = ["fr", "ja"]

通过环境变量可以覆盖禁用配置：

    HUGO_DISABLELANGUAGES="fr ja"
    HUGO_DISABLELANGUAGES=" "

翻译内容连接设置是很重要的步骤，通过在 MD 内容文件的扉页设置 translationKey，可以

    # From all three pages: about.md, a-propos.fr.md, acerda.es.md
    ---
    translationKey: about
    ---


Hugo 将链接的翻译内容保存在页面对象的两个变量中：

- .Translations 包含已链接的页面；
- .AllTranslations 包含已经链接的页面，包括当前翻译的页面。

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
