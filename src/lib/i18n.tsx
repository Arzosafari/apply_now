import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { Locale } from '@shared/types';

const dictionary = {
  'nav.home': { en: 'Home', fa: 'خانه' },
  'nav.services': { en: 'Services', fa: 'خدمات' },
  'nav.destinations': { en: 'Destinations', fa: 'مقاصد' },
  'nav.pricing': { en: 'Pricing', fa: 'قیمت‌ها' },
  'nav.experts': { en: 'Our Experts', fa: 'کارشناسان' },
  'nav.blog': { en: 'Blog', fa: 'وبلاگ' },
  'nav.about': { en: 'About Us', fa: 'درباره ما' },
  'nav.contact': { en: 'Contact Us', fa: 'تماس با ما' },
  'nav.faq': { en: 'FAQ', fa: 'پرسش‌های متداول' },
  'nav.admin': { en: 'Admin', fa: 'مدیریت' },
  'nav.menu': { en: 'Menu', fa: 'منو' },
  'nav.close': { en: 'Close menu', fa: 'بستن منو' },
  'nav.language': { en: 'Language', fa: 'زبان' },
  'nav.switchToEnglish': { en: 'Switch to English', fa: 'تغییر زبان به انگلیسی' },
  'nav.switchToPersian': { en: 'Switch to Persian', fa: 'تغییر زبان به فارسی' },
  'nav.viewAll': { en: 'View all', fa: 'مشاهده همه' },
  'cta.free': { en: 'Free Consultation', fa: 'مشاوره رایگان' },
  'cta.book': { en: 'Book a consultation', fa: 'رزرو مشاوره' },
  'cta.bookCompact': { en: 'Book consult', fa: 'رزرو مشاوره' },
  'cta.getStarted': { en: 'Get Free Consultation', fa: 'دریافت مشاوره رایگان' },
  'cta.explore': { en: 'Explore Our Services', fa: 'مشاهده خدمات' },
  'cta.exploreDestinations': { en: 'Explore destinations', fa: 'مشاهده مقاصد' },
  'cta.talk': { en: 'Talk to an advisor', fa: 'گفت‌وگو با مشاور' },
  'cta.learnMore': { en: 'Learn more', fa: 'بیشتر بدانید' },
  'cta.readMore': { en: 'Read article', fa: 'خواندن مقاله' },
  'cta.exploreCountry': { en: 'Explore country', fa: 'مشاهده کشور' },
  'cta.viewProfile': { en: 'View profile', fa: 'مشاهده پروفایل' },
  'common.loading': { en: 'Loading…', fa: 'در حال بارگذاری…' },
  'common.error': { en: 'Something went wrong', fa: 'مشکلی پیش آمد' },
  'common.errorBody': { en: 'We could not load this section. Please try again.', fa: 'بارگذاری این بخش ممکن نشد. دوباره تلاش کنید.' },
  'common.retry': { en: 'Try again', fa: 'تلاش مجدد' },
  'common.search': { en: 'Search', fa: 'جست‌وجو' },
  'common.searchPlaceholder': { en: 'Search…', fa: 'جست‌وجو…' },
  'common.filter': { en: 'Filter', fa: 'فیلتر' },
  'common.all': { en: 'All', fa: 'همه' },
  'common.demo': { en: 'Sample', fa: 'نمونه' },
  'common.readMore': { en: 'Read more', fa: 'ادامه مطلب' },
  'common.showMore': { en: 'Show more', fa: 'بیشتر' },
  'common.showLess': { en: 'Show less', fa: 'کمتر' },
  'common.required': { en: 'Required', fa: 'الزامی' },
  'common.optional': { en: 'Optional', fa: 'اختیاری' },
  'common.noResults': { en: 'No results found', fa: 'نتیجه‌ای پیدا نشد' },
  'common.noResultsBody': { en: 'Try a different search or filter.', fa: 'جست‌وجو یا فیلتر دیگری را امتحان کنید.' },
  'common.page': { en: 'Page', fa: 'صفحه' },
  'common.previous': { en: 'Previous', fa: 'قبلی' },
  'common.next': { en: 'Next', fa: 'بعدی' },
  'common.minutes': { en: 'min read', fa: 'دقیقه مطالعه' },
  'common.readingTime': { en: '{count} min read', fa: '{count} دقیقه مطالعه' },
  'common.notConfigured': { en: 'To be configured', fa: 'در انتظار پیکربندی' },
  'common.demoNotice': {
    en: 'Frontend preview — sample data only. Forms are not sent; do not enter real personal information.',
    fa: 'پیش‌نمایش رابط کاربری — فقط داده نمونه. فرم‌ها ارسال نمی‌شوند؛ اطلاعات شخصی واقعی وارد نکنید.',
  },
  'common.demoLabel': { en: 'Demonstration content', fa: 'محتوای نمایشی' },
  'common.officialNotice': {
    en: 'Immigration rules and fees change. Verify every requirement with the official authority before applying or paying.',
    fa: 'قوانین و هزینه‌های مهاجرت تغییر می‌کنند. پیش از درخواست یا پرداخت، همه الزامات را با مرجع رسمی تأیید کنید.',
  },
  'home.eyebrow': { en: 'Study · Work · Live · Abroad', fa: 'تحصیل · کار · زندگی · خارج از کشور' },
  'home.title1': { en: 'Your Global Journey', fa: 'سفر جهانی شما' },
  'home.title2': { en: 'Starts Here', fa: 'از اینجا آغاز می‌شود' },
  'home.supporting': { en: 'Turn your dreams into reality.', fa: 'رؤیاهای خود را به واقعیت تبدیل کنید.' },
  'home.description': {
    en: 'Discover international education and immigration opportunities with personalised guidance and professional support at every step of your journey.',
    fa: 'فرصت‌های تحصیل و مهاجرت بین‌المللی را با راهنمایی شخصی و پشتیبانی حرفه‌ای در هر مرحله از مسیر خود کشف کنید.',
  },
  'home.trust': { en: 'Independent guidance · Clear information · Realistic plans', fa: 'راهنمایی مستقل · اطلاعات شفاف · برنامه‌های واقع‌بینانه' },
  'home.destinationsEyebrow': { en: 'Where will you go?', fa: 'کجا خواهید رفت؟' },
  'home.destinationsTitle': { en: 'Popular destinations', fa: 'مقاصد محبوب' },
  'home.destinationsIntro': {
    en: 'Compare countries by education, work and settlement pathways — not by slogans.',
    fa: 'کشورها را بر اساس تحصیل، کار و مسیرهای اسکان مقایسه کنید، نه بر اساس شعار.',
  },
  'home.servicesEyebrow': { en: 'How we help', fa: 'چگونه کمک می‌کنیم' },
  'home.servicesTitle': { en: 'Comprehensive immigration services', fa: 'خدمات جامع مهاجرت' },
  'home.servicesIntro': {
    en: 'From the first conversation to your arrival checklist, every step has a clear owner and purpose.',
    fa: 'از نخستین گفت‌وگو تا چک‌لیست ورود، هر گام مالک و هدف روشنی دارد.',
  },
  'home.servicePromoTitle': { en: 'Not sure where to begin?', fa: 'نمی‌دانید از کجا شروع کنید؟' },
  'home.servicePromoBody': {
    en: 'Start with a short profile review. We will tell you what is realistic, what is missing and what to do next.',
    fa: 'با یک بررسی کوتاه پروفایل شروع کنید. می‌گوییم چه چیزی واقع‌بینانه است، چه چیزی کم است و گام بعدی چیست.',
  },
  'home.whyEyebrow': { en: 'Why Apply Now', fa: 'چرا Apply Now' },
  'home.whyTitle': { en: 'Clarity is the foundation of a good immigration plan.', fa: 'شفافیت، پایه یک برنامه مهاجرتی خوب است.' },
  'home.whyBody': {
    en: 'Immigration is a high-stakes decision. You deserve straight answers, a documented process and an adviser who tells you when a route is not right for you.',
    fa: 'مهاجرت تصمیمی پرریسک است. شما سزاوار پاسخ‌های صریح، فرایندی مستند و مشاوری هستید که بگوید چه زمانی یک مسیر برای شما مناسب نیست.',
  },
  'home.why1Title': { en: 'Official-source first', fa: 'اولویت منابع رسمی' },
  'home.why1Body': { en: 'Guidance is checked against current government and institutional requirements.', fa: 'راهنمایی بر اساس الزامات به‌روز دولت و مؤسسه بررسی می‌شود.' },
  'home.why2Title': { en: 'Personalised, not packaged', fa: 'شخصی‌سازی‌شده، نه بسته‌ای' },
  'home.why2Body': { en: 'Your profile, budget and family situation determine the plan.', fa: 'پروفایل، بودجه و وضعیت خانوادگی شما برنامه را تعیین می‌کند.' },
  'home.why3Title': { en: 'Transparent boundaries', fa: 'مرزهای شفاف' },
  'home.why3Body': { en: 'We explain what is included, what is not, and what no adviser can guarantee.', fa: 'توضیح می‌دهیم چه چیزی شامل است، چه چیزی نیست و هیچ مشاوری چه چیزی را نمی‌تواند تضمین کند.' },
  'home.why4Title': { en: 'Documents that agree', fa: 'مدارک هماهنگ' },
  'home.why4Body': { en: 'We check consistency across academic, financial and identity evidence.', fa: 'هماهنگی مدارک تحصیلی، مالی و هویتی را بررسی می‌کنیم.' },
  'home.why5Title': { en: 'One point of contact', fa: 'یک نقطه ارتباط' },
  'home.why5Body': { en: 'A named adviser coordinates your case and keeps next steps visible.', fa: 'یک مشاور مشخص پرونده شما را هماهنگ می‌کند و گام‌های بعدی را روشن نگه می‌دارد.' },
  'home.why6Title': { en: 'No false promises', fa: 'بدون وعده‌های نادرست' },
  'home.why6Body': { en: 'No guaranteed visas, invented success rates or fabricated documents.', fa: 'بدون ویزای تضمینی، نرخ موفقیت ساختگی یا مدارک جعلی.' },
  'home.adviceEyebrow': { en: 'A better first conversation', fa: 'یک گفت‌وگوی اولیه بهتر' },
  'home.adviceTitle': { en: 'Bring the questions you have been afraid to ask.', fa: 'پرسش‌هایی را بیاورید که از پرسیدنشان می‌ترسیدید.' },
  'home.adviceBody': {
    en: 'We will look at your profile honestly, explain the trade-offs and give you a practical next-step list — whether or not you decide to work with us.',
    fa: 'پروفایل شما را صادقانه بررسی می‌کنیم، بده‌بستان‌ها را توضیح می‌دهیم و فهرست گام‌های عملی می‌دهیم — چه با ما ادامه دهید چه نه.',
  },
  'home.expertsEyebrow': { en: 'The people behind the guidance', fa: 'افراد پشت راهنمایی' },
  'home.expertsTitle': { en: 'Meet our consultants', fa: 'با مشاوران ما آشنا شوید' },
  'home.expertsIntro': { en: 'Explore our consultants’ profiles and areas of expertise.', fa: 'با پروفایل و حوزه‌های تخصصی مشاوران ما آشنا شوید.' },
  'home.expertsViewAll': { en: 'View all consultants', fa: 'مشاهده همه مشاوران' },
  'home.expertsDemoNote': {
    en: 'Profiles marked Sample are illustrative and must be replaced with verified team information before launch.',
    fa: 'پروفایل‌های نشان‌دار نمونه هستند و پیش از انتشار باید با اطلاعات تأییدشده تیم جایگزین شوند.',
  },
  'home.processEyebrow': { en: 'A clear path', fa: 'مسیری روشن' },
  'home.processTitle': { en: 'How your journey works', fa: 'سفر شما چگونه پیش می‌رود' },
  'home.processIntro': {
    en: 'Four structured stages, with a decision point before you commit to fees or applications.',
    fa: 'چهار مرحله ساختارمند، با یک نقطه تصمیم پیش از تعهد به هزینه یا درخواست.',
  },
  'home.process1Title': { en: 'Initial consultation', fa: 'مشاوره اولیه' },
  'home.process1Body': { en: 'We listen to your goals, timeline, budget and constraints.', fa: 'به اهداف، زمان‌بندی، بودجه و محدودیت‌های شما گوش می‌دهیم.' },
  'home.process2Title': { en: 'Assessment & strategy', fa: 'ارزیابی و استراتژی' },
  'home.process2Body': { en: 'We compare routes, evidence gaps and realistic scenarios.', fa: 'مسیرها، شکاف مدارک و سناریوهای واقع‌بینانه را مقایسه می‌کنیم.' },
  'home.process3Title': { en: 'Document preparation', fa: 'آماده‌سازی مدارک' },
  'home.process3Body': { en: 'We build an organised, consistent and verifiable file.', fa: 'پرونده‌ای منظم، هماهنگ و قابل راستی‌آزمایی می‌سازیم.' },
  'home.process4Title': { en: 'Application guidance', fa: 'راهنمایی درخواست' },
  'home.process4Body': { en: 'We support submission, follow-up and the next practical steps.', fa: 'از ارسال، پیگیری و گام‌های عملی بعدی پشتیبانی می‌کنیم.' },
  'home.storiesEyebrow': { en: 'Client experience', fa: 'تجربه متقاضیان' },
  'home.storiesTitle': { en: 'Stories from the journey', fa: 'روایت‌هایی از مسیر' },
  'home.storiesNote': {
    en: 'Testimonials marked Sample are illustrative. Replace them with real, consented client stories before launch.',
    fa: 'نظرات نشان‌دار نمونه هستند و پیش از انتشار باید با روایت‌های واقعی و با رضایت متقاضیان جایگزین شوند.',
  },
  'carousel.role': { en: 'carousel', fa: 'چرخ‌نما' },
  'carousel.slide': { en: 'slide', fa: 'اسلاید' },
  'carousel.hint': { en: 'Swipe or drag to explore', fa: 'برای دیدن بیشتر، ورق بزنید' },
  'carousel.trackLabel': { en: 'Cards; use the arrow keys to browse', fa: 'کارت‌ها؛ برای مرور از کلیدهای جهت‌نما استفاده کنید' },
  'carousel.previous': { en: 'Previous slide', fa: 'اسلاید قبلی' },
  'carousel.next': { en: 'Next slide', fa: 'اسلاید بعدی' },
  'carousel.status': { en: 'View {current} of {total}', fa: 'نمای {current} از {total}' },
  'home.insightsEyebrow': { en: 'Insights', fa: 'بینش‌ها' },
  'home.insightsTitle': { en: 'Latest news & articles', fa: 'آخرین اخبار و مقالات' },
  'home.insightsIntro': { en: 'Practical guides, without the noise.', fa: 'راهنماهای کاربردی، بدون حاشیه.' },
  'home.faqEyebrow': { en: 'Questions, answered', fa: 'پاسخ پرسش‌ها' },
  'home.faqTitle': { en: 'Frequently asked questions', fa: 'پرسش‌های متداول' },
  'home.faqIntro': { en: 'The things applicants ask us before they begin.', fa: 'پرسش‌هایی که متقاضیان پیش از شروع می‌پرسند.' },
  'home.faqMore': { en: 'See all FAQs', fa: 'مشاهده همه پرسش‌ها' },
  'home.ctaTitle': { en: 'Ready to start your immigration journey?', fa: 'آماده شروع سفر مهاجرتی خود هستید؟' },
  'home.ctaBody': {
    en: 'Take the first step toward your international future. Our experts are ready to help.',
    fa: 'نخستین گام را به سوی آینده بین‌المللی خود بردارید. کارشناسان ما آماده کمک هستند.',
  },
  'footer.statement': {
    en: 'Clear guidance for international education, work and settlement. We help you understand the route — the decision remains with the official authority.',
    fa: 'راهنمایی شفاف برای تحصیل، کار و اسکان بین‌المللی. ما به شناخت مسیر کمک می‌کنیم — تصمیم نهایی با مرجع رسمی است.',
  },
  'footer.quickLinks': { en: 'Explore', fa: 'کاوش' },
  'footer.services': { en: 'Services', fa: 'خدمات' },
  'footer.destinations': { en: 'Destinations', fa: 'مقاصد' },
  'footer.contact': { en: 'Get in touch', fa: 'ارتباط با ما' },
  'footer.legal': { en: 'Legal', fa: 'حقوقی' },
  'footer.privacy': { en: 'Privacy Policy', fa: 'سیاست حریم خصوصی' },
  'footer.terms': { en: 'Terms & Conditions', fa: 'شرایط و قوانین' },
  'footer.rights': { en: 'All rights reserved.', fa: 'همه حقوق محفوظ است.' },
  'footer.disclaimer': { en: 'General information only — not legal advice.', fa: 'فقط اطلاعات عمومی — مشاوره حقوقی نیست.' },
  'footer.adminAccess': { en: 'Admin portal', fa: 'پورتال مدیریت' },
  'services.eyebrow': { en: 'What we do', fa: 'آنچه انجام می‌دهیم' },
  'services.title': { en: 'Services built around your next step', fa: 'خدماتی برای گام بعدی شما' },
  'services.intro': {
    en: 'Practical, transparent support for study, work, family and long-term settlement. Choose a starting point — we will help you test whether it fits.',
    fa: 'پشتیبانی کاربردی و شفاف برای تحصیل، کار، خانواده و اسکان بلندمدت. نقطه شروع را انتخاب کنید — کمک می‌کنیم تناسب آن را بسنجید.',
  },
  'services.all': { en: 'All services', fa: 'همه خدمات' },
  'services.available': { en: 'Available for consultation', fa: 'قابل مشاوره' },
  'services.ctaTitle': { en: 'Not sure which service fits?', fa: 'مطمئن نیستید کدام خدمت مناسب است؟' },
  'services.ctaBody': { en: 'A short consultation will narrow the options and save you from avoidable applications.', fa: 'یک مشاوره کوتاه گزینه‌ها را محدود می‌کند و از درخواست‌های غیرضروری جلوگیری می‌کند.' },
  'service.overview': { en: 'Overview', fa: 'مرور کلی' },
  'service.eligibility': { en: 'Who this is for', fa: 'این خدمت برای چه کسانی است' },
  'service.documents': { en: 'Typical documents', fa: 'مدارک معمول' },
  'service.process': { en: 'How the process works', fa: 'فرایند کار' },
  'service.timeline': { en: 'Planning window', fa: 'بازه برنامه‌ریزی' },
  'service.considerations': { en: 'Important considerations', fa: 'ملاحظات مهم' },
  'service.faq': { en: 'Service questions', fa: 'پرسش‌های این خدمت' },
  'service.related': { en: 'Related services', fa: 'خدمات مرتبط' },
  'service.request': { en: 'Request consultation for this service', fa: 'درخواست مشاوره برای این خدمت' },
  'service.sidebarTitle': { en: 'Start with a conversation', fa: 'با یک گفت‌وگو شروع کنید' },
  'service.sidebarBody': { en: 'Tell us where you are now. We will explain the realistic options before you commit.', fa: 'بگویید اکنون کجا هستید. پیش از هر تعهد، گزینه‌های واقع‌بینانه را توضیح می‌دهیم.' },
  'service.consideration1': { en: 'Eligibility and official requirements can change without notice.', fa: 'شرایط و الزامات رسمی ممکن است بدون اطلاع تغییر کنند.' },
  'service.consideration2': { en: 'Government fees, translations, tests and third-party costs are separate unless stated.', fa: 'هزینه‌های دولتی، ترجمه، آزمون و شخص ثالث جدا هستند مگر ذکر شود.' },
  'service.consideration3': { en: 'No consultant or agency can guarantee a visa, admission or processing time.', fa: 'هیچ مشاور یا آژانسی نمی‌تواند ویزا، پذیرش یا زمان پردازش را تضمین کند.' },
  'destinations.eyebrow': { en: 'Choose a destination', fa: 'یک مقصد انتخاب کنید' },
  'destinations.title': { en: 'Countries, compared clearly', fa: 'مقایسه شفاف کشورها' },
  'destinations.intro': { en: 'Explore education, work, family and settlement pathways. Each page explains what must be verified before you apply.', fa: 'مسیرهای تحصیل، کار، خانواده و اسکان را بررسی کنید. هر صفحه توضیح می‌دهد چه چیزی باید پیش از درخواست تأیید شود.' },
  'destinations.search': { en: 'Search countries', fa: 'جست‌وجوی کشورها' },
  'destinations.filterStudy': { en: 'Study', fa: 'تحصیل' },
  'destinations.filterWork': { en: 'Work', fa: 'کار' },
  'destinations.filterPr': { en: 'Permanent residency', fa: 'اقامت دائمی' },
  'destinations.filterFamily': { en: 'Family', fa: 'خانواده' },
  'destinations.filterInvestment': { en: 'Investment', fa: 'سرمایه‌گذاری' },
  'destination.overview': { en: 'Country overview', fa: 'مرور کشور' },
  'destination.education': { en: 'Education opportunities', fa: 'فرصت‌های تحصیلی' },
  'destination.universities': { en: 'Selected institutions', fa: 'مؤسسات منتخب' },
  'destination.pathways': { en: 'Immigration pathways', fa: 'مسیرهای مهاجرت' },
  'destination.study': { en: 'Study pathways', fa: 'مسیرهای تحصیل' },
  'destination.work': { en: 'Work pathways', fa: 'مسیرهای کار' },
  'destination.pr': { en: 'Permanent residency', fa: 'اقامت دائمی' },
  'destination.family': { en: 'Family options', fa: 'گزینه‌های خانوادگی' },
  'destination.investment': { en: 'Business & investment', fa: 'کسب‌وکار و سرمایه‌گذاری' },
  'destination.eligibility': { en: 'Eligibility snapshot', fa: 'نمای کلی شرایط' },
  'destination.documents': { en: 'Documents to prepare', fa: 'مدارک لازم' },
  'destination.process': { en: 'Application journey', fa: 'مسیر درخواست' },
  'destination.quickFacts': { en: 'Quick facts', fa: 'نکات کوتاه' },
  'destination.relatedServices': { en: 'Services for this destination', fa: 'خدمات مرتبط با این مقصد' },
  'destination.relatedArticles': { en: 'Related reading', fa: 'مطالب مرتبط' },
  'destination.ctaTitle': { en: 'Plan your route with a specialist', fa: 'مسیر خود را با یک متخصص برنامه‌ریزی کنید' },
  'destination.ctaBody': { en: 'We will review your profile against the latest published requirements and explain the gaps.', fa: 'پروفایل شما را با آخرین الزامات منتشرشده بررسی می‌کنیم و شکاف‌ها را توضیح می‌دهیم.' },
  'pricing.eyebrow': { en: 'Transparent pricing', fa: 'قیمت‌گذاری شفاف' },
  'pricing.title': { en: 'Choose the support that fits', fa: 'پشتیبانی مناسب خود را انتخاب کنید' },
  'pricing.intro': { en: 'Clear starting points, editable by the Apply Now team. Government fees and third-party costs are separate unless stated.', fa: 'نقاط شروع شفاف که تیم Apply Now آن را مدیریت می‌کند. هزینه‌های دولتی و شخص ثالث جدا هستند مگر ذکر شود.' },
  'pricing.featured': { en: 'Featured', fa: 'ویژه' },
  'pricing.included': { en: 'What is included', fa: 'چه چیزی شامل است' },
  'pricing.excluded': { en: 'Not included', fa: 'شامل نمی‌شود' },
  'pricing.noPayment': { en: 'Demo only: no consultation is booked and online payment is unavailable.', fa: 'فقط نمایشی: مشاوره‌ای رزرو نمی‌شود و پرداخت آنلاین در دسترس نیست.' },
  'pricing.demoNote': { en: 'Sample pricing for layout preview. The Apply Now team must confirm every amount before publication.', fa: 'قیمت نمونه برای پیش‌نمایش. تیم Apply Now باید همه مبالغ را پیش از انتشار تأیید کند.' },
  'pricing.customTitle': { en: 'Need a different scope?', fa: 'دامنه متفاوتی نیاز دارید؟' },
  'pricing.customBody': { en: 'Complex profiles and multi-person applications are scoped individually after a review.', fa: 'پرونده‌های پیچیده و درخواست‌های چندنفره پس از بررسی به‌صورت جداگانه تعیین می‌شوند.' },
  'experts.eyebrow': { en: 'The people behind the guidance', fa: 'افراد پشت راهنمایی' },
  'experts.title': { en: 'Meet the sample adviser team', fa: 'با تیم مشاوران نمونه آشنا شوید' },
  'experts.intro': { en: 'Explore example profile layouts. Team members and qualifications must be verified before publication.', fa: 'چیدمان پروفایل‌های نمونه را ببینید. اعضا و صلاحیت‌های تیم باید پیش از انتشار تأیید شوند.' },
  'experts.demo': { en: 'Sample profile — replace in the admin portal', fa: 'پروفایل نمونه — در پنل مدیریت جایگزین شود' },
  'experts.expertise': { en: 'Expertise', fa: 'تخصص' },
  'experts.languages': { en: 'Languages', fa: 'زبان‌ها' },
  'experts.bio': { en: 'Profile', fa: 'پروفایل' },
  'experts.ctaTitle': { en: 'Work with someone who will tell you the truth', fa: 'با کسی کار کنید که حقیقت را به شما می‌گوید' },
  'about.eyebrow': { en: 'About Apply Now', fa: 'درباره Apply Now' },
  'about.title': { en: 'Guidance for a life beyond borders', fa: 'راهنمایی برای زندگی فراتر از مرزها' },
  'about.intro': { en: 'Apply Now helps individuals and families make informed decisions about study, work and settlement abroad.', fa: 'Apply Now به افراد و خانواده‌ها کمک می‌کند درباره تحصیل، کار و اسکان در خارج تصمیم آگاهانه بگیرند.' },
  'about.storyTitle': { en: 'Why we exist', fa: 'چرا وجود داریم' },
  'about.story1': { en: 'International migration is often presented as a choice between a dream and a form. The reality is more complicated: eligibility, evidence, timing, funding and family circumstances all matter.', fa: 'مهاجرت بین‌المللی اغلب مانند انتخاب بین یک رؤیا و یک فرم نمایش داده می‌شود. واقعیت پیچیده‌تر است: شرایط، مدارک، زمان‌بندی، تأمین مالی و وضعیت خانواده همه مهم‌اند.' },
  'about.story2': { en: 'We built Apply Now around a different standard: explain the route before selling the service, show the source before making a claim, and put the client’s long-term interest ahead of a quick application.', fa: 'Apply Now را با معیاری متفاوت ساختیم: پیش از فروش خدمت مسیر را توضیح دهیم، پیش از ادعا منبع را نشان دهیم و منافع بلندمدت متقاضی را بر درخواست عجولانه مقدم بدانیم.' },
  'about.mission': { en: 'Our mission', fa: 'مأموریت ما' },
  'about.missionBody': { en: 'Make international mobility decisions more understandable, more honest and better documented.', fa: 'تصمیم‌های تحرک بین‌المللی را قابل‌فهم‌تر، صادقانه‌تر و مستندتر کنیم.' },
  'about.vision': { en: 'Our vision', fa: 'چشم‌انداز ما' },
  'about.visionBody': { en: 'A consultancy where clients understand the plan, the risks and their own role in it.', fa: 'مشاوره‌ای که در آن متقاضی برنامه، ریسک‌ها و نقش خود را در آن می‌فهمد.' },
  'about.values': { en: 'What we stand for', fa: 'اصول ما' },
  'about.value1': { en: 'Honesty over optimism', fa: 'صداقت به‌جای خوش‌بینی' },
  'about.value1Body': { en: 'If a route is unlikely or closed, we say so before you spend money.', fa: 'اگر مسیری بعید یا بسته است، پیش از هزینه کردن می‌گوییم.' },
  'about.value2': { en: 'Evidence over assertion', fa: 'شواهد به‌جای ادعا' },
  'about.value2Body': { en: 'Recommendations are tied to official requirements and your documented profile.', fa: 'توصیه‌ها به الزامات رسمی و پروفایل مستند شما متصل‌اند.' },
  'about.value3': { en: 'Clarity over jargon', fa: 'شفافیت به‌جای اصطلاحات پیچیده' },
  'about.value3Body': { en: 'Plain language, written next steps and no hidden scope.', fa: 'زبان ساده، گام‌های مکتوب و بدون دامنه پنهان.' },
  'about.value4': { en: 'Respect for your decision', fa: 'احترام به تصمیم شما' },
  'about.value4Body': { en: 'The final choice is yours; we provide the information to make it well.', fa: 'انتخاب نهایی با شماست؛ اطلاعات لازم برای تصمیم خوب را فراهم می‌کنیم.' },
  'about.approachTitle': { en: 'How we work', fa: 'نحوه کار ما' },
  'about.approachBody': { en: 'We start with a profile review, document the assumptions, and agree on scope in writing. You review every application before submission. If something falls outside our competence, we say so and refer you to a qualified professional.', fa: 'با بررسی پروفایل شروع می‌کنیم، فرض‌ها را مستند می‌کنیم و دامنه را کتبی توافق می‌کنیم. هر درخواست را پیش از ارسال بازبینی می‌کنید. اگر موضوعی خارج از تخصص ما باشد، می‌گوییم و به متخصص واجد شرایط ارجاع می‌دهیم.' },
  'blog.eyebrow': { en: 'News & insights', fa: 'اخبار و بینش‌ها' },
  'blog.title': { en: 'The Apply Now journal', fa: 'مجله Apply Now' },
  'blog.intro': { en: 'Practical guides and careful explanations for applicants navigating a complicated system.', fa: 'راهنماهای کاربردی و توضیحات دقیق برای متقاضیانی که در نظامی پیچیده حرکت می‌کنند.' },
  'blog.featured': { en: 'Featured article', fa: 'مقاله ویژه' },
  'blog.search': { en: 'Search articles', fa: 'جست‌وجوی مقالات' },
  'blog.allCategories': { en: 'All topics', fa: 'همه موضوعات' },
  'blog.related': { en: 'Related articles', fa: 'مقالات مرتبط' },
  'blog.share': { en: 'Share', fa: 'اشتراک‌گذاری' },
  'blog.author': { en: 'By', fa: 'نویسنده' },
  'blog.published': { en: 'Published', fa: 'انتشار' },
  'blog.noArticles': { en: 'No articles match your search.', fa: 'مقاله‌ای با جست‌وجوی شما مطابقت ندارد.' },
  'faq.eyebrow': { en: 'Help centre', fa: 'مرکز راهنمایی' },
  'faq.title': { en: 'Answers before you begin', fa: 'پاسخ‌ها پیش از شروع' },
  'faq.intro': { en: 'Search common questions about services, visas, documents, pricing and payments.', fa: 'پرسش‌های رایج درباره خدمات، ویزا، مدارک، قیمت و پرداخت را جست‌وجو کنید.' },
  'faq.search': { en: 'Search questions', fa: 'جست‌وجوی پرسش‌ها' },
  'faq.general': { en: 'General', fa: 'عمومی' },
  'faq.study': { en: 'Study abroad', fa: 'تحصیل در خارج' },
  'faq.student-visa': { en: 'Student visa', fa: 'ویزای دانشجویی' },
  'faq.work-visa': { en: 'Work visa', fa: 'ویزای کار' },
  'faq.immigration': { en: 'Immigration process', fa: 'فرایند مهاجرت' },
  'faq.pricing': { en: 'Consultation & pricing', fa: 'مشاوره و قیمت' },
  'faq.payments': { en: 'Payments', fa: 'پرداخت' },
  'faq.noResults': { en: 'No questions match your search.', fa: 'پرسشی با جست‌وجوی شما مطابقت ندارد.' },
  'faq.ctaTitle': { en: 'Still have a question?', fa: 'هنوز پرسشی دارید؟' },
  'faq.ctaBody': { en: 'Explore the sample guidance or try the contact form. No message is sent in this preview.', fa: 'راهنمای نمونه را ببینید یا فرم تماس را امتحان کنید. در این پیش‌نمایش پیامی ارسال نمی‌شود.' },
  'contact.eyebrow': { en: 'Contact', fa: 'تماس' },
  'contact.title': { en: 'Let’s talk about your next step', fa: 'درباره گام بعدی شما صحبت کنیم' },
  'contact.intro': { en: 'Explore the sample contact details and try the demo form. No message is sent to an adviser.', fa: 'اطلاعات تماس نمونه را ببینید و فرم نمایشی را امتحان کنید. پیامی برای مشاور ارسال نمی‌شود.' },
  'contact.getInTouch': { en: 'Get in touch', fa: 'ارتباط با ما' },
  'contact.phone': { en: 'Phone', fa: 'تلفن' },
  'contact.email': { en: 'Email', fa: 'ایمیل' },
  'contact.whatsapp': { en: 'WhatsApp', fa: 'واتس‌اپ' },
  'contact.address': { en: 'Office', fa: 'دفتر' },
  'contact.hours': { en: 'Hours', fa: 'ساعات کاری' },
  'contact.formTitle': { en: 'Send us a message', fa: 'پیام خود را بفرستید' },
  'contact.formIntro': { en: 'For general enquiries. Do not include passport numbers, payment details or other sensitive documents.', fa: 'برای پرسش‌های عمومی. شماره گذرنامه، اطلاعات پرداخت یا مدارک حساس را ارسال نکنید.' },
  'contact.name': { en: 'Full name', fa: 'نام و نام خانوادگی' },
  'contact.subject': { en: 'Subject', fa: 'موضوع' },
  'contact.message': { en: 'Message', fa: 'پیام' },
  'contact.send': { en: 'Save demo message', fa: 'ذخیره پیام نمایشی' },
  'contact.sending': { en: 'Saving…', fa: 'در حال ذخیره…' },
  'contact.success': { en: 'Demo complete. Your message stays in this browser and was not sent.', fa: 'نمایش کامل شد. پیام فقط در این مرورگر ماند و ارسال نشد.' },
  'contact.map': { en: 'Office location', fa: 'موقعیت دفتر' },
  'contact.mapPending': { en: 'The interactive map will appear once office coordinates are configured in the admin portal.', fa: 'نقشه تعاملی پس از پیکربندی مختصات دفتر در پنل مدیریت نمایش داده می‌شود.' },
  'contact.openMap': { en: 'Open in maps', fa: 'بازکردن در نقشه' },
  'contact.follow': { en: 'Follow Apply Now', fa: 'Apply Now را دنبال کنید' },
  'consultation.eyebrow': { en: 'Free consultation', fa: 'مشاوره رایگان' },
  'consultation.title': { en: 'Tell us where you want to go', fa: 'بگویید به کجا می‌خواهید بروید' },
  'consultation.intro': { en: 'Explore the consultation form with sample details. This preview does not send requests.', fa: 'فرم مشاوره را با اطلاعات نمونه بررسی کنید. این پیش‌نمایش درخواستی ارسال نمی‌کند.' },
  'consultation.formTitle': { en: 'Consultation request', fa: 'درخواست مشاوره' },
  'consultation.name': { en: 'Full name', fa: 'نام و نام خانوادگی' },
  'consultation.email': { en: 'Email address', fa: 'ایمیل' },
  'consultation.phone': { en: 'Phone number', fa: 'شماره تلفن' },
  'consultation.contactMethod': { en: 'Preferred contact method', fa: 'روش تماس ترجیحی' },
  'consultation.service': { en: 'Service type', fa: 'نوع خدمت' },
  'consultation.destination': { en: 'Destination country', fa: 'کشور مقصد' },
  'consultation.education': { en: 'Current education level', fa: 'سطح تحصیلات فعلی' },
  'consultation.message': { en: 'Additional information', fa: 'اطلاعات بیشتر' },
  'consultation.date': { en: 'Preferred consultation date', fa: 'تاریخ ترجیحی مشاوره' },
  'consultation.consent': {
    en: 'I acknowledge that this is a local demonstration and have read the',
    fa: 'می‌پذیرم که این یک نمایش محلی است و مطالعه کرده‌ام:',
  },
  'consultation.submit': { en: 'Save demo request', fa: 'ذخیره درخواست نمایشی' },
  'consultation.sending': { en: 'Submitting…', fa: 'در حال ارسال…' },
  'consultation.selectService': { en: 'Select a service', fa: 'یک خدمت انتخاب کنید' },
  'consultation.selectDestination': { en: 'Select a destination', fa: 'یک مقصد انتخاب کنید' },
  'consultation.selectEducation': { en: 'Select education level', fa: 'سطح تحصیلات را انتخاب کنید' },
  'consultation.choose': { en: 'Choose an option', fa: 'یک گزینه انتخاب کنید' },
  'consultation.methodEmail': { en: 'Email', fa: 'ایمیل' },
  'consultation.methodPhone': { en: 'Phone', fa: 'تلفن' },
  'consultation.methodWhatsapp': { en: 'WhatsApp', fa: 'واتس‌اپ' },
  'consultation.highSchool': { en: 'High school', fa: 'دبیرستان' },
  'consultation.bachelor': { en: 'Bachelor’s degree', fa: 'کارشناسی' },
  'consultation.master': { en: 'Master’s degree', fa: 'کارشناسی ارشد' },
  'consultation.doctorate': { en: 'Doctorate', fa: 'دکتری' },
  'consultation.other': { en: 'Other / professional qualification', fa: 'سایر / مدرک حرفه‌ای' },
  'consultation.successTitle': { en: 'Demo request saved locally', fa: 'درخواست نمایشی در مرورگر ذخیره شد' },
  'consultation.successBody': { en: 'Demo complete. This request is stored only in this browser and was not sent to an adviser.', fa: 'نمایش کامل شد. این درخواست فقط در همین مرورگر ذخیره شده و برای مشاور ارسال نشده است.' },
  'consultation.reference': { en: 'Your reference', fa: 'شماره پیگیری شما' },
  'consultation.another': { en: 'Submit another request', fa: 'ارسال درخواست دیگر' },
  'consultation.benefitsEyebrow': { en: 'A clearer first step', fa: 'گام اول روشن‌تر' },
  'consultation.benefitsTitle': { en: 'Why start with a consultation?', fa: 'چرا مشاوره بگیریم؟' },
  'consultation.benefitsBody': {
    en: 'A conversation can help you compare possible pathways, understand requirements and plan your next steps. No adviser can guarantee a visa or outcome.',
    fa: 'یک گفت‌وگو می‌تواند به شما کمک کند مسیرهای ممکن را مقایسه کنید، با الزامات آشنا شوید و گام‌های بعدی را روشن‌تر ببینید. هیچ مشاوری نمی‌تواند ویزا یا نتیجه را تضمین کند.',
  },
  'consultation.benefit1': { en: 'Discuss your goals, budget and timeline.', fa: 'درباره اهداف، بودجه و زمان‌بندی خود گفت‌وگو کنید.' },
  'consultation.benefit2': { en: 'Identify documents and gaps to check.', fa: 'مدارک و موارد نیازمند بررسی را شناسایی کنید.' },
  'consultation.benefit3': { en: 'Plan next steps using official sources.', fa: 'گام‌های بعدی را با کمک منابع رسمی برنامه‌ریزی کنید.' },
  'consultation.whyTitle': { en: 'How this demo works', fa: 'این نمایش چگونه کار می‌کند' },
  'consultation.why1': { en: 'Enter sample details, not real personal information.', fa: 'اطلاعات نمونه وارد کنید، نه اطلاعات شخصی واقعی.' },
  'consultation.why2': { en: 'The form validates fields in your browser.', fa: 'فرم فیلدها را در مرورگر شما اعتبارسنجی می‌کند.' },
  'consultation.why3': { en: 'The demo request appears in the local admin workspace.', fa: 'درخواست نمونه در پنل مدیریت محلی نمایش داده می‌شود.' },
  'consultation.why4': { en: 'Nothing is sent and no payment is taken.', fa: 'چیزی ارسال نمی‌شود و هیچ پرداختی انجام نمی‌شود.' },
  'consultation.privacyNote': { en: 'Demo entries stay in this browser, not a secure database.', fa: 'اطلاعات نمایشی در همین مرورگر می‌ماند، نه در پایگاه داده امن.' },
  'consultation.paymentTitle': { en: 'Selected sample package', fa: 'بسته نمونه انتخاب‌شده' },
  'consultation.paymentBody': { en: 'The package price is illustrative. Payments are not available in this preview.', fa: 'قیمت بسته صرفاً نمونه است. پرداخت در این پیش‌نمایش فعال نیست.' },
  'consultation.payNow': { en: 'Continue to secure payment', fa: 'ادامه به پرداخت امن' },
  'consultation.paymentUnavailable': { en: 'No payment has been made or requested.', fa: 'هیچ پرداختی انجام یا درخواست نشده است.' },
  'consultation.paymentError': { en: 'Payment could not be started. Your request is safe; please contact us.', fa: 'شروع پرداخت ممکن نشد. درخواست شما محفوظ است؛ با ما تماس بگیرید.' },
  'consultation.validation': { en: 'Please correct the highlighted fields.', fa: 'لطفاً فیلدهای مشخص‌شده را اصلاح کنید.' },
  'form.required': { en: 'This field is required.', fa: 'این فیلد الزامی است.' },
  'form.invalidEmail': { en: 'Enter a valid email address.', fa: 'یک ایمیل معتبر وارد کنید.' },
  'form.invalidPhone': { en: 'Enter a valid phone number.', fa: 'یک شماره تلفن معتبر وارد کنید.' },
  'form.tooShort': { en: 'This value is too short.', fa: 'این مقدار خیلی کوتاه است.' },
  'form.acceptPrivacy': { en: 'Please accept the privacy policy.', fa: 'لطفاً سیاست حریم خصوصی را بپذیرید.' },
  'legal.updated': { en: 'Last updated', fa: 'آخرین به‌روزرسانی' },
  'legal.reviewNote': { en: 'This policy is editable template content and should be reviewed by a qualified legal professional before launch.', fa: 'این متن یک الگوی قابل ویرایش است و باید پیش از انتشار توسط متخصص حقوقی واجد شرایط بررسی شود.' },
  'payment.successTitle': { en: 'Payment preview', fa: 'پیش‌نمایش پرداخت' },
  'payment.successBody': { en: 'Payments are not connected in this frontend preview. No payment or receipt has been created.', fa: 'پرداخت در این پیش‌نمایش متصل نیست. هیچ پرداخت یا رسیدی ایجاد نشده است.' },
  'payment.pendingTitle': { en: 'Payment preview', fa: 'پیش‌نمایش پرداخت' },
  'payment.pendingBody': { en: 'Payments are not connected in this frontend preview.', fa: 'پرداخت در این پیش‌نمایش متصل نیست.' },
  'payment.failedTitle': { en: 'Payment was not completed', fa: 'پرداخت تکمیل نشد' },
  'payment.failedBody': { en: 'No payment was confirmed in this browser-only preview. Return to pricing to continue exploring.', fa: 'در این پیش‌نمایش مرورگری پرداختی تأیید نشد. برای ادامه بررسی به صفحه قیمت‌ها بازگردید.' },
  'payment.cancelledTitle': { en: 'Checkout cancelled', fa: 'پرداخت لغو شد' },
  'payment.cancelledBody': { en: 'Payments are not available in this preview. Nothing has been charged.', fa: 'پرداخت در این پیش‌نمایش فعال نیست و مبلغی دریافت نشده است.' },
  'payment.reference': { en: 'Payment reference', fa: 'مرجع پرداخت' },
  'payment.amount': { en: 'Amount', fa: 'مبلغ' },
  'payment.returnHome': { en: 'Return home', fa: 'بازگشت به خانه' },
  'payment.goPricing': { en: 'View packages', fa: 'مشاهده بسته‌ها' },
  'payment.verifying': { en: 'Checking the demo status…', fa: 'در حال بررسی وضعیت نمایشی…' },
  'notfound.title': { en: 'This page took a different route.', fa: 'این صفحه مسیر دیگری را انتخاب کرد.' },
  'notfound.body': { en: 'The page you are looking for does not exist or has moved.', fa: 'صفحه‌ای که می‌خواهید وجود ندارد یا جابه‌جا شده است.' },
  'notfound.home': { en: 'Back to home', fa: 'بازگشت به خانه' },
  'admin.title': { en: 'Apply Now Admin', fa: 'مدیریت Apply Now' },
  'admin.login': { en: 'Sign in', fa: 'ورود' },
  'admin.email': { en: 'Email', fa: 'ایمیل' },
  'admin.password': { en: 'Password', fa: 'رمز عبور' },
  'admin.loggingIn': { en: 'Signing in…', fa: 'در حال ورود…' },
  'admin.loginIntro': { en: 'Authorised staff only. Sessions expire automatically.', fa: 'فقط کارکنان مجاز. نشست‌ها به‌صورت خودکار منقضی می‌شوند.' },
  'admin.logout': { en: 'Sign out', fa: 'خروج' },
  'admin.viewSite': { en: 'View website', fa: 'مشاهده وب‌سایت' },
  'admin.dashboard': { en: 'Dashboard', fa: 'داشبورد' },
  'admin.consultations': { en: 'Consultations', fa: 'درخواست‌های مشاوره' },
  'admin.payments': { en: 'Payments', fa: 'پرداخت‌ها' },
  'admin.messages': { en: 'Messages', fa: 'پیام‌ها' },
  'admin.services': { en: 'Services', fa: 'خدمات' },
  'admin.destinations': { en: 'Destinations', fa: 'مقاصد' },
  'admin.packages': { en: 'Packages', fa: 'بسته‌ها' },
  'admin.experts': { en: 'Experts', fa: 'کارشناسان' },
  'admin.blog': { en: 'Articles', fa: 'مقالات' },
  'admin.categories': { en: 'Categories', fa: 'دسته‌بندی‌ها' },
  'admin.faqs': { en: 'FAQs', fa: 'پرسش‌های متداول' },
  'admin.testimonials': { en: 'Testimonials', fa: 'نظرات' },
  'admin.settings': { en: 'Settings', fa: 'تنظیمات' },
  'admin.legal': { en: 'Legal pages', fa: 'صفحات حقوقی' },
  'admin.account': { en: 'Account security', fa: 'امنیت حساب' },
  'admin.content': { en: 'Content', fa: 'محتوا' },
  'admin.system': { en: 'System', fa: 'سیستم' },
  'admin.welcome': { en: 'Welcome back', fa: 'خوش آمدید' },
  'admin.overviewIntro': { en: 'Here is what is happening with the site today.', fa: 'وضعیت امروز سایت را ببینید.' },
  'admin.totalRequests': { en: 'Total requests', fa: 'کل درخواست‌ها' },
  'admin.pending': { en: 'Pending', fa: 'در انتظار' },
  'admin.approved': { en: 'Approved', fa: 'تأییدشده' },
  'admin.rejected': { en: 'Rejected', fa: 'ردشده' },
  'admin.publishedArticles': { en: 'Published articles', fa: 'مقالات منتشرشده' },
  'admin.totalServices': { en: 'Services', fa: 'خدمات' },
  'admin.totalDestinations': { en: 'Destinations', fa: 'مقاصد' },
  'admin.revenue': { en: 'Verified payments', fa: 'پرداخت‌های تأییدشده' },
  'admin.recentRequests': { en: 'Recent requests', fa: 'درخواست‌های اخیر' },
  'admin.recentActivity': { en: 'Recent activity', fa: 'فعالیت‌های اخیر' },
  'admin.requestTrend': { en: 'Consultation requests — last 14 days', fa: 'درخواست‌های مشاوره — ۱۴ روز اخیر' },
  'admin.quickActions': { en: 'Quick actions', fa: 'اقدامات سریع' },
  'admin.viewAll': { en: 'View all', fa: 'مشاهده همه' },
  'admin.noRequests': { en: 'No consultation requests yet.', fa: 'هنوز درخواست مشاوره‌ای ثبت نشده است.' },
  'admin.status': { en: 'Status', fa: 'وضعیت' },
  'admin.applicant': { en: 'Applicant', fa: 'متقاضی' },
  'admin.service': { en: 'Service', fa: 'خدمت' },
  'admin.submitted': { en: 'Submitted', fa: 'تاریخ ارسال' },
  'admin.reference': { en: 'Reference', fa: 'شماره پیگیری' },
  'admin.destination': { en: 'Destination', fa: 'مقصد' },
  'admin.contact': { en: 'Contact', fa: 'تماس' },
  'admin.notes': { en: 'Internal notes', fa: 'یادداشت‌های داخلی' },
  'admin.addNote': { en: 'Add note', fa: 'افزودن یادداشت' },
  'admin.notePlaceholder': { en: 'Internal note — never visible to applicants.', fa: 'یادداشت داخلی — هرگز برای متقاضی نمایش داده نمی‌شود.' },
  'admin.saveNote': { en: 'Save note', fa: 'ذخیره یادداشت' },
  'admin.noNotes': { en: 'No internal notes yet.', fa: 'هنوز یادداشت داخلی وجود ندارد.' },
  'admin.updateStatus': { en: 'Update status', fa: 'به‌روزرسانی وضعیت' },
  'admin.statusUpdated': { en: 'Status updated.', fa: 'وضعیت به‌روزرسانی شد.' },
  'admin.export': { en: 'Export CSV', fa: 'خروجی CSV' },
  'admin.search': { en: 'Search', fa: 'جست‌وجو' },
  'admin.filters': { en: 'Filters', fa: 'فیلترها' },
  'admin.allStatuses': { en: 'All statuses', fa: 'همه وضعیت‌ها' },
  'admin.allServices': { en: 'All services', fa: 'همه خدمات' },
  'admin.allDestinations': { en: 'All destinations', fa: 'همه مقاصد' },
  'admin.from': { en: 'From', fa: 'از' },
  'admin.to': { en: 'To', fa: 'تا' },
  'admin.reset': { en: 'Reset', fa: 'بازنشانی' },
  'admin.rows': { en: 'records', fa: 'رکورد' },
  'admin.page': { en: 'Page', fa: 'صفحه' },
  'admin.new': { en: 'New', fa: 'جدید' },
  'admin.edit': { en: 'Edit', fa: 'ویرایش' },
  'admin.delete': { en: 'Delete', fa: 'حذف' },
  'admin.save': { en: 'Save changes', fa: 'ذخیره تغییرات' },
  'admin.saving': { en: 'Saving…', fa: 'در حال ذخیره…' },
  'admin.cancel': { en: 'Cancel', fa: 'لغو' },
  'admin.confirmDelete': { en: 'Delete this record? This cannot be undone.', fa: 'این رکورد حذف شود؟ این کار قابل بازگشت نیست.' },
  'admin.saved': { en: 'Changes saved.', fa: 'تغییرات ذخیره شد.' },
  'admin.deleted': { en: 'Record deleted.', fa: 'رکورد حذف شد.' },
  'admin.published': { en: 'Published', fa: 'منتشرشده' },
  'admin.draft': { en: 'Draft', fa: 'پیش‌نویس' },
  'admin.visible': { en: 'Visible', fa: 'نمایان' },
  'admin.featured': { en: 'Featured', fa: 'ویژه' },
  'admin.image': { en: 'Image', fa: 'تصویر' },
  'admin.upload': { en: 'Upload image', fa: 'بارگذاری تصویر' },
  'admin.uploading': { en: 'Uploading…', fa: 'در حال بارگذاری…' },
  'admin.imageUrl': { en: 'Image URL', fa: 'نشانی تصویر' },
  'admin.slug': { en: 'URL slug', fa: 'شناسه URL' },
  'admin.order': { en: 'Display order', fa: 'ترتیب نمایش' },
  'admin.noRecords': { en: 'No records yet.', fa: 'هنوز رکوردی وجود ندارد.' },
  'admin.english': { en: 'English', fa: 'انگلیسی' },
  'admin.persian': { en: 'Persian', fa: 'فارسی' },
  'admin.basics': { en: 'Basics', fa: 'مبانی' },
  'admin.details': { en: 'Details', fa: 'جزئیات' },
  'admin.seo': { en: 'SEO', fa: 'سئو' },
  'admin.security': { en: 'Security', fa: 'امنیت' },
  'admin.changePassword': { en: 'Change password', fa: 'تغییر رمز عبور' },
  'admin.currentPassword': { en: 'Current password', fa: 'رمز عبور فعلی' },
  'admin.newPassword': { en: 'New password', fa: 'رمز عبور جدید' },
  'admin.passwordChanged': { en: 'Password changed. Other sessions have been signed out.', fa: 'رمز عبور تغییر کرد. سایر نشست‌ها خارج شدند.' },
  'admin.settingsSaved': { en: 'Settings saved.', fa: 'تنظیمات ذخیره شد.' },
  'admin.verification': { en: 'Content verification', fa: 'تأیید محتوا' },
  'admin.verificationNote': { en: 'Only mark content verified after replacing all sample contact details, team profiles, testimonials and figures.', fa: 'فقط پس از جایگزینی همه اطلاعات تماس، پروفایل تیم، نظرات و ارقام نمونه، محتوا را تأییدشده علامت بزنید.' },
  'admin.paymentLocked': { en: 'Verified gateway results are read-only. Refunds must be handled through the payment provider.', fa: 'نتایج تأییدشده درگاه فقط خواندنی هستند. بازپرداخت باید از طریق ارائه‌دهنده پرداخت انجام شود.' },
  'admin.paymentNotConfigured': { en: 'Online payment is not configured. Set Stripe environment variables to enable checkout.', fa: 'پرداخت آنلاین پیکربندی نشده است. برای فعال‌سازی، متغیرهای محیطی Stripe را تنظیم کنید.' },
  'admin.demoContent': { en: 'Sample content is live', fa: 'محتوای نمونه فعال است' },
  'admin.demoContentBody': { en: 'Replace demonstration profiles, reviews, statistics and contact details before launch.', fa: 'پیش از انتشار، پروفایل‌ها، نظرات، آمار و اطلاعات تماس نمونه را جایگزین کنید.' },
  'admin.noAccess': { en: 'You do not have permission to view this section.', fa: 'شما اجازه مشاهده این بخش را ندارید.' },
  'status.pending': { en: 'Pending', fa: 'در انتظار' },
  'status.under_review': { en: 'Under review', fa: 'در حال بررسی' },
  'status.contacted': { en: 'Contacted', fa: 'تماس گرفته‌شده' },
  'status.in_progress': { en: 'In progress', fa: 'در حال انجام' },
  'status.approved': { en: 'Approved', fa: 'تأییدشده' },
  'status.rejected': { en: 'Rejected', fa: 'ردشده' },
  'status.completed': { en: 'Completed', fa: 'تکمیل‌شده' },
  'status.successful': { en: 'Successful', fa: 'موفق' },
  'status.failed': { en: 'Failed', fa: 'ناموفق' },
  'status.cancelled': { en: 'Cancelled', fa: 'لغوشده' },
  'status.refunded': { en: 'Refunded', fa: 'بازپرداخت‌شده' },
  'status.new': { en: 'New', fa: 'جدید' },
  'status.read': { en: 'Read', fa: 'خوانده‌شده' },
  'status.replied': { en: 'Replied', fa: 'پاسخ داده‌شده' },
  'status.archived': { en: 'Archived', fa: 'بایگانی' },
} as const;

