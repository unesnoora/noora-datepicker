import { useEffect, useMemo, useState } from "react";
import { ConfigProvider } from "antd";
import faIR from "antd/locale/fa_IR";
import "antd/dist/reset.css";
import { DOC_LINKS, PROP_DOCS } from "./catalog";
import { ConfigPage } from "./ConfigPage";
import { ExampleRoute } from "./ExamplePages";
import { GuidePage } from "./GuidePages";
import { HomePage } from "./HomePage";
import { PRODUCT_NAME_EN, PRODUCT_NAME_FA, PRODUCT_TITLE, REPO_URL } from "./brand";
import { DocsThemeProvider, ThemeSelector } from "./docsTheme";
import "./docs.css";

function propTarget(): string | null {
  const query = window.location.hash.split("?")[1];
  if (!query) return null;
  return new URLSearchParams(query).get("p");
}

function readPath(): string {
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw || raw === "/") return "/";
  return raw.startsWith("/") ? raw.split("?")[0] : `/${raw.split("?")[0]}`;
}

export default function DocsApp() {
  const [path, setPath] = useState(readPath);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sync = () => {
      setPath(readPath());
      setMenuOpen(false);
      window.scrollTo(0, 0);
      const name = propTarget();
      if (name) requestAnimationFrame(() => document.getElementById(`prop-${name}`)?.scrollIntoView());
    };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    const current = DOC_LINKS.find((item) => item.path === path);
    document.title = current ? `${current.title} | ${PRODUCT_NAME_FA}` : PRODUCT_TITLE;
  }, [path]);

  const hits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const pages = DOC_LINKS.filter((item) => item.title.includes(query.trim()) || item.path.includes(q)).map(
      (item) => ({ href: `#${item.path}`, title: item.title, hint: item.group }),
    );
    const props = PROP_DOCS.filter((item) => item.name.toLowerCase().includes(q)).slice(0, 8).map((item) => ({
      href: `#/config?p=${item.name}`,
      title: item.name,
      hint: "پیکربندی",
    }));
    return [...pages, ...props].slice(0, 12);
  }, [query]);

  const index = DOC_LINKS.findIndex((item) => item.path === path);
  const prev = index > 0 ? DOC_LINKS[index - 1] : undefined;
  const next = index >= 0 && index < DOC_LINKS.length - 1 ? DOC_LINKS[index + 1] : undefined;
  const isHome = path === "/";
  const known = isHome || DOC_LINKS.some((item) => item.path === path);
  const navKey = path.startsWith("/guide") ? "/guide" : path.startsWith("/examples") ? "/examples/formatting" : path;

  let body = <MissingPage />;
  if (isHome) body = <HomePage />;
  else if (path.startsWith("/guide")) body = <GuidePage path={path} />;
  else if (path.startsWith("/examples")) body = <ExampleRoute path={path} />;
  else if (path === "/config") body = <ConfigPage />;

  const groups = ["راهنما", "نمونه‌ها", "مرجع"] as const;

  return (
    <ConfigProvider
      locale={faIR}
      direction="rtl"
      theme={{ token: { fontFamily: '"Vazirmatn", Tahoma, system-ui, sans-serif' } }}
    >
      <DocsThemeProvider>
        <div className={`docs${isHome ? "" : " docs--theme-bar"}`}>
        <header className="docs-top">
          <a className="docs-brand" href="#/">
            {PRODUCT_NAME_FA}{" "}
            <span className="docs-brand-en">{PRODUCT_NAME_EN}</span>
          </a>
          <form
            className="docs-search"
            onSubmit={(event) => {
              event.preventDefault();
              if (hits[0]) window.location.hash = hits[0].href.replace(/^#/, "");
            }}
          >
            <input
              aria-label="جستجو"
              placeholder="جستجو"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query.trim() && hits.length > 0 ? (
              <ul className="docs-search-list">
                {hits.map((hit) => (
                  <li key={hit.href}>
                    <a
                      href={hit.href}
                      onClick={() => setQuery("")}
                    >
                      {hit.title}
                      <small>{hit.hint}</small>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </form>
          <nav className="docs-nav">
            <button type="button" className="docs-menu-btn" onClick={() => setMenuOpen((open) => !open)}>
              فهرست
            </button>
            <a className={navKey === "/guide" || path.startsWith("/guide") ? "is-active" : ""} href="#/guide">
              راهنما
            </a>
            <a className={path === "/config" ? "is-active" : ""} href="#/config">
              پیکربندی
            </a>
            <a className={path.startsWith("/examples") ? "is-active" : ""} href="#/examples/formatting">
              نمونه‌ها
            </a>
            <a
              className="docs-github"
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </nav>
          {!isHome ? <ThemeSelector /> : null}
        </header>
        <div className="docs-body">
          {isHome ? null : (
            <aside className={`docs-side${menuOpen ? " is-open" : ""}`}>
              {groups.map((group) => (
                <div key={group}>
                  <h2>{group}</h2>
                  {DOC_LINKS.filter((item) => item.group === group).map((item) => (
                    <a key={item.path} className={item.path === path ? "is-active" : ""} href={`#${item.path}`}>
                      {item.title}
                    </a>
                  ))}
                </div>
              ))}
            </aside>
          )}
          <main className="docs-main">
            {known ? body : <MissingPage />}
            {!isHome && known && (prev || next) ? (
              <div className="doc-pager">
                {prev ? <a href={`#${prev.path}`}>→ {prev.title}</a> : <span />}
                {next ? <a href={`#${next.path}`}>{next.title} ←</a> : <span />}
              </div>
            ) : null}
          </main>
        </div>
        </div>
      </DocsThemeProvider>
    </ConfigProvider>
  );
}

function MissingPage() {
  return (
    <article className="doc-article">
      <h1>این صفحه نیست</h1>
      <p>
        از <a href="#/guide">راهنما</a> شروع کنید.
      </p>
    </article>
  );
}
