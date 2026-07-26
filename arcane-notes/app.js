/*
  app.js
  ----------------------------------------------------------------
  Vanilla JavaScript powering Notes. No frameworks, no build
  step — just DOM APIs. Responsibilities:

    1. renderNotes()        -> builds the whole page from NOTES_DATA
    2. Sidebar navigation    -> populates links + collapse/mobile toggle
    3. Search & filter       -> real-time filtering as you type
    4. Copy-to-clipboard     -> one button per code block
    5. Progress rail         -> constellation scroll tracker
    6. Small utilities       -> highlight(), toast(), escapeHtml()

  Everything here reads from the global NOTES_DATA array defined in
  notes-data.js (loaded before this file in index.html).
  ----------------------------------------------------------------
*/

(function () {
  "use strict";

  /* ---------------- DOM references ---------------- */
  const navList = document.getElementById("navList");
  const notesContent = document.getElementById("notesContent");
  const searchInput = document.getElementById("searchInput");
  const searchHint = document.getElementById("searchHint");
  const emptyState = document.getElementById("emptyState");
  const emptyQuery = document.getElementById("emptyQuery");
  const railNodes = document.getElementById("railNodes");
  const railFill = document.getElementById("railFill");
  const toTopBtn = document.getElementById("toTopBtn");
  const toast = document.getElementById("toast");
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  const menuBtn = document.getElementById("menuBtn");

  let toastTimer = null;

  /* =========================================================
     1. RENDER NOTES  — build sidebar nav, rail nodes, and all
        the section/topic/code-block markup from NOTES_DATA.
     ========================================================= */
  function renderNotes() {
    const navFragment = document.createDocumentFragment();
    const railFragment = document.createDocumentFragment();
    const contentFragment = document.createDocumentFragment();

    NOTES_DATA.forEach((section) => {
      // ---- Sidebar nav item ----
      const li = document.createElement("li");
      li.innerHTML = `
        <a href="#${section.id}" class="nav-item" data-target="${section.id}">
          <span class="nav-sigil" aria-hidden="true">${section.sigil}</span>
          <span class="nav-item-label">${section.title}</span>
          <span class="nav-count">${section.topics.length}</span>
        </a>`;
      navFragment.appendChild(li);

      // ---- Progress rail node ----
      const railLi = document.createElement("li");
      railLi.className = "rail-node";
      railLi.dataset.target = section.id;
      railLi.innerHTML = `
        <button aria-label="Jump to ${escapeHtml(section.title)}">
          <span class="rail-dot"></span>
        </button>
        <span class="rail-tooltip">${escapeHtml(section.title)}</span>`;
      railFragment.appendChild(railLi);

      // ---- Section content ----
      const sectionEl = document.createElement("section");
      sectionEl.className = "note-section";
      sectionEl.id = section.id;
      sectionEl.dataset.searchBlob = buildSearchBlob(section);

      const topicsHtml = section.topics
        .map((topic) => renderTopic(topic))
        .join("");

      sectionEl.innerHTML = `
        <div class="section-heading">
          <span class="section-sigil" aria-hidden="true">${section.sigil}</span>
          <h2 class="section-title">${section.title}</h2>
        </div>
        <p class="section-summary">${section.summary}</p>
        <div class="section-divider"></div>
        ${topicsHtml}
      `;
      contentFragment.appendChild(sectionEl);
    });

    navList.appendChild(navFragment);
    railNodes.appendChild(railFragment);
    notesContent.appendChild(contentFragment);
  }

  function renderTopic(topic) {
    const codeHtml = topic.code ? renderCodeBlock(topic.code) : "";
    return `
      <article class="topic-card" data-topic-title="${escapeHtml(topic.title)}">
        <h3 class="topic-title">${topic.title}</h3>
        <div class="topic-body">${topic.body}</div>
        ${codeHtml}
      </article>
    `;
  }

  let codeBlockId = 0;
  function renderCodeBlock(codeObj) {
    const id = `code-${codeBlockId++}`;
    const highlighted = highlightPython(codeObj.snippet);
    return `
      <div class="code-block">
        <div class="code-block-header">
          <span class="code-lang">${codeObj.lang}</span>
          <button class="copy-btn" data-copy-target="${id}" aria-label="Copy code to clipboard">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span class="copy-label">Copy</span>
          </button>
        </div>
        <pre><code id="${id}" data-raw="${escapeHtml(codeObj.snippet)}">${highlighted}</code></pre>
      </div>
    `;
  }

  function buildSearchBlob(section) {
    const parts = [section.title, section.summary];
    section.topics.forEach((t) => {
      parts.push(t.title, stripHtml(t.body));
      if (t.code) parts.push(t.code.snippet);
    });
    return parts.join(" ").toLowerCase();
  }

  /* =========================================================
     2. MINIMAL PYTHON SYNTAX HIGHLIGHTER
        Intentionally lightweight — no external library — good
        enough to color keywords, strings, comments, and numbers.
     ========================================================= */
  const PY_KEYWORDS = [
    "def","return","if","elif","else","for","while","in","import","from","as",
    "class","try","except","finally","with","lambda","not","and","or","is",
    "None","True","False","break","continue","pass","raise","yield","self",
    "print","range","len","f"
  ];

  function highlightPython(code) {
    const escaped = escapeHtml(code);
    const lines = escaped.split("\n").map(highlightLine);
    return lines.join("\n");
  }

  function highlightLine(line) {
    // Comments: everything after a # (that isn't inside a string we've
    // already tagged — good enough for the notes here, since snippets
    // are curated rather than arbitrary user input).
    const commentIdx = line.indexOf("#");
    let codePart = line;
    let commentPart = "";
    if (commentIdx !== -1) {
      codePart = line.slice(0, commentIdx);
      commentPart = `<span class="tok-com">${line.slice(commentIdx)}</span>`;
    }

    // Strings (single or double quoted, non-greedy)
    codePart = codePart.replace(/(&quot;.*?&quot;|'.*?')/g, '<span class="tok-str">$1</span>');

    // Numbers
    codePart = codePart.replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-num">$1</span>');

    // Keywords (word-boundary matched, skip if already inside a span)
    PY_KEYWORDS.forEach((kw) => {
      const re = new RegExp(`\\b(${kw})\\b(?![^<]*>)`, "g");
      codePart = codePart.replace(re, '<span class="tok-kw">$1</span>');
    });

    return codePart + commentPart;
  }

  /* =========================================================
     3. SEARCH & FILTER
     ========================================================= */
  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const sections = notesContent.querySelectorAll(".note-section");
    let visibleCount = 0;

    if (!query) {
      sections.forEach((sec) => {
        sec.hidden = false;
        clearHighlights(sec);
      });
      emptyState.hidden = true;
      searchHint.textContent = "";
      updateRailVisibility();
      return;
    }

    sections.forEach((sec) => {
      const matches = sec.dataset.searchBlob.includes(query);
      sec.hidden = !matches;
      if (matches) {
        visibleCount++;
        applyHighlights(sec, query);
      } else {
        clearHighlights(sec);
      }
    });

    emptyState.hidden = visibleCount !== 0;
    emptyQuery.textContent = searchInput.value.trim();
    searchHint.textContent = `${visibleCount} section${visibleCount === 1 ? "" : "s"}`;
    updateRailVisibility();
  }

  function applyHighlights(sectionEl, query) {
    // Only highlight within topic titles and body text (not raw code,
    // to avoid corrupting the copy-to-clipboard source).
    const targets = sectionEl.querySelectorAll(".topic-title, .topic-body p, .topic-body li");
    targets.forEach((el) => {
      if (!el.dataset.original) el.dataset.original = el.innerHTML;
      const original = el.dataset.original;
      const re = new RegExp(`(${escapeRegex(query)})`, "ig");
      el.innerHTML = original.replace(re, '<mark class="hl">$1</mark>');
    });
  }

  function clearHighlights(sectionEl) {
    const targets = sectionEl.querySelectorAll("[data-original]");
    targets.forEach((el) => {
      el.innerHTML = el.dataset.original;
    });
  }

  function updateRailVisibility() {
    const nodes = railNodes.querySelectorAll(".rail-node");
    nodes.forEach((node) => {
      const target = document.getElementById(node.dataset.target);
      node.style.display = target && target.hidden ? "none" : "";
    });
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /* =========================================================
     4. COPY TO CLIPBOARD
     ========================================================= */
  function handleCopyClick(e) {
    const btn = e.target.closest(".copy-btn");
    if (!btn) return;

    const targetId = btn.dataset.copyTarget;
    const codeEl = document.getElementById(targetId);
    if (!codeEl) return;

    const raw = codeEl.dataset.raw;

    navigator.clipboard.writeText(raw).then(
      () => {
        btn.classList.add("copied");
        const label = btn.querySelector(".copy-label");
        const prevText = label.textContent;
        label.textContent = "Copied";
        showToast("Code copied to clipboard.");
        setTimeout(() => {
          btn.classList.remove("copied");
          label.textContent = prevText;
        }, 1600);
      },
      () => {
        showToast("Could not copy — please copy manually.");
      }
    );
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 2200);
  }

  /* =========================================================
     5. PROGRESS RAIL (constellation scroll tracker)
     ========================================================= */
  function initProgressRail() {
    const sections = Array.from(notesContent.querySelectorAll(".note-section"));
    const nodes = Array.from(railNodes.querySelectorAll(".rail-node"));

    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      railFill.style.height = `${progress * 100}%`;

      // Determine which section is currently in view
      let activeIdx = 0;
      sections.forEach((sec, idx) => {
        if (sec.hidden) return;
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 140) activeIdx = idx;
      });

      nodes.forEach((node, idx) => {
        node.classList.toggle("active", idx === activeIdx);
        node.classList.toggle("passed", idx < activeIdx);
      });

      const navItems = navList.querySelectorAll(".nav-item");
      navItems.forEach((item, idx) => {
        item.classList.toggle("active", idx === activeIdx);
      });

      toTopBtn.classList.toggle("visible", scrollTop > 400);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Click a rail node to jump to that section
    railNodes.addEventListener("click", (e) => {
      const node = e.target.closest(".rail-node");
      if (!node) return;
      const target = document.getElementById(node.dataset.target);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* =========================================================
     6. SIDEBAR: collapse (desktop) + open/close (mobile)
     ========================================================= */
  function initSidebar() {
    sidebarToggle.addEventListener("click", () => {
      const collapsed = document.body.classList.toggle("sidebar-collapsed");
      sidebarToggle.setAttribute("aria-expanded", String(!collapsed));
    });

    menuBtn.addEventListener("click", () => {
      const open = document.body.classList.toggle("sidebar-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });

    sidebarBackdrop.addEventListener("click", () => {
      document.body.classList.remove("sidebar-open");
      menuBtn.setAttribute("aria-expanded", "false");
    });

    // Smooth-scroll on nav click, and close mobile sidebar afterward
    navList.addEventListener("click", (e) => {
      const link = e.target.closest(".nav-item");
      if (!link) return;
      e.preventDefault();
      const target = document.getElementById(link.dataset.target);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      document.body.classList.remove("sidebar-open");
    });
  }

  /* =========================================================
     7. UTILITIES
     ========================================================= */
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stripHtml(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || "";
  }

  /* =========================================================
     INIT
     ========================================================= */
  function init() {
    renderNotes();
    initSidebar();
    initProgressRail();

    searchInput.addEventListener("input", handleSearch);
    notesContent.addEventListener("click", handleCopyClick);
    toTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  document.addEventListener("DOMContentLoaded", init);
})();