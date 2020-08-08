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
type: slideshow
reveal: true
toc: true
---


{{<rawhtml>}}
<div class="reveal">

    <div class="slides">


<section data-transition="zoom">
    <h2>Examples of embedded Video, Audio and Iframes</h2>
</section>

    <section>
        <h2>Iframe</h2>
        <iframe data-autoplay width="700" height="540" src="https://slides.com/news/auto-animate/embed" frameborder="0"></iframe>
    </section>

    <!-- <section data-background-iframe="https://www.youtube.com/embed/h1_nyI3z8gI" data-background-interactive>
        <h2 style="color: #fff;">Iframe Background</h2>
    </section> -->

    <section>
        <h2>Video</h2>
        <video src="https://static.slid.es/site/homepage/v1/homepage-video-editor.mp4" data-autoplay></video>
    </section>

    <section>
        <h2>if - melody from 2015/1/12</h2>
        <audio src="/assets/if-rym.mp3" data-autoplay></audio>
    </section>

    <section>
        <h2>Audio inside slide fragments</h2>
        <div class="fragment">
            Beep 1
            <audio src="/assets/if-rym.mp3" data-autoplay></audio>
        </div>
        <div class="fragment">
            Beep 2
            <audio src="/assets/if-rym.mp3" data-autoplay></audio>
        </div>
    </section>

    <section>
        <h2>Audio with controls</h2>
        <audio src="/assets/if-rym.mp3" controls></audio>
    </section>

<section data-transition="zoom-in fade-out">
    <h1>reveal.js Math Plugin</h1>
    <p>A thin wrapper for MathJax</p>
</section>

    <section>
        <h3>The Lorenz Equations</h3>

        \[\begin{aligned}
        \dot{x} &amp; = \sigma(y-x) \\
        \dot{y} &amp; = \rho x - y - xz \\
        \dot{z} &amp; = -\beta z + xy
        \end{aligned} \]
    </section>

    <section>
        <h3>The Cauchy-Schwarz Inequality</h3>

        <script type="math/tex; mode=display">
            \left( \sum_{k=1}^n a_k b_k \right)^2 \leq \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right)
        </script>
    </section>

    <section>
        <h3>A Cross Product Formula</h3>

        \[\mathbf{V}_1 \times \mathbf{V}_2 =  \begin{vmatrix}
        \mathbf{i} &amp; \mathbf{j} &amp; \mathbf{k} \\
        \frac{\partial X}{\partial u} &amp;  \frac{\partial Y}{\partial u} &amp; 0 \\
        \frac{\partial X}{\partial v} &amp;  \frac{\partial Y}{\partial v} &amp; 0
        \end{vmatrix}  \]
    </section>

    <section>
        <h3>The probability of getting \(k\) heads when flipping \(n\) coins is</h3>

        \[P(E)   = {n \choose k} p^k (1-p)^{ n-k} \]
    </section>

    <section>
        <h3>An Identity of Ramanujan</h3>

        \[ \frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{\frac25 \pi}} =
        1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}}
        {1+\frac{e^{-8\pi}} {1+\ldots} } } } \]
    </section>

    <section>
        <h3>A Rogers-Ramanujan Identity</h3>

        \[  1 +  \frac{q^2}{(1-q)}+\frac{q^6}{(1-q)(1-q^2)}+\cdots =
        \prod_{j=0}^{\infty}\frac{1}{(1-q^{5j+2})(1-q^{5j+3})}\]
    </section>

    <section>
        <h3>Maxwell&#8217;s Equations</h3>

        \[  \begin{aligned}
        \nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} &amp; = \frac{4\pi}{c}\vec{\mathbf{j}} \\   \nabla \cdot \vec{\mathbf{E}} &amp; = 4 \pi \rho \\
        \nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} &amp; = \vec{\mathbf{0}} \\
        \nabla \cdot \vec{\mathbf{B}} &amp; = 0 \end{aligned}
        \]
    </section>

    <section>
        <h3>TeX Macros</h3>

        Here is a common vector space:
        \[L^2(\R) = \set{u : \R \to \R}{\int_\R |u|^2 &lt; +\infty}\]
        used in functional analysis.
    </section>

    <section>
        <section>
            <h3>The Lorenz Equations</h3>

            <div class="fragment">
                \[\begin{aligned}
                \dot{x} &amp; = \sigma(y-x) \\
                \dot{y} &amp; = \rho x - y - xz \\
                \dot{z} &amp; = -\beta z + xy
                \end{aligned} \]
            </div>
        </section>

        <section>
            <h3>The Cauchy-Schwarz Inequality</h3>

            <div class="fragment">
                \[ \left( \sum_{k=1}^n a_k b_k \right)^2 \leq \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right) \]
            </div>
        </section>

        <section>
            <h3>A Cross Product Formula</h3>

            <div class="fragment">
                \[\mathbf{V}_1 \times \mathbf{V}_2 =  \begin{vmatrix}
                \mathbf{i} &amp; \mathbf{j} &amp; \mathbf{k} \\
                \frac{\partial X}{\partial u} &amp;  \frac{\partial Y}{\partial u} &amp; 0 \\
                \frac{\partial X}{\partial v} &amp;  \frac{\partial Y}{\partial v} &amp; 0
                \end{vmatrix}  \]
            </div>
        </section>

        <section>
            <h3>The probability of getting \(k\) heads when flipping \(n\) coins is</h3>

            <div class="fragment">
                \[P(E)   = {n \choose k} p^k (1-p)^{ n-k} \]
            </div>
        </section>

        <section>
            <h3>An Identity of Ramanujan</h3>

            <div class="fragment">
                \[ \frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{\frac25 \pi}} =
                1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}}
                {1+\frac{e^{-8\pi}} {1+\ldots} } } } \]
            </div>
        </section>

        <section>
            <h3>A Rogers-Ramanujan Identity</h3>

            <div class="fragment">
                \[  1 +  \frac{q^2}{(1-q)}+\frac{q^6}{(1-q)(1-q^2)}+\cdots =
                \prod_{j=0}^{\infty}\frac{1}{(1-q^{5j+2})(1-q^{5j+3})}\]
            </div>
        </section>

        <section>
            <h3>Maxwell&#8217;s Equations</h3>

            <div class="fragment">
                \[  \begin{aligned}
                \nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} &amp; = \frac{4\pi}{c}\vec{\mathbf{j}} \\   \nabla \cdot \vec{\mathbf{E}} &amp; = 4 \pi \rho \\
                \nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} &amp; = \vec{\mathbf{0}} \\
                \nabla \cdot \vec{\mathbf{B}} &amp; = 0 \end{aligned}
                \]
            </div>
        </section>

        <section>
            <h3>TeX Macros</h3>

            Here is a common vector space:
            \[L^2(\R) = \set{u : \R \to \R}{\int_\R |u|^2 &lt; +\infty}\]
            used in functional analysis.
        </section>
    </section>

