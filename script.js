(function () {
  "use strict";

  var doc = document;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* year */
  var y = doc.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* mobile nav */
  var toggle = doc.getElementById("navToggle");
  var links = doc.getElementById("navLinks");
  function closeNav() {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") closeNav();
  });

  /* nav border on scroll */
  var nav = doc.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* active link highlight */
  var sections = Array.prototype.slice.call(doc.querySelectorAll("main section[id]"));
  var navAnchors = Array.prototype.slice.call(links.querySelectorAll("a"));
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navAnchors.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* typed role text */
  var phrases = [
    "Smart Contract Engineer",
    "Security Auditor",
    "Multi-chain DeFi Builder",
    "Wallet Infrastructure"
  ];
  var typed = doc.getElementById("typed");
  if (reduce) {
    typed.textContent = phrases[0];
  } else {
    var pi = 0, ci = 0, del = false;
    (function tick() {
      var word = phrases[pi];
      typed.textContent = word.slice(0, ci);
      var delay = del ? 35 : 70;
      if (!del && ci === word.length) { del = true; delay = 1400; }
      else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; delay = 350; }
      else { ci += del ? -1 : 1; }
      setTimeout(tick, delay);
    })();
  }

  /* reveal on scroll */
  var revealEls = doc.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* count-up stats */
  function format(val, decimals, suffix) {
    return val.toFixed(decimals) + (suffix || "");
  }
  var counters = doc.querySelectorAll("[data-count]");
  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce) { el.textContent = format(target, decimals, suffix); return; }
    var start = null, dur = 1200;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * eased, decimals, suffix);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(runCounter);
  }

  /* project card spotlight */
  doc.querySelectorAll(".project").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* contact form -> mailto */
  var form = doc.getElementById("contactForm");
  var note = doc.getElementById("formNote");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = doc.getElementById("cfName").value.trim();
    var email = doc.getElementById("cfEmail").value.trim();
    var msg = doc.getElementById("cfMsg").value.trim();
    note.classList.remove("err");
    if (!name || !email || !msg) {
      note.textContent = "Please fill in all three fields.";
      note.classList.add("err");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      note.textContent = "That email address doesn't look right.";
      note.classList.add("err");
      return;
    }
    var subject = encodeURIComponent("Portfolio enquiry from " + name);
    var body = encodeURIComponent(msg + "\n\n- " + name + " (" + email + ")");
    window.location.href = "mailto:vrajaparikh01@gmail.com?subject=" + subject + "&body=" + body;
    note.textContent = "Opening your email app...";
  });
})();
