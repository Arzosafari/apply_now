import { DEFAULT_BRAND_LEGAL_NAME, DEFAULT_BRAND_LOGO, DEFAULT_BRAND_NAME } from '@/lib/brand';

export const services = [
  {
    slug: 'study-abroad',
    category_en: 'Education',
    category_fa: 'تحصیل',
    icon: 'graduation-cap',
    image: '/images/study-abroad.jpg',
    title_en: 'Study Abroad',
    title_fa: 'تحصیل در خارج از کشور',
    short_en: 'Find the right programme, shortlist universities, and build an application that stands out.',
    short_fa: 'برنامه تحصیلی مناسب را پیدا کنید، دانشگاه‌ها را اولویت‌بندی کنید و درخواستی متمایز بسازید.',
    description_en:
      'A study-abroad decision is about far more than a university ranking. We begin with your academic background, budget, career direction and preferred environment, then build a realistic shortlist across countries and institutions. From programme research and application documents to offer acceptance and pre-departure planning, your advisor keeps every deadline and requirement in one clear plan. We explain what each institution asks for rather than promising an outcome, and we never submit information on your behalf without your review.',
    description_fa:
      'انتخاب تحصیل در خارج از کشور فقط به رتبه دانشگاه محدود نمی‌شود. کار را با بررسی سابقه تحصیلی، بودجه، مسیر شغلی و شرایط زندگی شما آغاز می‌کنیم و سپس فهرستی واقع‌بینانه از کشورها و دانشگاه‌ها می‌سازیم. از پژوهش برنامه و آماده‌سازی مدارک تا پذیرش پیشنهاد و برنامه‌ریزی پیش از سفر، مشاور شما همه مهلت‌ها و الزامات را در یک برنامه روشن نگه می‌دارد. ما شرایط هر دانشگاه را شفاف توضیح می‌دهیم، نتیجه‌ای را تضمین نمی‌کنیم و هیچ اطلاعاتی را بدون بازبینی شما ارسال نمی‌کنیم.',
    eligibility_en: [
      'A completed secondary or bachelor qualification relevant to the intended programme',
      'Language proficiency that meets each institution’s published requirement',
      'Proof of funds or a credible financial plan for tuition and living costs',
      'A clear academic or career rationale for the chosen programme',
    ],
    eligibility_fa: [
      'مدرک دیپلم یا کارشناسی مرتبط با برنامه تحصیلی مورد نظر',
      'مهارت زبانی مطابق با شرایط اعلام‌شده هر دانشگاه',
      'اثبات توان مالی یا برنامه مالی معتبر برای شهریه و هزینه زندگی',
      'دلیل تحصیلی یا شغلی روشن برای انتخاب برنامه',
    ],
    documents_en: [
      'Academic transcripts and graduation certificates',
      'Language test result or approved alternative evidence',
      'Passport biographical page',
      'Statement of purpose and curriculum vitae where required',
      'Recommendation letters and portfolio, if the programme asks for them',
    ],
    documents_fa: [
      'ریزنمرات و گواهی فارغ‌التحصیلی',
      'نتیجه آزمون زبان یا مدرک معتبر جایگزین',
      'صفحه مشخصات گذرنامه',
      'انگیزه‌نامه و رزومه در صورت نیاز برنامه',
      'توصیه‌نامه و نمونه‌کار در صورت درخواست دانشگاه',
    ],
    process_en: [
      'Profile review and goal-setting session',
      'Country and programme shortlist with cost comparison',
      'Document preparation and application quality review',
      'Submission, follow-up and interview preparation',
      'Offer review, deposit guidance and pre-departure checklist',
    ],
    process_fa: [
      'جلسه بررسی پروفایل و تعیین هدف',
      'انتخاب کشور و برنامه همراه با مقایسه هزینه‌ها',
      'آماده‌سازی مدارک و بازبینی کیفیت درخواست',
      'ارسال درخواست، پیگیری و آماده‌سازی مصاحبه',
      'بررسی پذیرش، راهنمایی واریز و چک‌لیست پیش از سفر',
    ],
    benefits_en: [
      'A shortlist grounded in your profile, not generic rankings',
      'One advisor from first enquiry to departure planning',
      'Clear deadlines and document tracking',
      'Independent review before every submission',
    ],
    benefits_fa: [
      'فهرست دانشگاه بر اساس پروفایل شما، نه رتبه‌بندی عمومی',
      'یک مشاور از اولین پرسش تا برنامه‌ریزی سفر',
      'مهلت‌های شفاف و پیگیری منظم مدارک',
      'بازبینی مستقل پیش از هر ارسال',
    ],
    faqs_en: [
      {
        q: 'Can you guarantee admission?',
        a: 'No. Admission decisions belong to each institution. We help you choose realistic options and present the strongest possible application.',
      },
      {
        q: 'When should I start?',
        a: 'Many applicants begin 9–18 months before their intended intake. Earlier planning creates more room for language tests and funding preparation.',
      },
    ],
    faqs_fa: [
      {
        q: 'آیا پذیرش تحصیلی تضمین می‌شود؟',
        a: 'خیر. تصمیم پذیرش در اختیار هر دانشگاه است. ما به شما کمک می‌کنیم گزینه‌های واقع‌بینانه انتخاب کنید و قوی‌ترین درخواست ممکن را ارائه دهید.',
      },
      {
        q: 'از چه زمانی باید شروع کنم؟',
        a: 'بسیاری از متقاضیان ۹ تا ۱۸ ماه پیش از ورودی مورد نظر شروع می‌کنند. برنامه‌ریزی زودهنگام زمان بیشتری برای آزمون زبان و آماده‌سازی مالی فراهم می‌کند.',
      },
    ],
    timeline_en: 'Typical planning window: 9–18 months, depending on intake and programme.',
    timeline_fa: 'بازه معمول برنامه‌ریزی: ۹ تا ۱۸ ماه، بسته به ورودی و برنامه تحصیلی.',
    featured: 1,
    sort_order: 1,
  },
  {
    slug: 'student-visa',
    category_en: 'Visas',
    category_fa: 'ویزا',
    icon: 'badge-check',
    image: '/images/visa-documents.jpg',
    title_en: 'Student Visa Assistance',
    title_fa: 'همراهی در ویزای تحصیلی',
    short_en: 'Understand the evidence, timelines and interview requirements before you apply.',
    short_fa: 'پیش از درخواست، مدارک، زمان‌بندی و الزامات مصاحبه را بشناسید.',
    description_en:
      'A student visa is an evidence-based application informed by your admission, finances, ties and study plan. We map the official checklist for your destination, review consistency across every document, and prepare you for biometrics or an interview where applicable. Requirements are set by the relevant authority and can change without notice. We work from current official sources, document every assumption, and tell you clearly when a requirement needs confirmation from the consulate or an accredited adviser.',
    description_fa:
      'ویزای تحصیلی یک درخواست مبتنی بر شواهد است که با پذیرش، وضعیت مالی، پیوندها و برنامه تحصیلی شما سنجیده می‌شود. چک‌لیست رسمی مقصد را مشخص می‌کنیم، هماهنگی همه مدارک را بازبینی می‌کنیم و در صورت نیاز شما را برای اثر انگشت یا مصاحبه آماده می‌سازیم. الزامات توسط مرجع رسمی تعیین می‌شود و ممکن است بدون اطلاع تغییر کند. ما از منابع رسمی به‌روز کار می‌کنیم، هر فرض را مستند می‌کنیم و زمانی که نیاز به تأیید سفارت یا مشاور دارای مجوز دارد، صریح اعلام می‌کنیم.',
    eligibility_en: [
      'An admission or eligibility letter from a recognised institution, where required',
      'Sufficient and lawfully sourced funds for tuition and living costs',
      'Genuine temporary intent and a coherent study plan, where applicable',
      'Health, character and biometric requirements set by the destination',
    ],
    eligibility_fa: [
      'نامه پذیرش یا واجد شرایط بودن از مؤسسه معتبر، در صورت نیاز',
      'وجوه کافی و با منشأ قانونی برای شهریه و هزینه زندگی',
      'قصد موقت واقعی و برنامه تحصیلی منسجم، در صورت کاربرد',
      'الزامات سلامت، سوابق و اثر انگشت مطابق مقصد',
    ],
    documents_en: [
      'Valid passport and completed official forms',
      'Institution admission or confirmation of enrolment',
      'Financial evidence and sponsor documents',
      'Language and academic records',
      'Study plan, photographs and any destination-specific declarations',
    ],
    documents_fa: [
      'گذرنامه معتبر و فرم‌های رسمی تکمیل‌شده',
      'پذیرش مؤسسه یا تأیید ثبت‌نام',
      'مدارک مالی و اسناد حامی مالی',
      'سوابق زبان و تحصیل',
      'برنامه تحصیلی، عکس و هر اظهارنامه ویژه مقصد',
    ],
    process_en: [
      'Eligibility and risk review',
      'Official checklist and evidence plan',
      'Document consistency review',
      'Application lodgement and biometrics',
      'Interview preparation and outcome guidance',
    ],
    process_fa: [
      'بررسی واجد شرایط بودن و ریسک‌ها',
      'چک‌لیست رسمی و برنامه شواهد',
      'بازبینی هماهنگی مدارک',
      'ثبت درخواست و اثر انگشت',
      'آماده‌سازی مصاحبه و راهنمایی نتیجه',
    ],
    benefits_en: [
      'A document plan tied to the current official checklist',
      'Consistency checks across financial and academic evidence',
      'Clear interview preparation',
      'No guarantees or invented timelines',
    ],
    benefits_fa: [
      'برنامه مدارک بر اساس چک‌لیست رسمی به‌روز',
      'بررسی هماهنگی مدارک مالی و تحصیلی',
      'آماده‌سازی شفاف برای مصاحبه',
      'بدون تضمین یا زمان‌بندی ساختگی',
    ],
    faqs_en: [
      {
        q: 'Do you submit the visa for me?',
        a: 'Where local rules allow representation, we prepare and review the application with you. Final declarations and biometrics remain your responsibility.',
      },
      {
        q: 'What if my visa is refused?',
        a: 'We review the refusal reasons with you and identify whether a lawful reapplication or appeal route exists. We never promise a different outcome.',
      },
    ],
    faqs_fa: [
      {
        q: 'آیا شما ویزا را به‌جای من ارسال می‌کنید؟',
        a: 'در جایی که قوانین محلی نمایندگی را اجازه دهد، درخواست را با شما آماده و بازبینی می‌کنیم. اظهارات نهایی و اثر انگشت بر عهده خود شماست.',
      },
      {
        q: 'اگر ویزا رد شود چه می‌شود؟',
        a: 'دلایل رد را با شما بررسی می‌کنیم و مشخص می‌کنیم آیا مسیر قانونی برای درخواست مجدد یا اعتراض وجود دارد. هرگز نتیجه متفاوتی را تضمین نمی‌کنیم.',
      },
    ],
    timeline_en: 'Processing times vary by destination and are never controlled by Apply Now.',
    timeline_fa: 'زمان پردازش بسته به مقصد متفاوت است و تحت کنترل Apply Now نیست.',
    featured: 1,
    sort_order: 2,
  },
  {
    slug: 'work-visa',
    category_en: 'Work',
    category_fa: 'کار',
    icon: 'briefcase',
    image: '/images/office.jpg',
    title_en: 'Work Visa & Employer Pathways',
    title_fa: 'ویزای کار و مسیرهای کارفرما',
    short_en: 'Navigate employer sponsorship, skills assessment and work-authorisation requirements.',
    short_fa: 'حمایت کارفرما، ارزیابی مهارت و الزامات اجازه کار را مدیریت کنید.',
    description_en:
      'Work immigration usually depends on a genuine job offer, an eligible occupation and an employer willing to meet sponsorship duties. We help you understand the route that fits your profession, prepare a credible skills and experience file, and coordinate with employers on the documents they must provide. Because labour-market rules change frequently, every recommendation is tied to the official source reviewed during your case and confirmed again before submission.',
    description_fa:
      'مهاجرت کاری معمولاً به پیشنهاد شغلی واقعی، شغل واجد شرایط و کارفرمایی که مسئولیت‌های حمایت را بپذیرد وابسته است. ما کمک می‌کنیم مسیر مناسب حرفه خود را بشناسید، پرونده معتبر مهارت و تجربه آماده کنید و با کارفرما برای مدارک لازم هماهنگ شوید. چون قواعد بازار کار مکرر تغییر می‌کند، هر توصیه به منبع رسمی بررسی‌شده در پرونده شما متصل است و پیش از ارسال دوباره تأیید می‌شود.',
    eligibility_en: [
      'A genuine offer or eligible employment pathway',
      'Qualification and experience matching the occupation',
      'Language, registration or licensing requirements where relevant',
      'Employer compliance with local sponsorship obligations',
    ],
    eligibility_fa: [
      'پیشنهاد شغلی واقعی یا مسیر اشتغال واجد شرایط',
      'مدرک و تجربه هماهنگ با شغل',
      'الزامات زبان، ثبت حرفه‌ای یا مجوز در صورت کاربرد',
      'پایبندی کارفرما به تعهدات حمایت محلی',
    ],
    documents_en: [
      'Passport, CV and detailed employment references',
      'Qualification certificates and professional registrations',
      'Employment contract or offer letter',
      'Employer sponsorship and labour-market documents',
      'Language test results and police certificates where required',
    ],
    documents_fa: [
      'گذرنامه، رزومه و معرفی‌نامه‌های شغلی دقیق',
      'گواهی مدارک و ثبت‌های حرفه‌ای',
      'قرارداد یا نامه پیشنهاد شغلی',
      'مدارک حمایت کارفرما و بازار کار',
      'نتیجه آزمون زبان و گواهی عدم سوءپیشینه در صورت نیاز',
    ],
    process_en: [
      'Occupation and route assessment',
      'Employer document coordination',
      'Skills and experience file preparation',
      'Application and compliance review',
      'Arrival and work-authorisation follow-up',
    ],
    process_fa: [
      'ارزیابی شغل و مسیر مناسب',
      'هماهنگی مدارک کارفرما',
      'آماده‌سازی پرونده مهارت و تجربه',
      'بازبینی درخواست و انطباق',
      'پیگیری ورود و اجازه کار',
    ],
    benefits_en: [
      'Route options explained side by side',
      'Structured employer document checklist',
      'Experience evidence presented clearly',
      'Compliance-focused application review',
    ],
    benefits_fa: [
      'توضیح گزینه‌های مسیر در کنار یکدیگر',
      'چک‌لیست ساختاریافته مدارک کارفرما',
      'ارائه شفاف شواهد تجربه',
      'بازبینی درخواست با تمرکز بر انطباق',
    ],
    faqs_en: [
      {
        q: 'Can I find a job through Apply Now?',
        a: 'We do not sell jobs or guarantee employment. We can discuss legitimate employer-led routes and help you present your experience professionally.',
      },
      {
        q: 'Do I need a job offer before starting?',
        a: 'Most employer-sponsored routes require one. Some points-based or talent routes may not, but eligibility is strict and must be checked against official rules.',
      },
    ],
    faqs_fa: [
      {
        q: 'آیا از طریق Apply Now کار پیدا می‌کنم؟',
        a: 'ما شغل نمی‌فروشیم و اشتغال را تضمین نمی‌کنیم. می‌توانیم درباره مسیرهای قانونی کارفرما محور صحبت کنیم و به ارائه حرفه‌ای تجربه شما کمک کنیم.',
      },
      {
        q: 'آیا پیش از شروع به پیشنهاد شغلی نیاز دارم؟',
        a: 'بیشتر مسیرهای حمایت کارفرما به پیشنهاد شغلی نیاز دارند. برخی مسیرهای امتیازی یا استعداد ممکن است نیاز نداشته باشند، اما شرایط سخت‌گیرانه است و باید با قوانین رسمی بررسی شود.',
      },
    ],
    timeline_en: 'Varies by occupation, employer readiness and authority processing.',
    timeline_fa: 'بسته به شغل، آمادگی کارفرما و زمان پردازش مرجع متفاوت است.',
    featured: 1,
    sort_order: 3,
  },
  {
    slug: 'permanent-residency',
    category_en: 'Immigration',
    category_fa: 'مهاجرت',
    icon: 'home',
    image: '/images/hero-city.jpg',
    title_en: 'Permanent Residency',
    title_fa: 'اقامت دائمی',
    short_en: 'Build a long-term residency strategy around your profile, family and professional goals.',
    short_fa: 'استراتژی اقامت بلندمدت را بر اساس پروفایل، خانواده و اهداف شغلی خود بسازید.',
    description_en:
      'Permanent residency routes are long-term strategies, not one-off forms. We assess the realistic pathways available to you, compare their evidence requirements and help you build a multi-stage plan covering language, qualifications, employment and settlement. Where a route is closed or uncertain, we say so. Every application must be supported by verifiable facts, and any change in law or policy can affect eligibility.',
    description_fa:
      'مسیرهای اقامت دائمی استراتژی بلندمدت هستند، نه یک فرم یک‌باره. مسیرهای واقع‌بینانه شما را ارزیابی می‌کنیم، الزامات مدرک هر کدام را مقایسه می‌کنیم و برنامه چندمرحله‌ای شامل زبان، مدرک، اشتغال و اسکان می‌سازیم. اگر مسیری بسته یا نامطمئن باشد، صریح می‌گوییم. هر درخواست باید با واقعیت‌های قابل راستی‌آزمایی پشتیبانی شود و تغییر قوانین یا سیاست‌ها می‌تواند شرایط را تحت تأثیر قرار دهد.',
    eligibility_en: [
      'A qualifying immigration category matching your profile',
      'Verifiable work experience, education or investment evidence',
      'Health, character and security clearances',
      'Language ability or settlement conditions attached to the route',
    ],
    eligibility_fa: [
      'دسته مهاجرتی واجد شرایط متناسب با پروفایل شما',
      'تجربه کاری، تحصیل یا سرمایه قابل راستی‌آزمایی',
      'تأییدیه سلامت، سوابق و امنیت',
      'توانایی زبان یا شرایط اسکان مرتبط با مسیر',
    ],
    documents_en: [
      'Identity and civil-status documents',
      'Full employment history and references',
      'Academic and language credentials',
      'Police, medical and financial evidence',
      'Family relationship records where dependants are included',
    ],
    documents_fa: [
      'مدارک هویت و وضعیت مدنی',
      'سابقه کامل اشتغال و معرفی‌نامه‌ها',
      'مدارک تحصیلی و زبان',
      'مدارک پلیس، پزشکی و مالی',
      'مدارک رابطه خانوادگی در صورت همراهی وابستگان',
    ],
    process_en: [
      'Eligibility mapping across available routes',
      'Evidence gap analysis and action plan',
      'Document collection and consistency review',
      'Application lodgement and authority correspondence',
      'Settlement planning after approval',
    ],
    process_fa: [
      'نقشه‌برداری واجد شرایط بودن در مسیرهای موجود',
      'تحلیل شکاف مدارک و برنامه اقدام',
      'جمع‌آوری مدارک و بازبینی هماهنگی',
      'ارسال درخواست و مکاتبه با مرجع',
      'برنامه‌ریزی اسکان پس از تأیید',
    ],
    benefits_en: [
      'Long-term plan rather than a single application',
      'Transparent comparison of viable routes',
      'Documented assumptions and legal sources',
      'Support for accompanying family members',
    ],
    benefits_fa: [
      'برنامه بلندمدت به‌جای یک درخواست منفرد',
      'مقایسه شفاف مسیرهای ممکن',
      'مستندسازی فرض‌ها و منابع قانونی',
      'پشتیبانی از اعضای همراه خانواده',
    ],
    faqs_en: [
      {
        q: 'Which country is easiest for permanent residency?',
        a: 'There is no universal answer. “Easiest” depends on your occupation, language, age, funds and family. We compare your actual eligibility instead of relying on general rankings.',
      },
      {
        q: 'Can you guarantee permanent residency?',
        a: 'No. Only the relevant government authority can decide. We provide preparation and guidance, not a guaranteed outcome.',
      },
    ],
    faqs_fa: [
      {
        q: 'کدام کشور برای اقامت دائمی آسان‌تر است؟',
        a: 'پاسخ جهانی وجود ندارد. «آسان‌تر» به شغل، زبان، سن، سرمایه و خانواده شما بستگی دارد. ما واجد شرایط بودن واقعی شما را مقایسه می‌کنیم، نه رتبه‌بندی‌های عمومی.',
      },
      {
        q: 'آیا اقامت دائمی تضمین می‌شود؟',
        a: 'خیر. تنها مرجع دولتی مربوطه می‌تواند تصمیم بگیرد. ما آماده‌سازی و راهنمایی ارائه می‌دهیم، نه نتیجه تضمینی.',
      },
    ],
    timeline_en: 'Multi-year planning is common; authority processing times vary widely.',
    timeline_fa: 'برنامه‌ریزی چندساله رایج است؛ زمان پردازش مرجع بسیار متفاوت است.',
    featured: 1,
    sort_order: 4,
  },
  {
    slug: 'family-sponsorship',
    category_en: 'Family',
    category_fa: 'خانواده',
    icon: 'users',
    image: '/images/team.jpg',
    title_en: 'Family Sponsorship',
    title_fa: 'حمایت خانوادگی',
    short_en: 'Keep your family together with a carefully evidenced sponsorship application.',
    short_fa: 'خانواده خود را با درخواست حمایت Familial مستند و دقیق کنار هم نگه دارید.',
    description_en:
      'Family sponsorship applications are examined through the relationship, the sponsor’s status and the applicant’s admissibility. We help you build a clear relationship narrative supported by genuine documents, review sponsorship eligibility and prepare for long processing periods. We do not create evidence, advise on marriages of convenience, or guarantee approval. All family categories and eligibility rules are set by the destination authority.',
    description_fa:
      'درخواست‌های حمایت خانوادگی از طریق رابطه، وضعیت حامی و پذیرش متقاضی بررسی می‌شوند. ما کمک می‌کنیم روایت روشنی از رابطه با مدارک واقعی بسازید، واجد شرایط بودن حامی را بازبینی کنید و برای دوره‌های طولانی پردازش آماده شوید. ما مدرک نمی‌سازیم، درباره ازدواج صوری مشاوره نمی‌دهیم و پذیرش را تضمین نمی‌کنیم. همه دسته‌ها و قواعد خانوادگی توسط مرجع مقصد تعیین می‌شود.',
    eligibility_en: [
      'A qualifying family relationship recognised by the destination',
      'A sponsor with lawful status and sufficient means where required',
      'Genuine and continuing relationship evidence',
      'Health, character and security requirements for applicants',
    ],
    eligibility_fa: [
      'رابطه خانوادگی واجد شرایط و شناخته‌شده توسط مقصد',
      'حامی با وضعیت قانونی و توان مالی کافی در صورت نیاز',
      'شواهد رابطه واقعی و مستمر',
      'الزامات سلامت، سوابق و امنیت برای متقاضیان',
    ],
    documents_en: [
      'Marriage, birth or dependency records',
      'Sponsor status and financial capacity documents',
      'Relationship history and cohabitation evidence',
      'Identity, police and medical records',
      'Statutory declarations or official translations where required',
    ],
    documents_fa: [
      'مدارک ازدواج، تولد یا وابستگی',
      'مدارک وضعیت حامی و توان مالی',
      'تاریخچه رابطه و شواهد زندگی مشترک',
      'مدارک هویت، پلیس و پزشکی',
      'اظهارنامه رسمی یا ترجمه رسمی در صورت نیاز',
    ],
    process_en: [
      'Relationship and sponsor eligibility review',
      'Evidence map and document plan',
      'Application preparation and quality check',
      'Lodgement and request handling',
      'Medical, biometrics and landing guidance',
    ],
    process_fa: [
      'بررسی رابطه و واجد شرایط بودن حامی',
      'نقشه شواهد و برنامه مدارک',
      'آماده‌سازی درخواست و کنترل کیفیت',
      'ثبت درخواست و پاسخ به استعلام‌ها',
      'راهنمایی پزشکی، اثر انگشت و ورود',
    ],
    benefits_en: [
      'Sensitive, respectful case handling',
      'Organised relationship evidence',
      'Realistic timeline expectations',
      'Support with official translations',
    ],
    benefits_fa: [
      'رسیدگی حساس و محترمانه به پرونده',
      'سازمان‌دهی شواهد رابطه',
      'انتظارات واقع‌بینانه از زمان‌بندی',
      'همراهی در ترجمه رسمی',
    ],
    faqs_en: [
      {
        q: 'Can I include my parents?',
        a: 'Some destinations allow parent sponsorship and others do not. Eligibility also depends on dependency and sponsor status. We confirm the current rule for your specific case.',
      },
      {
        q: 'How long does sponsorship take?',
        a: 'Processing varies significantly by category and office. We provide a range only when an official published estimate is available.',
      },
    ],
    faqs_fa: [
      {
        q: 'آیا می‌توانم والدینم را شامل کنم؟',
        a: 'برخی مقصدها حمایت از والدین را اجازه می‌دهند و برخی نه. شرایط به وابستگی و وضعیت حامی نیز بستگی دارد. قاعده به‌روز را برای پرونده مشخص شما تأیید می‌کنیم.',
      },
      {
        q: 'فرایند حمایت چقدر طول می‌کشد؟',
        a: 'زمان پردازش بسته به دسته و دفتر بسیار متفاوت است. تنها زمانی بازه اعلام می‌کنیم که برآورد رسمی منتشرشده موجود باشد.',
      },
    ],
    timeline_en: 'Often a multi-month or multi-year process; official estimates vary by category.',
    timeline_fa: 'اغلب چند ماه تا چند سال؛ برآوردهای رسمی بسته به دسته متفاوت است.',
    featured: 0,
    sort_order: 5,
  },
  {
    slug: 'tourist-visa',
    category_en: 'Visas',
    category_fa: 'ویزا',
    icon: 'plane',
    image: '/images/article-1.jpg',
    title_en: 'Tourist & Visit Visa',
    title_fa: 'ویزای توریستی و بازدید',
    short_en: 'Prepare a credible visit application with clear purpose, funds and return ties.',
    short_fa: 'درخواست بازدید معتبر با هدف، توان مالی و پیوندهای بازگشت شفاف آماده کنید.',
    description_en:
      'Visitor applications are assessed on purpose of travel, ability to fund the trip and incentives to return. We help you organise an honest itinerary, understand the evidence the destination expects, and avoid common inconsistencies. A visa is a permission, not a right; decisions rest with the relevant authority. We do not produce fake invitations, bank documents or employment letters.',
    description_fa:
      'درخواست‌های بازدید بر اساس هدف سفر، توان تأمین هزینه و انگیزه بازگشت بررسی می‌شوند. ما کمک می‌کنیم برنامه سفر صادقانه تنظیم کنید، شواهد مورد انتظار مقصد را بشناسید و از ناسازگاری‌های رایج پرهیز کنید. ویزا یک اجازه است، نه حق؛ تصمیم با مرجع مربوطه است. ما دعوت‌نامه، سند بانکی یا نامه اشتغال جعلی تهیه نمی‌کنیم.',
    eligibility_en: [
      'A clear purpose and duration for the visit',
      'Funds sufficient for transport, accommodation and daily costs',
      'Strong family, employment or financial ties to your home country',
      'Compliance with the destination’s immigration history requirements',
    ],
    eligibility_fa: [
      'هدف و مدت روشن برای بازدید',
      'وجوه کافی برای حمل‌ونقل، اقامت و هزینه‌های روزانه',
      'پیوندهای قوی خانوادگی، شغلی یا مالی با کشور خود',
      'رعایت الزامات سابقه مهاجرتی مقصد',
    ],
    documents_en: [
      'Passport and visa application forms',
      'Travel itinerary and accommodation plan',
      'Bank statements and employment or business evidence',
      'Invitation or host documents where applicable',
      'Travel insurance and return-ticket evidence where requested',
    ],
    documents_fa: [
      'گذرنامه و فرم‌های درخواست ویزا',
      'برنامه سفر و اقامت',
      'صورت‌حساب بانکی و مدارک شغلی یا کسب‌وکار',
      'دعوت‌نامه یا مدارک میزبان در صورت کاربرد',
      'بیمه سفر و شواهد بلیت بازگشت در صورت درخواست',
    ],
    process_en: [
      'Purpose and eligibility conversation',
      'Evidence checklist and itinerary review',
      'Application form quality check',
      'Appointment and biometrics guidance',
      'Decision review and next-step advice',
    ],
    process_fa: [
      'گفت‌وگو درباره هدف و واجد شرایط بودن',
      'چک‌لیست شواهد و بازبینی برنامه سفر',
      'کنترل کیفیت فرم درخواست',
      'راهنمایی وقت سفارت و اثر انگشت',
      'بررسی تصمیم و مشاوره گام بعد',
    ],
    benefits_en: [
      'Honest, destination-specific checklists',
      'Itinerary and evidence consistency review',
      'No fabricated supporting documents',
      'Clear explanation of refusal risks',
    ],
    benefits_fa: [
      'چک‌لیست صادقانه و ویژه هر مقصد',
      'بازبینی هماهنگی برنامه سفر و شواهد',
      'بدون مدارک پشتیبان جعلی',
      'توضیح شفاف ریسک‌های رد شدن',
    ],
    faqs_en: [
      {
        q: 'Can you guarantee a tourist visa?',
        a: 'No. A visa decision is made by the destination authority after reviewing your full circumstances.',
      },
      {
        q: 'Should I buy tickets before approval?',
        a: 'Follow the official guidance for your destination. Many applications only require a reservation or itinerary, not a non-refundable ticket.',
      },
    ],
    faqs_fa: [
      {
        q: 'آیا ویزای توریستی تضمین می‌شود؟',
        a: 'خیر. تصمیم ویزا توسط مرجع مقصد و پس از بررسی کامل شرایط شما گرفته می‌شود.',
      },
      {
        q: 'آیا پیش از تأیید باید بلیت بخرم؟',
        a: 'از راهنمای رسمی مقصد خود پیروی کنید. بسیاری از درخواست‌ها فقط رزرو یا برنامه سفر می‌خواهند، نه بلیت غیرقابل بازگشت.',
      },
    ],
    timeline_en: 'Appointment availability and processing times vary by destination.',
    timeline_fa: 'دسترسی به وقت سفارت و زمان پردازش بسته به مقصد متفاوت است.',
    featured: 0,
    sort_order: 6,
  },
  {
    slug: 'business-immigration',
    category_en: 'Business',
    category_fa: 'کسب‌وکار',
    icon: 'building',
    image: '/images/consultation.jpg',
    title_en: 'Business Immigration',
    title_fa: 'مهاجرت تجاری',
    short_en: 'Explore lawful business-owner and entrepreneur routes with a credible business plan.',
    short_fa: 'مسیرهای قانونی مالکیت کسب‌وکار و کارآفرینی را با طرح تجاری معتبر بررسی کنید.',
    description_en:
      'Business immigration combines corporate, tax and immigration advice. We focus on the immigration evidence: a credible business purpose, genuine investment, owner experience and compliance with local rules. We work alongside your accountant or legal counsel where specialist advice is required, and we do not describe a route as guaranteed or imply that buying a business automatically grants residency.',
    description_fa:
      'مهاجرت تجاری ترکیبی از مشاوره شرکتی، مالیاتی و مهاجرتی است. تمرکز ما بر شواهد مهاجرتی است: هدف تجاری معتبر، سرمایه‌گذاری واقعی، تجربه مالک و رعایت قواعد محلی. در جایی که مشاوره تخصصی لازم است با حسابدار یا مشاور حقوقی شما همکاری می‌کنیم و هیچ مسیری را تضمین‌شده نمی‌دانیم یا ادعا نمی‌کنیم خرید کسب‌وکار به‌طور خودکار اقامت می‌دهد.',
    eligibility_en: [
      'A genuine business purpose and verifiable investment',
      'Relevant ownership or management experience',
      'A business plan consistent with local requirements',
      'Compliance with tax, employment and corporate rules',
    ],
    eligibility_fa: [
      'هدف تجاری واقعی و سرمایه‌گذاری قابل راستی‌آزمایی',
      'تجربه مرتبط مالکیت یا مدیریت',
      'طرح تجاری هماهنگ با الزامات محلی',
      'رعایت قواعد مالیاتی، استخدام و شرکتی',
    ],
    documents_en: [
      'Passport and corporate ownership records',
      'Business plan, financial forecasts and funding evidence',
      'Experience letters and professional qualifications',
      'Local registration, tax and compliance documents',
      'Immigration forms and supporting declarations',
    ],
    documents_fa: [
      'گذرنامه و مدارک مالکیت شرکتی',
      'طرح تجاری، پیش‌بینی مالی و شواهد تأمین مالی',
      'نامه‌های تجربه و مدارک حرفه‌ای',
      'مدارک ثبت محلی، مالیات و انطباق',
      'فرم‌های مهاجرت و اظهارات پشتیبان',
    ],
    process_en: [
      'Business route and eligibility review',
      'Business plan evidence workshop',
      'Corporate and financial document coordination',
      'Immigration application preparation',
      'Post-approval compliance planning',
    ],
    process_fa: [
      'بررسی مسیر تجاری و واجد شرایط بودن',
      'کارگاه شواهد طرح تجاری',
      'هماهنگی مدارک شرکتی و مالی',
      'آماده‌سازی درخواست مهاجرت',
      'برنامه‌ریزی انطباق پس از تأیید',
    ],
    benefits_en: [
      'Immigration evidence aligned with your business plan',
      'Coordination with your financial advisers',
      'Clear separation of immigration and tax advice',
      'Realistic route comparison',
    ],
    benefits_fa: [
      'هماهنگی شواهد مهاجرتی با طرح تجاری',
      'همکاری با مشاوران مالی شما',
      'تفکیک شفاف مشاوره مهاجرت و مالیات',
      'مقایسه واقع‌بینانه مسیرها',
    ],
    faqs_en: [
      {
        q: 'Does buying a business give me residency?',
        a: 'Not automatically. Business ownership must usually satisfy separate immigration criteria. The rules vary by country and should be verified directly.',
      },
      {
        q: 'Do you provide tax advice?',
        a: 'No. We coordinate with qualified local accountants and tax advisers. Our role is limited to immigration preparation and process guidance.',
      },
    ],
    faqs_fa: [
      {
        q: 'آیا خرید کسب‌وکار اقامت می‌دهد؟',
        a: 'به‌طور خودکار خیر. مالکیت کسب‌وکار معمولاً باید معیارهای جداگانه مهاجرتی را برآورده کند. قواعد در هر کشور متفاوت است و باید مستقیم تأیید شود.',
      },
      {
        q: 'آیا مشاوره مالیاتی ارائه می‌دهید؟',
        a: 'خیر. با حسابداران و مشاوران مالیاتی محلی واجد شرایط هماهنگ می‌کنیم. نقش ما محدود به آماده‌سازی مهاجرت و راهنمایی فرایند است.',
      },
    ],
    timeline_en: 'Case-dependent; coordinate with corporate and tax advisers before committing funds.',
    timeline_fa: 'وابسته به پرونده؛ پیش از تعهد سرمایه با مشاوران شرکتی و مالیاتی هماهنگ کنید.',
    featured: 0,
    sort_order: 7,
  },
  {
    slug: 'investment-immigration',
    category_en: 'Business',
    category_fa: 'سرمایه‌گذاری',
    icon: 'trending-up',
    image: '/images/cta-city.jpg',
    title_en: 'Investment Immigration',
    title_fa: 'مهاجرت سرمایه‌گذاری',
    short_en: 'Understand investment-linked residency options, due diligence and source-of-funds evidence.',
    short_fa: 'گزینه‌های اقامت مرتبط با سرمایه‌گذاری، بررسی دقیق و شواهد منشأ وجوه را بشناسید.',
    description_en:
      'Investment routes carry significant financial and legal risk. We help you understand the immigration requirements, the evidence needed to explain lawful source of funds, and the questions to ask before committing capital. We do not sell investments, promise returns, or recommend a financial product. Any investment decision should be made with independent legal and financial advice and verified against the destination’s current official programme.',
    description_fa:
      'مسیرهای سرمایه‌گذاری ریسک مالی و حقوقی قابل توجهی دارند. ما کمک می‌کنیم الزامات مهاجرتی، شواهد لازم برای توضیح منشأ قانونی وجوه و پرسش‌هایی که پیش از تعهد سرمایه باید پرسید را بشناسید. ما سرمایه‌گذاری نمی‌فروشیم، بازدهی تضمین نمی‌کنیم و محصول مالی توصیه نمی‌کنیم. هر تصمیم سرمایه‌گذاری باید با مشاوره حقوقی و مالی مستقل و مطابق برنامه رسمی فعلی مقصد گرفته شود.',
    eligibility_en: [
      'Lawful, documented source of investment funds',
      'The minimum investment or business criteria of the specific route',
      'Health, character and security clearances',
      'Genuine compliance with ongoing programme conditions',
    ],
    eligibility_fa: [
      'منبع قانونی و مستند وجوه سرمایه‌گذاری',
      'حداقل سرمایه یا معیارهای تجاری مسیر مشخص',
      'تأییدیه سلامت، سوابق و امنیت',
      'رعایت واقعی شرایط مستمر برنامه',
    ],
    documents_en: [
      'Source-of-funds and wealth evidence',
      'Bank, tax and corporate records',
      'Investment or subscription documents',
      'Identity, police and medical records',
      'Due-diligence declarations required by the programme',
    ],
    documents_fa: [
      'شواهد منشأ وجوه و ثروت',
      'مدارک بانکی، مالیاتی و شرکتی',
      'مدارک سرمایه‌گذاری یا پذیره‌نویسی',
      'مدارک هویت، پلیس و پزشکی',
      'اظهارات بررسی دقیق مورد نیاز برنامه',
    ],
    process_en: [
      'Programme and risk briefing',
      'Source-of-funds evidence review',
      'Independent adviser coordination',
      'Immigration application preparation',
      'Ongoing compliance and renewal planning',
    ],
    process_fa: [
      'توجیه برنامه و ریسک‌ها',
      'بازبینی شواهد منشأ وجوه',
      'هماهنگی با مشاور مستقل',
      'آماده‌سازی درخواست مهاجرت',
      'برنامه‌ریزی انطباق و تمدید مستمر',
    ],
    benefits_en: [
      'Plain-language explanation of programme conditions',
      'Source-of-funds preparation support',
      'No financial-product sales',
      'Referral to independent specialist review',
    ],
    benefits_fa: [
      'توضیح ساده شرایط برنامه',
      'پشتیبانی آماده‌سازی منشأ وجوه',
      'بدون فروش محصول مالی',
      'ارجاع به بررسی تخصصی مستقل',
    ],
    faqs_en: [
      {
        q: 'Do you handle the investment itself?',
        a: 'No. We do not manage, sell or recommend investments. We focus on the immigration application and coordinate with independent advisers.',
      },
      {
        q: 'Are investment routes available in every country?',
        a: 'No. Programmes open, pause and change frequently. We confirm current availability from official sources before any advice is given.',
      },
    ],
    faqs_fa: [
      {
        q: 'آیا خود سرمایه‌گذاری را انجام می‌دهید؟',
        a: 'خیر. ما سرمایه‌گذاری را مدیریت، فروش یا توصیه نمی‌کنیم. تمرکز ما بر درخواست مهاجرت و هماهنگی با مشاوران مستقل است.',
      },
      {
        q: 'آیا مسیر سرمایه‌گذاری در همه کشورها وجود دارد؟',
        a: 'خیر. برنامه‌ها مکرر باز، متوقف یا تغییر می‌کنند. پیش از هر مشاوره، دسترسی فعلی را از منابع رسمی تأیید می‌کنیم.',
      },
    ],
    timeline_en: 'Programme-dependent; verification and due diligence take time.',
    timeline_fa: 'وابسته به برنامه؛ راستی‌آزمایی و بررسی دقیق زمان‌بر است.',
    featured: 0,
    sort_order: 8,
  },
  {
    slug: 'citizenship',
    category_en: 'Immigration',
    category_fa: 'مهاجرت',
    icon: 'landmark',
    image: '/images/destination-uk.jpg',
    title_en: 'Citizenship & Naturalization',
    title_fa: 'شهروندی و تابعیت',
    short_en: 'Understand residence, language and good-character requirements for naturalization.',
    short_fa: 'الزامات اقامت، زبان و حسن سابقه برای تابعیت را بشناسید.',
    description_en:
      'Naturalization is the final stage of a long immigration journey and depends on years of lawful residence, physical presence, language, civic knowledge and character requirements. We review your timeline, identify gaps and help organise the supporting evidence. Citizenship law is complex and changes; eligibility must always be confirmed against the official rules of the relevant country at the time of application.',
    description_fa:
      'تابعیت آخرین مرحله یک سفر طولانی مهاجرتی است و به سال‌های اقامت قانونی، حضور فیزیکی، زبان، دانش مدنی و الزامات حسن سابقه بستگی دارد. جدول زمانی شما را بررسی می‌کنیم، شکاف‌ها را شناسایی می‌کنیم و به سازمان‌دهی شواهد کمک می‌کنیم. قوانین شهروندی پیچیده و متغیرند؛ واجد شرایط بودن باید همیشه در زمان درخواست با قواعد رسمی کشور مربوطه تأیید شود.',
    eligibility_en: [
      'The required period of lawful residence and physical presence',
      'Language and civic-knowledge requirements where applicable',
      'Good character and absence of disqualifying conditions',
      'Compliance with tax, travel and residence conditions',
    ],
    eligibility_fa: [
      'دوره لازم اقامت قانونی و حضور فیزیکی',
      'الزامات زبان و دانش مدنی در صورت کاربرد',
      'حسن سابقه و نبود شرایط ناقض',
      'رعایت شرایط مالیاتی، سفر و اقامت',
    ],
    documents_en: [
      'Residence permits and travel history',
      'Passport and identity records',
      'Language or citizenship test results',
      'Tax and employment records',
      'Police certificates and official forms',
    ],
    documents_fa: [
      'مجوزهای اقامت و تاریخچه سفر',
      'گذرنامه و مدارک هویت',
      'نتایج آزمون زبان یا شهروندی',
      'مدارک مالیاتی و اشتغال',
      'گواهی پلیس و فرم‌های رسمی',
    ],
    process_en: [
      'Residence timeline audit',
      'Eligibility and gap review',
      'Evidence preparation',
      'Application and appointment guidance',
      'Ceremony and passport next steps',
    ],
    process_fa: [
      'ممیزی جدول زمانی اقامت',
      'بررسی واجد شرایط بودن و شکاف‌ها',
      'آماده‌سازی شواهد',
      'راهنمایی درخواست و وقت',
      'مراسم و گام‌های بعدی گذرنامه',
    ],
    benefits_en: [
      'Detailed residence and absence review',
      'Clear list of official requirements',
      'Support with timeline evidence',
      'No shortcuts or misrepresentation',
    ],
    benefits_fa: [
      'بررسی دقیق اقامت و غیبت‌ها',
      'فهرست روشن الزامات رسمی',
      'پشتیبانی شواهد جدول زمانی',
      'بدون میان‌بر یا ارائه اطلاعات نادرست',
    ],
    faqs_en: [
      {
        q: 'Can I apply early?',
        a: 'Some routes allow early application in limited circumstances. You should confirm the current discretion and rules with the official authority before relying on them.',
      },
      {
        q: 'Do you guarantee citizenship?',
        a: 'No. Citizenship is granted only by the relevant government after a full assessment.',
      },
    ],
    faqs_fa: [
      {
        q: 'آیا می‌توانم زودتر درخواست دهم؟',
        a: 'برخی مسیرها در شرایط محدود امکان درخواست زودهنگام می‌دهند. پیش از اتکا، باید صلاح‌دید و قواعد فعلی را با مرجع رسمی تأیید کنید.',
      },
      {
        q: 'آیا شهروندی تضمین می‌شود؟',
        a: 'خیر. شهروندی تنها توسط دولت مربوطه و پس از ارزیابی کامل اعطا می‌شود.',
      },
    ],
    timeline_en: 'Depends on the statutory residence period and authority processing.',
    timeline_fa: 'بسته به دوره اقامت قانونی و زمان پردازش مرجع متفاوت است.',
    featured: 0,
    sort_order: 9,
  },
  {
    slug: 'document-preparation',
    category_en: 'Support',
    category_fa: 'پشتیبانی',
    icon: 'file-check',
    image: '/images/blog-1.jpg',
    title_en: 'Document Preparation & Translation',
    title_fa: 'آماده‌سازی مدارک و ترجمه',
    short_en: 'Organise, translate and quality-check the documents your application depends on.',
    short_fa: 'مدارکی که درخواست شما به آن‌ها وابسته است را سازمان‌دهی، ترجمه و کنترل کنید.',
    description_en:
      'Applications often fail on avoidable document issues: inconsistent names, missing pages, unexplained gaps or untranslated seals. We build a document index, check completeness and consistency, and coordinate with accredited translators where official translation is required. We do not certify translations ourselves unless properly authorised, and we never alter original documents or official records.',
    description_fa:
      'درخواست‌ها اغلب به دلیل مشکلات قابل پیشگیری مدارک رد می‌شوند: ناسازگاری نام‌ها، صفحات ناقص، شکاف‌های توضیح‌داده‌نشده یا مهرهای ترجمه‌نشده. فهرست مدارک می‌سازیم، کامل بودن و هماهنگی را بررسی می‌کنیم و در جایی که ترجمه رسمی لازم است با مترجمان معتبر هماهنگ می‌کنیم. ما خودمان ترجمه را تأیید نمی‌کنیم مگر مجاز باشیم و هرگز اسناد اصلی یا سوابق رسمی را تغییر نمی‌دهیم.',
    eligibility_en: [
      'A defined application or document set',
      'Original or certified copies available for review',
      'Accurate personal and family information',
      'Adequate time before official deadlines',
    ],
    eligibility_fa: [
      'درخواست یا مجموعه مدارک مشخص',
      'نسخه اصلی یا کپی تأییدشده برای بررسی',
      'اطلاعات دقیق شخصی و خانوادگی',
      'زمان کافی پیش از مهلت‌های رسمی',
    ],
    documents_en: [
      'The documents listed in your application checklist',
      'Original documents for verification where required',
      'Certified translations from an approved translator',
      'Any correction or explanation records',
      'A complete digital index of submitted files',
    ],
    documents_fa: [
      'مدارک فهرست‌شده در چک‌لیست درخواست',
      'اسناد اصلی برای راستی‌آزمایی در صورت نیاز',
      'ترجمه تأییدشده از مترجم مورد تأیید',
      'هرگونه سابقه اصلاح یا توضیح',
      'فهرست دیجیتال کامل فایل‌های ارسالی',
    ],
    process_en: [
      'Checklist and document inventory',
      'Gap and inconsistency report',
      'Translation coordination',
      'Final quality and naming check',
      'Secure delivery and archive copy',
    ],
    process_fa: [
      'چک‌لیست و فهرست مدارک',
      'گزارش شکاف و ناسازگاری',
      'هماهنگی ترجمه',
      'کنترل نهایی کیفیت و نام‌گذاری',
      'تحویل امن و نسخه آرشیو',
    ],
    benefits_en: [
      'Fewer avoidable inconsistencies',
      'A single, organised document index',
      'Accredited translation coordination',
      'Secure handling of sensitive records',
    ],
    benefits_fa: [
      'کاهش ناسازگاری‌های قابل پیشگیری',
      'یک فهرست واحد و منظم مدارک',
      'هماهنگی ترجمه معتبر',
      'رسیدگی امن به سوابق حساس',
    ],
    faqs_en: [
      {
        q: 'Do you provide certified translations?',
        a: 'We coordinate with accredited translators. Certification is issued by the translator or authority permitted to do so, not by Apply Now.',
      },
      {
        q: 'Can you fix an error in my document?',
        a: 'No. Corrections must be made by the issuing authority. We can help you identify the issue and prepare an explanation where appropriate.',
      },
    ],
    faqs_fa: [
      {
        q: 'آیا ترجمه رسمی ارائه می‌دهید؟',
        a: 'با مترجمان معتبر هماهنگ می‌کنیم. تأییدیه توسط مترجم یا مرجع مجاز صادر می‌شود، نه Apply Now.',
      },
      {
        q: 'آیا می‌توانید خطای مدرک من را اصلاح کنید؟',
        a: 'خیر. اصلاح باید توسط مرجع صادرکننده انجام شود. می‌توانیم به شناسایی مشکل و آماده‌سازی توضیح در صورت لزوم کمک کنیم.',
      },
    ],
    timeline_en: 'Depends on document availability and translation lead times.',
    timeline_fa: 'بسته به دسترسی مدارک و زمان ترجمه متفاوت است.',
    featured: 0,
    sort_order: 10,
  },
];

