export interface JuknisFormData {
  kabupaten: string;
  jenjang: string;
  pejabat: string;
  tglPenetapan: string;
  tglMulai: string;
  tglKelulusan: string;
  tglDaftarUlang: string;
  domisili: number;
  afirmasi: number;
  prestasi: number;
  mutasi: number;
  fileJuknis?: File | null;
  filePendukung?: File | null;
}
