import { useMemo, useState } from 'react';
import { LocalLink } from '@/lib/i18n';
import { Search, GraduationCap, MapPin, Languages, DollarSign, Clock } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';
import { PageHero } from '@/components/PageHero';
import { SectionHead } from '@/components/SectionHead';
import { CtaBand } from '@/components/CtaBand';
import { EmptyState } from '@/components/EmptyState';

interface DAADProgram {
  id: number;
  slug: string;
  daad_id: number;
  course_name: string;
  course_name_short: string;
  academy: string;
  city: string;
  country: string;
  languages: string[];
  subject: string;
  tuition_fees: string;
  programme_duration: string;
  beginning: string;
  course_type: number;
  course_type_display: string;
  link: string;
  image: string;
}

export function DAADProgramsPage() {
  const { t, locale } = useLocale();
  const [programs, setPrograms] = useState<DAADProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  usePageMeta({
    title: locale === 'fa' ? 'برنامه‌های تحصیلی آلمان' : 'Study Programs in Germany',
    description: locale === 'fa' 
      ? 'برنامه‌های تحصیلی معتبر آلمان از طریق DAAD' 
      : 'Accredited study programs in Germany via DAAD',
    image: '/images/germany.jpg',
  });

  // Fetch programs on mount
  useState(() => {
    fetch('http://localhost:4000/api/public/daad-programs')
      .then(res => res.json())
      .then(data => {
        setPrograms(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching programs:', err);
        setLoading(false);
      });
  });

  const cities = useMemo(() => {
    const set = new Set<string>();
    programs.forEach(p => p.city && set.add(p.city));
    return ['all', ...Array.from(set).sort()];
  }, [programs]);

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
    
    const matchesCity = cityFilter === 'all' || program.city === cityFilter;
    const matchesType = typeFilter === 'all' || program.course_type_display === typeFilter;

    return matchesSearch && matchesCity && matchesType;
  });

  return (
    <>
      <PageHero
        eyebrow={locale === 'fa' ? 'برنامه‌های DAAD' : 'DAAD Programs'}
        title={locale === 'fa' ? 'برنامه‌های تحصیلی آلمان' : 'Study Programs in Germany'}
        intro={locale === 'fa' 
          ? 'برنامه‌های تحصیلی معتبر دانشگاه‌های آلمان از طریق DAAD' 
          : 'Accredited study programs from German universities via DAAD'}
        image="/images/germany.jpg"
        breadcrumbs={[{ label: locale === 'fa' ? 'برنامه‌ها' : 'Programs' }]}
      />

      <section className="section">
        <div className="shell">
          <div className="mb-8 flex flex-col gap-4 rounded-xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="input !w-auto"
              >
                <option value="all">{locale === 'fa' ? 'همه شهرها' : 'All Cities'}</option>
                {cities.slice(1).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
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
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center text-muted">{locale === 'fa' ? 'در حال بارگذاری...' : 'Loading...'}</div>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid gap-6">
              {filtered.map((program) => (
                <div key={program.id} className="card p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    {program.image && (
                      <div className="hidden h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:block">
                        <img
                          src={program.image.startsWith('http') ? program.image : `https://www2.daad.de${program.image}`}
                          alt={program.course_name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap gap-2">
                        <span className="chip chip-active">{program.course_type_display}</span>
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
                          {program.city}, {program.country}
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
                          to={`/daad-programs/${program.slug}`}
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
          ) : (
            <EmptyState />
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