export const destinations = [
  {
    slug: 'canada',
    country_code: 'CA',
    flag: '/images/flags/canada.png',
    image: '/images/destination-canada.jpg',
    name_en: 'Canada',
    name_fa: 'کانادا',
    tagline_en: 'Study, work and build a long-term future',
    tagline_fa: 'تحصیل، کار و ساختن آینده‌ای بلندمدت',
    overview_en:
      'Canada combines internationally recognised institutions with a range of study, work and family pathways. Its immigration system is structured but highly competitive, and eligibility depends on factors such as age, language, education, occupation and funds. We help you compare federal and provincial options from official sources, build a realistic timeline and understand where professional licensing or a job offer may be required.',
    overview_fa:
      'کانادا مؤسسات شناخته‌شده بین‌المللی را با طیفی از مسیرهای تحصیل، کار و خانواده ترکیب می‌کند. نظام مهاجرتی آن ساختارمند اما بسیار رقابتی است و واجد شرایط بودن به عواملی مانند سن، زبان، تحصیل، شغل و سرمایه بستگی دارد. ما کمک می‌کنیم گزینه‌های فدرال و استانی را از منابع رسمی مقایسه کنید، جدول زمانی واقع‌بینانه بسازید و بدانید کجا ممکن است مجوز حرفه‌ای یا پیشنهاد شغلی لازم باشد.',
    education_en:
      'Canada offers college, undergraduate and postgraduate study across English- and French-speaking provinces. Programme length, institution designation and post-study work eligibility are important planning factors. Always confirm designation and permit rules with the institution and IRCC before enrolling.',
    education_fa:
      'کانادا برنامه‌های کالج، کارشناسی و تحصیلات تکمیلی در استان‌های انگلیسی‌زبان و فرانسه‌زبان ارائه می‌دهد. مدت برنامه، تعیین‌شدگی مؤسسه و واجد شرایط بودن کار پس از تحصیل از عوامل مهم برنامه‌ریزی هستند. پیش از ثبت‌نام، تعیین‌شدگی و قواعد مجوز را با مؤسسه و IRCC تأیید کنید.',
    universities_en: ['University of Toronto', 'University of British Columbia', 'McGill University', 'University of Waterloo'],
    universities_fa: ['دانشگاه تورنتو', 'دانشگاه بریتیش کلمبیا', 'دانشگاه مک‌گیل', 'دانشگاه واترلو'],
    study_pathways_en: ['Study permit for a designated learning institution', 'Short-term study or exchange options where permitted', 'Post-graduation work options subject to current rules'],
    study_pathways_fa: ['مجوز تحصیل برای مؤسسه آموزشی تعیین‌شده', 'گزینه‌های تحصیل کوتاه‌مدت یا تبادل در صورت مجاز بودن', 'گزینه‌های کار پس از فارغ‌التحصیلی مطابق قواعد فعلی'],
    work_pathways_en: ['Employer-supported work permit', 'International mobility and specialist categories', 'Provincial nomination where eligible'],
    work_pathways_fa: ['مجوز کار با حمایت کارفرما', 'دسته‌های تحرک بین‌المللی و تخصصی', 'معرفی استانی در صورت واجد شرایط بودن'],
    pr_pathways_en: ['Express Entry categories', 'Provincial nominee programmes', 'Family sponsorship', 'Canadian experience pathways'],
    pr_pathways_fa: ['دسته‌های ورود سریع', 'برنامه‌های معرفی استانی', 'حمایت خانوادگی', 'مسیرهای تجربه کانادایی'],
    family_pathways_en: ['Spouse or partner sponsorship', 'Dependent child sponsorship', 'Parent and grandparent programmes where open'],
    family_pathways_fa: ['حمایت همسر یا شریک', 'حمایت فرزند وابسته', 'برنامه‌های والدین و پدربزرگ و مادربزرگ در صورت باز بودن'],
    investment_pathways_en: ['Provincial entrepreneur streams where available', 'Business owner routes subject to programme conditions'],
    investment_pathways_fa: ['جریان‌های کارآفرینی استانی در صورت وجود', 'مسیرهای مالک کسب‌وکار مطابق شرایط برنامه'],
    highlights_en: ['High-quality education', 'Structured immigration system', 'Bilingual society', 'Long-term settlement pathways'],
    highlights_fa: ['آموزش با کیفیت بالا', 'نظام مهاجرتی ساختارمند', 'جامعه دوزبانه', 'مسیرهای اسکان بلندمدت'],
    eligibility_en: ['Valid passport and lawful application status', 'Language evidence accepted by the chosen route', 'Proof of funds and source documentation', 'Health, character and biometric checks'],
    eligibility_fa: ['گذرنامه معتبر و وضعیت قانونی درخواست', 'مدرک زبان پذیرفته‌شده در مسیر انتخابی', 'اثبات وجوه و مدارک منبع', 'بررسی سلامت، سوابق و اثر انگشت'],
    documents_en: ['Passport and photographs', 'Academic and language records', 'Financial statements and sponsor letters', 'Employment references and CV', 'Police and medical certificates when requested'],
    documents_fa: ['گذرنامه و عکس', 'مدارک تحصیلی و زبان', 'صورت‌های مالی و نامه حامی', 'معرفی‌نامه‌های شغلی و رزومه', 'گواهی پلیس و پزشکی در صورت درخواست'],
    process_en: ['Eligibility and route review', 'Evidence plan', 'Application preparation', 'Submission and follow-up', 'Pre-arrival and settlement planning'],
    process_fa: ['بررسی واجد شرایط بودن و مسیر', 'برنامه شواهد', 'آماده‌سازی درخواست', 'ارسال و پیگیری', 'برنامه‌ریزی پیش از ورود و اسکان'],
    featured: 1,
    sort_order: 1,
  },
  {
    slug: 'germany',
    country_code: 'DE',
    flag: '/images/flags/germany.png',
    image: '/images/destination-germany.jpg',
    name_en: 'Germany',
    name_fa: 'آلمان',
    tagline_en: 'World-class education and a strong professional market',
    tagline_fa: 'آموزش در سطح جهانی و بازار حرفه‌ای قوی',
    overview_en:
      'Germany is a leading destination for engineering, technology, research and vocational education. Many public universities charge low or no tuition, but living costs, language requirements and admission equivalency still matter. Skilled-worker and job-seeker routes are regulated, and recognition of foreign qualifications can be essential. We help you build a programme and visa plan that reflects your actual qualifications and German language level.',
    overview_fa:
      'آلمان مقصدی پیشرو برای مهندسی، فناوری، پژوهش و آموزش حرفه‌ای است. بسیاری از دانشگاه‌های دولتی شهریه کم یا بدون شهریه دارند، اما هزینه زندگی، الزامات زبان و معادل‌سازی مدرک همچنان مهم است. مسیرهای کارگر ماهر و جستجوی کار تنظیم‌شده‌اند و شناسایی مدارک خارجی می‌تواند ضروری باشد. ما کمک می‌کنیم برنامه و نقشه ویزا را مطابق مدارک واقعی و سطح زبان آلمانی شما بسازید.',
    education_en:
      'Germany offers research universities, universities of applied sciences and dual vocational programmes. Admission often requires recognised prior education, and some programmes are taught in German. Confirm each programme’s language, deadline and recognition requirements directly with the institution.',
    education_fa:
      'آلمان دانشگاه‌های پژوهشی، دانشگاه‌های علوم کاربردی و برنامه‌های حرفه‌ای دوگانه ارائه می‌دهد. پذیرش اغلب به تحصیلات پیشین شناخته‌شده نیاز دارد و برخی برنامه‌ها به زبان آلمانی ارائه می‌شوند. الزامات زبان، مهلت و شناسایی هر برنامه را مستقیماً با مؤسسه تأیید کنید.',
    universities_en: ['Technical University of Munich', 'Heidelberg University', 'RWTH Aachen University', 'Humboldt University of Berlin'],
    universities_fa: ['دانشگاه فنی مونیخ', 'دانشگاه هایدلبرگ', 'دانشگاه RWTH آخن', 'دانشگاه هومبولت برلین'],
    study_pathways_en: ['Student visa for an admitted programme', 'Preparatory or language study where appropriate', 'Doctoral and research routes'],
    study_pathways_fa: ['ویزای تحصیلی برای برنامه پذیرفته‌شده', 'تحصیل آماده‌سازی یا زبان در صورت مناسب بودن', 'مسیرهای دکتری و پژوهش'],
    work_pathways_en: ['Skilled-worker visa with recognised qualification', 'Job-seeker opportunity card where eligible', 'EU Blue Card for qualifying roles'],
    work_pathways_fa: ['ویزای کارگر ماهر با مدرک شناسایی‌شده', 'کارت فرصت جستجوی کار در صورت واجد شرایط بودن', 'کارت آبی اتحادیه اروپا برای مشاغل واجد شرایط'],
    pr_pathways_en: ['Settlement after qualifying residence', 'EU long-term residence where eligible', 'Family reunification pathways'],
    pr_pathways_fa: ['اقامت پس از دوره واجد شرایط', 'اقامت بلندمدت اتحادیه اروپا در صورت واجد شرایط بودن', 'مسیرهای پیوستن خانواده'],
    family_pathways_en: ['Spouse and child reunification', 'Parental reunification in limited cases', 'Recognition of same-sex family rights under applicable law'],
    family_pathways_fa: ['پیوستن همسر و فرزند', 'پیوستن والدین در موارد محدود', 'شناسایی حقوق خانواده‌های همجنس مطابق قانون قابل اجرا'],
    investment_pathways_en: ['Self-employment routes for viable business projects', 'Entrepreneur visa subject to local assessment'],
    investment_pathways_fa: ['مسیرهای خوداشتغالی برای پروژه‌های تجاری معتبر', 'ویزای کارآفرینی مشروط به ارزیابی محلی'],
    highlights_en: ['Research and engineering excellence', 'Low or no tuition at many public universities', 'Strong industrial economy', 'Central European location'],
    highlights_fa: ['تعالی پژوهش و مهندسی', 'شهریه کم یا بدون شهریه در بسیاری از دانشگاه‌های دولتی', 'اقتصاد صنعتی قوی', 'موقعیت اروپای مرکزی'],
    eligibility_en: ['Recognised school or university qualification', 'Language ability for the programme or job', 'Proof of funds and health insurance', 'Valid passport and legal basis for entry'],
    eligibility_fa: ['مدرک تحصیلی شناسایی‌شده', 'توانایی زبان برای برنامه یا شغل', 'اثبات وجوه و بیمه درمانی', 'گذرنامه معتبر و مبنای قانونی ورود'],
    documents_en: ['Passport and application forms', 'Academic records and credential recognition', 'Language certificate', 'Financial evidence or blocked account where required', 'Health insurance and admission letter'],
    documents_fa: ['گذرنامه و فرم‌های درخواست', 'مدارک تحصیلی و شناسایی مدرک', 'گواهی زبان', 'شواهد مالی یا حساب مسدود در صورت نیاز', 'بیمه درمانی و نامه پذیرش'],
    process_en: ['Qualification and language review', 'Programme or job shortlist', 'Document and recognition plan', 'Visa appointment preparation', 'Arrival registration and residence planning'],
    process_fa: ['بررسی مدارک و زبان', 'انتخاب برنامه یا شغل', 'برنامه مدارک و شناسایی', 'آماده‌سازی وقت ویزا', 'ثبت ورود و برنامه‌ریزی اقامت'],
    featured: 1,
    sort_order: 2,
  },
  {
    slug: 'australia',
    country_code: 'AU',
    flag: '/images/flags/australia.png',
    image: '/images/destination-australia.jpg',
    name_en: 'Australia',
    name_fa: 'استرالیا',
    tagline_en: 'Quality education and a skills-focused immigration system',
    tagline_fa: 'آموزش با کیفیت و نظام مهاجرتی مبتنی بر مهارت',
    overview_en:
      'Australia’s immigration system is points-based for many skilled routes and closely linked to occupation demand. Study pathways can support later work options, but not every course or provider leads to the same outcome. We help you assess occupation lists, skills assessment requirements, genuine student criteria and the real cost of living before committing to a programme.',
    overview_fa:
      'نظام مهاجرتی استرالیا برای بسیاری از مسیرهای ماهر مبتنی بر امتیاز است و به تقاضای شغلی وابسته است. مسیرهای تحصیلی می‌توانند از گزینه‌های کاری بعدی پشتیبانی کنند، اما هر دوره یا مؤسسه به نتیجه یکسان منتهی نمی‌شود. ما کمک می‌کنیم فهرست مشاغل، الزامات ارزیابی مهارت، معیارهای دانشجوی واقعی و هزینه واقعی زندگی را پیش از تعهد به برنامه بررسی کنید.',
    education_en:
      'Australia has universities, vocational providers and English-language institutions. Provider registration, course level and post-study work rules are critical. Confirm the current register and visa conditions before choosing a programme.',
    education_fa:
      'استرالیا دانشگاه‌ها، ارائه‌دهندگان آموزش حرفه‌ای و مؤسسات زبان انگلیسی دارد. ثبت ارائه‌دهنده، سطح دوره و قواعد کار پس از تحصیل حیاتی هستند. پیش از انتخاب برنامه، ثبت فعلی و شرایط ویزا را تأیید کنید.',
    universities_en: ['University of Melbourne', 'University of Sydney', 'Australian National University', 'University of New South Wales'],
    universities_fa: ['دانشگاه ملبورن', 'دانشگاه سیدنی', 'دانشگاه ملی استرالیا', 'دانشگاه نیو ساوت ولز'],
    study_pathways_en: ['Student visa for an eligible course', 'English language and pathway programmes', 'Post-study work options subject to current rules'],
    study_pathways_fa: ['ویزای دانشجویی برای دوره واجد شرایط', 'برنامه‌های زبان انگلیسی و مسیر آماده‌سازی', 'گزینه‌های کار پس از تحصیل مطابق قواعد فعلی'],
    work_pathways_en: ['Employer-sponsored skilled work', 'Points-tested independent skilled routes', 'Regional and designated-area options'],
    work_pathways_fa: ['کار ماهر با حمایت کارفرما', 'مسیرهای مستقل ماهر مبتنی بر امتیاز', 'گزینه‌های منطقه‌ای و مناطق تعیین‌شده'],
    pr_pathways_en: ['General skilled migration categories', 'Employer nomination', 'Family and partner routes'],
    pr_pathways_fa: ['دسته‌های مهاجرت ماهر عمومی', 'معرفی کارفرما', 'مسیرهای خانواده و شریک'],
    family_pathways_en: ['Partner visa pathways', 'Child and parent categories', 'Family sponsorship subject to caps and rules'],
    family_pathways_fa: ['مسیرهای ویزای شریک', 'دسته‌های فرزند و والدین', 'حمایت خانوادگی مشروط به سهمیه و قواعد'],
    investment_pathways_en: ['Business innovation and investment streams where open', 'State or territory nomination conditions'],
    investment_pathways_fa: ['جریان‌های نوآوری و سرمایه‌گذاری تجاری در صورت باز بودن', 'شرایط معرفی ایالت یا قلمرو'],
    highlights_en: ['Globally ranked universities', 'Clear skilled-occupation framework', 'High quality of life', 'Regional pathway options'],
    highlights_fa: ['دانشگاه‌های با رتبه جهانی', 'چارچوب روشن مشاغل ماهر', 'کیفیت بالای زندگی', 'گزینه‌های مسیر منطقه‌ای'],
    eligibility_en: ['Skills assessment for the nominated occupation', 'English and points requirements', 'Health and character checks', 'Sufficient funds and genuine application evidence'],
    eligibility_fa: ['ارزیابی مهارت برای شغل معرفی‌شده', 'الزامات زبان و امتیاز', 'بررسی سلامت و سوابق', 'وجوه کافی و شواهد درخواست واقعی'],
    documents_en: ['Passport and identity records', 'Skills assessment outcome', 'English test results', 'Employment references and qualifications', 'Financial, health and police documents'],
    documents_fa: ['گذرنامه و مدارک هویت', 'نتیجه ارزیابی مهارت', 'نتایج آزمون زبان', 'معرفی‌نامه‌های شغلی و مدارک تحصیلی', 'مدارک مالی، سلامت و پلیس'],
    process_en: ['Occupation and points review', 'Skills assessment planning', 'Expression of interest strategy', 'Visa application preparation', 'Arrival and settlement checklist'],
    process_fa: ['بررسی شغل و امتیاز', 'برنامه‌ریزی ارزیابی مهارت', 'استراتژی ابراز علاقه', 'آماده‌سازی درخواست ویزا', 'چک‌لیست ورود و اسکان'],
    featured: 1,
    sort_order: 3,
  },
  {
    slug: 'united-kingdom',
    country_code: 'GB',
    flag: '/images/flags/uk.png',
    image: '/images/destination-uk.jpg',
    name_en: 'United Kingdom',
    name_fa: 'بریتانیا',
    tagline_en: 'A global hub for education and professional opportunity',
    tagline_fa: 'قطبی جهانی برای آموزش و فرصت حرفه‌ای',
    overview_en:
      'The United Kingdom offers a dense concentration of universities and a regulated visa system. Student, graduate, skilled-worker and family routes each have specific requirements, and financial evidence and institution sponsorship are central. We help you understand the route that matches your goal and prepare a consistent application without overstating outcomes.',
    overview_fa:
      'بریتانیا تراکم بالایی از دانشگاه‌ها و نظام ویزای تنظیم‌شده دارد. مسیرهای دانشجویی، فارغ‌التحصیلی، کارگر ماهر و خانواده هر یک الزامات مشخصی دارند و شواهد مالی و حمایت مؤسسه محوری هستند. ما کمک می‌کنیم مسیر متناسب با هدف خود را بشناسید و درخواستی منسجم بدون بزرگ‌نمایی نتیجه آماده کنید.',
    education_en:
      'UK programmes range from foundation and undergraduate degrees to intensive master’s courses. Institution sponsorship, course level and compliance requirements matter. Check the current provider register and the conditions attached to your chosen route.',
    education_fa:
      'برنامه‌های بریتانیا از دوره‌های پایه و کارشناسی تا کارشناسی ارشد فشرده را شامل می‌شود. حمایت مؤسسه، سطح دوره و الزامات انطباق اهمیت دارند. ثبت فعلی ارائه‌دهنده و شرایط مسیر انتخابی را بررسی کنید.',
    universities_en: ['University of Oxford', 'University of Cambridge', 'Imperial College London', 'University of Edinburgh'],
    universities_fa: ['دانشگاه آکسفورد', 'دانشگاه کمبریج', 'کالج امپریال لندن', 'دانشگاه ادینبرو'],
    study_pathways_en: ['Student route with a licensed sponsor', 'Short-term study where permitted', 'Graduate route subject to current terms'],
    study_pathways_fa: ['مسیر دانشجویی با حامی دارای مجوز', 'تحصیل کوتاه‌مدت در صورت مجاز بودن', 'مسیر فارغ‌التحصیلی مطابق شرایط فعلی'],
    work_pathways_en: ['Skilled Worker route with a licensed employer', 'Global talent and specialist routes', 'Graduate transition where eligible'],
    work_pathways_fa: ['مسیر کارگر ماهر با کارفرمای دارای مجوز', 'مسیرهای استعداد جهانی و تخصصی', 'گذار فارغ‌التحصیلی در صورت واجد شرایط بودن'],
    pr_pathways_en: ['Settlement after qualifying residence', 'Family routes leading to settlement', 'Long-residence options where eligible'],
    pr_pathways_fa: ['اقامت پس از دوره واجد شرایط', 'مسیرهای خانوادگی منتهی به اقامت', 'گزینه‌های اقامت طولانی در صورت واجد شرایط بودن'],
    family_pathways_en: ['Partner and spouse routes', 'Child dependants', 'Parent routes in limited circumstances'],
    family_pathways_fa: ['مسیرهای شریک و همسر', 'فرزندان وابسته', 'مسیرهای والدین در شرایط محدود'],
    investment_pathways_en: ['Innovator and business routes subject to endorsement', 'No general passive-investment route should be assumed'],
    investment_pathways_fa: ['مسیرهای نوآور و تجاری مشروط به تأیید', 'نباید مسیر سرمایه‌گذاری غیرفعال عمومی را فرض کرد'],
    highlights_en: ['World-leading universities', 'Diverse professional market', 'Accessible legal system', 'Strong cultural and transport links'],
    highlights_fa: ['دانشگاه‌های پیشرو جهان', 'بازار حرفه‌ای متنوع', 'نظام حقوقی قابل دسترس', 'پیوندهای فرهنگی و حمل‌ونقل قوی'],
    eligibility_en: ['Institution or employer sponsorship where required', 'English language evidence', 'Maintenance funds and financial documentation', 'Genuine intention and immigration compliance'],
    eligibility_fa: ['حمایت مؤسسه یا کارفرما در صورت نیاز', 'شواهد زبان انگلیسی', 'وجوه نگهداری و مدارک مالی', 'قصد واقعی و رعایت مقررات مهاجرت'],
    documents_en: ['Passport and application form', 'CAS or sponsorship certificate where applicable', 'Financial evidence meeting current rules', 'Academic and language records', 'TB test or police certificate when required'],
    documents_fa: ['گذرنامه و فرم درخواست', 'CAS یا گواهی حمایت در صورت کاربرد', 'شواهد مالی مطابق قواعد فعلی', 'مدارک تحصیلی و زبان', 'آزمون سل یا گواهی پلیس در صورت نیاز'],
    process_en: ['Route and eligibility review', 'Sponsor and document plan', 'Application preparation', 'Biometrics and interview guidance', 'Arrival and residence next steps'],
    process_fa: ['بررسی مسیر و واجد شرایط بودن', 'برنامه حامی و مدارک', 'آماده‌سازی درخواست', 'راهنمایی اثر انگشت و مصاحبه', 'گام‌های ورود و اقامت'],
    featured: 1,
    sort_order: 4,
  },
  {
    slug: 'united-states',
    country_code: 'US',
    flag: '/images/flags/usa.png',
    image: '/images/destination-usa.jpg',
    name_en: 'United States',
    name_fa: 'ایالات متحده آمریکا',
    tagline_en: 'Diverse institutions and specialist career pathways',
    tagline_fa: 'مؤسسات متنوع و مسیرهای شغلی تخصصی',
    overview_en:
      'The United States has an exceptionally diverse higher-education system and multiple employment-based visa categories. Applications are institution- and category-specific, with strict documentary and interview requirements. We help you build a realistic school list, understand F-1 and employment-based considerations, and prepare consistent evidence. Immigration law is complex; specialist legal advice may be required.',
    overview_fa:
      'ایالات متحده نظام آموزش عالی بسیار متنوع و دسته‌های متعدد ویزای اشتغال دارد. درخواست‌ها وابسته به مؤسسه و دسته هستند و الزامات مدارک و مصاحبه سخت‌گیرانه دارند. ما کمک می‌کنیم فهرست واقع‌بینانه دانشگاه بسازید، ملاحظات F-1 و اشتغال را بشناسید و شواهد منسجم آماده کنید. قانون مهاجرت پیچیده است؛ ممکن است مشاوره حقوقی تخصصی لازم باشد.',
    education_en:
      'US institutions range from community colleges to research universities, each with its own admissions and funding process. Confirm accreditation, programme length, OPT eligibility and total cost directly with the institution.',
    education_fa:
      'مؤسسات آمریکا از کالج‌های محلی تا دانشگاه‌های پژوهشی متفاوت‌اند و هر یک فرایند پذیرش و تأمین مالی خود را دارد. اعتبارسنجی، مدت برنامه، واجد شرایط بودن OPT و هزینه کل را مستقیماً با مؤسسه تأیید کنید.',
    universities_en: ['Massachusetts Institute of Technology', 'Harvard University', 'Stanford University', 'University of California, Berkeley'],
    universities_fa: ['مؤسسه فناوری ماساچوست', 'دانشگاه هاروارد', 'دانشگاه استنفورد', 'دانشگاه کالیفرنیا برکلی'],
    study_pathways_en: ['F-1 student visa for an SEVP-certified programme', 'Exchange visitor programmes where eligible', 'Short-term study options'],
    study_pathways_fa: ['ویزای دانشجویی F-1 برای برنامه تأییدشده SEVP', 'برنامه‌های مبادله در صورت واجد شرایط بودن', 'گزینه‌های تحصیل کوتاه‌مدت'],
    work_pathways_en: ['H-1B and specialty occupation routes', 'Intracompany transfer categories', 'Employment-based immigrant petitions'],
    work_pathways_fa: ['مسیرهای H-1B و مشاغل تخصصی', 'دسته‌های انتقال درون‌شرکتی', 'دادخواست‌های مهاجرت مبتنی بر اشتغال'],
    pr_pathways_en: ['Employment-based preference categories', 'Family-sponsored petitions', 'Diversity visa where eligible'],
    pr_pathways_fa: ['دسته‌های اولویت مبتنی بر اشتغال', 'دادخواست‌های حمایت خانوادگی', 'ویزای تنوع در صورت واجد شرایط بودن'],
    family_pathways_en: ['Immediate relative petitions', 'Family preference categories', 'Fiancé(e) route where applicable'],
    family_pathways_fa: ['دادخواست‌های خویشاوندان درجه یک', 'دسته‌های اولویت خانوادگی', 'مسیر نامزد در صورت کاربرد'],
    investment_pathways_en: ['EB-5 and treaty-investor routes subject to strict rules', 'Business visas requiring independent legal review'],
    investment_pathways_fa: ['مسیرهای EB-5 و سرمایه‌گذار معاهده‌ای مطابق قواعد سخت', 'ویزاهای تجاری نیازمند بررسی حقوقی مستقل'],
    highlights_en: ['Widest choice of institutions', 'Strong research ecosystem', 'Specialist career markets', 'Multiple visa categories'],
    highlights_fa: ['گسترده‌ترین انتخاب مؤسسات', 'اکوسیستم پژوهشی قوی', 'بازارهای شغلی تخصصی', 'دسته‌های متعدد ویزا'],
    eligibility_en: ['Admission or employer petition as required', 'Financial capacity and ties evidence', 'English proficiency for study', 'Strict interview and security checks'],
    eligibility_fa: ['پذیرش یا دادخواست کارفرما در صورت نیاز', 'توان مالی و شواهد پیوندها', 'مهارت زبان انگلیسی برای تحصیل', 'بررسی‌های سخت‌گیرانه مصاحبه و امنیت'],
    documents_en: ['Passport and DS forms', 'Admission letter and I-20 where applicable', 'Financial evidence', 'Academic and test records', 'Employment and petition documents for work routes'],
    documents_fa: ['گذرنامه و فرم‌های DS', 'نامه پذیرش و I-20 در صورت کاربرد', 'شواهد مالی', 'مدارک تحصیلی و آزمون', 'مدارک اشتغال و دادخواست برای مسیرهای کاری'],
    process_en: ['Goal and route assessment', 'Institution or employer application', 'Financial and document review', 'Visa appointment preparation', 'Pre-arrival and compliance briefing'],
    process_fa: ['ارزیابی هدف و مسیر', 'درخواست مؤسسه یا کارفرما', 'بررسی مالی و مدارک', 'آماده‌سازی وقت ویزا', 'توجیه پیش از ورود و انطباق'],
    featured: 0,
    sort_order: 5,
  },
  {
    slug: 'netherlands',
    country_code: 'NL',
    flag: '/images/flags/netherlands.png',
    image: '/images/destination-netherlands.jpg',
    name_en: 'Netherlands',
    name_fa: 'هلند',
    tagline_en: 'English-taught study and an internationally connected economy',
    tagline_fa: 'تحصیل انگلیسی‌زبان و اقتصادی متصل به جهان',
    overview_en:
      'The Netherlands is known for English-taught degree programmes, compact cities and a highly international workforce. Institutions are research- or applied-sciences focused, and housing and living costs require early planning. We help you compare programmes, understand institution sponsorship and prepare a realistic budget for one of Europe’s most competitive student housing markets.',
    overview_fa:
      'هلند به برنامه‌های تحصیلی انگلیسی‌زبان، شهرهای فشرده و نیروی کار بسیار بین‌المللی شناخته می‌شود. مؤسسات پژوهشی یا علوم کاربردی هستند و مسکن و هزینه زندگی نیازمند برنامه‌ریزی زودهنگام است. ما کمک می‌کنیم برنامه‌ها را مقایسه کنید، حمایت مؤسسه را بشناسید و برای یکی از رقابتی‌ترین بازارهای مسکن دانشجویی اروپا بودجه واقع‌بینانه بسازید.',
    education_en:
      'Dutch universities and universities of applied sciences offer a large catalogue of English-taught programmes. Confirm accreditation, language requirements, housing support and post-study orientation rules directly with the institution.',
    education_fa:
      'دانشگاه‌های هلند و دانشگاه‌های علوم کاربردی فهرست بزرگی از برنامه‌های انگلیسی‌زبان ارائه می‌دهند. اعتبارسنجی، الزامات زبان، پشتیبانی مسکن و قواعد اقامت پس از تحصیل را مستقیماً با مؤسسه تأیید کنید.',
    universities_en: ['University of Amsterdam', 'Delft University of Technology', 'Utrecht University', 'Erasmus University Rotterdam'],
    universities_fa: ['دانشگاه آمستردام', 'دانشگاه فناوری دلفت', 'دانشگاه اوترخت', 'دانشگاه اراسموس روتردام'],
    study_pathways_en: ['Student residence permit with an recognised sponsor', 'Orientation year for eligible graduates', 'Exchange and short-term programmes'],
    study_pathways_fa: ['مجوز اقامت دانشجویی با حامی شناخته‌شده', 'سال جهت‌یابی برای فارغ‌التحصیلان واجد شرایط', 'برنامه‌های مبادله و کوتاه‌مدت'],
    work_pathways_en: ['Highly skilled migrant route with a recognised employer', 'Orientation year for graduates', 'EU Blue Card for qualifying roles'],
    work_pathways_fa: ['مسیر مهاجر بسیار ماهر با کارفرمای شناخته‌شده', 'سال جهت‌یابی فارغ‌التحصیلان', 'کارت آبی اروپا برای مشاغل واجد شرایط'],
    pr_pathways_en: ['Permanent residence after qualifying residence', 'EU long-term residence where eligible', 'Family reunification'],
    pr_pathways_fa: ['اقامت دائمی پس از دوره واجد شرایط', 'اقامت بلندمدت اتحادیه اروپا در صورت واجد شرایط بودن', 'پیوستن خانواده'],
    family_pathways_en: ['Spouse and partner reunification', 'Dependent children', 'Family members of highly skilled migrants'],
    family_pathways_fa: ['پیوستن همسر و شریک', 'فرزندان وابسته', 'اعضای خانواده مهاجران بسیار ماهر'],
    investment_pathways_en: ['Startup and innovative business routes subject to assessment', 'No automatic residency from property purchase'],
    investment_pathways_fa: ['مسیرهای استارتاپ و کسب‌وکار نوآور مشروط به ارزیابی', 'بدون اقامت خودکار از خرید ملک'],
    highlights_en: ['English-taught programmes', 'Strong research and design sectors', 'International workforce', 'Central European access'],
    highlights_fa: ['برنامه‌های انگلیسی‌زبان', 'بخش‌های قوی پژوهش و طراحی', 'نیروی کار بین‌المللی', 'دسترسی به اروپای مرکزی'],
    eligibility_en: ['Institution admission and recognised sponsor', 'English language proficiency', 'Proof of sufficient living funds', 'Valid passport and health insurance'],
    eligibility_fa: ['پذیرش مؤسسه و حامی شناخته‌شده', 'مهارت زبان انگلیسی', 'اثبات وجوه کافی زندگی', 'گذرنامه معتبر و بیمه درمانی'],
    documents_en: ['Passport and photographs', 'Admission letter', 'Language certificate', 'Financial evidence and insurance', 'Antecedents certificate where required'],
    documents_fa: ['گذرنامه و عکس', 'نامه پذیرش', 'گواهی زبان', 'شواهد مالی و بیمه', 'گواهی سوابق در صورت نیاز'],
    process_en: ['Programme and city comparison', 'Admission and funding plan', 'Institution-led residence application', 'Housing and insurance planning', 'Arrival registration'],
    process_fa: ['مقایسه برنامه و شهر', 'برنامه پذیرش و تأمین مالی', 'درخواست اقامت با هدایت مؤسسه', 'برنامه‌ریزی مسکن و بیمه', 'ثبت ورود'],
    featured: 0,
    sort_order: 6,
  },
];

