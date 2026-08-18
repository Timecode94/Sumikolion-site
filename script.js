// Cherche, pour chaque emplacement photo, si le fichier existe déjà dans images/.
// Si oui : affiche la vraie photo. Si non : laisse le "gabarit" (placeholder) visible.
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".photo-slot").forEach(function (slot) {
    var src = slot.getAttribute("data-src");
    if (!src) return;
    var probe = new Image();
    probe.onload = function () {
      slot.innerHTML =
        '<img src="' + src + '" alt="' +
        (slot.getAttribute("data-alt") || "") +
        '" loading="lazy">';
      slot.classList.remove("placeholder");
      slot.classList.add("loaded");
    };
    probe.onerror = function () {
      // Fichier pas encore présent : on garde le gabarit tel quel.
    };
    probe.src = src;
  });
});

// ---------- Lightbox plein écran pour les galeries ----------
(function () {
  var overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML =
    '<button class="lightbox-close" aria-label="Fermer">&times;</button>' +
    '<button class="lightbox-prev" aria-label="Précédent">&lsaquo;</button>' +
    '<img src="" alt="">' +
    '<button class="lightbox-next" aria-label="Suivant">&rsaquo;</button>' +
    '<p class="lightbox-cap"></p>';
  document.addEventListener("DOMContentLoaded", function () {
    document.body.appendChild(overlay);
  });

  var imgEl = overlay.querySelector("img");
  var capEl = overlay.querySelector(".lightbox-cap");
  var items = [];
  var current = 0;

  function collect() {
    items = Array.prototype.slice
      .call(document.querySelectorAll(".photo-grid figure"))
      .filter(function (fig) {
        return fig.querySelector(".photo-slot.loaded img");
      });
  }

  function show(i) {
    if (!items.length) return;
    current = (i + items.length) % items.length;
    var img = items[current].querySelector(".photo-slot.loaded img");
    var cap = items[current].querySelector(".cap");
    imgEl.src = img.src;
    imgEl.alt = img.alt;
    capEl.textContent = cap ? cap.textContent : "";
    overlay.classList.add("open");
  }

  document.addEventListener("click", function (e) {
    var fig = e.target.closest ? e.target.closest(".photo-grid figure") : null;
    if (fig && fig.querySelector(".photo-slot.loaded img")) {
      collect();
      show(items.indexOf(fig));
    }
    if (e.target.closest && e.target.closest(".lightbox-close")) {
      overlay.classList.remove("open");
    }
    if (e.target.closest && e.target.closest(".lightbox-prev")) {
      show(current - 1);
    }
    if (e.target.closest && e.target.closest(".lightbox-next")) {
      show(current + 1);
    }
    if (e.target === overlay) {
      overlay.classList.remove("open");
    }
  });

  document.addEventListener("keydown", function (e) {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") overlay.classList.remove("open");
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
})();
