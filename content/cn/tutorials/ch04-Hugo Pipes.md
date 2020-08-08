---
title: "IV: Hugo Pipes 管道处理"
description: "坚果的 Hugo 教程"
date: 2020-08-06T20:14:08-04:00
featured_image_: "/assets/IMG_20181101_233654_s.jpg"
thumb_image_: "/assets/micro_s.png"
summary: Hugo Pipes 是一组织处理资源目录下的文件函数集，资源目录可以通过 **assetDir** 配置项指定，默认是 assets，这些资源通过管道处理生成最终需要的文件，比如 SCSS 通过管道的工具处理生成 CSS，其中一个工具就是 PostCSS。
tags: ["hugo"]
---
# Hugo Pipes 管道处理

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

{{<table>}}
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
{{<table>}}
{{</table>}}


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

{{<table>}}
|       选项      |      类型      |                               说明                               |
|-----------------|----------------|------------------------------------------------------------------|
| targetPath      | [string]       | 指定输出路径，默认只修改原 SASS/SCSS 的扩展名为 .css；           |
| outputStyle     | [string]       | 默认是 nested，其它输出风格有 expanded, compact, compressed 等； |
| precision       | [int]          | 浮点值处理精度                                                   |
| enableSourceMap | [bool]         | 是不使用 source map 调试信息映射文件                             |
| includePaths    | [string slice] | 添加 SCSS/SASS 包含目录，注意要使用工程目录中的相对路径      |
{{</table>}}


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

{{<table>}}
|      属性     |   类型   |                            说明                           |
|---------------|----------|-----------------------------------------------------------|
| config        | [string] | 指定 PostCSS 配置文件，默认 postcss.config.js             |
| noMap         | [bool]   | 默认 true 不生成调试映射文件                              |
| inlineImports | [bool]   | 默认 false，启用 @import "..." 或 @import url("...") 语句 |
| use           | [string] | 使用的 PostCSS 插件列表                                   |
| parser        | [string] | 指定 PostCSS parser                                       |
| stringifier   | [string] | 指定 PostCSS stringifier                                  |
| syntax        | [string] | 指定 postcss syntax                                       |
{{</table>}}

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