export const packages = [
  {
    slug: 'initial-consultation',
    name_en: 'Initial Consultation',
    name_fa: 'مشاوره اولیه',
    description_en: 'A focused 45-minute session to clarify your goals and identify realistic next steps.',
    description_fa: 'یک جلسه متمرکز ۴۵ دقیقه‌ای برای روشن کردن اهداف و شناسایی گام‌های واقع‌بینانه بعدی.',
    price_minor: 0,
    currency: 'USD',
    billing_type: 'one_time',
    duration_en: '45 minutes',
    duration_fa: '۴۵ دقیقه',
    features_en: ['Profile and goal review', 'Destination and route overview', 'Priority action list', 'Written summary'],
    features_fa: ['بررسی پروفایل و هدف', 'مرور مقصد و مسیر', 'فهرست اقدامات اولویت‌دار', 'خلاصه مکتوب'],
    exclusions_en: ['Full application preparation', 'Document translation fees', 'Government or third-party fees'],
    exclusions_fa: ['آماده‌سازی کامل درخواست', 'هزینه ترجمه مدارک', 'هزینه‌های دولتی یا شخص ثالث'],
    cta_type: 'consultation',
    featured: 0,
    sort_order: 1,
  },
  {
    slug: 'university-application',
    name_en: 'University Application Assistance',
    name_fa: 'همراهی در درخواست دانشگاه',
    description_en: 'Structured support for a shortlist of programmes and a well-reviewed application package.',
    description_fa: 'پشتیبانی ساختارمند برای فهرست برنامه‌ها و بسته درخواست با بازبینی دقیق.',
    price_minor: 45000,
    currency: 'USD',
    billing_type: 'one_time',
    duration_en: 'Up to 3 programmes',
    duration_fa: 'تا ۳ برنامه',
    features_en: ['Programme shortlist', 'CV and motivation review', 'Application quality check', 'Offer comparison session'],
    features_fa: ['انتخاب برنامه', 'بازبینی رزومه و انگیزه‌نامه', 'کنترل کیفیت درخواست', 'جلسه مقایسه پذیرش‌ها'],
    exclusions_en: ['University application fees', 'Language test fees', 'Visa application'],
    exclusions_fa: ['هزینه درخواست دانشگاه', 'هزینه آزمون زبان', 'درخواست ویزا'],
    cta_type: 'payment',
    featured: 0,
    sort_order: 2,
  },
  {
    slug: 'complete-study-abroad',
    name_en: 'Complete Study Abroad Support',
    name_fa: 'پشتیبانی کامل تحصیل در خارج',
    description_en: 'End-to-end guidance from shortlist and applications through visa preparation and departure.',
    description_fa: 'راهنمایی سرتاسری از انتخاب و درخواست تا آماده‌سازی ویزا و سفر.',
    price_minor: 120000,
    currency: 'USD',
    billing_type: 'one_time',
    duration_en: 'One intake cycle',
    duration_fa: 'یک دوره ورودی',
    features_en: ['Up to 5 programme applications', 'Document and visa evidence review', 'Interview preparation', 'Pre-departure planning'],
    features_fa: ['تا ۵ درخواست برنامه', 'بازبینی مدارک و شواهد ویزا', 'آماده‌سازی مصاحبه', 'برنامه‌ریزی پیش از سفر'],
    exclusions_en: ['Tuition and living costs', 'Government fees', 'Accredited translation and testing fees'],
    exclusions_fa: ['شهریه و هزینه زندگی', 'هزینه‌های دولتی', 'هزینه ترجمه معتبر و آزمون'],
    cta_type: 'payment',
    featured: 1,
    sort_order: 3,
  },
  {
    slug: 'visa-application',
    name_en: 'Visa Application Assistance',
    name_fa: 'همراهی در درخواست ویزا',
    description_en: 'A document-focused review for applicants who already have an admission or job offer.',
    description_fa: 'بازبینی متمرکز بر مدارک برای متقاضیانی که پذیرش یا پیشنهاد شغلی دارند.',
    price_minor: 65000,
    currency: 'USD',
    billing_type: 'one_time',
    duration_en: 'Single application',
    duration_fa: 'یک درخواست',
    features_en: ['Official checklist mapping', 'Financial evidence review', 'Form consistency check', 'Interview briefing'],
    features_fa: ['تطبیق چک‌لیست رسمی', 'بازبینی شواهد مالی', 'کنترل هماهنگی فرم‌ها', 'توجیه مصاحبه'],
    exclusions_en: ['Visa and biometric fees', 'Legal representation', 'Translation costs'],
    exclusions_fa: ['هزینه ویزا و اثر انگشت', 'نمایندگی حقوقی', 'هزینه ترجمه'],
    cta_type: 'payment',
    featured: 0,
    sort_order: 4,
  },
  {
    slug: 'custom-immigration-consultation',
    name_en: 'Custom Immigration Consultation',
    name_fa: 'مشاوره مهاجرتی سفارشی',
    description_en: 'A tailored strategy engagement for complex profiles, families or business routes.',
    description_fa: 'همکاری استراتژی سفارشی برای پروفایل‌های پیچیده، خانواده‌ها یا مسیرهای تجاری.',
    price_minor: 30000,
    currency: 'USD',
    billing_type: 'deposit',
    duration_en: 'Scoped after review',
    duration_fa: 'پس از بررسی تعیین می‌شود',
    features_en: ['Extended profile assessment', 'Route comparison memo', 'Coordinated action plan', 'Follow-up review session'],
    features_fa: ['ارزیابی گسترده پروفایل', 'یادداشت مقایسه مسیرها', 'برنامه اقدام هماهنگ', 'جلسه بازبینی پیگیری'],
    exclusions_en: ['Government fees', 'Legal or tax advice', 'Third-party professional fees'],
    exclusions_fa: ['هزینه‌های دولتی', 'مشاوره حقوقی یا مالیاتی', 'هزینه متخصصان شخص ثالث'],
    cta_type: 'consultation',
    featured: 0,
    sort_order: 5,
  },
];

