/* ============================================================
   KDP Cecilia — Audit App
   ============================================================ */

const TOTAL = 7;
const answers = {};
let currentStep = 0;
let isDemoMode = false;
let currentLang = 'BM';

/* ── Translations ───────────────────────────────────────── */

const TRANSLATIONS = {
  BM: {
    'beta.text':         'Versi ujian — Untuk semakan kelulusan program KDP Sarawak',
    'beta.demo':         'Cuba Demo →',
    'hero.programme':    'Program KDP Sarawak',
    'hero.subprogramme': 'Skim Pemerkasaan Digital Usahawan Kecil & Sederhana',
    'hero.title1':       'Audit Kehadiran Digital',
    'hero.title2':       'Percuma untuk Perniagaan Sarawak',
    'hero.tagline':      'Jawab 7 soalan ringkas. Ketahui tahap digital perniagaan anda dan layak untuk baucar kerajaan bernilai RM1,000.',
    'coupon.title':      'Baucar Digital KDP — Laman Web Perniagaan',
    'coupon.desc':       'Nilai baucar untuk pembinaan laman web profesional pertama perniagaan anda, dibiayai oleh program kerajaan.',
    'hero.meta':         '<strong>Kurang dari 3 minit</strong> &nbsp;·&nbsp; 7 soalan &nbsp;·&nbsp; Percuma sepenuhnya &nbsp;·&nbsp; Tanpa komitmen',
    'btn.start':         'Mula Audit Saya →',
    'btn.demo':          'Cuba Demo',
    'nav.back':          '← Kembali',
    'nav.next':          'Seterusnya →',
    'nav.submit':        'Hantar Audit →',
    'multi.hint':        'Boleh pilih lebih dari satu',
    'q1.chip':    'Soalan 1 daripada 7',
    'q1.title':   'Di mana perniagaan anda beroperasi?',
    'q1.hint':    'Pilih daerah atau kawasan utama operasi perniagaan anda.',
    'q1.kuching':  'Kuching',
    'q1.miri':     'Miri',
    'q1.sibu':     'Sibu',
    'q1.bintulu':  'Bintulu',
    'q1.samarahan':'Samarahan',
    'q1.srIaman':  'Sri Aman',
    'q1.kapit':    'Kapit',
    'q1.other':    'Daerah Lain',
    'q2.chip':    'Soalan 2 daripada 7',
    'q2.title':   'Apakah jenis perniagaan anda?',
    'q2.food':    'Makanan & Minuman',
    'q2.retail':  'Peruncitan',
    'q2.services':'Perkhidmatan',
    'q2.craft':   'Kraf & Kraftangan',
    'q2.agri':    'Pertanian',
    'q2.other':   'Lain-lain',
    'q3.chip':       'Soalan 3 daripada 7',
    'q3.title':      'Bagaimana pelanggan menemui perniagaan anda sekarang?',
    'q3.none':       'Tiada kehadiran online langsung',
    'q3.fb':         'Facebook atau WhatsApp sahaja',
    'q3.social':     'Media sosial aktif (Instagram, TikTok)',
    'q3.oldweb':     'Ada laman web tapi sudah lapuk',
    'q3.activeweb':  'Ada laman web yang berfungsi dengan baik',
    'q4.chip':    'Soalan 4 daripada 7',
    'q4.title':   'Anggaran pendapatan bulanan perniagaan anda?',
    'q4.hint':    'Maklumat ini membantu kami memahami peringkat perniagaan anda.',
    'q4.under1k': 'Bawah RM1,000',
    'q4.1kto5k':  'RM1,000 – RM5,000',
    'q4.5kto20k': 'RM5,000 – RM20,000',
    'q4.over20k': 'Lebih RM20,000',
    'q5.chip':    'Soalan 5 daripada 7',
    'q5.title':   'Bagaimana kebanyakan pelanggan baru menemui anda?',
    'q5.wom':     'Cadangan dari kawan atau keluarga',
    'q5.social':  'Facebook atau Instagram',
    'q5.google':  'Carian Google',
    'q5.ecom':    'Shopee atau Lazada',
    'q5.walk':    'Jalan lalu nampak kedai',
    'q6.chip':    'Soalan 6 daripada 7',
    'q6.title':   'Apakah cabaran digital terbesar perniagaan anda?',
    'q6.nofind':  'Pelanggan susah jumpa perniagaan saya online',
    'q6.noweb':   'Tiada laman web yang kelihatan profesional',
    'q6.noknow':  'Tidak tahu cara nak mulakan pemasaran digital',
    'q6.cost':    'Kos laman web dan pemasaran terlalu tinggi',
    'q6.time':    'Tiada masa untuk uruskan pemasaran digital',
    'q7.chip':    'Soalan 7 daripada 7',
    'q7.title':   'Masukkan maklumat untuk terima keputusan anda',
    'q7.hint':    'Keputusan audit dan kelayakan baucar akan dihantar kepada anda.',
    'form.biz':      'Nama Perniagaan',
    'form.biz.ph':   'cth. Kedai Makan Mak Jah',
    'form.name':     'Nama Pemilik',
    'form.name.ph':  'cth. Ahmad bin Kadir',
    'form.mobile':   'No. Telefon',
    'form.mobile.ph':'011-2345 6789',
    'form.email':    'Emel (pilihan)',
    'form.email.ph': 'ahmad@contoh.com',
    'form.consent':  'Dengan menghantar, anda bersetuju maklumat di atas digunakan untuk tujuan program KDP Sarawak. Kami tidak akan berkongsi maklumat anda dengan pihak ketiga.',
    'loading.title': 'Menganalisis profil digital anda…',
    'loading.li1':   'Menilai kehadiran digital semasa',
    'loading.li2':   'Mengira skor kelayakan baucar',
    'loading.li3':   'Menyediakan laporan peribadi',
    'result.title':  'Tahniah! Perniagaan anda layak untuk Baucar Digital KDP.',
    'cert.programme':'Program KDP Sarawak · Baucar Digital',
    'cert.status':   'Layak',
    'cert.label':    'Nilai baucar yang diluluskan',
    'cert.currNote': 'Ringgit Malaysia — untuk pembinaan laman web perniagaan pertama',
    'cert.row.biz':  'Nama Perniagaan',
    'cert.row.name': 'Nama Pemilik',
    'cert.row.code': 'Kod Rujukan',
    'cert.row.valid':'Sah sehingga',
    'next.title':       'Langkah Seterusnya',
    'next.step1.head':  'Pegawai KDP akan menghubungi anda',
    'next.step1.sub':   'Dalam masa 1-3 hari bekerja melalui WhatsApp atau telefon.',
    'next.step2.head':  'Pilih pakej laman web anda',
    'next.step2.sub':   'Pakej asas bermula RM500 — baucar RM1,000 menampung kos ini sepenuhnya.',
    'next.step3.head':  'Laman web anda hidup dalam 14 hari',
    'next.step3.sub':   'Kami urus semua teknikal — anda fokus pada perniagaan anda.',
  },

  EN: {
    'beta.text':         'Beta version — For KDP Sarawak programme approval review',
    'beta.demo':         'Try Demo →',
    'hero.programme':    'KDP Sarawak Programme',
    'hero.subprogramme': 'Digital Empowerment Scheme for Small & Medium Enterprises',
    'hero.title1':       'Digital Presence Audit',
    'hero.title2':       'Free for Sarawak Businesses',
    'hero.tagline':      'Answer 7 quick questions. Discover your business digital score and qualify for a RM1,000 government voucher.',
    'coupon.title':      'KDP Digital Voucher — Business Website',
    'coupon.desc':       'Voucher value for building your first professional business website, funded by the government programme.',
    'hero.meta':         '<strong>Less than 3 minutes</strong> &nbsp;·&nbsp; 7 questions &nbsp;·&nbsp; Completely free &nbsp;·&nbsp; No commitment',
    'btn.start':         'Start My Audit →',
    'btn.demo':          'Try Demo',
    'nav.back':          '← Back',
    'nav.next':          'Next →',
    'nav.submit':        'Submit Audit →',
    'multi.hint':        'You may choose more than one',
    'q1.chip':    'Question 1 of 7',
    'q1.title':   'Where does your business operate?',
    'q1.hint':    'Select the district or main area of your business operations.',
    'q1.kuching':  'Kuching',
    'q1.miri':     'Miri',
    'q1.sibu':     'Sibu',
    'q1.bintulu':  'Bintulu',
    'q1.samarahan':'Samarahan',
    'q1.srIaman':  'Sri Aman',
    'q1.kapit':    'Kapit',
    'q1.other':    'Other District',
    'q2.chip':    'Question 2 of 7',
    'q2.title':   'What type of business do you run?',
    'q2.food':    'Food & Beverage',
    'q2.retail':  'Retail',
    'q2.services':'Services',
    'q2.craft':   'Craft & Handicraft',
    'q2.agri':    'Agriculture',
    'q2.other':   'Other',
    'q3.chip':       'Question 3 of 7',
    'q3.title':      'How do customers find your business right now?',
    'q3.none':       'No online presence at all',
    'q3.fb':         'Facebook or WhatsApp only',
    'q3.social':     'Active social media (Instagram, TikTok)',
    'q3.oldweb':     'Have a website but it is outdated',
    'q3.activeweb':  'Have a fully functioning website',
    'q4.chip':    'Question 4 of 7',
    'q4.title':   'Estimated monthly revenue of your business?',
    'q4.hint':    'This helps us understand your business stage.',
    'q4.under1k': 'Below RM1,000',
    'q4.1kto5k':  'RM1,000 – RM5,000',
    'q4.5kto20k': 'RM5,000 – RM20,000',
    'q4.over20k': 'Above RM20,000',
    'q5.chip':    'Question 5 of 7',
    'q5.title':   'How do most new customers find you?',
    'q5.wom':     'Word of mouth from friends or family',
    'q5.social':  'Facebook or Instagram',
    'q5.google':  'Google Search',
    'q5.ecom':    'Shopee or Lazada',
    'q5.walk':    'Walk past and see the shop',
    'q6.chip':    'Question 6 of 7',
    'q6.title':   'What is your biggest digital challenge?',
    'q6.nofind':  'Customers struggle to find my business online',
    'q6.noweb':   'No professional-looking website',
    'q6.noknow':  'Don\'t know how to start digital marketing',
    'q6.cost':    'Website and marketing costs are too high',
    'q6.time':    'No time to manage digital marketing',
    'q7.chip':    'Question 7 of 7',
    'q7.title':   'Enter your details to receive your results',
    'q7.hint':    'Your audit results and voucher eligibility will be sent to you.',
    'form.biz':      'Business Name',
    'form.biz.ph':   'e.g. Mak Jah\'s Restaurant',
    'form.name':     'Owner Name',
    'form.name.ph':  'e.g. Ahmad bin Kadir',
    'form.mobile':   'Phone Number',
    'form.mobile.ph':'011-2345 6789',
    'form.email':    'Email (optional)',
    'form.email.ph': 'ahmad@example.com',
    'form.consent':  'By submitting, you agree that the above information may be used for KDP Sarawak programme purposes. We will not share your information with third parties.',
    'loading.title': 'Analysing your digital profile…',
    'loading.li1':   'Assessing current digital presence',
    'loading.li2':   'Calculating voucher eligibility score',
    'loading.li3':   'Preparing personalised report',
    'result.title':  'Congratulations! Your business qualifies for the KDP Digital Voucher.',
    'cert.programme':'KDP Sarawak Programme · Digital Voucher',
    'cert.status':   'Eligible',
    'cert.label':    'Approved voucher value',
    'cert.currNote': 'Ringgit Malaysia — for building your first business website',
    'cert.row.biz':  'Business Name',
    'cert.row.name': 'Owner Name',
    'cert.row.code': 'Reference Code',
    'cert.row.valid':'Valid until',
    'next.title':       'Next Steps',
    'next.step1.head':  'A KDP officer will contact you',
    'next.step1.sub':   'Within 1-3 working days via WhatsApp or phone.',
    'next.step2.head':  'Choose your website package',
    'next.step2.sub':   'Basic package from RM500 — the RM1,000 voucher covers this in full.',
    'next.step3.head':  'Your website goes live within 14 days',
    'next.step3.sub':   'We handle all the technical work — you focus on your business.',
  },

  ZH: {
    'beta.text':         '测试版本 — 供沙捞越KDP计划审批审核',
    'beta.demo':         '试用演示 →',
    'hero.programme':    'KDP沙捞越计划',
    'hero.subprogramme': '中小企业数字赋能计划',
    'hero.title1':       '数字存在感审计',
    'hero.title2':       '沙捞越商家免费参与',
    'hero.tagline':      '回答7个简短问题。了解您的商业数字评级，有资格获得价值RM1,000的政府代金券。',
    'coupon.title':      'KDP数字代金券 — 商业网站',
    'coupon.desc':       '代金券用于建立您的第一个专业商业网站，由政府计划资助。',
    'hero.meta':         '<strong>不到3分钟</strong> &nbsp;·&nbsp; 7个问题 &nbsp;·&nbsp; 完全免费 &nbsp;·&nbsp; 无需承诺',
    'btn.start':         '开始我的审计 →',
    'btn.demo':          '试用演示',
    'nav.back':          '← 返回',
    'nav.next':          '下一步 →',
    'nav.submit':        '提交审计 →',
    'multi.hint':        '可选择多于一项',
    'q1.chip':    '第 1 题，共 7 题',
    'q1.title':   '您的业务在哪里经营？',
    'q1.hint':    '选择您主要经营业务的地区。',
    'q1.kuching':  '古晋',
    'q1.miri':     '美里',
    'q1.sibu':     '诗巫',
    'q1.bintulu':  '民都鲁',
    'q1.samarahan':'三马拉汉',
    'q1.srIaman':  '斯里阿曼',
    'q1.kapit':    '加帛',
    'q1.other':    '其他地区',
    'q2.chip':    '第 2 题，共 7 题',
    'q2.title':   '您经营什么类型的业务？',
    'q2.food':    '餐饮',
    'q2.retail':  '零售',
    'q2.services':'服务业',
    'q2.craft':   '工艺品',
    'q2.agri':    '农业',
    'q2.other':   '其他',
    'q3.chip':       '第 3 题，共 7 题',
    'q3.title':      '客户目前如何找到您的业务？',
    'q3.none':       '完全没有网络存在',
    'q3.fb':         '仅通过Facebook或WhatsApp',
    'q3.social':     '活跃社交媒体（Instagram、TikTok）',
    'q3.oldweb':     '有网站但已过时',
    'q3.activeweb':  '有运作良好的网站',
    'q4.chip':    '第 4 题，共 7 题',
    'q4.title':   '您的业务预估月收入？',
    'q4.hint':    '此信息帮助我们了解您的业务阶段。',
    'q4.under1k': 'RM1,000以下',
    'q4.1kto5k':  'RM1,000 – RM5,000',
    'q4.5kto20k': 'RM5,000 – RM20,000',
    'q4.over20k': 'RM20,000以上',
    'q5.chip':    '第 5 题，共 7 题',
    'q5.title':   '大多数新客户如何找到您？',
    'q5.wom':     '朋友或家人推荐',
    'q5.social':  'Facebook或Instagram',
    'q5.google':  'Google搜索',
    'q5.ecom':    'Shopee或Lazada',
    'q5.walk':    '路过看到店铺',
    'q6.chip':    '第 6 题，共 7 题',
    'q6.title':   '您最大的数字挑战是什么？',
    'q6.nofind':  '客户难以在网上找到我的业务',
    'q6.noweb':   '没有专业外观的网站',
    'q6.noknow':  '不知道如何开始数字营销',
    'q6.cost':    '网站和营销成本太高',
    'q6.time':    '没有时间管理数字营销',
    'q7.chip':    '第 7 题，共 7 题',
    'q7.title':   '输入您的信息以接收结果',
    'q7.hint':    '您的审计结果和代金券资格将发送给您。',
    'form.biz':      '业务名称',
    'form.biz.ph':   '例：Mak Jah餐厅',
    'form.name':     '业主姓名',
    'form.name.ph':  '例：Ahmad bin Kadir',
    'form.mobile':   '电话号码',
    'form.mobile.ph':'011-2345 6789',
    'form.email':    '电子邮件（选填）',
    'form.email.ph': 'ahmad@example.com',
    'form.consent':  '提交即表示您同意上述信息用于KDP沙捞越计划目的。我们不会与第三方共享您的信息。',
    'loading.title': '正在分析您的数字档案…',
    'loading.li1':   '评估当前数字存在感',
    'loading.li2':   '计算代金券资格评分',
    'loading.li3':   '准备个性化报告',
    'result.title':  '恭喜！您的业务符合KDP数字代金券资格。',
    'cert.programme':'KDP沙捞越计划 · 数字代金券',
    'cert.status':   '符合资格',
    'cert.label':    '已批准代金券价值',
    'cert.currNote': '马来西亚令吉 — 用于建立您的第一个商业网站',
    'cert.row.biz':  '业务名称',
    'cert.row.name': '业主姓名',
    'cert.row.code': '参考代码',
    'cert.row.valid':'有效至',
    'next.title':       '下一步',
    'next.step1.head':  'KDP官员将联系您',
    'next.step1.sub':   '在1-3个工作日内通过WhatsApp或电话联系。',
    'next.step2.head':  '选择您的网站套餐',
    'next.step2.sub':   '基本套餐从RM500起 — RM1,000代金券完全覆盖此费用。',
    'next.step3.head':  '您的网站14天内上线',
    'next.step3.sub':   '我们处理所有技术工作 — 您专注于您的业务。',
  },

  IB: {
    'beta.text':         'Versi ujian — Utuk semak kelulusan program KDP Sarawak',
    'beta.demo':         'Cuba Demo →',
    'hero.programme':    'Program KDP Sarawak',
    'hero.subprogramme': 'Skim Pemansang Digital Pengusaha Kechik & Menengah',
    'hero.title1':       'Audit Kehadiran Digital',
    'hero.title2':       'Geratis utuk Pengusaha Sarawak',
    'hero.tagline':      'Jawab 7 soalan ringkas. Nemu taraf digital perniagaan nuan lalu layak baucar kerajaan RM1,000.',
    'coupon.title':      'Baucar Digital KDP — Laman Web Perniagaan',
    'coupon.desc':       'Nilai baucar utuk ngaga laman web profesional penama perniagaan nuan, dibiayai program kerajaan.',
    'hero.meta':         '<strong>Kurang ari 3 minit</strong> &nbsp;·&nbsp; 7 soalan &nbsp;·&nbsp; Geratis &nbsp;·&nbsp; Enda komitmen',
    'btn.start':         'Mula Audit Aku →',
    'btn.demo':          'Cuba Demo',
    'nav.back':          '← Balik',
    'nav.next':          'Semak →',
    'nav.submit':        'Hantar Audit →',
    'multi.hint':        'Ulih milih lebih ari satu',
    'q1.chip':    'Soalan 1 ari 7',
    'q1.title':   'Ni siti perniagaan nuan beroperasi?',
    'q1.hint':    'Milih daerah atau kawasan utama operasi perniagaan nuan.',
    'q1.kuching':  'Kuching',
    'q1.miri':     'Miri',
    'q1.sibu':     'Sibu',
    'q1.bintulu':  'Bintulu',
    'q1.samarahan':'Samarahan',
    'q1.srIaman':  'Sri Aman',
    'q1.kapit':    'Kapit',
    'q1.other':    'Daerah Bukai',
    'q2.chip':    'Soalan 2 ari 7',
    'q2.title':   'Nama jenis perniagaan nuan?',
    'q2.food':    'Makanan & Minuman',
    'q2.retail':  'Peruncitan',
    'q2.services':'Perkhidmatan',
    'q2.craft':   'Kraftangan',
    'q2.agri':    'Pertanian',
    'q2.other':   'Bukai',
    'q3.chip':       'Soalan 3 ari 7',
    'q3.title':      'Baka ni pelanggan nemu perniagaan nuan kin',
    'q3.none':       'Enda ada kehadiran online langsung',
    'q3.fb':         'Facebook atau WhatsApp sahaja',
    'q3.social':     'Media sosial aktif (Instagram, TikTok)',
    'q3.oldweb':     'Ada laman web tapi udah lapuk',
    'q3.activeweb':  'Ada laman web bejalaika enggau manah',
    'q4.chip':    'Soalan 4 ari 7',
    'q4.title':   'Agak-agak pendapatan bulan perniagaan nuan?',
    'q4.hint':    'Keterangan tu menolong kami nemu peringkat perniagaan nuan.',
    'q4.under1k': 'Bawah RM1,000',
    'q4.1kto5k':  'RM1,000 – RM5,000',
    'q4.5kto20k': 'RM5,000 – RM20,000',
    'q4.over20k': 'Lebih RM20,000',
    'q5.chip':    'Soalan 5 ari 7',
    'q5.title':   'Baka ni pelanggan baru nemu nuan?',
    'q5.wom':     'Cadangan ari diri atau keluarga',
    'q5.social':  'Facebook atau Instagram',
    'q5.google':  'Carian Google',
    'q5.ecom':    'Shopee atau Lazada',
    'q5.walk':    'Jalan lalu nampak kedai',
    'q6.chip':    'Soalan 6 ari 7',
    'q6.title':   'Nama cabaran digital tebat perniagaan nuan?',
    'q6.nofind':  'Pelanggan payah nemu perniagaan aku online',
    'q6.noweb':   'Enda ada laman web belelengkap',
    'q6.noknow':  'Enda nemu baka ni mula pemasaran digital',
    'q6.cost':    'Kos laman web enggau pemasaran terlalu tinggi',
    'q6.time':    'Enda ada masa nguruska pemasaran digital',
    'q7.chip':    'Soalan 7 ari 7',
    'q7.title':   'Keterikan maklumat nuan bisi nerima keputusan',
    'q7.hint':    'Keputusan audit enggau kelayakan baucar akan dihantar ngagai nuan.',
    'form.biz':      'Nama Perniagaan',
    'form.biz.ph':   'cth. Kedai Makan Mak Jah',
    'form.name':     'Nama Tuai Kedai',
    'form.name.ph':  'cth. Ahmad bin Kadir',
    'form.mobile':   'No. Telefon',
    'form.mobile.ph':'011-2345 6789',
    'form.email':    'Emel (pilihan)',
    'form.email.ph': 'ahmad@contoh.com',
    'form.consent':  'Enggau nghantar, nuan bersetuju maklumat tu digunaka utuk tujuan program KDP Sarawak. Kami enda ngumbai maklumat nuan ngagai pihak ketiga.',
    'loading.title': 'Nganalisis profil digital nuan…',
    'loading.li1':   'Menilai kehadiran digital semasa',
    'loading.li2':   'Ngira skor kelayakan baucar',
    'loading.li3':   'Nyediaka laporan peribadi',
    'result.title':  'Tahniah! Perniagaan nuan layak utuk Baucar Digital KDP.',
    'cert.programme':'Program KDP Sarawak · Baucar Digital',
    'cert.status':   'Layak',
    'cert.label':    'Nilai baucar diluluskan',
    'cert.currNote': 'Ringgit Malaysia — utuk ngaga laman web perniagaan penama',
    'cert.row.biz':  'Nama Perniagaan',
    'cert.row.name': 'Nama Tuai Kedai',
    'cert.row.code': 'Kod Rujukan',
    'cert.row.valid':'Sah datai',
    'next.title':       'Langkah Semak',
    'next.step1.head':  'Pegawai KDP makin ngaul nuan',
    'next.step1.sub':   'Dalam masa 1-3 hari bekerja ari WhatsApp atau telefon.',
    'next.step2.head':  'Milih pakej laman web nuan',
    'next.step2.sub':   'Pakej asas bermula RM500 — baucar RM1,000 nampung kos tu penuh.',
    'next.step3.head':  'Laman web nuan hidup dalam 14 hari',
    'next.step3.sub':   'Kami nguruska semua teknikal — nuan fokus ngagai perniagaan nuan.',
  },
};

