export interface MoroccanCity {
  key: string;
  name: string;
  lat: number;
  lng: number;
}

export const MOROCCAN_CITIES: MoroccanCity[] = [
  { key: "mohammedia", name: "المحمدية (زاوية المحمدية)", lat: 33.6866, lng: -7.3829 },
  { key: "casablanca", name: "الدار البيضاء", lat: 33.5731, lng: -7.5898 },
  { key: "rabat", name: "الرباط والجهوية", lat: 34.0209, lng: -6.8416 },
  { key: "fes", name: "فاس العريقة", lat: 34.0331, lng: -5.0003 },
  { key: "marrakech", name: "مراكش الحمراء", lat: 31.6295, lng: -7.9811 },
  { key: "tangier", name: "طنجة العالية", lat: 35.7595, lng: -5.8340 },
  { key: "oujda", name: "وجدة والشرق (مداغ)", lat: 34.6814, lng: -1.9086 },
  { key: "laayoune", name: "العيون والصحراء", lat: 27.1536, lng: -13.2033 },
];

export interface PrayerTimesResult {
  fajr: string;
  shuruk: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  cityName: string;
  cityKey: string;
}

export interface NextPrayerInfo {
  key: "fajr" | "shuruk" | "dhuhr" | "asr" | "maghrib" | "isha";
  name: string;
  time: string;
  countdown: string;
  isPassed: boolean;
}

export function calculateMoroccanPrayerTimes(
  date: Date = new Date(),
  cityKey: string = "mohammedia"
): PrayerTimesResult {
  const city =
    MOROCCAN_CITIES.find((c) => c.key === cityKey) || MOROCCAN_CITIES[0];

  const d = new Date(date);
  const start = new Date(Date.UTC(d.getUTCFullYear(), 0, 0));
  const diff = d.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const latRad = city.lat * (Math.PI / 180);
  const gamma = ((2 * Math.PI) / 365) * (dayOfYear - 1);

  // Equation of time in minutes
  const eqtime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  // Solar declination in radians
  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma);

  // Morocco operates on UTC+1 (GMT+1) standard
  const timezone = 1;
  const solarNoonMinutes = 720 - 4 * city.lng - eqtime + 60 * timezone;

  function getHA(altitudeDeg: number) {
    const altRad = altitudeDeg * (Math.PI / 180);
    const cosH =
      (Math.sin(altRad) - Math.sin(latRad) * Math.sin(decl)) /
      (Math.cos(latRad) * Math.cos(decl));
    if (cosH > 1 || cosH < -1) return 0;
    return Math.acos(cosH) * (180 / Math.PI) * 4;
  }

  // Morocco standard Habous: Fajr 19°, Shuruk -0.833°, Isha 17°
  const fajrHA = getHA(-19);
  const sunriseHA = getHA(-0.833);

  // Asr: Maliki School (shadow = 1 + shadow at noon)
  const noonZenith = Math.abs(latRad - decl);
  const shadowAtNoon = Math.tan(noonZenith);
  const asrAltitude = Math.atan(1 / (1 + shadowAtNoon)) * (180 / Math.PI);
  const asrHA = getHA(asrAltitude);

  const maghribHA = sunriseHA;
  const ishaHA = getHA(-17);

  function minToTime(minutes: number) {
    let m = Math.round(minutes);
    let hrs = Math.floor(m / 60) % 24;
    let mins = m % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  }

  return {
    fajr: minToTime(solarNoonMinutes - fajrHA),
    shuruk: minToTime(solarNoonMinutes - sunriseHA),
    dhuhr: minToTime(solarNoonMinutes),
    asr: minToTime(solarNoonMinutes + asrHA),
    maghrib: minToTime(solarNoonMinutes + maghribHA),
    isha: minToTime(solarNoonMinutes + ishaHA),
    cityName: city.name,
    cityKey: city.key,
  };
}

export function getNextPrayer(times: PrayerTimesResult, now: Date = new Date()): NextPrayerInfo {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const prayers: { key: NextPrayerInfo["key"]; name: string; minutes: number; timeStr: string }[] = [
    { key: "fajr", name: "الفجر", minutes: parseTime(times.fajr), timeStr: times.fajr },
    { key: "shuruk", name: "الشروق", minutes: parseTime(times.shuruk), timeStr: times.shuruk },
    { key: "dhuhr", name: "الظهر", minutes: parseTime(times.dhuhr), timeStr: times.dhuhr },
    { key: "asr", name: "العصر", minutes: parseTime(times.asr), timeStr: times.asr },
    { key: "maghrib", name: "المغرب", minutes: parseTime(times.maghrib), timeStr: times.maghrib },
    { key: "isha", name: "العشاء", minutes: parseTime(times.isha), timeStr: times.isha },
  ];

  for (const p of prayers) {
    if (p.minutes > currentMinutes) {
      const diff = p.minutes - currentMinutes;
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      const countdown =
        hours > 0 ? `بعد ${hours} س و ${mins} د` : `بعد ${mins} دقيقة`;
      return {
        key: p.key,
        name: p.name,
        time: p.timeStr,
        countdown,
        isPassed: false,
      };
    }
  }

  // If past Isha, next is tomorrow's Fajr
  const fajrMin = parseTime(times.fajr);
  const diff = 24 * 60 - currentMinutes + fajrMin;
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  return {
    key: "fajr",
    name: "الفجر (غداً)",
    time: times.fajr,
    countdown: `بعد ${hours} س و ${mins} د`,
    isPassed: false,
  };
}
