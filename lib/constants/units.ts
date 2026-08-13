export interface UnitDefinition {
  name: string;
  ratio?: number; // Relative to category base unit
  toBase?: (val: number) => number;
  fromBase?: (val: number) => number;
}

export interface UnitCategory {
  name: string;
  type: "linear" | "custom";
  units: Record<string, UnitDefinition>;
}

export const UNIT_CATEGORIES: Record<string, UnitCategory> = {
  temperature: {
    name: "Temperature",
    type: "custom",
    units: {
      celsius: { name: "Celsius (°C)", toBase: (v) => v, fromBase: (v) => v },
      fahrenheit: { name: "Fahrenheit (°F)", toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      kelvin: { name: "Kelvin (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    },
  },
  mass: {
    name: "Mass / Weight",
    type: "linear",
    units: {
      milligram: { name: "Milligram (mg)", ratio: 0.000001 },
      gram: { name: "Gram (g)", ratio: 0.001 },
      kilogram: { name: "Kilogram (kg)", ratio: 1 },
      metric_ton: { name: "Metric Ton (t)", ratio: 1000 },
      ounce: { name: "Ounce (oz)", ratio: 0.0283495 },
      pound: { name: "Pound (lb)", ratio: 0.453592 },
    },
  },
  pressure: {
    name: "Pressure",
    type: "linear",
    units: {
      pascal: { name: "Pascal (Pa)", ratio: 1 },
      kilopascal: { name: "Kilopascal (kPa)", ratio: 1000 },
      bar: { name: "Bar", ratio: 100000 },
      psi: { name: "PSI (lbf/in²)", ratio: 6894.76 },
      atm: { name: "Atmosphere (atm)", ratio: 101325 },
      torr: { name: "Torr (mmHg)", ratio: 133.322 },
    },
  },
  force: {
    name: "Force",
    type: "linear",
    units: {
      newton: { name: "Newton (N)", ratio: 1 },
      kilonewton: { name: "Kilonewton (kN)", ratio: 1000 },
      dyne: { name: "Dyne (dyn)", ratio: 0.00001 },
      pound_force: { name: "Pound-force (lbf)", ratio: 4.44822 },
    },
  },
  charges: {
    name: "Electric Charge",
    type: "linear",
    units: {
      coulomb: { name: "Coulomb (C)", ratio: 1 },
      millicoulomb: { name: "Millicoulomb (mC)", ratio: 0.001 },
      microcoulomb: { name: "Microcoulomb (μC)", ratio: 0.000001 },
      ampere_hour: { name: "Ampere-hour (Ah)", ratio: 3600 },
      milliampere_hour: { name: "Milliampere-hour (mAh)", ratio: 3.6 },
    },
  },
  length: {
    name: "Length / Distance",
    type: "linear",
    units: {
      millimeter: { name: "Millimeter (mm)", ratio: 0.001 },
      centimeter: { name: "Centimeter (cm)", ratio: 0.01 },
      meter: { name: "Meter (m)", ratio: 1 },
      kilometer: { name: "Kilometer (km)", ratio: 1000 },
      inch: { name: "Inch (in)", ratio: 0.0254 },
      foot: { name: "Foot (ft)", ratio: 0.3048 },
      yard: { name: "Yard (yd)", ratio: 0.9144 },
      mile: { name: "Mile (mi)", ratio: 1609.34 },
    },
  },
  volume: {
    name: "Volume",
    type: "linear",
    units: {
      milliliter: { name: "Milliliter (mL)", ratio: 0.001 },
      liter: { name: "Liter (L)", ratio: 1 },
      cubic_meter: { name: "Cubic Meter (m³)", ratio: 1000 },
      gallon: { name: "Gallon (US gal)", ratio: 3.78541 },
      quart: { name: "Quart (US qt)", ratio: 0.946353 },
      cup: { name: "Cup (US cup)", ratio: 0.24 },
    },
  },
  area: {
    name: "Area",
    type: "linear",
    units: {
      sq_meter: { name: "Square Meter (m²)", ratio: 1 },
      sq_km: { name: "Square Kilometer (km²)", ratio: 1000000 },
      sq_foot: { name: "Square Foot (ft²)", ratio: 0.092903 },
      acre: { name: "Acre (ac)", ratio: 4046.86 },
      hectare: { name: "Hectare (ha)", ratio: 10000 },
    },
  },
  speed: {
    name: "Speed",
    type: "linear",
    units: {
      m_s: { name: "Meter per sec (m/s)", ratio: 1 },
      km_h: { name: "Km per hour (km/h)", ratio: 0.277778 },
      mph: { name: "Miles per hour (mph)", ratio: 0.44704 },
      knot: { name: "Knot (kn)", ratio: 0.514444 },
    },
  },
  power: {
    name: "Power",
    type: "linear",
    units: {
      watt: { name: "Watt (W)", ratio: 1 },
      kilowatt: { name: "Kilowatt (kW)", ratio: 1000 },
      horsepower: { name: "Horsepower (hp)", ratio: 745.7 },
    },
  },
  energy: {
    name: "Energy",
    type: "linear",
    units: {
      joule: { name: "Joule (J)", ratio: 1 },
      kilojoule: { name: "Kilojoule (kJ)", ratio: 1000 },
      calorie: { name: "Calorie (cal)", ratio: 4.184 },
      kilocalorie: { name: "Kilocalorie (kcal)", ratio: 4184 },
      watt_hour: { name: "Watt-hour (Wh)", ratio: 3600 },
      kilowatt_hour: { name: "Kilowatt-hour (kWh)", ratio: 3600000 },
    },
  },
  data: {
    name: "Data Storage",
    type: "linear",
    units: {
      byte: { name: "Byte (B)", ratio: 1 },
      kilobyte: { name: "Kilobyte (KB)", ratio: 1024 },
      megabyte: { name: "Megabyte (MB)", ratio: 1048576 },
      gigabyte: { name: "Gigabyte (GB)", ratio: 1073741824 },
      terabyte: { name: "Terabyte (TB)", ratio: 1099511627776 },
    },
  },
};

export function convertUnit(
  val: number,
  fromKey: string,
  toKey: string,
  catKey: string
): number {
  if (isNaN(val)) return 0;
  if (fromKey === toKey) return val;

  const cat = UNIT_CATEGORIES[catKey];
  const from = cat.units[fromKey];
  const to = cat.units[toKey];

  if (cat.type === "custom") {
    const base = from.toBase!(val);
    return to.fromBase!(base);
  }

  const baseVal = val * from.ratio!;
  return baseVal / to.ratio!;
}