/* ── Language switcher ──────────────────────────────────── */

function setLang(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  const t = TRANSLATIONS[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key] !== undefined) el.placeholder = t[key];
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
  });
  const htmlLang = { BM: 'ms', EN: 'en', ZH: 'zh', IB: 'iba' };
  document.documentElement.lang = htmlLang[lang] || 'ms';
}

const DEMO_ANSWERS = {
  q1: 'Kuching',
  q2: 'Makanan & Minuman',
  q3: 'Facebook sahaja',
  q4: 'RM1,000–RM5,000',
  q5: ['Facebook atau Instagram', 'Dari kawan-kawan'],
  q6: ['Pelanggan tak jumpa saya online', 'Tiada laman web profesional'],
};

const DEMO_CONTACT = {
  biz:    'Kedai Kek Ros Indah',
  name:   'Rosita binti Ahmad',
  mobile: '011-2345 6789',
  email:  'rosita@demo.kdp.my',
};

/* ── Step navigation ────────────────────────────────────── */

function showHero() {
  document.getElementById('step-0').style.display = '';
  document.getElementById('form-wrap').classList.remove('visible');
  document.getElementById('step-loading').classList.remove('active');
  document.getElementById('step-result').classList.remove('active');
  document.getElementById('progress-wrap').classList.remove('visible');
  currentStep = 0;
}