export const experts = [
  {
    slug: 'sample-senior-advisor',
    name: 'Sample Senior Advisor',
    role_en: 'Senior Immigration Advisor',
    role_fa: 'مشاور ارشد مهاجرت',
    expertise_en: 'Study pathways, skilled migration and family applications',
    expertise_fa: 'مسیرهای تحصیلی، مهاجرت ماهر و درخواست‌های خانوادگی',
    bio_en:
      'This is a sample profile for demonstration only. Replace it with a verified team biography in the admin portal. The final profile should describe real experience, regulated qualifications and areas of practice without making unsupported success claims.',
    bio_fa:
      'این یک پروفایل نمونه برای نمایش است. آن را در پنل مدیریت با بیوگرافی تأییدشده تیم جایگزین کنید. پروفایل نهایی باید تجربه واقعی، مدارک تنظیم‌شده و حوزه‌های فعالیت را بدون ادعای موفقیت پشتیبانی‌نشده توصیف کند.',
    languages_en: ['English', 'Persian'],
    languages_fa: ['انگلیسی', 'فارسی'],
    photo: '/images/expert-1.jpg',
    years_experience: null,
    is_demo: 1,
    sort_order: 1,
  },
  {
    slug: 'sample-education-advisor',
    name: 'Sample Education Advisor',
    role_en: 'International Education Advisor',
    role_fa: 'مشاور آموزش بین‌المللی',
    expertise_en: 'University applications, scholarships and student transition',
    expertise_fa: 'درخواست دانشگاه، بورسیه و گذار دانشجویی',
    bio_en:
      'This sample profile illustrates how adviser expertise will appear. It is not a real staff member. Add verified names, photographs and biographies through Admin → Experts before launch.',
    bio_fa:
      'این پروفایل نمونه نشان می‌دهد تخصص مشاوران چگونه نمایش داده می‌شود. این فرد عضو واقعی تیم نیست. پیش از راه‌اندازی، نام، عکس و بیوگرافی تأییدشده را از بخش مدیریت → کارشناسان اضافه کنید.',
    languages_en: ['English', 'Persian', 'German'],
    languages_fa: ['انگلیسی', 'فارسی', 'آلمانی'],
    photo: '/images/expert-2.jpg',
    years_experience: null,
    is_demo: 1,
    sort_order: 2,
  },
  {
    slug: 'sample-visa-specialist',
    name: 'Sample Visa Specialist',
    role_en: 'Visa Documentation Specialist',
    role_fa: 'متخصص مدارک ویزا',
    expertise_en: 'Evidence review, document quality and interview preparation',
    expertise_fa: 'بازبینی شواهد، کیفیت مدارک و آماده‌سازی مصاحبه',
    bio_en:
      'Demonstration profile only. This card shows the intended structure for a documentation specialist. Replace it with confirmed professional details and do not imply accreditation that has not been verified.',
    bio_fa:
      'فقط پروفایل نمایشی. این کارت ساختار مورد نظر برای متخصص مدارک را نشان می‌دهد. آن را با جزئیات حرفه‌ای تأییدشده جایگزین کنید و اعتبارسنجی تأییدنشده را القا نکنید.',
    languages_en: ['English', 'Persian', 'French'],
    languages_fa: ['انگلیسی', 'فارسی', 'فرانسوی'],
    photo: '/images/expert-3.jpg',
    years_experience: null,
    is_demo: 1,
    sort_order: 3,
  },
  {
    slug: 'sample-client-care-lead',
    name: 'Sample Client Care Lead',
    role_en: 'Client Care Lead',
    role_fa: 'مسئول تجربه متقاضیان',
    expertise_en: 'Case coordination, family communication and settlement planning',
    expertise_fa: 'هماهنگی پرونده، ارتباط با خانواده و برنامه‌ریزی اسکان',
    bio_en:
      'Demonstration profile only. This profile is a layout placeholder and does not represent a real person. Add verified team information through the admin dashboard.',
    bio_fa:
      'فقط پروفایل نمایشی. این پروفایل جایگزین چیدمان است و نماینده فرد واقعی نیست. اطلاعات تأییدشده تیم را از طریق پنل مدیریت اضافه کنید.',
    languages_en: ['English', 'Persian', 'Dutch'],
    languages_fa: ['انگلیسی', 'فارسی', 'هلندی'],
    photo: '/images/expert-4.jpg',
    years_experience: null,
    is_demo: 1,
    sort_order: 4,
  },
];

