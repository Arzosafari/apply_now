import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLink, GraduationCap, MapPin, Languages, DollarSign, Clock, Calendar, FileText, Users, Phone, Mail, Globe } from 'lucide-react';
import { useLocale, LocalLink } from '@/lib/i18n';
import { usePageMeta } from '@/lib/seo';
import { PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { LoadingScreen } from '@/components/LoadingScreen';

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
  application_deadline: string;
  course_type: number;
  course_type_display: string;
  link: string;
  image: string;
  description: string;
  admission_requirements: string;
  language_requirements: string;
  application_documents: string;
  living_costs: string;
  scholarship_info: string;
  contact_info: string;
}

export function StudyProgramDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, locale } = useLocale();
  const [program, setProgram] = useState<StudyProgram | null>(null);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: program?.course_name || locale === 'fa' ? 'برنامه تحصیلی' : 'Study Program',
    description: program?.description || locale === 'fa' 
      ? 'جزئیات برنامه تحصیلی' 
      : 'Study program details',
    image: program?.image || '/images/world.jpg',
  });

  useEffect(() => {
    if (!slug) return;

    fetch(`http://localhost:4000/api/public/study-programs/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Program not found');
        return res.json();
      })
      .then(data => {
        setProgram(data.item);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching program:', err);
        setLoading(false);
        navigate('/study-programs');
      });
  }, [slug, navigate]);

  if (loading) return <LoadingScreen />;
  if (!program) return null;

  return (
    <>
      <PageHero
        eyebrow={`${program.country_display} - ${program.course_type_display}`}
        title={program.course_name}
        intro={program.academy}
        image={program.image}
        breadcrumbs={[
          { label: locale === 'fa' ? 'برنامه‌ها' : 'Programs', to: '/study-programs' },
          { label: program.course_name_short || program.course_name },
        ]}
      />

      <section className="section">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="card p-6">
                <h2 className="mb-4 text-xl font-semibold">
                  {locale === 'fa' ? 'اطلاعات کلی' : 'Program Information'}
                </h2>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Globe size={18} className="mt-1 shrink-0 text-sky-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{locale === 'fa' ? 'کشور' : 'Country'}</p>
                      <p className="text-sm text-gray-600">{program.country_display}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <GraduationCap size={18} className="mt-1 shrink-0 text-sky-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{locale === 'fa' ? 'دانشگاه' : 'University'}</p>
                      <p className="text-sm text-gray-600">{program.academy}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="mt-1 shrink-0 text-sky-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{locale === 'fa' ? 'مکان' : 'Location'}</p>
                      <p className="text-sm text-gray-600">{program.city}</p>
                    </div>
                  </div>
                  
                  {program.languages && program.languages.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Languages size={18} className="mt-1 shrink-0 text-sky-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{locale === 'fa' ? 'زبان آموزش' : 'Language'}</p>
                        <p className="text-sm text-gray-600">{program.languages.join(', ')}</p>
                      </div>
                    </div>
                  )}
                  
                  {program.programme_duration && (
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="mt-1 shrink-0 text-sky-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{locale === 'fa' ? 'مدت دوره' : 'Duration'}</p>
                        <p className="text-sm text-gray-600">{program.programme_duration}</p>
                      </div>
                    </div>
                  )}
                  
                  {program.beginning && (
                    <div className="flex items-start gap-3">
                      <Calendar size={18} className="mt-1 shrink-0 text-sky-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{locale === 'fa' ? 'شروع دوره' : 'Start Date'}</p>
                        <p className="text-sm text-gray-600">{program.beginning}</p>
                      </div>
                    </div>
                  )}
                  
                  {program.tuition_fees && (
                    <div className="flex items-start gap-3">
                      <DollarSign size={18} className="mt-1 shrink-0 text-sky-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{locale === 'fa' ? 'شهریه' : 'Tuition Fees'}</p>
                        <p className="text-sm text-gray-600">{program.tuition_fees}</p>
                      </div>
                    </div>
                  )}
                </div>

                {program.subject && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="mb-2 font-semibold text-gray-900">{locale === 'fa' ? 'رشته تحصیلی' : 'Subject'}</h3>
                    <p className="text-sm text-gray-600">{program.subject}</p>
                  </div>
                )}

                {program.application_deadline && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="mb-2 font-semibold text-gray-900">{locale === 'fa' ? 'آخرین مهلت ثبت‌نام' : 'Application Deadline'}</h3>
                    <p className="text-sm text-gray-600">{program.application_deadline}</p>
                  </div>
                )}

                {program.description && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="mb-2 font-semibold text-gray-900">{locale === 'fa' ? 'توضیحات' : 'Description'}</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{program.description}</p>
                  </div>
                )}

                {program.admission_requirements && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                      <FileText size={18} className="text-sky-600" />
                      {locale === 'fa' ? 'شرایط پذیرش' : 'Admission Requirements'}
                    </h3>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{program.admission_requirements}</p>
                  </div>
                )}

                {program.language_requirements && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                      <Languages size={18} className="text-sky-600" />
                      {locale === 'fa' ? 'شرایط زبان' : 'Language Requirements'}
                    </h3>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{program.language_requirements}</p>
                  </div>
                )}

                {program.application_documents && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                      <FileText size={18} className="text-sky-600" />
                      {locale === 'fa' ? 'مدارک مورد نیاز' : 'Required Documents'}
                    </h3>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{program.application_documents}</p>
                  </div>
                )}

                {program.living_costs && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                      <DollarSign size={18} className="text-sky-600" />
                      {locale === 'fa' ? 'هزینه‌های زندگی' : 'Living Costs'}
                    </h3>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{program.living_costs}</p>
                  </div>
                )}

                {program.scholarship_info && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                      <Users size={18} className="text-sky-600" />
                      {locale === 'fa' ? 'اطلاعات بورسیه' : 'Scholarship Information'}
                    </h3>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{program.scholarship_info}</p>
                  </div>
                )}

                {program.contact_info && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                      <Phone size={18} className="text-sky-600" />
                      {locale === 'fa' ? 'اطلاعات تماس' : 'Contact Information'}
                    </h3>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{program.contact_info}</p>
                  </div>
                )}

                {program.link && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <a
                      href={program.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-100"
                    >
                      {locale === 'fa' ? 'مشاهده در سایت منبع' : 'View on Source Website'} <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="card p-6">
                <h3 className="mb-4 font-semibold text-gray-900">
                  {locale === 'fa' ? 'به دنبال مشاوره هستید؟' : 'Need Consultation?'}
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  {locale === 'fa' 
                    ? 'برای اطلاعات بیشتر در مورد این برنامه تحصیلی و راهنمایی در فرآیند درخواست، با مشاوران ما تماس بگیرید.' 
                    : 'For more information about this study program and guidance on the application process, contact our advisors.'}
                </p>
                <LocalLink
                  to="/consultation"
                  className="btn btn-primary w-full"
                >
                  {locale === 'fa' ? 'رزرو مشاوره رایگان' : 'Book Free Consultation'}
                </LocalLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
