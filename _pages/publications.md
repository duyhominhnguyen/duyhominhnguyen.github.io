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

<div class="publication-filters" id="pub-year-filters">
  <button type="button" class="pub-filter-btn active" data-year="all">All</button>
</div>

{% bibliography --query @*[selected=true]* %}

</div>

<style>
  .publication-filters {
    margin-bottom: 1.5rem;
  }
  .pub-filter-btn {
    display: inline-block;
    margin: 0 0.4rem 0.5rem 0;
    padding: 0.3rem 0.9rem;
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--global-text-color);
    background-color: var(--global-bg-color);
    border: 1px solid var(--global-text-color);
    border-radius: 1rem;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
  }
  .pub-filter-btn:hover {
    color: var(--global-theme-color);
    border-color: var(--global-theme-color);
  }
  .pub-filter-btn.active {
    color: var(--global-bg-color);
    background-color: var(--global-theme-color);
    border-color: var(--global-theme-color);
  }
</style>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    var container = document.querySelector('.publications');
    if (!container) return;

    var filterBar = document.getElementById('pub-year-filters');
    var yearHeaders = Array.prototype.slice.call(container.querySelectorAll('h2.bibliography'));

    // Build one filter button per year heading actually present on the page,
    // in the order they already appear (site.scholar.group_order controls that).
    yearHeaders.forEach(function (h2) {
      var year = h2.textContent.trim();
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pub-filter-btn';
      btn.dataset.year = year;
      btn.textContent = year;
      filterBar.appendChild(btn);
    });

    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.pub-filter-btn');
      if (!btn) return;
      var year = btn.dataset.year;

      filterBar.querySelectorAll('.pub-filter-btn').forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });

      yearHeaders.forEach(function (h2) {
        var ol = h2.nextElementSibling; // the <ol class="bibliography"> that follows each year heading
        var show = year === 'all' || h2.textContent.trim() === year;
        h2.style.display = show ? '' : 'none';
        if (ol) ol.style.display = show ? '' : 'none';
      });
    });
  });
</script>
