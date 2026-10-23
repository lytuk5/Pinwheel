function changeImage(imageSrc, buttonElement) {
  const imgElement = document.getElementById("anh-chuyen");

  imgElement.style.opacity = 0;

  setTimeout(() => {
    imgElement.src = imageSrc;
    imgElement.style.opacity = 1;
  }, 150);

  const allButtons = document.querySelectorAll(".tab-btn");
  allButtons.forEach((btn) => {
    btn.classList.remove("bg-[#fbbb9f]");
    btn.classList.add("bg-transparent", "hover:bg-gray-100");
  });

  buttonElement.classList.remove("bg-transparent", "hover:bg-gray-100");
  buttonElement.classList.add("bg-[#fbbb9f]");
}

// Bấm nút play thì hiện video YouTube
document.querySelectorAll(".video-play-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var player = btn.closest(".video").querySelector(".video-player");
    var frame = player.querySelector("iframe");
    if (!frame.src) frame.src = frame.dataset.src;
    player.classList.remove("hidden");
  });
});
// Slider đánh giá: bấm 3 chấm tròn để chuyển, kéo chuột/vuốt để đổi, lặp vô hạn
(function () {
  var root = document.querySelector(".reviews-carousel");
  if (!root) return;
  var wrap = root.querySelector(".swiper-wrapper");
  var pag = root.querySelector(".swiper-pagination");
  var originals = [].slice.call(wrap.children);
  var n = originals.length,
    GAP = 20;

  function clones() {
    var f = document.createDocumentFragment();
    originals.forEach(function (el) {
      var c = el.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      f.appendChild(c);
    });
    return f;
  }
  wrap.insertBefore(clones(), wrap.firstChild);
  wrap.appendChild(clones());
  var slides = [].slice.call(wrap.children);

  var dots = [];
  for (var k = 0; k < n; k++) {
    (function (k) {
      var d = document.createElement("span");
      d.className = "swiper-pagination-bullet";
      d.setAttribute("role", "button");
      d.setAttribute("tabindex", "0");
      d.setAttribute("aria-label", "Go to slide " + (k + 1));
      d.addEventListener("click", function () {
        goToLogical(k);
      });
      d.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToLogical(k);
        }
      });
      pag.appendChild(d);
      dots.push(d);
    })(k);
  }

  var p = n,
    slideW = 0,
    timer = null;

  function perView() {
    var w = root.clientWidth;
    return w >= 1024 ? 3 : w >= 768 ? 2 : 1;
  }
  function layout() {
    var pv = perView();
    slideW = (root.clientWidth - GAP * (pv - 1)) / pv;
    slides.forEach(function (s) {
      s.style.width = slideW + "px";
      s.style.marginRight = GAP + "px";
    });
    setT(p, false, 0);
  }
  function setT(pos, animate, extra) {
    wrap.style.transition = animate ? "transform 300ms ease-out" : "none";
    wrap.style.transform =
      "translate3d(" +
      (-(pos * (slideW + GAP)) + (extra || 0)) +
      "px,0,0)";
  }
  function logical() {
    return (((p - n) % n) + n) % n;
  }
  function updateDots() {
    var L = logical();
    dots.forEach(function (d, i) {
      d.classList.toggle("swiper-pagination-bullet-active", i === L);
      if (i === L) d.setAttribute("aria-current", "true");
      else d.removeAttribute("aria-current");
    });
  }
  function settle() {
    clearTimeout(timer);
    if (p < n || p >= 2 * n) {
      p = n + logical();
      setT(p, false, 0);
    }
  }
  function goTo(pos) {
    settle();
    p = pos;
    setT(p, true, 0);
    updateDots();
    timer = setTimeout(settle, 340);
  }
  function goToLogical(k) {
    settle();
    goTo(p + (k - logical()));
  }

  wrap.addEventListener("transitionend", function (e) {
    if (e.target === wrap) settle();
  });

  // Kéo chuột / vuốt cảm ứng
  var startX = 0,
    startT = 0,
    dragging = false,
    dx = 0;
  root.addEventListener("pointerdown", function (e) {
    if (e.target.closest(".swiper-pagination")) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    settle();
    dragging = true;
    dx = 0;
    startX = e.clientX;
    startT = Date.now();
    root.classList.add("is-dragging");
    try {
      root.setPointerCapture(e.pointerId);
    } catch (err) {}
  });
  root.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    dx = e.clientX - startX;
    setT(p, false, dx);
  });
  function end() {
    if (!dragging) return;
    dragging = false;
    root.classList.remove("is-dragging");
    var quick = Date.now() - startT < 300 && Math.abs(dx) > 20;
    if (quick || Math.abs(dx) > slideW / 2) goTo(p + (dx < 0 ? 1 : -1));
    else {
      setT(p, true, 0);
      timer = setTimeout(settle, 340);
    }
    dx = 0;
  }
  root.addEventListener("pointerup", end);
  root.addEventListener("pointercancel", end);

  window.addEventListener("resize", layout);
  layout();
  updateDots();
})();

// Menu hamburger trên màn hình nhỏ
(function () {
  var toggle = document.getElementById("menu-toggle");
  var menu = document.getElementById("menu-chinh");
  if (!toggle || !menu) return;

  function setOpen(open) {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
    toggle.innerHTML = open
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  }

  toggle.addEventListener("click", function () {
    setOpen(!menu.classList.contains("open"));
  });

  // Bấm vào một mục menu thì đóng menu lại
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });

  // Quay lại màn hình lớn thì đóng menu để không bị kẹt trạng thái
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1024) setOpen(false);
  });
})();