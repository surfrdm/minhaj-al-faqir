import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  GraduationCap,
  Award,
  BookOpen,
  Globe2,
  Building,
  School,
  FileText,
  UserCheck,
  Crown,
  Sparkles,
  ChevronLeft,
  HeartHandshake,
  Compass,
  CheckCircle2,
  Scroll,
} from "lucide-react";

export const metadata: Metadata = {
  title: "شيخ الطريقة القادرية البودشيشية | فضيلة الدكتور الشيخ سيدي منير القادري بودشيش",
  description:
    "ورقة تعريفية شاملة بشيخ الطريقة القادرية البودشيشية فضيلة الشيخ الدكتور سيدي منير القادري بودشيش: السند التربوي، المسار الأكاديمي، والمهام العلمية والإشعاع الفكري المعاصر.",
};

export default function ShaykhPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] dark:bg-[#07130E] text-[#1D2A24] dark:text-[#E8F0EC]" dir="rtl">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb & Navigation helper */}
        <section className="bg-[#F3ECE0] dark:bg-[#0B1A14] border-b border-[#E7DFD5] dark:border-[#1E382C] py-3.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto flex items-center justify-between text-xs sm:text-sm font-ibm">
            <div className="flex items-center gap-2 text-[#6B7D74] dark:text-[#95B8A8]">
              <Link href="/" className="hover:text-[#1B4332] dark:hover:text-[#E5C378] transition-colors">
                الرئيسية
              </Link>
              <span>/</span>
              <span className="text-[#1B4332] dark:text-[#E5C378] font-semibold">
                شيخ الطريقة القادرية البودشيشية
              </span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B4332] dark:text-[#E5C378] hover:underline"
            >
              <span>العودة للمنهاج</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* HERO HEADER: Royal & Spiritual Presentation */}
        <section className="relative py-14 sm:py-20 overflow-hidden bg-gradient-to-b from-[#F7F2E9] via-[#FAF7F2] to-[#FAF7F2] dark:from-[#0A1813] dark:via-[#07130E] dark:to-[#07130E] border-b border-[#E7DFD5]/80 dark:border-[#1C362A]">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#C5A059]/10 dark:bg-[#1B4332]/25 rounded-full blur-3xl pointer-events-none -z-0" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
              {/* Grand Portrait with Royal Framing */}
              <div className="relative shrink-0">
                <div className="w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-3xl bg-gradient-to-b from-[#1B4332] via-[#143628] to-[#0B1E17] p-2 border-2 border-[#C5A059] shadow-2xl overflow-hidden flex items-center justify-center">
                  <img
                    src="/images/sidi_mounir_portrait.png"
                    alt="فضيلة الشيخ الدكتور سيدي منير القادري بودشيش"
                    className="w-full h-full object-cover object-top filter drop-shadow-md hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* Royal Crown Badge */}
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-tr from-[#9E7B35] to-[#D4AF37] text-[#143628] rounded-2xl p-2.5 shadow-xl border-2 border-white dark:border-[#0E2019]">
                  <Crown className="w-6 h-6 text-[#143628]" />
                </div>
              </div>

              {/* Title, Subtitle, & Lineage Badge */}
              <div className="flex-1 text-center md:text-right space-y-4">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/35 text-[#9E7B35] dark:text-[#E5C378] text-xs sm:text-sm font-semibold">
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <span>الإرشاد والتربية الروحية • السند القادري المتصل</span>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-white/70 dark:bg-[#0E2019]/70 border border-[#E7DFD5] dark:border-[#1F3D2F] text-[#52796F] dark:text-[#A1B3A9] font-medium">
                    آخر تحيين: ربيع الثاني 1448 هـ / أكتوبر 2026
                  </span>
                </div>

                <h1 className="font-amiri text-3xl sm:text-4xl lg:text-5xl font-bold text-[#143628] dark:text-[#FAF7F2] leading-tight pt-1">
                  الشيخ الدكتور سيدي منير القادري بودشيش
                </h1>

                <p className="font-amiri text-xl sm:text-2xl text-[#C5A059] dark:text-[#D4AF37] font-semibold leading-relaxed">
                  شيخ الطريقة القادرية البودشيشية ومربيها الروحي
                </p>

                <p className="font-ibm text-sm sm:text-base text-[#1D2A24]/80 dark:text-[#D5E2DB] leading-relaxed max-w-2xl">
                  ورقة تعريفية شاملة تبرز استمرارية السند التربوي والروحي للطريقة، وتجمع بين رسوخ التكوين الشرعي الأصيل والانفتاح الأكاديمي والفكري المعاصر.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN BODY CONTENT: Spacious, Clear, Highly Readable */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14 sm:space-y-16">
          {/* ======================================================== */}
          {/* SECTION 1: SPIRITUAL SUCCESSION & INTRODUCTION           */}
          {/* ======================================================== */}
          <section className="bg-white dark:bg-[#0E221B] rounded-3xl p-7 sm:p-10 border border-[#E7DFD5] dark:border-[#1F3D2F] shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 text-[#1B4332] dark:text-[#E5C378] mb-6 border-b border-[#E7DFD5] dark:border-[#1F3D2F] pb-4">
              <div className="p-2.5 rounded-xl bg-[#C5A059]/15 text-[#C5A059]">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="font-amiri text-2xl sm:text-3xl font-bold">
                السند التربوي والوراثة الروحية
              </h2>
            </div>

            <div className="space-y-5 font-ibm text-base sm:text-lg text-[#1D2A24]/90 dark:text-[#DCE7E1] leading-loose">
              <p>
                يُعدّ <strong className="text-[#143628] dark:text-[#FAF7F2] font-semibold">الشيخ الدكتور سيدي منير القادري بودشيش</strong> أحد أبرز أعلام الطريقة القادرية البودشيشية في المرحلة الراهنة، حيث <strong className="text-[#1B4332] dark:text-[#E5C378] font-semibold">آلت إليه مهمة الإرشاد والتربية الروحية بناء على وصيتين مباركتين للشيخين سيدي حمزة بن العباس وسيدي جمال الدين، رحمهما الله</strong>، في سياق استمرارية السند التربوي والروحي للطريقة.
              </p>
              <p>
                وقد اقترن اسمه بحضور علمي متميز جمع بين <strong className="text-[#143628] dark:text-[#FAF7F2] font-semibold">التكوين الشرعي والمعرفة العصرية</strong>، إذ راكم سيدي منير مسارا أكاديميا متنوعا يعكس انفتاحا على الحقول الإنسانية والاجتماعية والاقتصادية، بما يعزز مقاربته للتصوف في أبعاده الفكرية والتواصلية المعاصرة.
              </p>
            </div>
          </section>

          {/* ======================================================== */}
          {/* SECTION 2: ACADEMIC CURRICULUM (المسار الأكاديمي)        */}
          {/* ======================================================== */}
          <section className="bg-white dark:bg-[#0E221B] rounded-3xl p-7 sm:p-10 border border-[#E7DFD5] dark:border-[#1F3D2F] shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-[#1B4332] dark:text-[#E5C378] border-b border-[#E7DFD5] dark:border-[#1F3D2F] pb-4">
              <div className="p-2.5 rounded-xl bg-[#1B4332]/10 dark:bg-[#C5A059]/20 text-[#1B4332] dark:text-[#E5C378]">
                <GraduationCap className="w-6 h-6 text-[#C5A059]" />
              </div>
              <div>
                <h2 className="font-amiri text-2xl sm:text-3xl font-bold">
                  المسار الأكاديمي والشهادات العليا
                </h2>
                <p className="font-ibm text-xs sm:text-sm text-[#6B7D74] dark:text-[#95B8A8] mt-1">
                  سجل علمي حافل يجمع الإجازات والدبلومات المتخصصة وأطروحات الدكتوراه بالجامعات المغربية والفرنسية
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 font-ibm">
              {/* Item 1 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-3.5 hover:border-[#C5A059]/60 transition-all">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-1" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-base text-[#143628] dark:text-[#FAF7F2]">
                    الإجازة في الدراسات الإسلامية
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7D74] dark:text-[#95B8A8]">
                    كلية الآداب والعلوم الإنسانية – وجدة، 1994
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-3.5 hover:border-[#C5A059]/60 transition-all">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-1" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-base text-[#143628] dark:text-[#FAF7F2]">
                    الإجازة في العلوم الاقتصادية
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7D74] dark:text-[#95B8A8]">
                    كلية العلوم القانونية والاقتصادية – وجدة، 1995
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-3.5 hover:border-[#C5A059]/60 transition-all">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-1" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-base text-[#143628] dark:text-[#FAF7F2]">
                    خريج دار الحديث الحسنية
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7D74] dark:text-[#95B8A8]">
                    المؤسسة العتيدة دار الحديث الحسنية للدراسات الإسلامية العليا – الرباط، 1996
                  </p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-3.5 hover:border-[#C5A059]/60 transition-all">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-1" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-base text-[#143628] dark:text-[#FAF7F2]">
                    دبلوم في العلوم الاقتصادية وتسيير المقاولات
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7D74] dark:text-[#95B8A8]">
                    جامعة كرونوبل (Université de Grenoble) – فرنسا، 1999
                  </p>
                </div>
              </div>

              {/* Item 5 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-3.5 hover:border-[#C5A059]/60 transition-all">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-1" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-base text-[#143628] dark:text-[#FAF7F2]">
                    دبلوم الدراسات العليا المتخصصة في الأنثروبولوجيا السوسيولوجية
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7D74] dark:text-[#95B8A8]">
                    أبحاث معمقة حول المجتمعات المغاربية المعاصرة، 1999
                  </p>
                </div>
              </div>

              {/* Item 6 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-3.5 hover:border-[#C5A059]/60 transition-all">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-1" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-base text-[#143628] dark:text-[#FAF7F2]">
                    ماجستير في الذكاء الاقتصادي
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7D74] dark:text-[#95B8A8]">
                    Master en Intelligence Économique
                  </p>
                </div>
              </div>

              {/* Item 7 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-3.5 hover:border-[#C5A059]/60 transition-all">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-1" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-base text-[#143628] dark:text-[#FAF7F2]">
                    دكتوراه في العلوم الإنسانية
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7D74] dark:text-[#95B8A8]">
                    مؤسسة دار الحديث الحسنية – الرباط
                  </p>
                </div>
              </div>

              {/* Item 8 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-3.5 hover:border-[#C5A059]/60 transition-all">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-1" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-base text-[#143628] dark:text-[#FAF7F2]">
                    دكتوراه في علوم الأديان وأنظمة التفكير
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7D74] dark:text-[#95B8A8]">
                    المدرسة التطبيقية للدراسات العليا – السوربون (EPHE - Sorbonne)
                  </p>
                </div>
              </div>

              {/* Item 9: The Famous Sorbonne Sufism Doctorate */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#C5A059]/15 via-[#C5A059]/10 to-transparent border-2 border-[#C5A059]/50 sm:col-span-2 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[#C5A059] text-[#143628] shrink-0 shadow-sm mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                    دكتوراه في الدراسات الصوفية – جامعة السوربون (Sorbonne Université)
                  </h3>
                  <p className="text-sm sm:text-base text-[#1D2A24]/90 dark:text-[#E8F0EC] leading-relaxed">
                    عن أطروحة أكاديمية قيّمة تناولت كتاب <strong>«قوت القلوب في معاملة المحبوب ووصف طريق المريد إلى مقام التوحيد»</strong> للإمام أبي طالب المكي رحمه الله، أُنجزت تحت إشراف البروفيسور <em>بيير لوري (Pierre Lory)</em>.
                  </p>
                </div>
              </div>

              {/* Item 10 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] sm:col-span-2 flex items-start gap-3.5 hover:border-[#C5A059]/60 transition-all">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-1" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-base text-[#143628] dark:text-[#FAF7F2]">
                    دبلوم معهد أوروبا – المغارب
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7D74] dark:text-[#95B8A8]">
                    باريس، 2001
                  </p>
                </div>
              </div>
            </div>

            {/* Academic & Spiritual Chronological Timeline (الجمع بين الأكاديميا والسلوك) */}
            <div className="mt-10 pt-8 border-t border-[#E7DFD5] dark:border-[#1F3D2F]">
              <div className="flex items-center gap-2.5 mb-6 text-[#C5A059]">
                <Compass className="w-5 h-5" />
                <h3 className="font-amiri text-xl sm:text-2xl font-bold text-[#143628] dark:text-[#FAF7F2]">
                  المسار الزمني: نموذج الجمع بين الرسوخ الشرعي والأكاديمي والذوق السلوكي
                </h3>
              </div>

              <div className="relative pr-6 border-r-2 border-[#C5A059]/40 space-y-6">
                {/* 1994 */}
                <div className="relative">
                  <span className="absolute -right-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#1B4332] border-2 border-[#C5A059]" />
                  <span className="text-xs font-mono font-bold text-[#C5A059] block">1994 م</span>
                  <h4 className="font-semibold text-sm text-[#143628] dark:text-[#FAF7F2]">
                    الإجازة في الدراسات الإسلامية (جامعة محمد الأول – وجدة)
                  </h4>
                  <p className="text-xs text-[#6B7D74] dark:text-[#95B8A8] mt-0.5">
                    التأسيس العقدي والفقهي والأصولي المتين في المذهب المالكي والعقيدة الأشعرية.
                  </p>
                </div>

                {/* 1995 */}
                <div className="relative">
                  <span className="absolute -right-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#1B4332] border-2 border-[#C5A059]" />
                  <span className="text-xs font-mono font-bold text-[#C5A059] block">1995 م</span>
                  <h4 className="font-semibold text-sm text-[#143628] dark:text-[#FAF7F2]">
                    الإجازة في العلوم الاقتصادية (كلية الحقوق والاقتصاد – وجدة)
                  </h4>
                  <p className="text-xs text-[#6B7D74] dark:text-[#95B8A8] mt-0.5">
                    إدراك التحديات التنموية والمعطيات الاقتصادية والمؤسساتية المعاصرة.
                  </p>
                </div>

                {/* 1996 */}
                <div className="relative">
                  <span className="absolute -right-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#1B4332] border-2 border-[#C5A059]" />
                  <span className="text-xs font-mono font-bold text-[#C5A059] block">1996 م</span>
                  <h4 className="font-semibold text-sm text-[#143628] dark:text-[#FAF7F2]">
                    التخرج من مؤسسة دار الحديث الحسنية للدراسات الإسلامية العليا (الرباط)
                  </h4>
                  <p className="text-xs text-[#6B7D74] dark:text-[#95B8A8] mt-0.5">
                    التعمق في علوم الحديث النبوي الشريف والتخريج ومناهج المحدثين والمحققين.
                  </p>
                </div>

                {/* 1999 - 2001 */}
                <div className="relative">
                  <span className="absolute -right-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#1B4332] border-2 border-[#C5A059]" />
                  <span className="text-xs font-mono font-bold text-[#C5A059] block">1999 – 2001 م</span>
                  <h4 className="font-semibold text-sm text-[#143628] dark:text-[#FAF7F2]">
                    دبلومات العلوم الاقتصادية والأنثروبولوجيا ومعهد أوروبا-المغارب (فرنسا)
                  </h4>
                  <p className="text-xs text-[#6B7D74] dark:text-[#95B8A8] mt-0.5">
                    تسيير المقاولات بجامعة غرونوبل، أبحاث المجتمعات المغاربية، وماجستير الذكاء الاقتصادي.
                  </p>
                </div>

                {/* Doctoral Milestones */}
                <div className="relative">
                  <span className="absolute -right-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#C5A059] border-2 border-[#1B4332]" />
                  <span className="text-xs font-mono font-bold text-[#C5A059] block">المرحلة الأكاديمية العليا (أطروحات الدكتوراه)</span>
                  <h4 className="font-semibold text-sm text-[#143628] dark:text-[#FAF7F2]">
                    ثلاث درجات دكتوراه متخصصة (دار الحديث الحسنية بالرباط، والمدرسة التطبيقية EPHE، وجامعة السوربون بباريس)
                  </h4>
                  <p className="text-xs text-[#6B7D74] dark:text-[#95B8A8] mt-0.5">
                    تتويج المسار بأطروحة الدكتوراه في السوربون حول «قوت القلوب» لأبي طالب المكي بإشراف البروفيسور بيير لوري، مسجلةً تجسيداً فريداً للجمع بين أدوات البحث الأكاديمي الدولي والعمق الروحي الصوفي.
                  </p>
                </div>

                {/* Leadership & Succession */}
                <div className="relative">
                  <span className="absolute -right-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#C5A059] border-2 border-white dark:border-[#0E2019]" />
                  <span className="text-xs font-mono font-bold text-[#C5A059] block">الوراثة والسند التربوي</span>
                  <h4 className="font-semibold text-sm text-[#143628] dark:text-[#FAF7F2]">
                    مشيخة الطريقة القادرية البودشيشية ووراثة التربية الروحية
                  </h4>
                  <p className="text-xs text-[#6B7D74] dark:text-[#95B8A8] mt-0.5">
                    تولي التربية والإرشاد بالوصيتين المباركتين للشيخين سيدي حمزة وسيدي جمال الدين، وقيادة الطريقة برؤية تجسر بين الأصالة والمعاصرة.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* SECTION 3: SCIENTIFIC MISSIONS & LEADERSHIP              */}
          {/* ======================================================== */}
          <section className="bg-white dark:bg-[#0E221B] rounded-3xl p-7 sm:p-10 border border-[#E7DFD5] dark:border-[#1F3D2F] shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-[#1B4332] dark:text-[#E5C378] border-b border-[#E7DFD5] dark:border-[#1F3D2F] pb-4">
              <div className="p-2.5 rounded-xl bg-[#C5A059]/15 text-[#C5A059]">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-amiri text-2xl sm:text-3xl font-bold">
                  المهام العلمية والإشعاع الفكري
                </h2>
                <p className="font-ibm text-xs sm:text-sm text-[#6B7D74] dark:text-[#95B8A8] mt-1">
                  مسؤوليات مؤسسية ودولية تعكس الحضور في مجالات البحث والتأطير والتواصل الحضاري
                </p>
              </div>
            </div>

            <p className="font-ibm text-base sm:text-lg text-[#1D2A24]/90 dark:text-[#D5E2DB] leading-relaxed">
              إلى جانب مساره الأكاديمي، اضطلع الشيخ سيدي منير القادري بودشيش بعدد من المسؤوليات العلمية والمؤسساتية التي تعكس حضوره في مجالات البحث والتأطير والتواصل الحضاري، من أبرزها:
            </p>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 font-ibm">
              <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-4">
                <Building className="w-5 h-5 text-[#C5A059] shrink-0 mt-1" />
                <span className="text-sm sm:text-base text-[#1D2A24]/90 dark:text-[#E8F0EC] leading-relaxed">
                  <strong>مدير مركز الدراسات الأورو-متوسطية حول الإسلام اليوم (CEMEIA)</strong> – باريس
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-4">
                <School className="w-5 h-5 text-[#C5A059] shrink-0 mt-1" />
                <span className="text-sm sm:text-base text-[#1D2A24]/90 dark:text-[#E8F0EC] leading-relaxed">
                  <strong>أستاذ المالية الإسلامية</strong> بجامعة دوفين (Université Paris-Dauphine) – فرنسا
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-4">
                <Globe2 className="w-5 h-5 text-[#C5A059] shrink-0 mt-1" />
                <span className="text-sm sm:text-base text-[#1D2A24]/90 dark:text-[#E8F0EC] leading-relaxed">
                  <strong>رئيس الملتقى العالمي للتصوف</strong> – مداغ الشريفة، إقليم بركان
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-4">
                <UserCheck className="w-5 h-5 text-[#C5A059] shrink-0 mt-1" />
                <span className="text-sm sm:text-base text-[#1D2A24]/90 dark:text-[#E8F0EC] leading-relaxed">
                  <strong>عضو المجلس الأوروبي للعلماء المغاربة</strong> – بروكسيل
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-4">
                <Award className="w-5 h-5 text-[#C5A059] shrink-0 mt-1" />
                <span className="text-sm sm:text-base text-[#1D2A24]/90 dark:text-[#E8F0EC] leading-relaxed">
                  <strong>رئيس لجنة الرقابة الشرعية</strong> بالمجلس الأوروبي المستقل للمالية الإسلامية
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] flex items-start gap-4">
                <BookOpen className="w-5 h-5 text-[#C5A059] shrink-0 mt-1" />
                <span className="text-sm sm:text-base text-[#1D2A24]/90 dark:text-[#E8F0EC] leading-relaxed">
                  <strong>رئيس جمعية «ورش»</strong> لتحفيظ القرآن الكريم وتعليم علومه – بركان
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] sm:col-span-2 flex items-start gap-4">
                <FileText className="w-5 h-5 text-[#C5A059] shrink-0 mt-1" />
                <span className="text-sm sm:text-base text-[#1D2A24]/90 dark:text-[#E8F0EC] leading-relaxed">
                  <strong>باحث في التصوف والتواصل</strong> بالمدرسة التطبيقية للدراسات العليا – جامعة السوربون (EPHE - Sorbonne)
                </span>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* SECTION 4: ROYAL VISION & MOROCCAN CONSTANTS             */}
          {/* ======================================================== */}
          <section className="rounded-3xl bg-gradient-to-r from-[#1B4332] via-[#143628] to-[#1B4332] text-[#FAF7F2] p-8 sm:p-12 border-2 border-[#C5A059]/60 shadow-xl relative overflow-hidden space-y-6">
            <div className="flex items-center gap-3 text-[#E5C378]">
              <Crown className="w-7 h-7 text-[#C5A059]" />
              <h2 className="font-amiri text-2xl sm:text-3xl font-bold">
                أنموذج العالم الصوفي المعاصر وحفظ ثوابت المملكة المغربية
              </h2>
            </div>

            <p className="font-ibm text-base sm:text-xl text-[#FAF7F2]/95 leading-loose">
              يمثل الشيخ الدكتور سيدي منير القادري بودشيش نموذجا لعالم صوفي معاصر يجمع بين عمق التكوين الشرعي والانفتاح على العلوم الإنسانية والاجتماعية، بما يؤهله للإسهام في تجديد الخطاب الصوفي وتعزيز حضوره في السياقات العالمية الراهنة، ضمن رؤية تقوم على الحوار والتواصل وبناء المشترك الإنساني، <strong className="text-[#E5C378] font-bold">ممثلا لرؤية صاحب الجلالة الملك محمد السادس نصره الله وأيده القائمة على حفظ ثوابت المملكة المغربية الشريفة</strong>.
            </p>
          </section>

          {/* ======================================================== */}
          {/* SECTION 5: PILLARS OF TARIQA BOUTCHICHIYYA               */}
          {/* ======================================================== */}
          <section className="bg-white dark:bg-[#0E221B] rounded-3xl p-7 sm:p-10 border border-[#E7DFD5] dark:border-[#1F3D2F] shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-[#1B4332] dark:text-[#E5C378] border-b border-[#E7DFD5] dark:border-[#1F3D2F] pb-4">
              <div className="p-2.5 rounded-xl bg-[#C5A059]/15 text-[#C5A059]">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h2 className="font-amiri text-2xl sm:text-3xl font-bold">
                معالم المنهج التربوي في الطريقة القادرية البودشيشية
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 font-ibm text-sm">
              <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] space-y-1.5">
                <strong className="text-base text-[#1B4332] dark:text-[#E5C378] font-amiri block">المحبة والذكر الكثير:</strong>
                <p className="text-xs sm:text-sm text-[#1D2A24]/85 dark:text-[#D5E2DB] leading-relaxed">
                  التربية بالحب في الله، وملازمة ذكر الله تعالى باللسان والقلب لغسل القلوب من الصدأ ورؤية النفس ونيل طمأنينة الإيمان.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] space-y-1.5">
                <strong className="text-base text-[#1B4332] dark:text-[#E5C378] font-amiri block">الجمع بين الشريعة والحقيقة:</strong>
                <p className="text-xs sm:text-sm text-[#1D2A24]/85 dark:text-[#D5E2DB] leading-relaxed">
                  التصوف السني الجنيدي المنضبط بكتاب الله وسنة رسوله ﷺ والعمل بأحكام المذهب المالكي والاجتهاد في العبادة بلا غلو ولا ابتداع.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] space-y-1.5">
                <strong className="text-base text-[#1B4332] dark:text-[#E5C378] font-amiri block">خدمة الخلق وجبر الخواطر:</strong>
                <p className="text-xs sm:text-sm text-[#1D2A24]/85 dark:text-[#D5E2DB] leading-relaxed">
                  حسن الخلق، والتواضع للفقراء وعامة المسلمين، واعتبار خدمة عباد الله ونفعهم مقصداً كبيراً من مقاصد السير إلى الله تعالى.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#081711] border border-[#E7DFD5] dark:border-[#1F3A2E] space-y-1.5">
                <strong className="text-base text-[#1B4332] dark:text-[#E5C378] font-amiri block">الثوابت الوطنية الجامعة:</strong>
                <p className="text-xs sm:text-sm text-[#1D2A24]/85 dark:text-[#D5E2DB] leading-relaxed">
                  الوفاء لثوابت المملكة المغربية الشريفة: العقيدة الأشعرية، والمذهب المالكي، والتصوف السني، وإمارة المؤمنين.
                </p>
              </div>
            </div>
          </section>

          {/* Bottom CTA to return to Academy & Curriculum */}
          <div className="text-center pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#1B4332] hover:bg-[#143628] text-[#FAF7F2] font-semibold shadow-lg shadow-[#1B4332]/25 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 border border-[#C5A059]/40 text-sm sm:text-base font-ibm"
            >
              <Scroll className="w-5 h-5 text-[#C5A059]" />
              <span>استكشاف رحاب الأنوار والمتون في منصة «مِنْهَاجُ الفَقِير»</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