export const articleCategories = [
  { slug: 'study-abroad', name_en: 'Study Abroad', name_fa: 'تحصیل در خارج', sort_order: 1 },
  { slug: 'student-visa', name_en: 'Student Visa', name_fa: 'ویزای دانشجویی', sort_order: 2 },
  { slug: 'immigration-news', name_en: 'Immigration News', name_fa: 'اخبار مهاجرت', sort_order: 3 },
  { slug: 'scholarships', name_en: 'Scholarships', name_fa: 'بورسیه‌ها', sort_order: 4 },
  { slug: 'work-opportunities', name_en: 'Work Opportunities', name_fa: 'فرصت‌های کاری', sort_order: 5 },
  { slug: 'destination-guides', name_en: 'Destination Guides', name_fa: 'راهنمای مقاصد', sort_order: 6 },
  { slug: 'visa-regulations', name_en: 'Visa Regulations', name_fa: 'قوانین ویزا', sort_order: 7 },
];

export const articles = [
  {
    slug: 'building-a-realistic-study-abroad-shortlist',
    category: 'study-abroad',
    author: 'Apply Now Editorial',
    image: '/images/blog-1.jpg',
    title_en: 'How to Build a Realistic Study-Abroad Shortlist',
    title_fa: 'چگونه فهرستی واقع‌بینانه برای تحصیل در خارج بسازیم',
    excerpt_en:
      'Rankings are only one input. A sustainable shortlist balances academic fit, funding, language, location and outcome.',
    excerpt_fa:
      'رتبه‌بندی تنها یک ورودی است. فهرست پایدار، تناسب تحصیلی، تأمین مالی، زبان، موقعیت و نتیجه را متعادل می‌کند.',
    content_en: `## Start with the life you are planning, not the logo

A university name can feel like the goal. In practice, the programme, total cost, language of instruction, housing market and post-study rules will shape your experience far more.

### Build four columns

Write down your academic profile, available budget, language level and non-negotiables. Then compare programmes against those four columns instead of collecting an endless list of famous names.

- **Academic fit:** prerequisite subjects, grades and progression options
- **Funding:** tuition, living costs, deposits and currency risk
- **Language:** the actual teaching and assessment level, not only the test score
- **Outcome:** internships, licensing requirements and the legal route after study

> A good shortlist includes ambitious, matched and safer options. It should never depend on one institution.

### Verify before you apply

Institution accreditation, application deadlines, scholarship rules and visa conditions can change. Always confirm them on the institution's and the immigration authority's official website. A consultant can help you structure the decision, but the final evidence must be true and yours.

### Plan the full year

Applications, language tests, funding evidence and visa appointments rarely fit into a few weeks. Work backwards from the intake date and leave space for document corrections. The earlier you begin, the more options remain available.`,
    content_fa: `## از زندگی‌ای که برنامه‌ریزی می‌کنید شروع کنید، نه از لوگو

نام دانشگاه می‌تواند مثل هدف به نظر برسد. در عمل، برنامه تحصیلی، هزینه کل، زبان آموزش، بازار مسکن و قواعد پس از تحصیل تجربه شما را بسیار بیشتر شکل می‌دهند.

### چهار ستون بسازید

پروفایل تحصیلی، بودجه در دسترس، سطح زبان و اولویت‌های غیرقابل‌گذشت خود را بنویسید. سپس برنامه‌ها را با این چهار ستون مقایسه کنید، نه با جمع‌آوری فهرست بی‌پایان نام‌های مشهور.

- **تناسب تحصیلی:** پیش‌نیازها، نمرات و گزینه‌های ادامه تحصیل
- **تأمین مالی:** شهریه، هزینه زندگی، ودیعه و ریسک ارز
- **زبان:** سطح واقعی آموزش و ارزیابی، نه فقط نمره آزمون
- **نتیجه:** کارآموزی، الزامات مجوز و مسیر قانونی پس از تحصیل

> یک فهرست خوب شامل گزینه‌های بلندپروازانه، متناسب و مطمئن‌تر است. نباید به یک مؤسسه وابسته باشد.

### پیش از درخواست راستی‌آزمایی کنید

اعتبار مؤسسه، مهلت‌های درخواست، قواعد بورسیه و شرایط ویزا می‌توانند تغییر کنند. همیشه آن‌ها را در وب‌سایت رسمی مؤسسه و مرجع مهاجرت تأیید کنید. مشاور می‌تواند به ساختار تصمیم کمک کند، اما شواهد نهایی باید واقعی و متعلق به شما باشد.

### کل سال را برنامه‌ریزی کنید

درخواست‌ها، آزمون زبان، شواهد مالی و وقت ویزا به‌ندرت در چند هفته جا می‌شوند. از تاریخ ورودی به عقب برنامه‌ریزی کنید و برای اصلاح مدارک فضا بگذارید. هرچه زودتر شروع کنید، گزینه‌های بیشتری باقی می‌ماند.`,
    reading_minutes: 6,
    status: 'published',
    featured: 1,
    published_at: '2026-09-18T09:00:00.000Z',
  },
  {
    slug: 'student-visa-evidence-checklist',
    category: 'student-visa',
    author: 'Apply Now Editorial',
    image: '/images/visa-documents.jpg',
    title_en: 'The Student Visa Evidence Checklist That Actually Matters',
    title_fa: 'چک‌لیست شواهد ویزای دانشجویی که واقعاً مهم است',
    excerpt_en:
      'Consistency, provenance and clear explanations matter more than a thick folder of documents.',
    excerpt_fa:
      'هماهنگی، منشأ مشخص و توضیح شفاف مهم‌تر از پوشه‌ای ضخیم از مدارک است.',
    content_en: `## Evidence tells one story

A visa officer is not simply counting pages. They are checking whether your admission, finances, study plan and personal circumstances fit together without contradiction.

### The core file

1. **Identity:** a valid passport and consistent personal details across every form.
2. **Study:** an authentic admission or confirmation of enrolment from an eligible provider.
3. **Money:** statements, sponsor evidence and documents explaining where the funds came from.
4. **Language and academics:** results that meet the exact requirement for your programme.
5. **Intent:** a study plan that explains why this programme, why now and how it connects to your future.

### Common avoidable problems

- A sponsor letter that does not match the bank statement
- Large unexplained deposits made shortly before the application
- An English test below the institution's stated threshold
- Different addresses or names across documents
- Copies that are incomplete or impossible to read

### Use official checklists

Requirements differ by country and can change. Download the checklist from the official immigration website on the day you prepare the file and note the date. If you use an adviser, ask them to show you the source of every requirement.

> No one can guarantee a visa. A truthful, coherent application is the strongest thing you can control.`,
    content_fa: `## شواهد باید یک داستان را بیان کنند

افسر ویزا فقط صفحات را نمی‌شمارد. او بررسی می‌کند که آیا پذیرش، وضعیت مالی، برنامه تحصیلی و شرایط شخصی شما بدون تناقض با هم هماهنگ هستند.

### پرونده اصلی

۱. **هویت:** گذرنامه معتبر و اطلاعات شخصی یکسان در همه فرم‌ها.
۲. **تحصیل:** پذیرش واقعی یا تأیید ثبت‌نام از ارائه‌دهنده واجد شرایط.
۳. **مالی:** صورت‌حساب، شواهد حامی و مدارکی که منشأ وجوه را توضیح می‌دهد.
۴. **زبان و تحصیلات:** نتایجی که الزام دقیق برنامه شما را برآورده کند.
۵. **قصد:** برنامه تحصیلی که توضیح دهد چرا این برنامه، چرا اکنون و چگونه به آینده شما متصل است.

### مشکلات قابل پیشگیری رایج

- نامه حامی ناهماهنگ با صورت‌حساب بانکی
- واریزهای بزرگ و توضیح‌داده‌نشده در فاصله کوتاه پیش از درخواست
- نمره آزمون زبان پایین‌تر از حد اعلام‌شده مؤسسه
- نشانی یا نام متفاوت در مدارک
- کپی‌های ناقص یا ناخوانا

### از چک‌لیست‌های رسمی استفاده کنید

الزامات در هر کشور متفاوت است و می‌تواند تغییر کند. چک‌لیست را در روز آماده‌سازی از وب‌سایت رسمی مهاجرت دانلود و تاریخ آن را ثبت کنید. اگر از مشاور کمک می‌گیرید، از او بخواهید منبع هر الزام را نشان دهد.

> هیچ‌کس نمی‌تواند ویزا را تضمین کند. درخواست صادقانه و منسجم قوی‌ترین چیزی است که می‌توانید کنترل کنید.`,
    reading_minutes: 5,
    status: 'published',
    featured: 1,
    published_at: '2026-09-08T09:00:00.000Z',
  },
  {
    slug: 'questions-before-paying-an-agent',
    category: 'immigration-news',
    author: 'Apply Now Editorial',
    image: '/images/blog-3.jpg',
    title_en: 'Seven Questions to Ask Before Paying an Immigration Adviser',
    title_fa: 'هفت پرسش پیش از پرداخت به مشاور مهاجرت',
    excerpt_en:
      'A trustworthy adviser welcomes questions about scope, fees, credentials and what happens if an application is refused.',
    excerpt_fa:
      'مشاور قابل‌اعتماد از پرسش درباره دامنه خدمات، هزینه، مدارک و نتیجه رد شدن استقبال می‌کند.',
    content_en: `## Trust is built through clarity

Immigration decisions are made by governments. An adviser can organise the work and explain requirements, but cannot sell a guaranteed outcome. Before paying, ask these questions.

### 1. What exactly is included?

Ask for the services, number of applications, communication channels and timeline in writing.

### 2. Who will handle my file?

Meet the person doing the work. Ask whether they are regulated, what qualification they hold and who supervises them.

### 3. What are the total third-party costs?

Government fees, translations, tests, courier costs and medical exams are often separate. Request a full estimate.

### 4. Where do you get your legal information?

The answer should reference official government sources, not rumour or a competitor's website.

### 5. What happens if I am refused?

Understand whether a review or reapplication is included, and what it costs.

### 6. Can I see a written refund and cancellation policy?

Get it before payment and read the conditions carefully.

### 7. Will you ever ask me to provide false information?

The answer must be no. Walk away from any suggestion of fake documents, undisclosed refusals or misleading employment letters.

> A professional adviser is comfortable saying “I don't know; let me verify the current official rule.”`,
    content_fa: `## اعتماد با شفافیت ساخته می‌شود

تصمیم‌های مهاجرتی توسط دولت‌ها گرفته می‌شود. مشاور می‌تواند کار را سازمان‌دهی و الزامات را توضیح دهد، اما نمی‌تواند نتیجه تضمینی بفروشد. پیش از پرداخت این پرسش‌ها را بپرسید.

### ۱. دقیقاً چه چیزی شامل خدمت است؟

خدمات، تعداد درخواست‌ها، کانال‌های ارتباطی و زمان‌بندی را کتبی بخواهید.

### ۲. چه کسی پرونده من را مدیریت می‌کند؟

با فردی که کار را انجام می‌دهد ملاقات کنید. بپرسید آیا تنظیم‌شده است، چه مدرکی دارد و چه کسی بر او نظارت می‌کند.

### ۳. کل هزینه‌های شخص ثالث چقدر است؟

هزینه دولتی، ترجمه، آزمون، پست و معاینات پزشکی اغلب جدا هستند. برآورد کامل بخواهید.

### ۴. اطلاعات حقوقی را از کجا می‌آورید؟

پاسخ باید به منابع رسمی دولتی ارجاع دهد، نه شایعه یا وب‌سایت رقیب.

### ۵. اگر درخواست من رد شود چه می‌شود؟

بدانید آیا بازبینی یا درخواست مجدد شامل خدمت است و هزینه آن چقدر است.

### ۶. آیا سیاست بازپرداخت و لغو کتبی دارید؟

پیش از پرداخت آن را بگیرید و شرایط را دقیق بخوانید.

### ۷. آیا هرگز از من می‌خواهید اطلاعات نادرست ارائه دهم؟

پاسخ باید «نه» باشد. از هر پیشنهاد مدرک جعلی، رد پنهان‌شده یا نامه اشتغال گمراه‌کننده فاصله بگیرید.

> مشاور حرفه‌ای راحت می‌گوید: «نمی‌دانم؛ اجازه دهید قاعده رسمی فعلی را بررسی کنم.»`,
    reading_minutes: 5,
    status: 'published',
    featured: 0,
    published_at: '2026-08-27T09:00:00.000Z',
  },
  {
    slug: 'funding-your-studies-abroad',
    category: 'scholarships',
    author: 'Apply Now Editorial',
    image: '/images/article-2.jpg',
    title_en: 'Funding Your Studies: A Practical Planning Framework',
    title_fa: 'تأمین مالی تحصیل: چارچوبی کاربردی برای برنامه‌ریزی',
    excerpt_en:
      'Build a total-cost budget, separate scholarships from loans, and prepare evidence before deadlines.',
    excerpt_fa:
      'بودجه هزینه کل بسازید، بورسیه را از وام جدا کنید و شواهد را پیش از مهلت آماده کنید.',
    content_en: `## The number that matters is the total

Tuition is only one line. Add accommodation, food, transport, insurance, visa fees, flights and a realistic emergency buffer. Use the institution's official cost estimate, then compare it with your actual funding.

### Three sources, not one

- **Family or personal savings:** stable, documented and lawfully sourced
- **Scholarships:** competitive and rarely sufficient on their own
- **Education loans:** require approval, repayment planning and often a guarantor

Do not treat an application for funding as an approved award. A conditional offer is not money in the bank.

### Build a calendar

Scholarship deadlines often fall months before admission deadlines. Prepare transcripts, references and financial documents early, and keep separate versions for each institution.

> If the plan only works with an unconfirmed scholarship, it does not yet work. Have a second funding route.`,
    content_fa: `## عددی که اهمیت دارد هزینه کل است

شهریه فقط یک ردیف است. اقامت، غذا, حمل‌ونقل، بیمه، هزینه ویزا، بلیت و ذخیره اضطراری واقع‌بینانه را اضافه کنید. برآورد رسمی مؤسسه را بگیرید و با تأمین مالی واقعی خود مقایسه کنید.

### سه منبع، نه یک منبع

- **پس‌انداز خانوادگی یا شخصی:** پایدار، مستند و با منشأ قانونی
- **بورسیه:** رقابتی و به‌ندرت به‌تنهایی کافی
- **وام تحصیلی:** نیازمند تأیید، برنامه بازپرداخت و اغلب ضامن

درخواست تأمین مالی را به‌عنوان کمک تأییدشده در نظر نگیرید. پذیرش مشروط پول در بانک نیست.

### تقویم بسازید

مهلت بورسیه اغلب ماه‌ها پیش از مهلت پذیرش است. ریزنمرات، توصیه‌نامه و مدارک مالی را زود آماده کنید و برای هر مؤسسه نسخه جدا نگه دارید.

> اگر برنامه فقط با بورسیه تأییدنشده کار کند، هنوز کار نمی‌کند. مسیر دوم تأمین مالی داشته باشید.`,
    reading_minutes: 4,
    status: 'published',
    featured: 0,
    published_at: '2026-08-12T09:00:00.000Z',
  },
  {
    slug: 'working-abroad-what-employers-check',
    category: 'work-opportunities',
    author: 'Apply Now Editorial',
    image: '/images/consultation.jpg',
    title_en: 'What Employers Actually Check in an International Application',
    title_fa: 'کارفرمایان در درخواست بین‌المللی واقعاً چه چیزی را بررسی می‌کنند',
    excerpt_en:
      'Clear evidence of impact, verifiable references and role alignment beat a long list of responsibilities.',
    excerpt_fa:
      'شواهد روشن از تأثیر، معرفی‌نامه قابل راستی‌آزمایی و تناسب نقش بر فهرست بلند مسئولیت‌ها برتری دارد.',
    content_en: `## Show the outcome, not just the job description

International hiring managers cannot easily interpret local titles. Explain the scale of your work, the decisions you owned and the measurable result.

### Build a role-aligned CV

- Lead with a short professional summary, not an objective statement
- For each role, write two or three outcome-focused bullets
- Name the tools, standards and teams you worked with
- Use consistent dates and explain employment gaps briefly and honestly

### Prepare verifiable references

A reference should be able to confirm your title, dates and responsibilities. Ask permission before sharing someone's contact details.

### Understand the legal route

A willing employer is not the same as work authorisation. Check whether the role and employer can sponsor, whether the occupation is eligible, and which documents the employee and employer must provide.

> Never invent a title or extend dates to fit a job description. Verification is normal and a discrepancy can end the process.`,
    content_fa: `## نتیجه را نشان دهید، نه فقط شرح شغل را

مدیران استخدام بین‌المللی به‌سختی عنوان‌های محلی را تفسیر می‌کنند. مقیاس کار، تصمیم‌هایی که مالک آن بودید و نتیجه قابل اندازه‌گیری را توضیح دهید.

### رزومه متناسب با نقش بسازید

- با خلاصه حرفه‌ای کوتاه شروع کنید، نه جمله هدف
- برای هر نقش دو یا سه نکته نتیجه‌محور بنویسید
- ابزارها، استانداردها و تیم‌هایی که با آن‌ها کار کردید را نام ببرید
- تاریخ‌ها را یکسان کنید و وقفه‌های شغلی را کوتاه و صادقانه توضیح دهید

### معرفی‌نامه قابل راستی‌آزمایی آماده کنید

معرف باید بتواند عنوان، تاریخ‌ها و مسئولیت‌ها را تأیید کند. پیش از اشتراک اطلاعات تماس کسی، اجازه بگیرید.

### مسیر قانونی را بشناسید

کارفرمای مایل با اجازه کار یکی نیست. بررسی کنید آیا شغل و کارفرما می‌توانند حمایت کنند، آیا شغل واجد شرایط است و کارمند و کارفرما چه مدارکی باید ارائه دهند.

> هرگز عنوان نسازید یا تاریخ‌ها را برای تطبیق با شرح شغل طولانی نکنید. راستی‌آزمایی عادی است و ناسازگاری می‌تواند فرایند را پایان دهد.`,
    reading_minutes: 4,
    status: 'published',
    featured: 0,
    published_at: '2026-07-30T09:00:00.000Z',
  },
  {
    slug: 'understanding-visa-refusals',
    category: 'visa-regulations',
    author: 'Apply Now Editorial',
    image: '/images/article-3.jpg',
    title_en: 'A Refusal Is Not the End: How to Read the Decision Carefully',
    title_fa: 'رد شدن پایان راه نیست: تصمیم را دقیق بخوانید',
    excerpt_en:
      'Understand the stated reason, separate evidence gaps from eligibility problems, and avoid rushing a reapplication.',
    excerpt_fa:
      'دلیل اعلام‌شده را بفهمید، شکاف مدارک را از مشکل واجد شرایط بودن جدا کنید و در درخواست مجدد عجله نکنید.',
    content_en: `## Read the actual reason

A refusal letter usually identifies the legal ground and the evidence the decision-maker found insufficient. Do not rely on a summary from social media. Read every paragraph and translate unfamiliar terms accurately.

### Separate three problems

1. **Document gap:** a required record was missing, incomplete or inconsistent. This may be fixable.
2. **Eligibility problem:** the route itself does not fit your circumstances. A new application may need a different strategy.
3. **Credibility concern:** the decision-maker did not find the evidence genuine or the intention credible. More documents alone may not solve this.

### Before reapplying

Check whether a review or appeal deadline applies. Obtain the full decision and your submitted file. Identify what changed since the refusal — not just what you wish had been included.

> Reapplying with the same evidence usually produces the same result. Get advice on the specific ground of refusal before paying again.`,
    content_fa: `## دلیل واقعی را بخوانید

نامه رد معمولاً مبنای قانونی و شواهدی که تصمیم‌گیرنده ناکافی دانسته را مشخص می‌کند. به خلاصه شبکه‌های اجتماعی تکیه نکنید. هر پاراگراف را بخوانید و اصطلاحات ناآشنا را دقیق ترجمه کنید.

### سه مشکل را جدا کنید

۱. **شکاف مدارک:** مدرک لازم ناقص، ناکامل یا ناسازگار بوده است. ممکن است قابل رفع باشد.
۲. **مشکل واجد شرایط بودن:** خود مسیر با شرایط شما تناسب ندارد. درخواست جدید ممکن است استراتژی دیگری بخواهد.
۳. **نگرانی اعتبار:** تصمیم‌گیرنده شواهد را واقعی یا قصد را باورپذیر ندانسته است. مدارک بیشتر به‌تنهایی ممکن است این را حل نکند.

### پیش از درخواست مجدد

بررسی کنید آیا مهلت بازبینی یا اعتراض وجود دارد. تصمیم کامل و پرونده ارسالی خود را بگیرید. مشخص کنید از زمان رد شدن چه چیزی تغییر کرده است — نه فقط چه چیزی را آرزو داشتید شامل می‌شد.

> درخواست مجدد با همان شواهد معمولاً همان نتیجه را می‌دهد. پیش از پرداخت دوباره، درباره مبنای مشخص رد شدن مشاوره بگیرید.`,
    reading_minutes: 5,
    status: 'published',
    featured: 0,
    published_at: '2026-07-14T09:00:00.000Z',
  },
];

