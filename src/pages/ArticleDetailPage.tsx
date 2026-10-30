import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Check,
  Clock3,
  Link2,
  Linkedin,
  MessageCircle,
  Share2,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { publicApi } from '@/lib/api';
import { LocalLink, useLocale } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';
import { usePublicSite } from '@/components/PublicLayout';
import { ArticleCard } from '@/components/Cards';
import { Markdown } from '@/components/Markdown';
import { CtaBand } from '@/components/CtaBand';

export function ArticleDetailPage() {
  const { slug = '' } = useParams();
  const site = usePublicSite();
  const { t, locale, formatDate } = useLocale();
  const [copied, setCopied] = useState(false);
  const query = useQuery({
    queryKey: ['article', slug],
    queryFn: () => publicApi.article(slug),
    enabled: Boolean(slug),
  });
  const article = query.data?.article;
  const title = article ? (locale === 'fa' ? article.title_fa : article.title_en) : '';
  const content = article ? (locale === 'fa' ? article.content_fa : article.content_en) : '';

  usePageMeta({
    title: article ? title : t('common.loading'),
    description: article
      ? (locale === 'fa' ? article.seo_description_fa : article.seo_description_en) ||
        (locale === 'fa' ? article.excerpt_fa : article.excerpt_en)
      : '',
    image: article?.image,
    type: 'article',
    jsonLd: article
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: locale === 'fa' ? article.excerpt_fa : article.excerpt_en,
          image: article.image ? `${window.location.origin}${article.image}` : undefined,
          datePublished: article.published_at,
          dateModified: article.updated_at,
          author: { '@type': 'Organization', name: article.author },
          publisher: { '@type': 'Organization', name: site.settings.brand.name },
        }
      : undefined,
  });

  if (query.isLoading) {
    return (
      <div className="shell max-w-4xl py-24">
        <div className="skeleton h-6 w-1/4" />
        <div className="skeleton mt-5 h-16 w-full" />
        <div className="skeleton mt-2 h-16 w-3/4" />
        <div className="skeleton mt-10 aspect-[16/8] w-full" />
      </div>
    );
  }
  if (query.isError || !article) {
    return (
      <div className="shell py-28 text-center">
        <h1>{t('common.error')}</h1>
        <p className="mt-3 text-sm text-muted">{t('common.errorBody')}</p>
        <LocalLink to="/blog" className="btn btn-dark mt-6">
          {t('nav.blog')}
        </LocalLink>
      </div>
    );
  }

  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(title);
  const shareLinks = [
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      icon: Linkedin,
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`,
      icon: Share2,
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${shareText}%20${shareUrl}`,
      icon: MessageCircle,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard may be unavailable; the URL is still visible in the browser.
    }
  };

  return (
    <>
      <article>
        <header className="bg-white pb-10 pt-12">
          <div className="shell max-w-4xl">
            <LocalLink to="/blog" className="link-arrow">
              <ArrowLeft size={14} className="rtl:rotate-180" /> {t('nav.blog')}
            </LocalLink>
            <div className="mt-7 flex flex-wrap items-center gap-2">
              <span className="tag">{locale === 'fa' ? article.category_name_fa : article.category_name_en}</span>
              <span className="article-meta">
                <time dateTime={article.published_at || article.created_at}>{formatDate(article.published_at || article.created_at)}</time>
                <span className="h-1 w-1 rounded-full bg-[#c0ccd8]" />
                <span className="inline-flex items-center gap-1"><Clock3 size={11} /> {t('common.readingTime', { count: article.reading_minutes })}</span>
              </span>
            </div>
            <h1 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-[1.07] tracking-[-0.045em] text-navy">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-[1rem] leading-8 text-muted">
              {locale === 'fa' ? article.excerpt_fa : article.excerpt_en}
            </p>
            <div className="mt-7 flex items-center justify-between gap-4 border-t border-line pt-5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-navy text-[0.66rem] font-bold text-white">FT</span>
                <div>
                  <div className="text-[0.7rem] font-semibold text-navy">{article.author}</div>
                  <div className="text-[0.6rem] text-muted">{t('blog.published')} · {formatDate(article.published_at || article.created_at)}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="me-1 hidden text-[0.62rem] text-muted sm:inline">{t('blog.share')}</span>
                {shareLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn social-btn-light"
                    aria-label={`${t('blog.share')} ${link.label}`}
                  >
                    <link.icon size={13} />
                  </a>
                ))}
                <button
                  type="button"
                  className="social-btn social-btn-light"
                  onClick={() => void copyLink()}
                  aria-label="Copy link"
                >
                  {copied ? <Check size={13} /> : <Link2 size={13} />}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="shell max-w-5xl">
          {article.image && (
            <img
              className="aspect-[16/8] w-full rounded-[18px] object-cover"
              src={article.image}
              alt={title}
              width="1400"
              height="700"
            />
          )}
        </div>

        <div className="shell max-w-3xl py-12">
          <Markdown content={content} />
          <div className="mt-10 flex flex-wrap gap-2 border-t border-line pt-6">
            <span className="me-2 text-[0.72rem] font-semibold text-navy">{t('blog.share')}:</span>
            {shareLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="chip">
                <link.icon size={13} /> {link.label}
              </a>
            ))}
          </div>
        </div>
      </article>

      {query.data?.related && query.data.related.length > 0 && (
        <section className="section bg-sky-50">
          <div className="shell">
            <h2 className="section-title">{t('blog.related')}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {query.data.related.map((item) => (
                <ArticleCard key={item.id} article={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
