export type ToleranceKind = "ppm" | "da";

export interface Tolerance {
  kind: ToleranceKind;
  upper: number;
  lower: number;
}

export interface Enzyme {
  cleave_at: string;
  restrict: string | null;
  c_terminal: boolean;
  min_len: number;
  max_len: number;
  missed_cleavages: number;
  semi_enzymatic: boolean;
}

export interface QuantificationSettings {
  tmt: string | null,
  tmt_settings: {
    level: number,
    sn: boolean,
  },
  lfq: boolean,
  lfq_settings: {
    ppm_tolerance: number,
    spectral_angle: number,
    combine_charge_states: boolean,
  }
}

export interface BaseParams<Tol> {
  precursor_tol: Tol;
  fragment_tol: Tol;
  isotope_errors: [number, number];
  deisotope: boolean;
  chimera: boolean;
  predict_rt: boolean;
  wide_window: boolean;
  min_peaks: number;
  max_peaks: number;
  min_matched_peaks: number;
  max_fragment_charge: number;
  report_psms: number;
}

export interface Modification {
  label: string,
  target: string[],
  value: number,
  unimod?: number,
  kind: "off" | "static" | "variable"
}

/// Schema used to make it easier to build a react UI
export interface DatabaseParams {
  fasta: string;
  enzyme: Enzyme;
  modifications: Modification[],
}


export interface Params<Tol> extends BaseParams<Tol> {
  database: DatabaseParams,
  quant: QuantificationSettings,
}

const predefined_mods = [
  { label: "Protein N-term acetylation", target: ["["], value: 42.010565, unimod: 1 },
  { label: "Carbamidomethyl", target: ["C"], value: 57.02146, unimod: 4 },
  { label: "Oxidation", target: ["M"], value: 15.994915, unimod: 35 },
  { label: "Glu->pyro-Glu", target: ["E"], value: -18.01565, unimod: 27 },
  { label: "Gln->pyro-Glu", target: ["Q"], value: -17.026549, unimod: 28 },
];


export const DefaultParams: Params<Tolerance> = {
  database: {
    fasta: "human",
    enzyme: {
      cleave_at: "KR",
      restrict: null,
      c_terminal: true,
      min_len: 7,
      max_len: 30,
      missed_cleavages: 1,
      semi_enzymatic: false,
    },
    modifications: predefined_mods.map((x) => ({ ...x, kind: "off" })),
  },
  fragment_tol: {
    kind: "ppm",
    lower: -10.0,
    upper: 10.0
  },
  precursor_tol: {
    kind: "ppm",
    lower: -50.0,
    upper: 50.0,
  },
  isotope_errors: [-1, 3],
  quant: {
    tmt: null,
    tmt_settings: {
      sn: false,
      level: 3,
    },
    lfq: false,
    lfq_settings: {
      ppm_tolerance: 5.0,
      spectral_angle: 0.7,
      combine_charge_states: true,
    }
  },
  deisotope: true,
  chimera: false,
  wide_window: false,
  report_psms: 1,
  min_peaks: 15,
  max_peaks: 150,
  min_matched_peaks: 4,
  max_fragment_charge: 1,
  predict_rt: true,
};



/// Schema sent to sever
export interface SageParams extends BaseParams<{ [kind: string]: [number, number] }> {
  database: {
    bucket_size: number,
    fasta: string;
    enzyme: Enzyme;
    variable_mods: { [aa: string]: number[] },
    static_mods: { [aa: string]: number[] },
  }
  quant: QuantificationSettings,
  mzml_paths: string[]
}
