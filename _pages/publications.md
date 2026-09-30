---
layout: page
permalink: /publications/
title: publications
description: publications by categories in reversed chronological order.
nav: false
nav_order: 2
---

<!-- _pages/publications.md -->
<div class="publications">

<div class="publication-year-filters"></div>

{% bibliography --query @*[selected=true]* %}

</div>