export type TranslationKey = keyof typeof dictionary;

interface LocaleContextValue {
  locale: Locale;
  isRtl: boolean;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  localize: (to: string) => string;
  switchLocale: () => void;
  formatNumber: (value: number | string) => string;
  formatDate: (value: string | Date | null | undefined, options?: Intl.DateTimeFormatOptions) => string;
  formatPrice: (minor: number, currency: string) => string;
  pick: (en: string | null | undefined, fa: string | null | undefined) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminLocale, setAdminLocale] = useState<Locale>(() => {
    try { return localStorage.getItem('faratech_lang') === 'en' ? 'en' : 'fa'; } catch { return 'fa'; }
  });
  const inAdmin = location.pathname === '/admin' || location.pathname.startsWith('/admin/');
  const locale: Locale = inAdmin ? adminLocale : location.pathname === '/fa' || location.pathname.startsWith('/fa/') ? 'fa' : 'en';
  const isRtl = locale === 'fa';

  useEffect(() => {
    if (!inAdmin) setAdminLocale(locale);
  }, [inAdmin, locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.body.classList.toggle('locale-fa', isRtl);
  }, [locale, isRtl]);

  const value = useMemo<LocaleContextValue>(() => {
    const localize = (to: string) => {
      const [pathPart, suffix = ''] = to.split(/(?=[?#])/);
      const clean = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
      if (locale === 'en') return `${clean}${suffix}`;
      if (clean === '/') return `/fa${suffix}`;
      return `/fa${clean}${suffix}`;
    };
    const t = (key: TranslationKey, vars?: Record<string, string | number>) => {
      let text: string = dictionary[key]?.[locale] || dictionary[key]?.en || key;
      if (vars) {
        for (const [name, replacement] of Object.entries(vars)) {
          text = text.replaceAll(`{${name}}`, String(replacement));
        }
      }
      return text;
    };
    const switchLocale = () => {
      const path = location.pathname;
      setAdminLocale(locale === 'fa' ? 'en' : 'fa');
      if (inAdmin) {
        const next: Locale = locale === 'fa' ? 'en' : 'fa';
        try { window.localStorage.setItem('faratech_lang', next); } catch { /* URL/session remains usable */ }
        setAdminLocale(next);
        return;
      }
      const bare = path === '/fa' ? '/' : path.startsWith('/fa/') ? path.slice(3) : path;
      const target = locale === 'fa' ? bare || '/' : `/fa${bare === '/' ? '' : bare}`;
      try {
        window.localStorage.setItem('faratech_lang', locale === 'fa' ? 'en' : 'fa');
      } catch {
        // Storage can be disabled; the URL remains the source of truth.
      }
      navigate(`${target}${location.search}${location.hash}`);
    };
    const formatNumber = (input: number | string) => {
      const numeric = typeof input === 'number' ? input : Number(input);
      if (Number.isNaN(numeric)) return String(input);
      return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(numeric);
    };
    const formatDate = (input: string | Date | null | undefined, options?: Intl.DateTimeFormatOptions) => {
      if (!input) return '—';
      const date = input instanceof Date ? input : new Date(input);
      if (Number.isNaN(date.getTime())) return '—';
      return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-GB', {
        dateStyle: 'medium',
        ...options,
      }).format(date);
    };
    const formatPrice = (minor: number, currency: string) => {
      if (minor === 0) return locale === 'fa' ? 'رایگان' : 'Free';
      try {
        return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
          style: 'currency',
          currency,
          maximumFractionDigits: minor % 100 === 0 ? 0 : 2,
        }).format(minor / 100);
      } catch {
        return `${currency} ${formatNumber(minor / 100)}`;
      }
    };
    const pick = (en: string | null | undefined, fa: string | null | undefined) =>
      (locale === 'fa' ? fa || en : en || fa) || '';
    return { locale, isRtl, t, localize, switchLocale, formatNumber, formatDate, formatPrice, pick };
  }, [locale, isRtl, inAdmin, location.pathname, location.search, location.hash, navigate]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used inside LocaleProvider');
  return context;
}

export function LocalLink({
  to,
  children,
  className,
  ...rest
}: Omit<React.ComponentProps<typeof Link>, 'to'> & { to: string }) {
  const { localize } = useLocale();
  return (
    <Link to={localize(to)} className={className} {...rest}>
      {children}
    </Link>
  );
}
