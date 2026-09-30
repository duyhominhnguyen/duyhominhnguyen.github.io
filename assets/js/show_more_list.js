// Collapses a .publications list down to the first N entries, with a
// "See N more" button to expand (and collapse back). Activated by adding
// a placeholder like:
//   <div class="show-more-container" data-show-limit="4"></div>
// right after the {% bibliography %} tag in the relevant include/page.
(function () {
  function initShowMore(container) {
    var toggleWrap = container.querySelector(".show-more-container");
    if (!toggleWrap) return;

    var limit = parseInt(toggleWrap.dataset.showLimit, 10) || 4;
    var items = container.querySelectorAll("ol.bibliography > li");
    if (items.length <= limit) {
      toggleWrap.remove();
      return;
    }

    items.forEach(function (li, idx) {
      if (idx >= limit) li.classList.add("show-more-hidden");
    });

    var remaining = items.length - limit;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "show-more-btn";
    btn.textContent = "See " + remaining + " more";
    toggleWrap.appendChild(btn);

    var expanded = false;
    btn.addEventListener("click", function () {
      expanded = !expanded;
      items.forEach(function (li, idx) {
        if (idx >= limit) li.classList.toggle("show-more-hidden", !expanded);
      });
      btn.textContent = expanded ? "See less" : "See " + remaining + " more";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".publications").forEach(initShowMore);
  });
})();