export const faqs = [
  {
    category: 'general',
    question_en: 'What does Apply Now do?',
    question_fa: 'Apply Now چه کاری انجام می‌دهد؟',
    answer_en:
      'Apply Now provides immigration and international education guidance: profile assessment, programme and country research, document planning, application support and pre-departure preparation. We explain official requirements and help you organise your own truthful application.',
    answer_fa:
      'Apply Now راهنمایی مهاجرت و آموزش بین‌المللی ارائه می‌دهد: ارزیابی پروفایل، پژوهش برنامه و کشور، برنامه‌ریزی مدارک، پشتیبانی درخواست و آماده‌سازی پیش از سفر. ما الزامات رسمی را توضیح می‌دهیم و به سازمان‌دهی درخواست صادقانه خودتان کمک می‌کنیم.',
    sort_order: 1,
  },
  {
    category: 'general',
    question_en: 'Do you guarantee a visa or admission?',
    question_fa: 'آیا ویزا یا پذیرش را تضمین می‌کنید؟',
    answer_en:
      'No. Decisions are made by governments and educational institutions. We do not sell guaranteed outcomes, and we will not submit false or misleading evidence.',
    answer_fa:
      'خیر. تصمیم‌ها توسط دولت‌ها و مؤسسات آموزشی گرفته می‌شوند. ما نتیجه تضمینی نمی‌فروشیم و مدارک نادرست یا گمراه‌کننده ارسال نمی‌کنیم.',
    sort_order: 2,
  },
  {
    category: 'study',
    question_en: 'When should I start planning to study abroad?',
    question_fa: 'چه زمانی برنامه‌ریزی تحصیل در خارج را شروع کنم؟',
    answer_en:
      'For many destinations, 9–18 months before the intake is realistic. Competitive programmes, scholarships and language tests may require even more time.',
    answer_fa:
      'برای بسیاری از مقاصد، ۹ تا ۱۸ ماه پیش از ورودی واقع‌بینانه است. برنامه‌های رقابتی، بورسیه‌ها و آزمون‌های زبان ممکن است زمان بیشتری بخواهند.',
    sort_order: 3,
  },
  {
    category: 'study',
    question_en: 'Can you help me find a scholarship?',
    question_fa: 'آیا می‌توانید در پیدا کردن بورسیه کمک کنید؟',
    answer_en:
      'We can help you identify official scholarship opportunities and organise application materials. We do not guarantee awards and do not charge a fee to “reserve” scholarship funding.',
    answer_fa:
      'می‌توانیم به شناسایی فرصت‌های رسمی بورسیه و سازمان‌دهی مدارک کمک کنیم. ما بورسیه را تضمین نمی‌کنیم و برای «رزرو» بودجه بورسیه هزینه نمی‌گیریم.',
    sort_order: 4,
  },
  {
    category: 'student-visa',
    question_en: 'What documents are usually required for a student visa?',
    question_fa: 'معمولاً چه مدارکی برای ویزای دانشجویی لازم است؟',
    answer_en:
      'Common categories include a passport, admission or enrolment confirmation, financial evidence, academic and language records, insurance and photographs. The exact checklist depends on the destination and must be verified with the official authority.',
    answer_fa:
      'دسته‌های رایج شامل گذرنامه، پذیرش یا تأیید ثبت‌نام، شواهد مالی، مدارک تحصیلی و زبان، بیمه و عکس است. چک‌لیست دقیق به مقصد بستگی دارد و باید با مرجع رسمی تأیید شود.',
    sort_order: 5,
  },
  {
    category: 'student-visa',
    question_en: 'Can I work while studying?',
    question_fa: 'آیا می‌توانم در طول تحصیل کار کنم؟',
    answer_en:
      'Work rights vary by country, course and visa condition. Check the current rule on the official immigration website before accepting employment. Unauthorised work can affect your status.',
    answer_fa:
      'حق کار بسته به کشور، دوره و شرط ویزا متفاوت است. پیش از پذیرش شغل، قاعده فعلی را در وب‌سایت رسمی مهاجرت بررسی کنید. کار غیرمجاز می‌تواند وضعیت شما را تحت تأثیر قرار دهد.',
    sort_order: 6,
  },
  {
    category: 'work-visa',
    question_en: 'Do I need a job offer for a work visa?',
    question_fa: 'آیا برای ویزای کار به پیشنهاد شغلی نیاز دارم؟',
    answer_en:
      'Many employer-sponsored routes require a genuine offer from an eligible employer. Some independent or talent routes do not, but they have strict criteria. The answer depends on the specific country and route.',
    answer_fa:
      'بسیاری از مسیرهای حمایت کارفرما به پیشنهاد واقعی از کارفرمای واجد شرایط نیاز دارند. برخی مسیرهای مستقل یا استعداد نیاز ندارند، اما معیارهای سخت‌گیرانه دارند. پاسخ به کشور و مسیر مشخص بستگی دارد.',
    sort_order: 7,
  },
  {
    category: 'work-visa',
    question_en: 'Can Apply Now find me a job?',
    question_fa: 'آیا Apply Now برای من کار پیدا می‌کند؟',
    answer_en:
      'We are not a recruitment agency and do not sell jobs. We can help you understand employer-led immigration routes and present your experience clearly, but employment decisions belong to employers.',
    answer_fa:
      'ما آژانس استخدام نیستیم و شغل نمی‌فروشیم. می‌توانیم به شناخت مسیرهای مهاجرت کارفرما محور و ارائه شفاف تجربه شما کمک کنیم، اما تصمیم استخدام با کارفرماست.',
    sort_order: 8,
  },
  {
    category: 'immigration',
    question_en: 'How long does an immigration application take?',
    question_fa: 'درخواست مهاجرت چقدر طول می‌کشد؟',
    answer_en:
      'Processing time depends on the route, authority, document completeness and current demand. We only provide timing estimates from official published sources and clearly label them as estimates.',
    answer_fa:
      'زمان پردازش به مسیر، مرجع، کامل بودن مدارک و تقاضای فعلی بستگی دارد. ما فقط برآوردهای زمانی منابع رسمی منتشرشده را ارائه می‌دهیم و آن‌ها را صریحاً برآورد علامت می‌زنیم.',
    sort_order: 9,
  },
  {
    category: 'immigration',
    question_en: 'Can I include my family in my application?',
    question_fa: 'آیا می‌توانم خانواده‌ام را در درخواست شامل کنم؟',
    answer_en:
      'Many routes allow a spouse or dependent children, but definitions and evidence requirements vary. Family inclusion must be confirmed against the specific route and the family members’ circumstances.',
    answer_fa:
      'بسیاری از مسیرها همسر یا فرزندان وابسته را اجازه می‌دهند، اما تعریف‌ها و الزامات مدارک متفاوت است. شمول خانواده باید مطابق مسیر مشخص و شرایط اعضای خانواده تأیید شود.',
    sort_order: 10,
  },
  {
    category: 'pricing',
    question_en: 'How much does a consultation cost?',
    question_fa: 'هزینه مشاوره چقدر است؟',
    answer_en:
      'Current package prices are displayed on the Pricing page and are managed by the Apply Now team. Government fees, translations, tests and third-party costs are separate unless explicitly stated.',
    answer_fa:
      'قیمت‌های فعلی بسته‌ها در صفحه قیمت‌ها نمایش داده می‌شود و توسط تیم Apply Now مدیریت می‌شود. هزینه‌های دولتی، ترجمه، آزمون و شخص ثالث جدا هستند مگر صریحاً ذکر شود.',
    sort_order: 11,
  },
  {
    category: 'pricing',
    question_en: 'Are package prices fixed?',
    question_fa: 'آیا قیمت بسته‌ها ثابت است؟',
    answer_en:
      'Prices and inclusions can change. The final scope and price are confirmed in writing before any payment. No payment is taken without displaying the amount and receiving explicit confirmation.',
    answer_fa:
      'قیمت‌ها و اقلام شامل می‌تواند تغییر کند. دامنه و قیمت نهایی پیش از هر پرداخت کتبی تأیید می‌شود. هیچ پرداختی بدون نمایش مبلغ و تأیید صریح دریافت نمی‌شود.',
    sort_order: 12,
  },
  {
    category: 'payments',
    question_en: 'Which payment methods do you accept?',
    question_fa: 'چه روش‌های پرداختی می‌پذیرید؟',
    answer_en:
      'Online card payments are processed by the configured payment provider on its secure hosted page. If online payments are not yet configured, the consultation form remains available and the team will confirm payment instructions directly.',
    answer_fa:
      'پرداخت‌های آنلاین کارت توسط ارائه‌دهنده پیکربندی‌شده در صفحه امن میزبان پردازش می‌شود. اگر پرداخت آنلاین هنوز پیکربندی نشده باشد، فرم مشاوره در دسترس است و تیم دستورالعمل پرداخت را مستقیماً تأیید می‌کند.',
    sort_order: 13,
  },
  {
    category: 'payments',
    question_en: 'Do you store my card details?',
    question_fa: 'آیا اطلاعات کارت من را ذخیره می‌کنید؟',
    answer_en:
      'No. Card details are entered on the payment provider’s hosted checkout. Apply Now stores only the transaction reference, amount, status and related service record.',
    answer_fa:
      'خیر. اطلاعات کارت در صفحه پرداخت میزبان ارائه‌دهنده وارد می‌شود. Apply Now فقط مرجع تراکنش، مبلغ، وضعیت و سابقه خدمت مرتبط را ذخیره می‌کند.',
    sort_order: 14,
  },
];

