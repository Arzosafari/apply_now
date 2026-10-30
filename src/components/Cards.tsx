import { ArrowRight, Check, Clock3, MapPin, Star } from 'lucide-react';
import type { Article, Destination, Expert, Service, Testimonial } from '@shared/types';
import { LocalLink, useLocale } from '@/lib/i18n';
import { cn, initials } from '@/lib/utils';
import { ServiceIcon } from './ServiceIcon';

export function ServiceCard({ service, minimal = false }: { service: Service; minimal?: boolean }) {
  const { locale, t } = useLocale();
  const title = locale === 'fa' ? service.title_fa : service.title_en;
  const description = locale === 'fa' ? service.short_fa : service.short_en;
  return (
    <LocalLink to={`/services/${service.slug}`} className="service-card group" aria-label={title}>
      <span className="service-icon">
        <ServiceIcon name={service.icon} />
      </span>
      <span className="block text-[0.63rem] font-semibold uppercase tracking-[0.12em] text-[#97a8b9]">
        {locale === 'fa' ? service.category_fa : service.category_en}
      </span>
      <h3 className="mt-1.5">{title}</h3>
      {!minimal && <p>{description}</p>}
      <span className="link-arrow">
        {t('cta.learnMore')} <ArrowRight size={13} className="rtl:rotate-180" />
      </span>
    </LocalLink>
  );
}

export function DestinationCard({ destination }: { destination: Destination }) {
  const { locale, t } = useLocale();
  const name = locale === 'fa' ? destination.name_fa : destination.name_en;
  const tagline = locale === 'fa' ? destination.tagline_fa : destination.tagline_en;
  const pathways = [
    ...(destination.study_pathways_en || []).slice(0, 1).map(() => t('destinations.filterStudy')),
    ...(destination.work_pathways_en || []).slice(0, 1).map(() => t('destinations.filterWork')),
    ...(destination.pr_pathways_en || []).slice(0, 1).map(() => t('destinations.filterPr')),
  ];
  return (
    <LocalLink
      to={`/destinations/${destination.slug}`}
      className="destination-card card card-hover group block"
      aria-label={name}
    >
      <div className="destination-card-media">
        <img
          src={destination.image || '/images/hero-city.jpg'}
          alt={`${name} — ${tagline}`}
          loading="lazy"
          width="600"
          height="400"
        />
        <div className="absolute start-4 top-4 z-[1] flex items-center gap-2 rounded-full bg-white/90 py-1.5 pe-3 ps-1.5 text-[0.63rem] font-semibold text-navy backdrop-blur">
          <span className="flag-badge">
            <img src={destination.flag || ''} alt="" width="30" height="20" />
          </span>
          {destination.country_code}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[1.05rem] font-bold leading-tight">{name}</h3>
          <ArrowRight size={15} className="mt-1 text-[#9babbc] transition group-hover:translate-x-0.5 group-hover:text-orange rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
        </div>
        <p className="mt-1.5 text-[0.75rem] leading-6 text-muted">{tagline}</p>
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {[...new Set(pathways)].filter(Boolean).map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </LocalLink>
  );
}

export function ArticleCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  const { locale, t, formatDate } = useLocale();
  const title = locale === 'fa' ? article.title_fa : article.title_en;
  const excerpt = locale === 'fa' ? article.excerpt_fa : article.excerpt_en;
  const category = locale === 'fa' ? article.category_name_fa : article.category_name_en;
  const date = article.published_at || article.created_at;
  return (
    <LocalLink to={`/blog/${article.slug}`} className={cn('article-card card card-hover group', compact && 'flex-row')}>
      <div className={cn('article-card-image', compact && 'w-36 shrink-0 aspect-auto')}>
        <img src={article.image || '/images/blog-1.jpg'} alt={title} loading="lazy" width="700" height="440" />
        {category && <span className="absolute start-3 top-3 rounded-md bg-white/95 px-2 py-1 text-[0.6rem] font-bold text-navy">{category}</span>}
      </div>
      <div className="article-card-body">
        <div className="article-meta">
          <time dateTime={date}>{formatDate(date, { dateStyle: 'medium' })}</time>
          <span className="h-1 w-1 rounded-full bg-[#c0ccd8]" />
          <span className="inline-flex items-center gap-1">
            <Clock3 size={11} /> {t('common.readingTime', { count: article.reading_minutes })}
          </span>
        </div>
        <h3 className={compact ? 'text-[0.95rem]' : ''}>{title}</h3>
        {!compact && <p>{excerpt}</p>}
        <span className="link-arrow mt-4">
          {t('cta.readMore')} <ArrowRight size={13} className="rtl:rotate-180" />
        </span>
      </div>
    </LocalLink>
  );
}

export function ExpertCard({ expert }: { expert: Expert }) {
  const { locale, t } = useLocale();
  const role = locale === 'fa' ? expert.role_fa : expert.role_en;
  const expertise = locale === 'fa' ? expert.expertise_fa : expert.expertise_en;
  return (
    <LocalLink to={`/experts/${expert.slug}`} className="expert-card card card-hover group block">
      <div className="expert-photo">
        {expert.photo ? (
          <img src={expert.photo} alt={expert.name} loading="lazy" width="500" height="580" />
        ) : (
          <div className="grid h-full place-items-center text-3xl font-bold text-blue">{initials(expert.name)}</div>
        )}
        <span className="expert-badge">{role}</span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[1rem] leading-tight">{expert.name}</h3>
          {expert.is_demo && <span className="tag tag-orange">{t('common.demo')}</span>}
        </div>
        <p className="mt-2 flex items-start gap-1.5 text-[0.73rem] leading-6 text-muted">
          <MapPin size={12} className="mt-1.5 shrink-0 text-blue" />
          {expertise}
        </p>
      </div>
    </LocalLink>
  );
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { locale, t } = useLocale();
  const quote = locale === 'fa' ? testimonial.quote_fa : testimonial.quote_en;
  const service = locale === 'fa' ? testimonial.service_fa : testimonial.service_en;
  return (
    <article className="testimonial-card">
      <div className="flex items-start justify-between">
        <span className="quote-mark" aria-hidden="true">
          “
        </span>
        <div className="flex items-center gap-2">
          {testimonial.is_demo && <span className="tag tag-orange">{t('common.demo')}</span>}
          <span className="rating" aria-label={`${testimonial.rating} out of 5`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} size={11} fill={index < testimonial.rating ? 'currentColor' : 'none'} />
            ))}
          </span>
        </div>
      </div>
      <blockquote>{quote}</blockquote>
      <div className="flex items-center gap-3 border-t border-line pt-4">
        {testimonial.photo ? (
          <img className="avatar" src={testimonial.photo} alt="" loading="lazy" width="43" height="43" />
        ) : (
          <span className="avatar avatar-fallback">{initials(testimonial.name)}</span>
        )}
        <div>
          <div className="text-[0.78rem] font-semibold text-navy">{testimonial.name}</div>
          <div className="mt-0.5 text-[0.65rem] text-muted">
            {service} · {testimonial.country}
          </div>
        </div>
      </div>
    </article>
  );
}

export function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="pathway-list">
      {items.map((item) => (
        <li key={item}>
          <span className="bullet">
            <Check size={11} strokeWidth={2.5} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
