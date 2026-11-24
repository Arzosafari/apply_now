import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LocalLink } from '@/lib/i18n';
import { Search, GraduationCap, MapPin, Languages, DollarSign, Clock, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';
import { PageHero } from '@/components/PageHero';
import { SectionHead } from '@/components/SectionHead';
import { CtaBand } from '@/components/CtaBand';
import { EmptyState } from '@/components/EmptyState';

interface StudyProgram {
  id: number;
  slug: string;
  country: string;
  country_display: string;
  data_source: string;
  course_name: string;
  course_name_short: string;
  academy: string;
  city: string;
  languages: string[];
  subject: string;
  tuition_fees: string;
  programme_duration: string;
  beginning: string;
  course_type: number;
  course_type_display: string;
  link: string;
  image: string;
  featured: boolean;
}

const COUNTRIES = [
  { value: 'all', label: 'All Countries' },
  { value: 'germany', label: 'Germany' },
  { value: 'canada', label: 'Canada' },
  { value: 'australia', label: 'Australia' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'usa', label: 'United States' },
  { value: 'netherlands', label: 'Netherlands' },
  { value: 'france', label: 'France' },
  { value: 'sweden', label: 'Sweden' },
  { value: 'norway', label: 'Norway' },
  { value: 'finland', label: 'Finland' },
  { value: 'denmark', label: 'Denmark' },
  { value: 'switzerland', label: 'Switzerland' },
  { value: 'ireland', label: 'Ireland' },
  { value: 'new_zealand', label: 'New Zealand' },
  { value: 'singapore', label: 'Singapore' },
  { value: 'japan', label: 'Japan' },
  { value: 'south_korea', label: 'South Korea' },
];

const PER_PAGE = 10;

export function StudyProgramsPage() {
  const { t, locale } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const countryParam = searchParams.get('country') || 'all';
  const pageParam = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const [programs, setPrograms] = useState<StudyProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState(countryParam);
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(pageParam);

  // Keep filters in sync when the URL changes (e.g. header dropdown links)
  useEffect(() => {
    setCountryFilter(countryParam);
    setPage(pageParam);
  }, [countryParam, pageParam]);

  const updateParams = (updates: { country?: string; page?: number }) => {
    const next = new URLSearchParams(searchParams);
    if (updates.country !== undefined) {
      if (updates.country === 'all') next.delete('country');
      else next.set('country', updates.country);
    }
    if (updates.page !== undefined) {
      if (updates.page <= 1) next.delete('page');
      else next.set('page', String(updates.page));
    }
    setSearchParams(next, { replace: true });
  };

  const handleCountryChange = (value: string) => {
    setCountryFilter(value);
    setPage(1);
    updateParams({ country: value, page: 1 });
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  usePageMeta({
    title: locale === 'fa' ? 'برنامه‌های تحصیلی بین‌المللی' : 'International Study Programs',
    description: locale === 'fa' 
      ? 'برنامه‌های تحصیلی معتبر دانشگاه‌های جهان' 
      : 'Accredited study programs from universities worldwide',
    image: '/images/world.jpg',
  });

  // Fetch programs on mount and when country filter changes
  useEffect(() => {
    setLoading(true);
    const url = countryFilter === 'all' 
      ? 'http://localhost:4000/api/public/study-programs'
      : `http://localhost:4000/api/public/study-programs?country=${countryFilter}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setPrograms(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching programs:', err);
        setLoading(false);
      });
  }, [countryFilter]);

  const courseTypes = useMemo(() => {
    const map = new Map<number, string>();
    programs.forEach(p => {
      if (p.course_type && p.course_type_display) {
        map.set(p.course_type, p.course_type_display);
      }
    });
    return ['all', ...Array.from(map.values())];
  }, [programs]);

  const filtered = programs.filter((program) => {
    const matchesSearch = !search || 
      program.course_name.toLowerCase().includes(search.toLowerCase()) ||
      program.academy.toLowerCase().includes(search.toLowerCase()) ||
      program.subject.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === 'all' || program.course_type_display === typeFilter;

    return matchesSearch && matchesType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pagedPrograms = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const goToPage = (next: number) => {
    const clamped = Math.max(1, Math.min(next, totalPages));
    setPage(clamped);
    updateParams({ page: clamped });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageNumbers = useMemo(() => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('...');
      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, safePage]);

  return (
    <>
      <PageHero
        eyebrow={locale === 'fa' ? 'برنامه‌های تحصیلی' : 'Study Programs'}
        title={locale === 'fa' ? 'برنامه‌های تحصیلی بین‌المللی' : 'International Study Programs'}
        intro={locale === 'fa' 
          ? 'برنامه‌های تحصیلی معتبر دانشگاه‌های جهان' 
          : 'Accredited study programs from universities worldwide'}
        image="/images/world.jpg"
        breadcrumbs={[{ label: locale === 'fa' ? 'برنامه‌ها' : 'Programs' }]}
      />

      <section className="section">
        <div className="shell">
          <div className="mb-8 flex flex-col gap-4 rounded-xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <select
                value={countryFilter}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="input !w-auto"
              >
                {COUNTRIES.map(country => (
                  <option key={country.value} value={country.value}>{country.label}</option>
                ))}
              </select>
              <select
                value={typeFilter}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="input !w-auto"
              >
                <option value="all">{locale === 'fa' ? 'همه انواع' : 'All Types'}</option>
                {courseTypes.slice(1).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <label className="relative block w-full sm:w-64">
              <span className="sr-only">{locale === 'fa' ? 'جستجو' : 'Search'}</span>
              <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#8fa1b5]" />
              <input
                className="input !ps-9"
                placeholder={locale === 'fa' ? 'جستجو در برنامه‌ها...' : 'Search programs...'}
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
              />
            </label>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center text-muted">{locale === 'fa' ? 'در حال بارگذاری...' : 'Loading...'}</div>
            </div>
          ) : filtered.length > 0 ? (
            <>
            <div className="grid gap-6">
              {pagedPrograms.map((program) => (
                <div key={program.id} className="card p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    {program.image && (
                      <div className="hidden h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:block">
                        <img
                          src={program.image}
                          alt={program.course_name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap gap-2">
                        <span className="chip bg-sky-50 text-sky-700">
                          <Globe size={12} className="mr-1 inline" />
                          {program.country_display}
                        </span>
                        <span className="chip chip-active">{program.course_type_display}</span>
                        {program.featured && (
                          <span className="chip bg-orange-50 text-orange-600">
                            {locale === 'fa' ? 'ویژه' : 'Featured'}
                          </span>
                        )}
                        {program.programme_duration && (
                          <span className="chip bg-sky-50 text-sky-700">
                            <Clock size={12} className="mr-1 inline" />
                            {program.programme_duration}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{program.course_name}</h3>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted">
                        <span className="flex items-center gap-1">
                          <GraduationCap size={14} />
                          {program.academy}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {program.city}
                        </span>
                        {program.languages && program.languages.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Languages size={14} />
                            {program.languages.join(', ')}
                          </span>
                        )}
                      </div>
                      {program.subject && (
                        <p className="mt-2 text-sm text-gray-600">{program.subject}</p>
                      )}
                      {program.tuition_fees && (
                        <p className="mt-2 text-sm">
                          <span className="flex items-center gap-1 text-green-600">
                            <DollarSign size={14} />
                            {program.tuition_fees}
                          </span>
                        </p>
                      )}
                      {program.slug && (
                        <LocalLink
                          to={`/study-programs/${program.slug}`}
                          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange hover:text-orange/80"
                        >
                          {locale === 'fa' ? 'مشاهده جزئیات' : 'View Details'}
                        </LocalLink>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage <= 1}
                  className="btn btn-outline btn-sm inline-flex items-center gap-1 disabled:opacity-40"
                  aria-label={locale === 'fa' ? 'قبلی' : 'Previous'}
                >
                  <ChevronLeft size={14} className="rtl:-scale-x-100" />
                  {locale === 'fa' ? 'قبلی' : 'Previous'}
                </button>
                {pageNumbers.map((num, idx) =>
                  num === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-muted">…</span>
                  ) : (
                    <button
                      key={num}
                      type="button"
                      onClick={() => goToPage(num)}
                      className={`btn btn-sm min-w-[2.25rem] ${num === safePage ? 'btn-primary' : 'btn-outline'}`}
                      aria-current={num === safePage ? 'page' : undefined}
                    >
                      {num}
                    </button>
                  ),
                )}
                <button
                  type="button"
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage >= totalPages}
                  className="btn btn-outline btn-sm inline-flex items-center gap-1 disabled:opacity-40"
                  aria-label={locale === 'fa' ? 'بعدی' : 'Next'}
                >
                  {locale === 'fa' ? 'بعدی' : 'Next'}
                  <ChevronRight size={14} className="rtl:-scale-x-100" />
                </button>
              </div>
            )}
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