<!-- Use external markdown resource, separate slides by three newlines; vertical slides by two newlines -->
<section data-transition="convex" data-markdown="/revealjs-v3.9.2/plugin/markdown/example.md" data-separator="^\n\n\n" data-separator-vertical="^\n\n"></section>

    <!-- Slides are separated by three dashes (quick 'n dirty regular expression) -->
    <section data-markdown data-separator="---">
        <script type="text/template">
            ## Demo 1
            Slide 1
            ---
            ## Demo 1
            Slide 2
            ---
            ## Demo 1
            Slide 3
        </script>
    </section>

<!-- Slides are separated by newline + three dashes + newline, vertical slides identical but two dashes -->
<section data-transition="convex-in concave-out" data-markdown data-separator="^\n---\n$" data-separator-vertical="^\n--\n$">
    <script type="text/template">
        ## Demo 2
        Slide 1.1

        --

        ## Demo 2
        Slide 1.2

        ---

        ## Demo 2
        Slide 2
    </script>
</section>

    <!-- No "extra" slides, since there are no separators defined (so they'll become horizontal rulers) -->
    <section data-markdown>
        <script type="text/template">
            A

            ---

            B

            ---

            C
        </script>
    </section>

<!-- Slide attributes -->
<section data-transition="concave" data-markdown>
    <script type="text/template">
        <!-- .slide: data-background="#000000" -->
        ## Slide attributes
    </script>
</section>

    <!-- Element attributes -->
    <section data-markdown>
        <script type="text/template">
            ## Element attributes
            - Item 1 <!-- .element: class="fragment" data-fragment-index="2" -->
            - Item 2 <!-- .element: class="fragment" data-fragment-index="1" -->
        </script>
    </section>

<!-- Code -->
<section data-transition="convex-in fade-out" data-markdown>
    <script type="text/template">
        ```php
        public function foo()
        {
            $foo = array(
                'bar' => 'bar'
            )
        }
        ```
    </script>
</section>

    <!-- Images -->
    <section data-markdown>
        <script type="text/template">
            ![Sample image](/assets/IMG_20181101_233654_s.jpg)
        </script>
    </section>

    </div>
</div>
{{</rawhtml>}}

