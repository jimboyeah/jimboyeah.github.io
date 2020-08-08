---
title: "mermaid"
description: "mermaid 图表"
summary: "    "
featured_image: ''
featured_class: 'bg-near-black'
lastmod: 2020-08-06T20:14:08-04:00
categories: [content management]
keywords: ["front matter", "yaml", "toml", "json", "metadata", "archetypes"]
audio: ["/assets/if-rym.mp3"]
videos: ["/assets/2018-12-02-112213751.mp4"]
type: slideshow
mermaid: true
toc: true
---


{{<mermaid>}}
    pie
        "Dogs" : 386
        "Cats" : 85
        "Rats" : 15
{{</mermaid>}}
 
{{<mermaid>}}
    stateDiagram
        [*] --> Still
        Still --> [*]
        Still --> Moving
        Moving --> Still
        Moving --> Crash
        Crash --> [*]
{{</mermaid>}}


{{<mermaid>}}
    gantt
    section Section
    Completed :done,    des1, 2014-01-06,2014-01-08
    Active        :active,  des2, 2014-01-07, 3d
    Parallel 1   :         des3, after des1, 1d
    Parallel 2   :         des4, after des1, 1d
    Parallel 3   :         des5, after des3, 1d
    Parallel 4   :         des6, after des4, 1d
{{</mermaid>}}
 
{{<mermaid>}}
    graph TD
    A[Hard] -->|Text| B(Round)
    B --> C{Decision}
    C -->|One| D[Result 1]
    C -->|Two| E[Result 2]
{{</mermaid>}}


{{<mermaid>}}
    graph TD
    A[Hard] -->|Text| B(Round)
    B --> C{Decision}
    C -->|One| D[Result 1]
    C -->|Two| E[Result 2]
{{</mermaid>}}


{{<mermaid>}}
journey
  title My working day
  section Go to work
    Make tea: 5: Me
    Go upstairs: 3: Me
    Do work: 1: Me, Cat
  section Go home
    Go downstairs: 5: Me
    Sit down: 3: Me
{{</mermaid>}}


{{<mermaid>}}
    classDiagram
        Class01 <|-- AveryLongClass : Cool
        <<interface>> Class01
        Class09 --> C2 : Where am i?
        Class09 --* C3
        Class09 --|> Class07
        Class07 : equals()
        Class07 : Object[] elementData
        Class01 : size()
        Class01 : int chimp
        Class01 : int gorilla
        class Class10 {
          <<service>>
          int id
          size()
        }
{{</mermaid>}}

