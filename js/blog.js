(function () {
  const posts = Array.isArray(window.blogs) ? window.blogs : [];
  const listing = document.querySelector("[data-blog-list]");
  const postMount = document.querySelector("[data-blog-post]");
  const categories = ["All", ...new Set(posts.map((post) => post.category))];
  const perPage = 6;
  const urlParams = new URLSearchParams(window.location.search);
  const currentPath = window.location.pathname.split("/").pop() || "blog.html";
  // Allow pages to set a default category via `window.defaultCategory` (e.g., category-opinion.html)
  const defaultCategory = typeof window.defaultCategory === "string" ? window.defaultCategory : null;
  let initCategory = urlParams.get("category") || defaultCategory || "All";
  let currentCategory = categories.includes(initCategory) ? initCategory : "All";
  let currentPage = Number(urlParams.get("page")) || 1;
  let currentSearch = urlParams.get("search") || "";

  function postUrl(post) {
    return `blog-post.html?id=${encodeURIComponent(post.id)}`;
  }

  function card(post) {
    return `
      <article class="article-card">
        <a href="${postUrl(post)}">
          <img src="${post.image}" alt="${post.imageAlt}" loading="lazy">
        </a>
        <p class="category">${post.category}</p>
        <h3><a href="${postUrl(post)}">${post.title}</a></h3>
        <p>${post.excerpt}</p>
        <div class="meta"><span>${post.author}</span><span>${post.date}</span></div>
      </article>
    `;
  }

  function updateUrl() {
    const params = new URLSearchParams();
    const useCategoryParam = currentPath === "blog.html" || !defaultCategory || currentCategory !== defaultCategory;
    if (useCategoryParam && currentCategory && currentCategory !== "All") {
      params.set("category", currentCategory);
    }
    if (currentSearch) {
      params.set("search", currentSearch);
    }
    if (currentPage > 1) {
      params.set("page", currentPage);
    }
    const query = params.toString();
    const newUrl = query ? `${currentPath}?${query}` : currentPath;
    window.history.replaceState({}, "", newUrl);
  }

  function renderListing() {
    if (!listing) return;
    const searchInput = document.querySelector("[data-blog-search]");
    const categorySelect = document.querySelector("[data-blog-category]");
    const pagination = document.querySelector("[data-pagination]");

    if (categorySelect && categorySelect.options.length === 0) {
      categorySelect.innerHTML = categories.map((cat) => `<option value="${cat}">${cat}</option>`).join("");
    }

    if (categorySelect) {
      categorySelect.value = categories.includes(currentCategory) ? currentCategory : "All";
    }

    if (searchInput) {
      searchInput.value = currentSearch;
    }

    const filtered = posts.filter((post) => {
      const matchesCategory = currentCategory === "All" || post.category === currentCategory;
      const haystack = `${post.title} ${post.excerpt} ${post.category} ${post.author}`.toLowerCase();
      return matchesCategory && haystack.includes(currentSearch.toLowerCase());
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    currentPage = Math.min(currentPage, totalPages);
    const pagePosts = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

    listing.innerHTML = pagePosts.length
      ? pagePosts.map(card).join("")
      : `<p>No articles match your search yet.</p>`;

    if (pagination) {
      pagination.innerHTML = Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        return `<button type="button" data-page="${page}" ${page === currentPage ? 'aria-current="page"' : ""}>${page}</button>`;
      }).join("");
    }

    if (searchInput && !searchInput.dataset.bound) {
      searchInput.dataset.bound = "true";
      searchInput.addEventListener("input", () => {
        currentSearch = searchInput.value.trim();
        currentPage = 1;
        renderListing();
      });
    }

    if (categorySelect && !categorySelect.dataset.bound) {
      categorySelect.dataset.bound = "true";
      categorySelect.addEventListener("change", () => {
        currentCategory = categorySelect.value;
        currentPage = 1;
        renderListing();
      });
    }

    if (pagination && !pagination.dataset.bound) {
      pagination.dataset.bound = "true";
      pagination.addEventListener("click", (event) => {
        const button = event.target.closest("[data-page]");
        if (!button) return;
        currentPage = Number(button.dataset.page);
        renderListing();
      });
    }

    updateUrl();
  }

  function setMeta(name, content, property) {
    if (!content) return;
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let tag = document.head.querySelector(selector);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute(property ? "property" : "name", name);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  }

  function renderPost() {
    if (!postMount) return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || posts[0]?.id;
    const post = posts.find((item) => item.id === id);

    if (!post) {
      postMount.innerHTML = `
        <div class="page-hero"><div class="container"><h1>Article not found</h1><p>The story may have moved. Return to the blog index to keep reading.</p><a class="btn" href="blog.html">View All Articles</a></div></div>
      `;
      return;
    }

    document.title = `${post.seoTitle || post.title} | Headlinica`;
    setMeta("description", post.metaDescription);
    setMeta("og:title", post.title, true);
    setMeta("og:description", post.metaDescription, true);
    setMeta("og:image", post.image, true);
    setMeta("twitter:title", post.title);
    setMeta("twitter:description", post.metaDescription);
    setMeta("twitter:image", post.image);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = `https://www.headlinica.com/blog-post.html?id=${encodeURIComponent(post.id)}`;

    postMount.innerHTML = `
      <section class="section">
        <div class="container">
          <header class="post-header">
            <p class="category">${post.category}</p>
            <h1>${post.title}</h1>
            <p>${post.excerpt}</p>
            <div class="meta"><span>${post.author}</span><span>${post.date}</span></div>
          </header>
          <img class="post-image" src="${post.image}" alt="${post.imageAlt}" loading="lazy">
          <div class="split-layout">
            <article class="post-content">${post.content}</article>
            <aside class="sidebar" aria-label="Article sidebar">
              <div class="widget">
                <h3>More From Headlinica</h3>
                <ol class="ranked-list">
                  ${posts.filter((item) => item.id !== post.id).slice(0, 3).map((item) => `<li><a href="${postUrl(item)}">${item.title}</a></li>`).join("")}
                </ol>
              </div>
              <div class="widget">
                <h3>Briefing</h3>
                <p>Get clear news analysis in your inbox.</p>
                <button class="btn js-open-cta" type="button">Subscribe</button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    `;

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: post.title,
      description: post.metaDescription,
      image: post.image,
      author: { "@type": "Organization", name: post.author },
      publisher: { "@type": "Organization", name: "Headlinica" },
      datePublished: post.isoDate,
      mainEntityOfPage: `https://www.headlinica.com/blog-post.html?id=${post.id}`
    });
    document.head.appendChild(schema);
  }

  renderListing();
  renderPost();
})();