export const testimonials = [
  {
    name: 'Sample client A.',
    country: 'Canada',
    service_en: 'Study Abroad',
    service_fa: 'تحصیل در خارج',
    quote_en:
      'This is demonstration text. It illustrates how a verified client story will appear after launch. Replace it with a real testimonial and explicit consent in the admin portal.',
    quote_fa:
      'این متن نمایشی است و نشان می‌دهد داستان تأییدشده مشتری پس از راه‌اندازی چگونه نمایش داده می‌شود. آن را با نظر واقعی و رضایت صریح در پنل مدیریت جایگزین کنید.',
    photo: '/images/testimonial-1.jpg',
    rating: 5,
    is_demo: 1,
    sort_order: 1,
  },
  {
    name: 'Sample client B.',
    country: 'Germany',
    service_en: 'Visa preparation',
    service_fa: 'آماده‌سازی ویزا',
    quote_en:
      'Demonstration content only. A real testimonial should describe the client’s own experience honestly and must not imply a guaranteed outcome.',
    quote_fa:
      'فقط محتوای نمایشی. نظر واقعی باید تجربه خود مشتری را صادقانه توصیف کند و نباید القای نتیجه تضمینی داشته باشد.',
    photo: '/images/testimonial-2.jpg',
    rating: 5,
    is_demo: 1,
    sort_order: 2,
  },
  {
    name: 'Sample client C.',
    country: 'Australia',
    service_en: 'Family application',
    service_fa: 'درخواست خانوادگی',
    quote_en:
      'Sample testimonial for layout preview. Apply Now has not published real client reviews here. Verified reviews will be added from the admin dashboard.',
    quote_fa:
      'نظر نمونه برای پیش‌نمایش چیدمان. Apply Now هیچ نظر واقعی مشتری در اینجا منتشر نکرده است. نظرات تأییدشده از پنل مدیریت اضافه می‌شوند.',
    photo: '/images/testimonial-3.jpg',
    rating: 4,
    is_demo: 1,
    sort_order: 3,
  },
];

