// Adds a "filter by year" button bar to any .publications block that
// contains a .publication-year-filters placeholder. Works whether the
// bibliography is grouped by year (group_by: year -> <h2 class="bibliography">)
// or rendered as a flat list (group_by: none, e.g. the About page's
// "selected papers" section) by reading the year straight out of each
// entry's .periodical text.
(function () {
  function yearFromEntry(li) {
    var periodical = li.querySelector(".periodical");
    var text = periodical ? periodical.textContent : li.textContent;
    var match = text.match(/(19|20)\d{2}/g);
    return match ? match[match.length - 1] : null;
  }

  function initPubYearFilter(container) {
    var bar = container.querySelector(".publication-year-filters");
    var items = container.querySelectorAll(":scope > ol.bibliography > li, ol.bibliography li");
    if (!bar || !items.length) return;

    var entries = [];
    items.forEach(function (li) {
      entries.push({ el: li, year: yearFromEntry(li) });
    });

    var years = [];
    entries.forEach(function (e) {
      if (e.year && years.indexOf(e.year) === -1) years.push(e.year);
    });
    years.sort(function (a, b) {
      return b - a;
    });
    if (!years.length) return;

    bar.innerHTML = "";

    var allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = "pub-filter-btn active";
    allBtn.dataset.year = "all";
    allBtn.textContent = "All";
    bar.appendChild(allBtn);

    years.forEach(function (year) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pub-filter-btn";
      btn.dataset.year = year;
      btn.textContent = year;
      bar.appendChild(btn);
    });

    var yearHeadings = container.querySelectorAll("h2.bibliography");

    bar.addEventListener("click", function (e) {
      var btn = e.target.closest(".pub-filter-btn");
      if (!btn) return;
      var year = btn.dataset.year;

      bar.querySelectorAll(".pub-filter-btn").forEach(function (b) {
        b.classList.toggle("active", b === btn);
      });

      entries.forEach(function (entry) {
        entry.el.style.display = year === "all" || entry.year === year ? "" : "none";
      });

      // If the bibliography is grouped by year (main publications page),
      // also hide/show the year headings themselves.
      yearHeadings.forEach(function (h2) {
        var headingYear = h2.textContent.trim();
        h2.style.display = year === "all" || headingYear === year ? "" : "none";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".publications").forEach(initPubYearFilter);
  });
})();
