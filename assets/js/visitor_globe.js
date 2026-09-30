// Loads the UmamiMaps visitor globe widget on the About page and keeps it in
// sync with the site's light/dark theme toggle (see assets/js/theme.js).
//
// The widget itself (https://github.com/Selenium39/umami-maps) is a small
// external bundle loaded from a CDN; this file only wires it up to the
// container + theme, and shows a quiet fallback if it never renders (e.g.
// while the Umami + proxy setup described in visitor-globe-proxy/README.md
// hasn't been finished yet).

(function () {
  "use strict";

  var CONTAINER_ID = "visitor-globe";
  var EMBED_SRC = "https://unpkg.com/umami-maps/dist/embed.global.js";
  var RENDER_TIMEOUT_MS = 8000;

  function getComputedTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function mountWidget(container) {
    var endpoint = container.getAttribute("data-endpoint");
    var size = container.getAttribute("data-size") || "260";

    if (!endpoint || endpoint.indexOf("REPLACE-WITH-YOUR-VERCEL-URL") !== -1) {
      // Config not finished yet -- fail quietly instead of loading a broken widget.
      return;
    }

    // Clear out anything from a previous mount (e.g. on theme toggle).
    container.innerHTML = "";

    var placeholder = document.createElement("p");
    placeholder.className = "visitor-globe-placeholder";
    placeholder.textContent = "Loading visitor map…";
    container.appendChild(placeholder);

    var script = document.createElement("script");
    script.src = EMBED_SRC;
    script.setAttribute("data-endpoint", endpoint);
    script.setAttribute("data-target", "#" + CONTAINER_ID);
    script.setAttribute("data-size", size);
    script.setAttribute("data-dark", getComputedTheme() === "dark" ? "true" : "false");
    container.appendChild(script);

    // If the widget hasn't replaced the placeholder after a while (endpoint
    // not deployed yet, Umami has no data yet, CORS issue, etc.), swap in a
    // quiet note instead of leaving "Loading…" stuck forever.
    window.setTimeout(function () {
      if (container.contains(placeholder)) {
        placeholder.textContent = "Visitor map is warming up -- check back soon.";
      }
    }, RENDER_TIMEOUT_MS);
  }

  function init() {
    var container = document.getElementById(CONTAINER_ID);
    if (!container) return;

    mountWidget(container);

    // Re-render with the correct dark/light color scheme whenever the theme
    // toggle (light-toggle) or the OS-level preference changes.
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].attributeName === "data-theme") {
          mountWidget(container);
          break;
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
