import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description: string;
  image?: string | null;
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    if (hreflang) element.setAttribute('hreflang', hreflang);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

export function usePageMeta({ title, description, image, type = 'website', noindex, jsonLd }: PageMeta) {
  useEffect(() => {
    const brand = 'FaraTech';
    document.title = title.includes(brand) ? title : `${title} — ${brand}`;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setMeta('meta[property="og:title"]', 'property', 'og:title', document.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', type);
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', brand);
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', document.title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    if (image) {
      const absolute = new URL(image, window.location.origin).toString();
      setMeta('meta[property="og:image"]', 'property', 'og:image', absolute);
      setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', absolute);
    }
    const canonical = `${window.location.origin}${window.location.pathname}`;
    setLink('canonical', canonical);
    const bare = window.location.pathname.replace(/^\/fa(?=\/|$)/, '') || '/';
    const english = `${window.location.origin}${bare}`;
    const persian = `${window.location.origin}${bare === '/' ? '/fa' : `/fa${bare}`}`;
    setLink('alternate', english, 'en');
    setLink('alternate', persian, 'fa');
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical);

    let script = document.head.querySelector<HTMLScriptElement>('script[data-page-jsonld]');
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.dataset.pageJsonld = 'true';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
  }, [title, description, image, type, noindex, jsonLd]);
}

export function useScrollToTop(pathname: string) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
}
