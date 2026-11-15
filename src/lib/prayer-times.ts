export interface MoroccanCity {
  key: string;
  name: string;
  name_en: string;
  lat: number;
  lng: number;
}

export const MOROCCAN_CITIES: MoroccanCity[] = [
  { key: "casablanca", name: "الدار البيضاء", name_en: "Casablanca", lat: 33.5731, lng: -7.5898 },
  { key: "rabat", name: "الرباط", name_en: "Rabat", lat: 34.0209, lng: -6.8416 },
  { key: "fes", name: "فاس", name_en: "Fes", lat: 34.0331, lng: -5.0003 },
  { key: "marrakech", name: "مراكش", name_en: "Marrakech", lat: 31.6295, lng: -7.9811 },
  { key: "tangier", name: "طنجة", name_en: "Tangier", lat: 35.7595, lng: -5.8340 },
  { key: "agadir", name: "أكادير", name_en: "Agadir", lat: 30.4278, lng: -9.5981 },
  { key: "meknes", name: "مكناس", name_en: "Meknes", lat: 33.8938, lng: -5.5516 },
  { key: "oujda", name: "وجدة", name_en: "Oujda", lat: 34.6814, lng: -1.9086 },
  { key: "tetouan", name: "تطوان", name_en: "Tetouan", lat: 35.5889, lng: -5.3626 },
  { key: "laayoune", name: "العيون", name_en: "Laayoune", lat: 27.1536, lng: -13.2033 },
  { key: "mohammedia", name: "المحمدية", name_en: "Mohammedia", lat: 33.6866, lng: -7.3829 },
  // International Centers
  { key: "makkah", name: "مكة المكرمة", name_en: "Makkah", lat: 21.4225, lng: 39.8262 },
  { key: "madinah", name: "المدينة المنورة", name_en: "Madinah", lat: 24.5247, lng: 39.5692 },
  { key: "london", name: "لندن", name_en: "London", lat: 51.5074, lng: -0.1278 },
  { key: "paris", name: "باريس", name_en: "Paris", lat: 48.8566, lng: 2.3522 },
  { key: "new_york", name: "نيويورك", name_en: "New York", lat: 40.7128, lng: -74.0060 },
  { key: "dubai", name: "دبي", name_en: "Dubai", lat: 25.2048, lng: 55.2708 },
];

const MAKKAH_LAT = 21.4225;
const MAKKAH_LNG = 39.8262;

/**
 * Calculates Qibla direction (azimuth in degrees from True North clockwise, 0-360)
 */
export function calculateQiblaBearing(lat: number, lng: number): number {
  const phi1 = (lat * Math.PI) / 180;
  const phi2 = (MAKKAH_LAT * Math.PI) / 180;
  const deltaLambda = ((MAKKAH_LNG - lng) * Math.PI) / 180;

  const y = Math.sin(deltaLambda);
  const x =
    Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);

  const qibla = (Math.atan2(y, x) * 180) / Math.PI;
  return Math.round(((qibla + 360) % 360) * 10) / 10;
}

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
  cityKey: string = "mohammedia",
  timezoneOffset: number = 0 // Default to GMT (0) to match Moroccan Mosque & Adhan clocks
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

  // Moroccan Mosque / Habous standard timing is GMT (0)
  const solarNoonMinutes = 720 - 4 * city.lng - eqtime + 60 * timezoneOffset;

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
    const m = Math.round(minutes);
    const hrs = Math.floor(m / 60) % 24;
    const mins = m % 60;
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

export function getNextPrayer(
  times: PrayerTimesResult,
  now: Date = new Date(),
  timezoneOffset: number = 0
): NextPrayerInfo {
  // Compute current clock in the same timezone as prayer times (independent of device locale)
  const currentMinutes =
    ((now.getUTCHours() + timezoneOffset + 24) % 24) * 60 + now.getUTCMinutes();

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