function showQuestion(n) {
  document.getElementById('step-0').style.display = 'none';
  document.getElementById('step-loading').classList.remove('active');
  document.getElementById('step-result').classList.remove('active');
  document.getElementById('form-wrap').classList.add('visible');
  document.getElementById('progress-wrap').classList.add('visible');

  document.querySelectorAll('.q-step').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('q' + n);
  if (target) {
    target.classList.add('active');
    target.style.animation = 'none';
    target.offsetHeight;
    target.style.animation = '';
  }
  currentStep = n;
  updateProgress(n);
}

function updateProgress(n) {
  const pct = Math.round(((n - 1) / TOTAL) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-label').textContent = n + ' / ' + TOTAL;
  document.getElementById('progress-wrap').setAttribute('aria-valuenow', pct);
}

/* ── Option selection ───────────────────────────────────── */

function bindOptionGrid(gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  const q = grid.dataset.q;
  grid.querySelectorAll('.opt-card').forEach(card => {
    card.addEventListener('click', () => selectOption(q, card, grid));
  });
}

function selectOption(q, card, grid) {
  const isMulti = grid.dataset.multi === 'true';
  if (isMulti) {
    card.classList.toggle('selected');
  } else {
    grid.querySelectorAll('.opt-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
  }
  const selected = [...grid.querySelectorAll('.opt-card.selected')].map(c => c.dataset.value);
  answers[q] = isMulti ? selected : selected[0];

  const nextBtn = document.getElementById(q + '-next') || document.getElementById(q + '-submit');
  if (nextBtn) nextBtn.disabled = selected.length === 0;

  if (isDemoMode && !isMulti) {
    setTimeout(() => {
      const n = parseInt(q.replace('q', ''), 10);
      if (n < TOTAL) showQuestion(n + 1);
      else showQuestion(TOTAL);
    }, 420);
  }
}

/* ── Demo mode ──────────────────────────────────────────── */

function enableDemo() {
  isDemoMode = true;
  document.body.classList.add('demo-mode');
  Object.assign(answers, DEMO_ANSWERS);
  showQuestion(1);

  document.querySelectorAll('[data-q]').forEach(grid => {
    const q = grid.dataset.q;
    const val = DEMO_ANSWERS[q];
    if (!val) return;
    const vals = Array.isArray(val) ? val : [val];
    grid.querySelectorAll('.opt-card').forEach(card => {
      card.classList.toggle('selected', vals.includes(card.dataset.value));
    });
    const nextBtn = document.getElementById(q + '-next');
    if (nextBtn) nextBtn.disabled = false;
  });
}

/* ── Lead scoring ───────────────────────────────────────── */

function calcScore() {
  let score = 50;
  const webMap = {
    'Tiada kehadiran online': -20,
    'Facebook sahaja': -5,
    'Media sosial aktif': 5,
    'Laman web ada tapi lama': 10,
    'Laman web aktif': 25,
  };
  const revMap = {
    'Bawah RM1,000': -10,
    'RM1,000–RM5,000': 0,
    'RM5,000–RM20,000': 15,
    'Lebih RM20,000': 20,
  };
  const districtBonus = ['Kapit', 'Sri Aman', 'Lain-lain'].includes(answers.q1) ? 10 : 0;
  score += (webMap[answers.q3] ?? 0);
  score += (revMap[answers.q4] ?? 0);
  score += districtBonus;
  return Math.max(10, Math.min(100, score));
}

function genCertCode() {
  const prefix = 'KDP';
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return prefix + '-' + year + '-' + rand;
}

/* ── Form submit ────────────────────────────────────────── */

async function submitForm() {
  let biz, name, mobile, email;

  if (isDemoMode) {
    biz    = DEMO_CONTACT.biz;
    name   = DEMO_CONTACT.name;
    mobile = DEMO_CONTACT.mobile;
    email  = DEMO_CONTACT.email;
  } else {
    biz    = document.getElementById('f-biz').value.trim();
    name   = document.getElementById('f-name').value.trim();
    mobile = document.getElementById('f-mobile').value.trim();
    email  = document.getElementById('f-email').value.trim();

    let hasError = false;
    [
      { id: 'f-biz', val: biz },
      { id: 'f-name', val: name },
      { id: 'f-mobile', val: mobile },
    ].forEach(({ id, val }) => {
      const el = document.getElementById(id);
      if (!val) { el.classList.add('error'); hasError = true; }
      else el.classList.remove('error');
    });
    if (hasError) return;
  }

  const score = calcScore();
  const certCode = genCertCode();
  const validUntil = new Date();
  validUntil.setMonth(validUntil.getMonth() + 3);
  const validStr = validUntil.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });

  showLoading(isDemoMode);

  if (!isDemoMode) {
    const record = {
      id: certCode,
      biz, name, mobile, email, score, certCode,
      q1: answers.q1, q2: answers.q2, q3: answers.q3,
      q4: answers.q4,
      q5: Array.isArray(answers.q5) ? answers.q5.join(', ') : answers.q5,
      q6: Array.isArray(answers.q6) ? answers.q6.join(', ') : answers.q6,
      status: 'Baru',
      submittedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem('kdp_last_lead', JSON.stringify(record));
      await window.SDC_SYNC.push(record);
    } catch (e) {
      /* silent fail */
    }
  }

  setTimeout(() => {
    showResult({ biz, name, certCode, validStr });
  }, isDemoMode ? 1700 : 2600);
}

