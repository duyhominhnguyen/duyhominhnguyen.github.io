// Adds a "filter by year" button bar to any .publications block that
// contains a .publication-year-filters placeholder. Works whether the
// bibliography is grouped by year (group_by: year -> <h2 class="bibliography">)
// or rendered as a flat list (group_by: none, e.g. the About page's
// "selected papers" section) by reading the year straight out of each
// entry's .periodical text.
//
// Add data-default-year="2026" on the placeholder div to have that year
// selected by default instead of "All" (falls back to "All" if that year
// isn't found among the actual entries).
(function () {
  function yearFromEntry(li) {
    var periodical = li.querySelector(".periodical");
    var text = periodical ? periodical.textContent : li.textContent;
    var match = text.match(/(19|20)\d{2}/g);
    return match ? match[match.length - 1] : null;
  }

  function applyFilter(year, bar, entries, yearHeadings, dividers) {
    bar.querySelectorAll(".pub-filter-btn").forEach(function (b) {
      b.classList.toggle("active", b.dataset.year === year);
    });

    entries.forEach(function (entry) {
      entry.el.style.display = year === "all" || entry.year === year ? "" : "none";
    });

    // Faded year markers between groups are only shown in the "All" view.
    dividers.forEach(function (d) {
      d.style.display = year === "all" ? "" : "none";
    });

    // If the bibliography is grouped by year (main publications page),
    // also hide/show the year headings themselves.
    yearHeadings.forEach(function (h2) {
      var headingYear = h2.textContent.trim();
      h2.style.display = year === "all" || headingYear === year ? "" : "none";
    });
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
    allBtn.className = "pub-filter-btn";
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

    // For flat (non-grouped) lists, insert a faded year marker before the
    // first paper of each year so the "All" view still shows year sections.
    // Assumes entries are already in (reverse) chronological order.
    var dividers = [];
    if (!yearHeadings.length) {
      var previousYear = null;
      entries.forEach(function (e) {
        if (!e.year || e.year === previousYear) return;
        previousYear = e.year;
        var divider = document.createElement("li");
        divider.className = "pub-year-divider";
        divider.setAttribute("aria-hidden", "true");
        divider.dataset.year = e.year;
        divider.textContent = e.year;
        e.el.parentNode.insertBefore(divider, e.el);
        dividers.push(divider);
      });
    }

    // Default selection: use data-default-year if it's one of the years
    // actually present, otherwise fall back to "all".
    var requestedDefault = bar.dataset.defaultYear;
    var initialYear = requestedDefault && years.indexOf(requestedDefault) !== -1 ? requestedDefault : "all";
    applyFilter(initialYear, bar, entries, yearHeadings, dividers);

    bar.addEventListener("click", function (e) {
      var btn = e.target.closest(".pub-filter-btn");
      if (!btn) return;
      applyFilter(btn.dataset.year, bar, entries, yearHeadings, dividers);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".publications").forEach(initPubYearFilter);
  });
})();
