---
title: "IX: Menus 菜单组织"
description: "坚果的 Hugo 教程"
date: 2020-08-06T12:09:08-04:00
featured_image_: "/assets/IMG_20181101_233654_s.jpg"
tags: ["hugo", "menu"]
disable_share: false
summary: "Hugo 的菜单系统和多语言结合得非常紧密，在定义多语言时，也可以相应定义相应的菜单。也就是说，一个 Hugo 项目可以有多个不同语言的，每种语言都可以使用专用菜单。<!--more-->"
---

# Menus 菜单组织

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

{{<code file="partials/navigation.html">}}
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
{{</code>}}