/* ── Loading sequence ───────────────────────────────────── */

function showLoading(fast) {
  document.getElementById('form-wrap').classList.remove('visible');
  document.getElementById('step-loading').classList.add('active');
  document.getElementById('progress-wrap').classList.remove('visible');

  const items = ['li-1', 'li-2', 'li-3'];
  const delays = fast ? [300, 700, 1200] : [400, 1100, 2000];

  items.forEach((id, i) => {
    const el = document.getElementById(id);
    el.classList.remove('shown', 'done', 'active');
    el.querySelector('.loader-dot').className = 'loader-dot';
    setTimeout(() => {
      el.classList.add('shown', 'active');
    }, delays[i]);
    setTimeout(() => {
      el.classList.remove('active');
      el.classList.add('done');
    }, delays[i] + (fast ? 400 : 800));
  });
}

/* ── Show result ────────────────────────────────────────── */

function showResult({ biz, name, certCode, validStr }) {
  document.getElementById('step-loading').classList.remove('active');
  document.getElementById('progress-wrap').classList.add('visible');
  updateProgress(7);
  document.getElementById('progress-fill').style.width = '100%';
  document.getElementById('progress-label').textContent = 'Selesai';

  document.getElementById('cert-biz').textContent = biz || '—';
  document.getElementById('cert-name').textContent = name || '—';
  document.getElementById('cert-code').textContent = certCode;
  document.getElementById('cert-validity').textContent = validStr;

  document.getElementById('step-result').classList.add('active');
  document.getElementById('step-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Init ───────────────────────────────────────────────── */

function init() {
  ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'].forEach(q => bindOptionGrid(q + '-grid'));

  document.getElementById('start-btn').addEventListener('click', () => showQuestion(1));
  document.getElementById('hero-demo-btn').addEventListener('click', enableDemo);
  document.getElementById('demo-btn').addEventListener('click', enableDemo);

  document.getElementById('q2-back').addEventListener('click', () => showQuestion(1));
  document.getElementById('q3-back').addEventListener('click', () => showQuestion(2));
  document.getElementById('q4-back').addEventListener('click', () => showQuestion(3));
  document.getElementById('q5-back').addEventListener('click', () => showQuestion(4));
  document.getElementById('q6-back').addEventListener('click', () => showQuestion(5));
  document.getElementById('q7-back').addEventListener('click', () => showQuestion(6));

  document.getElementById('q1-next').addEventListener('click', () => showQuestion(2));
  document.getElementById('q2-next').addEventListener('click', () => showQuestion(3));
  document.getElementById('q3-next').addEventListener('click', () => showQuestion(4));
  document.getElementById('q4-next').addEventListener('click', () => showQuestion(5));
  document.getElementById('q5-next').addEventListener('click', () => showQuestion(6));
  document.getElementById('q6-next').addEventListener('click', () => showQuestion(7));
  document.getElementById('q7-submit').addEventListener('click', submitForm);

  ['f-biz', 'f-name', 'f-mobile', 'f-email'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => el.classList.remove('error'));
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  setLang('BM');

  if (new URLSearchParams(location.search).get('demo') === '1') enableDemo();
}

document.addEventListener('DOMContentLoaded', init);