export const settings: Record<string, unknown> = {
  brand: {
    name: DEFAULT_BRAND_NAME,
    legalName: DEFAULT_BRAND_LEGAL_NAME,
    tagline: 'Study · Work · Live · Abroad',
    logoUrl: DEFAULT_BRAND_LOGO,
    description:
      'Independent immigration and international education guidance, built around clear information and realistic plans.',
    description_fa:
      'راهنمایی مستقل مهاجرت و آموزش بین‌المللی، بر پایه اطلاعات شفاف و برنامه‌های واقع‌بینانه.',
    email: 'contact@applynow.example',
    phone: '+00 000 000 0000',
    whatsapp: '',
    address: 'Office address to be confirmed',
    address_fa: 'نشانی دفتر در انتظار تأیید',
    city: 'Tehran',
    country: 'Iran',
    hours: 'Sunday–Thursday, 9:00–18:00',
    hours_fa: 'یکشنبه تا پنجشنبه، ۹:۰۰ تا ۱۸:۰۰',
    mapUrl: '',
    mapEmbedUrl: '',
    social: { instagram: '', linkedin: '', x: '', facebook: '', youtube: '', telegram: '' },
  },
  hero: {
    eyebrow: 'Study · Work · Live · Abroad',
    title: 'Your Global Journey',
    highlight: 'Starts Here',
    supporting: 'Turn your dreams into reality.',
    description:
      'Discover international education and immigration opportunities with personalised guidance and professional support at every step of your journey.',
    description_fa:
      'فرصت‌های تحصیل و مهاجرت بین‌المللی را با راهنمایی شخصی و پشتیبانی حرفه‌ای در هر مرحله از مسیر خود کشف کنید.',
    eyebrow_fa: 'تحصیل · کار · زندگی · خارج از کشور',
    title_fa: 'سفر جهانی شما',
    highlight_fa: 'از اینجا آغاز می‌شود',
    supporting_fa: 'رؤیاهای خود را به واقعیت تبدیل کنید.',
    primaryCta: 'Get Free Consultation',
    primaryCta_fa: 'دریافت مشاوره رایگان',
    secondaryCta: 'Explore Our Services',
    secondaryCta_fa: 'مشاهده خدمات',
    image: '/images/hero-city.jpg',
  },
  stats: [
    { value: '10', label_en: 'Specialist services', label_fa: 'خدمت تخصصی' },
    { value: '6', label_en: 'Destination countries', label_fa: 'کشور مقصد' },
    { value: '4', label_en: 'Guided steps', label_fa: 'گام راهنما' },
    { value: '1:1', label_en: 'Advisor support', label_fa: 'پشتیبانی مشاور' },
  ],
  seo: {
    title: 'Apply Now — Immigration & Study Abroad Consultancy',
    title_fa: 'Apply Now — مشاوره مهاجرت و تحصیل در خارج',
    description:
      'Personalised immigration and international education guidance from first assessment to arrival. Explore destinations, services and book a consultation.',
    description_fa:
      'راهنمایی شخصی مهاجرت و آموزش بین‌المللی از ارزیابی اولیه تا ورود. مقاصد، خدمات و رزرو مشاوره را ببینید.',
    ogImage: '/images/hero-city.jpg',
  },
  footer: {
    statement:
      'Clear guidance for international education, work and settlement. We help you understand the route — the decision remains with the official authority.',
    statement_fa:
      'راهنمایی شفاف برای تحصیل، کار و اسکان بین‌المللی. ما به شناخت مسیر کمک می‌کنیم — تصمیم نهایی با مرجع رسمی است.',
  },
  cta: {
    title: 'Ready to start your immigration journey?',
    title_fa: 'آماده شروع سفر مهاجرتی خود هستید؟',
    body: 'Take the first step toward your international future. Our experts are ready to help.',
    body_fa: 'نخستین گام را به سوی آینده بین‌المللی خود بردارید. کارشناسان ما آماده کمک هستند.',
    button: 'Get Free Consultation',
    button_fa: 'دریافت مشاوره رایگان',
  },
  general: {
    defaultLanguage: 'en',
  },
  legalNotice:
    'Immigration rules, fees and processing times change without notice. Information on this website is general guidance, not legal advice or a guarantee of outcome. Always verify requirements with the relevant official authority before applying or making payments.',
  legalNotice_fa:
    'قوانین مهاجرت، هزینه‌ها و زمان پردازش بدون اطلاع تغییر می‌کنند. اطلاعات این وب‌سایت راهنمایی عمومی است، نه مشاوره حقوقی یا تضمین نتیجه. پیش از درخواست یا پرداخت، الزامات را با مرجع رسمی مربوطه تأیید کنید.',
  contentVerification: {
    verified: false,
    note: 'Preview content: profiles, testimonials, statistics and contact details are samples until verified by the Apply Now team.',
  },
};

export const legalPages = [
  {
    slug: 'privacy-policy',
    title_en: 'Privacy Policy',
    title_fa: 'سیاست حریم خصوصی',
    body_en: `## Information we collect

When you submit a consultation or contact form, we collect the information you provide: name, email address, phone number, selected service or destination, education background, message and preferred consultation date. We also record the date and time of submission and basic technical information needed to protect the service.

## How we use it

We use your information to respond to your enquiry, assess your request, provide the services you ask for, maintain records, prevent abuse and comply with applicable law. We do not sell personal information.

## Legal basis and consent

We process enquiry data on the basis of your request and consent. You may withdraw consent for future communication at any time, subject to legal record-keeping obligations.

## Sharing

We share information only with service providers necessary to operate the website or deliver an agreed service, or where required by law. Payment card details are processed by the payment provider and are not stored on Apply Now servers.

## Retention and security

We retain enquiry records only as long as needed for the purpose collected, dispute resolution and legal compliance. We use access controls, encrypted transport in production, password hashing and limited administrative access. No system is completely secure; contact us promptly if you believe your data has been compromised.

## Your rights

Depending on your jurisdiction, you may request access, correction, deletion or a copy of your personal information, or object to certain processing. Use the contact details published on this website.

## International transfers

If a service provider processes data in another country, we take reasonable steps to ensure appropriate safeguards. Specific transfer mechanisms depend on the providers configured for the live service.

## Changes

We may update this policy as the service evolves. The revised version will show a new update date. This text is a starting policy and should be reviewed by a qualified legal professional before launch.`,
    body_fa: `## اطلاعاتی که جمع‌آوری می‌کنیم

هنگام ارسال فرم مشاوره یا تماس، اطلاعاتی را که ارائه می‌دهید جمع‌آوری می‌کنیم: نام، ایمیل، شماره تلفن، خدمت یا مقصد انتخابی، سابقه تحصیلی، پیام و تاریخ مشاوره ترجیحی. تاریخ و زمان ارسال و اطلاعات فنی پایه لازم برای حفاظت از سرویس را نیز ثبت می‌کنیم.

## نحوه استفاده

از اطلاعات شما برای پاسخ به درخواست، ارزیابی، ارائه خدمات درخواستی، نگهداری سوابق، جلوگیری از سوءاستفاده و رعایت قانون استفاده می‌کنیم. اطلاعات شخصی نمی‌فروشیم.

## مبنای قانونی و رضایت

داده‌های درخواست را بر اساس درخواست و رضایت شما پردازش می‌کنیم. می‌توانید رضایت خود برای ارتباط آینده را در هر زمان پس بگیرید، مشروط به تعهدات قانونی نگهداری سوابق.

## اشتراک‌گذاری

اطلاعات را فقط با ارائه‌دهندگان لازم برای اداره وب‌سایت یا ارائه خدمت توافق‌شده، یا در صورت الزام قانونی به اشتراک می‌گذاریم. اطلاعات کارت توسط ارائه‌دهنده پرداخت پردازش می‌شود و در سرورهای Apply Now ذخیره نمی‌شود.

## نگهداری و امنیت

سوابق درخواست را فقط تا زمانی که برای هدف جمع‌آوری، حل اختلاف و رعایت قانون لازم است نگه می‌داریم. از کنترل دسترسی، انتقال رمزنگاری‌شده در محیط عملیاتی، هش رمز عبور و دسترسی مدیریتی محدود استفاده می‌کنیم. هیچ سیستمی کاملاً امن نیست؛ در صورت ظن به نشت داده فوراً با ما تماس بگیرید.

## حقوق شما

بسته به حوزه قضایی، می‌توانید دسترسی، اصلاح، حذف یا نسخه‌ای از اطلاعات شخصی خود بخواهید یا به برخی پردازش‌ها اعتراض کنید. از اطلاعات تماس منتشرشده در این وب‌سایت استفاده کنید.

## انتقال بین‌المللی

اگر ارائه‌دهنده‌ای داده را در کشور دیگری پردازش کند، اقدامات معقول برای تضمین‌های مناسب انجام می‌دهیم. سازوکارهای انتقال به ارائه‌دهندگان محیط عملیاتی بستگی دارد.

## تغییرات

ممکن است این سیاست را با توسعه سرویس به‌روزرسانی کنیم. نسخه اصلاح‌شده تاریخ به‌روزرسانی جدید نشان می‌دهد. این متن یک سیاست آغازین است و باید پیش از راه‌اندازی توسط متخصص حقوقی واجد شرایط بررسی شود.`,
  },
  {
    slug: 'terms-and-conditions',
    title_en: 'Terms & Conditions',
    title_fa: 'شرایط و قوانین',
    body_en: `## Scope of service

Apply Now provides information, assessment and application-preparation guidance. We are not a government authority, law firm or immigration decision-maker. Unless a separate written agreement states otherwise, no outcome, approval or processing time is guaranteed.

## Your responsibilities

You agree to provide accurate, complete and lawful information and documents. You must review every application before submission and remain responsible for declarations, signatures, biometrics and attendance. Apply Now may decline or stop work where information appears false or instructions would require misleading an authority.

## Fees and payment

Service fees are displayed on the website or confirmed in a written quote. Government fees, translations, tests, couriers and third-party charges are separate unless expressly included. Online payments are processed by a third-party provider; the final amount is displayed before confirmation. Payment does not create a guarantee of approval.

## Refunds and cancellation

Refund eligibility depends on the signed service agreement and the work already performed. Third-party fees are generally non-refundable. No refund policy on this page overrides a specific written agreement.

## No legal advice

Website content, guides and articles are general information, not legal, tax or financial advice. Immigration law changes. You should verify requirements with the relevant official authority and seek regulated legal advice where necessary.

## Limitation of liability

To the extent permitted by law, Apply Now is not liable for decisions made by governments or institutions, delays outside its control, or losses caused by inaccurate information supplied by the client. Nothing in these terms excludes liability that cannot lawfully be excluded.

## Intellectual property

Website text, design, graphics and branding are protected. You may not republish or resell them without permission, except for short attributed quotations.

## Governing law and contact

The governing law and formal dispute process must be specified in the final service agreement. Contact details are published on the Contact page. This text is a starting template and must be reviewed by a qualified legal professional before launch.`,
    body_fa: `## دامنه خدمات

Apply Now اطلاعات، ارزیابی و راهنمایی آماده‌سازی درخواست ارائه می‌دهد. ما مرجع دولتی، دفتر حقوقی یا تصمیم‌گیرنده مهاجرت نیستیم. مگر در توافق کتبی جداگانه ذکر شود، هیچ نتیجه، تأیید یا زمان پردازشی تضمین نمی‌شود.

## مسئولیت‌های شما

می‌پذیرید اطلاعات و مدارک دقیق، کامل و قانونی ارائه دهید. باید هر درخواست را پیش از ارسال بررسی کنید و مسئول اظهارات، امضا، اثر انگشت و حضور باشید. Apply Now می‌تواند در صورت نادرست به نظر رسیدن اطلاعات یا درخواست گمراه‌کردن مرجع، کار را رد یا متوقف کند.

## هزینه‌ها و پرداخت

هزینه خدمات در وب‌سایت نمایش داده یا در پیش‌فاکتور کتبی تأیید می‌شود. هزینه‌های دولتی، ترجمه، آزمون، پست و شخص ثالث جدا هستند مگر صریحاً شامل باشند. پرداخت آنلاین توسط ارائه‌دهنده شخص ثالث پردازش می‌شود؛ مبلغ نهایی پیش از تأیید نمایش داده می‌شود. پرداخت تضمین تأیید نیست.

## بازپرداخت و لغو

شرایط بازپرداخت به توافق خدمت امضاشده و کار انجام‌شده بستگی دارد. هزینه‌های شخص ثالث معمولاً غیرقابل بازپرداخت هستند. سیاست بازپرداخت این صفحه جایگزین توافق کتبی مشخص نیست.

## بدون مشاوره حقوقی

محتوای سایت، راهنماها و مقالات اطلاعات عمومی هستند، نه مشاوره حقوقی، مالیاتی یا مالی. قوانین مهاجرت تغییر می‌کنند. الزامات را با مرجع رسمی تأیید کنید و در صورت نیاز مشاوره حقوقی تنظیم‌شده بگیرید.

## محدودیت مسئولیت

تا حد مجاز قانون، Apply Now مسئول تصمیم دولت‌ها یا مؤسسات، تأخیر خارج از کنترل یا خسارت ناشی از اطلاعات نادرست مشتری نیست. هیچ‌چیز در این شرایط مسئولیتی را که قانوناً قابل حذف نیست حذف نمی‌کند.

## مالکیت فکری

متن، طراحی، گرافیک و برند وب‌سایت محافظت می‌شود. بدون اجازه نمی‌توانید بازنشر یا فروش کنید، مگر نقل‌قول کوتاه با ذکر منبع.

## قانون حاکم و تماس

قانون حاکم و فرایند رسمی حل اختلاف باید در توافق نهایی خدمات مشخص شود. اطلاعات تماس در صفحه تماس منتشر شده است. این متن یک الگوی آغازین است و باید پیش از راه‌اندازی توسط متخصص حقوقی واجد شرایط بررسی شود.`,
  },
];
