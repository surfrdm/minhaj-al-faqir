// Kaaba Coordinates (Al-Masjid Al-Haram, Makkah Al-Mukarramah)
export const KAABA_LAT = 21.422487;
export const KAABA_LNG = 39.826206;

export interface QiblaInfo {
  bearing: number; // Degrees clockwise from True North (0 - 360)
  distanceKm: number; // Great-circle distance to Makkah in km
  cardinalAr: string;
  cardinalFr: string;
  cardinalShortAr: string;
}

export interface SolarPosition {
  azimuth: number; // Degrees clockwise from True North (0 - 360)
  altitude: number; // Elevation above horizon in degrees
  isDaylight: boolean;
}

/**
 * حساب زاوية القبلة الشريفة بدقة كروية عالية (Great-Circle Bearing)
 * من أي إحداثيات جغرافية إلى الكعبة المشرفة
 */
export function calculateQiblaBearing(lat: number, lng: number): number {
  const rad = Math.PI / 180;
  const phiK = KAABA_LAT * rad;
  const lambdaK = KAABA_LNG * rad;
  const phi = lat * rad;
  const lambda = lng * rad;

  const dLambda = lambdaK - lambda;
  const y = Math.sin(dLambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(dLambda);

  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  if (bearing < 0) bearing += 360;
  return Number(bearing.toFixed(1));
}

/**
 * حساب المسافة المباشرة إلى مكة المكرمة بالكيلومتر (صيغة هافرسين Haversine)
 */
export function calculateDistanceToMeccaKm(lat: number, lng: number): number {
  const R = 6371; // Earth radius in km
  const rad = Math.PI / 180;
  const dLat = (KAABA_LAT - lat) * rad;
  const dLon = (KAABA_LNG - lng) * rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat * rad) *
      Math.cos(KAABA_LAT * rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * استخراج الاتجاه الجغرافي باللغة العربية والفرنسية انطلاقاً من الزاوية
 */
export function getQiblaDirectionLabels(bearing: number): {
  cardinalAr: string;
  cardinalFr: string;
  cardinalShortAr: string;
} {
  const directions = [
    { min: 337.5, max: 360, ar: "الشمال تماماً", fr: "Nord", shortAr: "ش" },
    { min: 0, max: 22.5, ar: "الشمال تماماً", fr: "Nord", shortAr: "ش" },
    { min: 22.5, max: 67.5, ar: "الشمال الشرقي", fr: "Nord-Est", shortAr: "ش.ق" },
    { min: 67.5, max: 112.5, ar: "الشرق (نحو المشرق)", fr: "Est", shortAr: "ق" },
    { min: 112.5, max: 157.5, ar: "الجنوب الشرقي", fr: "Sud-Est", shortAr: "ج.ق" },
    { min: 157.5, max: 202.5, ar: "الجنوب تماماً", fr: "Sud", shortAr: "ج" },
    { min: 202.5, max: 247.5, ar: "الجنوب الغربي", fr: "Sud-Ouest", shortAr: "ج.غ" },
    { min: 247.5, max: 292.5, ar: "الغرب تماماً", fr: "Ouest", shortAr: "غ" },
    { min: 292.5, max: 337.5, ar: "الشمال الغربي", fr: "Nord-Ouest", shortAr: "ش.غ" },
  ];

  // Specific refinement for Morocco (~84° to 99° -> East with slight South/North inclination)
  const match =
    directions.find((d) => bearing >= d.min && bearing < d.max) || directions[3];

  let refinedAr = match.ar;
  let refinedFr = match.fr;

  if (bearing > 90.5 && bearing <= 105) {
    refinedAr = "شرقاً (بميلٍ يسير نحو الجنوب)";
    refinedFr = "Est-Sud-Est";
  } else if (bearing >= 75 && bearing < 89.5) {
    refinedAr = "شرقاً (بميلٍ يسير نحو الشمال)";
    refinedFr = "Est-Nord-Est";
  }

  return {
    cardinalAr: refinedAr,
    cardinalFr: refinedFr,
    cardinalShortAr: match.shortAr,
  };
}

export function getQiblaInfo(lat: number, lng: number): QiblaInfo {
  const bearing = calculateQiblaBearing(lat, lng);
  const distanceKm = calculateDistanceToMeccaKm(lat, lng);
  const labels = getQiblaDirectionLabels(bearing);

  return {
    bearing,
    distanceKm,
    ...labels,
  };
}

/**
 * حساب موقع الشمس في السماء حالياً للمساعدة في الاستدلال بالشمس عند عدم وجود بوصلة في الحاسوب
 */
export function calculateSolarAzimuth(
  date: Date,
  lat: number,
  lng: number
): SolarPosition {
  const rad = Math.PI / 180;
  const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000);
  const utcHours =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600;

  const gamma = ((2 * Math.PI) / 365) * (dayOfYear - 1 + (utcHours - 12) / 24);
  const eqtime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));
  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma);

  const timeOffset = eqtime + 4 * lng;
  const tst = utcHours * 60 + timeOffset;
  const ha = (tst / 4 - 180) * rad;
  const latRad = lat * rad;

  const cosZenith =
    Math.sin(latRad) * Math.sin(decl) +
    Math.cos(latRad) * Math.cos(decl) * Math.cos(ha);
  const zenith = Math.acos(Math.max(-1, Math.min(1, cosZenith)));
  const altitude = 90 - zenith / rad;

  const sinAz = (-Math.cos(decl) * Math.sin(ha)) / Math.sin(zenith);
  const cosAz =
    (Math.sin(decl) - Math.sin(latRad) * cosZenith) /
    (Math.cos(latRad) * Math.sin(zenith));
  let azimuth = Math.atan2(sinAz, cosAz) / rad;
  if (azimuth < 0) azimuth += 360;

  return {
    azimuth: Number(azimuth.toFixed(1)),
    altitude: Number(altitude.toFixed(1)),
    isDaylight: altitude > 0,
  };
}

/**
 * صياغة وصف مقارنة اتجاه القبلة بالشمس حالياً
 */
export function getSunQiblaRelationText(
  qiblaBearing: number,
  solar: SolarPosition
): string {
  if (!solar.isDaylight) {
    return "الوقت ليلاً حالياً (الشمس تحت الأفق) — يُستعان بالبوصلة الحية أو الاتجاه الجغرافي (شرقاً).";
  }

  let diff = qiblaBearing - solar.azimuth;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  const absDiff = Math.round(Math.abs(diff));
  if (absDiff <= 5) {
    return "الشمس تواجه القبلة الشريفة تقريباً في هذه اللحظة! استقبل عين الشمس.";
  } else if (diff > 0) {
    return `الشمس حالياً في الزاوية ${solar.azimuth}° — اتجه لـ «يمين» الشمس بمقدار ${absDiff}° لتكون نحو القبلة.`;
  } else {
    return `الشمس حالياً في الزاوية ${solar.azimuth}° — اتجه لـ «يسار» الشمس بمقدار ${absDiff}° لتكون نحو القبلة.`;
  }
}
