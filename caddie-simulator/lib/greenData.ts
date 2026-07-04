export type GreenHazardType =
  | "bunker"
  | "water"
  | "penalty"
  | "rough"
  | "obi"
  | "dropZone"
  | "tree";

export type GreenZone =
  | "front"
  | "middle"
  | "back"
  | "left"
  | "right"
  | "center"
  | "frontLeft"
  | "frontRight"
  | "backLeft"
  | "backRight"
  | "aroundGreen"
  | "approach";

export type GreenHazard = {
  type: GreenHazardType;
  zone: GreenZone;
  label: string;
  note: string;
};

export type PinZone = {
  zone: GreenZone;
  label: string;
  difficulty: "easy" | "medium" | "hard";
  advice: string;
};

export type GreenLayout = {
  holeNumber: number;
  greenShape: "round" | "oval" | "wide" | "narrow" | "angled" | "split";
  approachType: "open" | "guarded" | "narrow" | "elevated" | "riskReward";
  safeMiss: GreenZone;
  dangerousMiss: GreenZone[];
  hazards: GreenHazard[];
  pinZones: PinZone[];
  approachNote: string;
  caddieFocus: string;
};

export const greenData: GreenLayout[] = [
  {
    holeNumber: 1,
    greenShape: "oval",
    approachType: "guarded",
    safeMiss: "center",
    dangerousMiss: ["left", "right"],
    hazards: [
      {
        type: "bunker",
        zone: "left",
        label: "Bunker kiri area approach",
        note: "Jangan terlalu agresif ke kiri saat approach.",
      },
      {
        type: "bunker",
        zone: "right",
        label: "Bunker kanan area approach",
        note: "Target aman lebih baik ke tengah green.",
      },
      {
        type: "obi",
        zone: "left",
        label: "OB kiri",
        note: "Miss kiri harus dihindari.",
      },
      {
        type: "obi",
        zone: "right",
        label: "OB kanan",
        note: "Miss kanan juga berisiko tinggi.",
      },
    ],
    pinZones: [
      {
        zone: "front",
        label: "Pin depan",
        difficulty: "medium",
        advice: "Gunakan club cukup, jangan terlalu pendek.",
      },
      {
        zone: "middle",
        label: "Pin tengah",
        difficulty: "easy",
        advice: "Target tengah green adalah pilihan paling aman.",
      },
      {
        zone: "back",
        label: "Pin belakang",
        difficulty: "hard",
        advice: "Hindari over green jika player kurang kontrol jarak.",
      },
    ],
    approachNote:
      "Hole 1 menuntut caddie menjaga arah rekomendasi tetap aman karena ada risiko kanan dan kiri.",
    caddieFocus: "Target aman, hindari miss kanan-kiri, dan prioritaskan center green.",
  },
  {
    holeNumber: 2,
    greenShape: "oval",
    approachType: "guarded",
    safeMiss: "center",
    dangerousMiss: ["left", "right"],
    hazards: [
      {
        type: "bunker",
        zone: "left",
        label: "Bunker kiri",
        note: "Area kiri perlu dihindari jika pin kiri.",
      },
      {
        type: "bunker",
        zone: "right",
        label: "Bunker kanan",
        note: "Jangan memaksa target kanan jika player tidak akurat.",
      },
    ],
    pinZones: [
      {
        zone: "front",
        label: "Pin depan",
        difficulty: "medium",
        advice: "Pastikan carry cukup untuk masuk green.",
      },
      {
        zone: "middle",
        label: "Pin tengah",
        difficulty: "easy",
        advice: "Target tengah aman untuk mayoritas player.",
      },
      {
        zone: "backRight",
        label: "Pin belakang kanan",
        difficulty: "hard",
        advice: "Jangan attack pin jika miss kanan mengarah bunker.",
      },
    ],
    approachNote:
      "Hole 2 bagus untuk melatih keputusan target antara attack pin dan center green.",
    caddieFocus: "Baca posisi bunker sebelum memberi rekomendasi target.",
  },
  {
    holeNumber: 3,
    greenShape: "wide",
    approachType: "riskReward",
    safeMiss: "front",
    dangerousMiss: ["left", "right"],
    hazards: [
      {
        type: "water",
        zone: "approach",
        label: "Area air sebelum fairway/approach",
        note: "Pastikan rekomendasi tidak memaksa carry berisiko.",
      },
      {
        type: "bunker",
        zone: "center",
        label: "Bunker tengah dekat green",
        note: "Layup atau target aman bisa lebih baik untuk player high handicap.",
      },
    ],
    pinZones: [
      {
        zone: "front",
        label: "Pin depan",
        difficulty: "medium",
        advice: "Jangan pendek jika ada hazard sebelum green.",
      },
      {
        zone: "middle",
        label: "Pin tengah",
        difficulty: "medium",
        advice: "Target tengah aman setelah posisi bola sudah bagus.",
      },
      {
        zone: "back",
        label: "Pin belakang",
        difficulty: "hard",
        advice: "Gunakan club cukup, tapi jangan over-aggressive.",
      },
    ],
    approachNote:
      "Par 5 ini menuntut caddie mengatur strategi bertahap, bukan hanya mengejar jarak maksimal.",
    caddieFocus: "Course management, layup decision, dan membaca risiko carry.",
  },
  {
    holeNumber: 4,
    greenShape: "round",
    approachType: "guarded",
    safeMiss: "center",
    dangerousMiss: ["left", "right", "back"],
    hazards: [
      {
        type: "rough",
        zone: "aroundGreen",
        label: "Rough sekitar green",
        note: "Miss kecil masih bisa dimainkan, tapi arah tetap perlu aman.",
      },
    ],
    pinZones: [
      {
        zone: "front",
        label: "Pin depan",
        difficulty: "medium",
        advice: "Pilih club yang tidak terlalu pendek.",
      },
      {
        zone: "middle",
        label: "Pin tengah",
        difficulty: "easy",
        advice: "Target center green.",
      },
      {
        zone: "back",
        label: "Pin belakang",
        difficulty: "hard",
        advice: "Jangan over green.",
      },
    ],
    approachNote:
      "Par 3. Fokus utama adalah pemilihan club sesuai tee distance dan kemampuan player.",
    caddieFocus: "Club selection berdasarkan jarak tee dan kontrol carry.",
  },
  {
    holeNumber: 5,
    greenShape: "oval",
    approachType: "guarded",
    safeMiss: "center",
    dangerousMiss: ["left"],
    hazards: [
      {
        type: "bunker",
        zone: "left",
        label: "Bunker kiri",
        note: "Hindari miss kiri saat approach.",
      },
      {
        type: "rough",
        zone: "right",
        label: "Area kanan relatif lebih aman",
        note: "Safe miss bisa diarahkan sedikit kanan jika pin kiri.",
      },
    ],
    pinZones: [
      {
        zone: "frontLeft",
        label: "Pin depan kiri",
        difficulty: "hard",
        advice: "Jangan attack langsung jika bunker kiri aktif.",
      },
      {
        zone: "middle",
        label: "Pin tengah",
        difficulty: "easy",
        advice: "Target tengah green.",
      },
      {
        zone: "back",
        label: "Pin belakang",
        difficulty: "medium",
        advice: "Perhatikan club agar tidak over.",
      },
    ],
    approachNote:
      "Hole 5 menuntut caddie menjaga player tidak terpancing ke sisi bunker.",
    caddieFocus: "Safe target dan kontrol arah approach.",
  },
  {
    holeNumber: 6,
    greenShape: "narrow",
    approachType: "narrow",
    safeMiss: "front",
    dangerousMiss: ["left", "right"],
    hazards: [
      {
        type: "bunker",
        zone: "right",
        label: "Bunker kanan",
        note: "Hindari target kanan jika akurasi player rendah.",
      },
      {
        type: "bunker",
        zone: "left",
        label: "Bunker kiri",
        note: "Miss kiri juga tidak aman.",
      },
      {
        type: "obi",
        zone: "left",
        label: "OB kiri",
        note: "Jangan memilih target yang membuka risiko kiri.",
      },
      {
        type: "obi",
        zone: "right",
        label: "OB kanan",
        note: "Rekomendasi terlalu agresif bisa mahal.",
      },
    ],
    pinZones: [
      {
        zone: "front",
        label: "Pin depan",
        difficulty: "medium",
        advice: "Lebih baik short aman daripada miss kanan-kiri.",
      },
      {
        zone: "middle",
        label: "Pin tengah",
        difficulty: "medium",
        advice: "Target center dengan club terkendali.",
      },
      {
        zone: "back",
        label: "Pin belakang",
        difficulty: "hard",
        advice: "Jangan mengejar pin jika line sempit.",
      },
    ],
    approachNote:
      "Hole 6 berisiko karena kanan-kiri bisa menjadi masalah besar.",
    caddieFocus: "Minimalkan risiko lateral dan pilih target konservatif.",
  },
  {
    holeNumber: 7,
    greenShape: "round",
    approachType: "guarded",
    safeMiss: "front",
    dangerousMiss: ["back", "left", "right"],
    hazards: [
      {
        type: "dropZone",
        zone: "front",
        label: "Drop zone depan tee ladies",
        note: "Digunakan saat skenario penalty/hazard aktif.",
      },
      {
        type: "rough",
        zone: "aroundGreen",
        label: "Rough sekitar green",
        note: "Miss sekitar green masih bisa recovery.",
      },
    ],
    pinZones: [
      {
        zone: "front",
        label: "Pin depan",
        difficulty: "medium",
        advice: "Pilih club yang carry sampai depan green.",
      },
      {
        zone: "middle",
        label: "Pin tengah",
        difficulty: "easy",
        advice: "Target tengah green.",
      },
      {
        zone: "back",
        label: "Pin belakang",
        difficulty: "hard",
        advice: "Jangan over green jika distance control kurang.",
      },
    ],
    approachNote:
      "Par 3 dengan variasi tee distance. Caddie harus membaca jarak dengan disiplin.",
    caddieFocus: "Club selection, tee distance, dan safe miss.",
  },
  {
    holeNumber: 8,
    greenShape: "wide",
    approachType: "riskReward",
    safeMiss: "center",
    dangerousMiss: ["left", "right"],
    hazards: [
      {
        type: "bunker",
        zone: "left",
        label: "Rangkaian bunker kiri",
        note: "Jangan biarkan player terlalu agresif ke kiri.",
      },
      {
        type: "penalty",
        zone: "right",
        label: "Penalty area kanan",
        note: "Miss kanan berbahaya dan harus dihindari.",
      },
      {
        type: "obi",
        zone: "left",
        label: "OB kiri",
        note: "Miss kiri juga berisiko.",
      },
    ],
    pinZones: [
      {
        zone: "front",
        label: "Pin depan",
        difficulty: "medium",
        advice: "Layup bisa menjadi pilihan jika angle belum bagus.",
      },
      {
        zone: "middle",
        label: "Pin tengah",
        difficulty: "medium",
        advice: "Target tengah setelah posisi bola aman.",
      },
      {
        zone: "back",
        label: "Pin belakang",
        difficulty: "hard",
        advice: "Jangan mengejar jarak maksimal tanpa angle.",
      },
    ],
    approachNote:
      "Par 5 dengan kombinasi bunker, OB, dan penalty. Strategi bertahap lebih aman.",
    caddieFocus: "Risk management, layup, dan arah aman.",
  },
  {
    holeNumber: 9,
    greenShape: "angled",
    approachType: "guarded",
    safeMiss: "center",
    dangerousMiss: ["left", "right"],
    hazards: [
      {
        type: "bunker",
        zone: "left",
        label: "Bunker kiri",
        note: "Miss kiri dekat green perlu dihindari.",
      },
      {
        type: "bunker",
        zone: "center",
        label: "Bunker tengah",
        note: "Target langsung ke area bunker berisiko.",
      },
      {
        type: "bunker",
        zone: "right",
        label: "Bunker kanan",
        note: "Hindari miss kanan jika pin kanan.",
      },
      {
        type: "penalty",
        zone: "left",
        label: "Penalty/ilalang area",
        note: "Area penalty harus jadi pertimbangan sebelum attack.",
      },
    ],
    pinZones: [
      {
        zone: "front",
        label: "Pin depan",
        difficulty: "medium",
        advice: "Pastikan carry cukup dan target tidak masuk bunker tengah.",
      },
      {
        zone: "middle",
        label: "Pin tengah",
        difficulty: "medium",
        advice: "Target tengah relatif lebih aman.",
      },
      {
        zone: "backRight",
        label: "Pin belakang kanan",
        difficulty: "hard",
        advice: "Jangan memaksa jika miss kanan membawa bunker.",
      },
    ],
    approachNote:
      "Hole 9 menguji kemampuan caddie membaca bunker tengah dan area penalty.",
    caddieFocus: "Target selection dan hazard awareness.",
  },
  {
    holeNumber: 10,
    greenShape: "wide",
    approachType: "riskReward",
    safeMiss: "center",
    dangerousMiss: ["left", "right"],
    hazards: [
      {
        type: "bunker",
        zone: "left",
        label: "Bunker kiri dekat green",
        note: "Hindari miss kiri saat approach.",
      },
      {
        type: "bunker",
        zone: "right",
        label: "Bunker kanan",
        note: "Miss kanan dapat membuka risiko recovery sulit.",
      },
      {
        type: "obi",
        zone: "left",
        label: "OB kiri",
        note: "Jangan terlalu membuka arah ke kiri.",
      },
      {
        type: "obi",
        zone: "right",
        label: "OB kanan over bunker",
        note: "Over kanan sangat berisiko.",
      },
    ],
    pinZones: [
      {
        zone: "front",
        label: "Pin depan",
        difficulty: "medium",
        advice: "Bisa pilih pendek aman jika angle belum bagus.",
      },
      {
        zone: "middle",
        label: "Pin tengah",
        difficulty: "medium",
        advice: "Target tengah green setelah layup baik.",
      },
      {
        zone: "back",
        label: "Pin belakang",
        difficulty: "hard",
        advice: "Jaga agar tidak over ke area bahaya.",
      },
    ],
    approachNote:
      "Par 5 ini perlu strategi, bukan hanya power. OB kiri-kanan harus dibaca.",
    caddieFocus: "Strategi pukulan kedua dan ketiga, plus safe approach.",
  },
  {
    holeNumber: 11,
    greenShape: "narrow",
    approachType: "narrow",
    safeMiss: "center",
    dangerousMiss: ["left", "right"],
    hazards: [
      {
        type: "bunker",
        zone: "left",
        label: "Bunker kiri",
        note: "Bunker kiri bisa mengganggu approach.",
      },
      {
        type: "obi",
        zone: "left",
        label: "OB kiri",
        note: "Miss kiri harus dihindari.",
      },
      {
        type: "obi",
        zone: "right",
        label: "OB kanan",
        note: "Jaga rekomendasi tidak membuka miss kanan.",
      },
    ],
    pinZones: [
      {
        zone: "front",
        label: "Pin depan",
        difficulty: "medium",
        advice: "Pilih club cukup dan target center.",
      },
      {
        zone: "middle",
        label: "Pin tengah",
        difficulty: "medium",
        advice: "Jangan terlalu agresif kanan-kiri.",
      },
      {
        zone: "back",
        label: "Pin belakang",
        difficulty: "hard",
        advice: "Kontrol carry dan hindari over.",
      },
    ],
    approachNote:
      "Hole 11 menuntut disiplin arah karena kanan-kiri OB.",
    caddieFocus: "Akurasi rekomendasi, bukan agresivitas.",
  },
  {
    holeNumber: 12,
    greenShape: "round",
    approachType: "guarded",
    safeMiss: "front",
    dangerousMiss: ["right", "back"],
    hazards: [
      {
        type: "dropZone",
        zone: "right",
        label: "Drop zone kanan green",
        note: "Dipakai saat skenario penalty/hazard aktif.",
      },
      {
        type: "rough",
        zone: "aroundGreen",
        label: "Rough sekitar green",
        note: "Recovery masih mungkin, tapi jangan terlalu miss.",
      },
    ],
    pinZones: [
      {
        zone: "front",
        label: "Pin depan",
        difficulty: "medium",
        advice: "Jangan pendek terlalu jauh.",
      },
      {
        zone: "middle",
        label: "Pin tengah",
        difficulty: "easy",
        advice: "Target tengah green.",
      },
      {
        zone: "backRight",
        label: "Pin belakang kanan",
        difficulty: "hard",
        advice: "Hindari miss kanan.",
      },
    ],
    approachNote:
      "Par 3 dengan drop zone kanan. Caddie harus hati-hati membaca target kanan.",
    caddieFocus: "Club selection dan arah target aman.",
  },
  {
    holeNumber: 13,
    greenShape: "oval",
    approachType: "guarded",
    safeMiss: "center",
    dangerousMiss: ["left", "right"],
    hazards: [
      {
        type: "bunker",
        zone: "right",
        label: "Bunker kanan",
        note: "Hindari miss kanan jika pin kanan.",
      },
      {
        type: "bunker",
        zone: "left",
        label: "Bunker kiri",
        note: "Bunker kiri aktif untuk approach agresif.",
      },
    ],
    pinZones: [
      {
        zone: "front",
        label: "Pin depan",
        difficulty: "medium",
        advice: "Target depan tengah jika player kurang kontrol.",
      },
      {
        zone: "middle",
        label: "Pin tengah",
        difficulty: "easy",
        advice: "Center green aman.",
      },
      {
        zone: "back",
        label: "Pin belakang",
        difficulty: "medium",
        advice: "Perhatikan carry dan rollout.",
      },
    ],
    approachNote:
      "Hole 13 cukup seimbang, tapi bunker kiri-kanan tetap harus diperhitungkan.",
    caddieFocus: "Baca arah bunker dan sesuaikan dengan kemampuan player.",
  },
  {
    holeNumber: 14,
    greenShape: "split",
    approachType: "riskReward",
    safeMiss: "center",
    dangerousMiss: ["left", "right"],
    hazards: [
      {
        type: "bunker",
        zone: "left",
        label: "Bunker kiri",
        note: "Jangan memaksa target kiri jika risiko tinggi.",
      },
      {
        type: "penalty",
        zone: "right",
        label: "Penalty kanan",
        note: "Miss kanan berisiko penalty.",
      },
      {
        type: "obi",
        zone: "left",
        label: "OB kiri",
        note: "Miss kiri juga berbahaya.",
      },
      {
        type: "water",
        zone: "approach",
        label: "Area air/jembatan",
        note: "Perlu pertimbangan layup sebelum approach.",
      },
    ],
    pinZones: [
      {
        zone: "front",
        label: "Pin depan",
        difficulty: "medium",
        advice: "Pilih landing aman sebelum green.",
      },
      {
        zone: "middle",
        label: "Pin tengah",
        difficulty: "medium",
        advice: "Target tengah jika angle sudah bagus.",
      },
      {
        zone: "back",
        label: "Pin belakang",
        difficulty: "hard",
        advice: "Jangan terlalu agresif jika belum di posisi ideal.",
      },
    ],
    approachNote:
      "Hole 14 split fairway. Caddie harus menentukan jalur aman dan kapan layup.",
    caddieFocus: "Strategi split fairway, penalty awareness, dan layup.",
  },
  {
    holeNumber: 15,
    greenShape: "angled",
    approachType: "guarded",
    safeMiss: "center",
    dangerousMiss: ["left", "right"],
    hazards: [
      {
        type: "bunker",
        zone: "left",
        label: "Bunker kiri",
        note: "Area kiri harus diperhatikan saat approach.",
      },
      {
        type: "bunker",
        zone: "right",
        label: "Bunker kanan",
        note: "Miss kanan berpotensi masuk bunker.",
      },
      {
        type: "penalty",
        zone: "right",
        label: "Penalty kanan dekat HH",
        note: "Jangan memberi target terlalu kanan.",
      },
      {
        type: "obi",
        zone: "left",
        label: "OB kiri",
        note: "Miss kiri juga sangat berisiko.",
      },
    ],
    pinZones: [
      {
        zone: "front",
        label: "Pin depan",
        difficulty: "medium",
        advice: "Target aman ke depan tengah.",
      },
      {
        zone: "middle",
        label: "Pin tengah",
        difficulty: "medium",
        advice: "Gunakan center green sebagai target utama.",
      },
      {
        zone: "backRight",
        label: "Pin belakang kanan",
        difficulty: "hard",
        advice: "Jangan attack jika penalty kanan aktif.",
      },
    ],
    approachNote:
      "Hole 15 memiliki penalty kanan dan OB kiri, sehingga target harus disiplin.",
    caddieFocus: "Hindari dua sisi bahaya dan pilih target konservatif.",
  },
  {
    holeNumber: 16,
    greenShape: "round",
    approachType: "guarded",
    safeMiss: "front",
    dangerousMiss: ["left", "right", "back"],
    hazards: [
      {
        type: "dropZone",
        zone: "left",
        label: "Drop zone kiri green",
        note: "Dipakai jika skenario hazard/penalty aktif.",
      },
      {
        type: "rough",
        zone: "aroundGreen",
        label: "Rough sekitar green",
        note: "Recovery masih mungkin, tapi target tetap harus aman.",
      },
    ],
    pinZones: [
      {
        zone: "front",
        label: "Pin depan",
        difficulty: "medium",
        advice: "Pilih club yang tidak short terlalu jauh.",
      },
      {
        zone: "middle",
        label: "Pin tengah",
        difficulty: "easy",
        advice: "Center green adalah pilihan paling aman.",
      },
      {
        zone: "back",
        label: "Pin belakang",
        difficulty: "hard",
        advice: "Kontrol jarak agar tidak over.",
      },
    ],
    approachNote:
      "Par 3 pendek-menengah. Kesalahan biasanya dari club selection atau overconfidence.",
    caddieFocus: "Pilih club sesuai tee dan jangan terlalu agresif.",
  },
  {
    holeNumber: 17,
    greenShape: "narrow",
    approachType: "narrow",
    safeMiss: "front",
    dangerousMiss: ["left", "right"],
    hazards: [
      {
        type: "bunker",
        zone: "center",
        label: "Bunker tengah",
        note: "Jangan target langsung ke bunker tengah.",
      },
      {
        type: "bunker",
        zone: "left",
        label: "Bunker kiri",
        note: "Miss kiri bisa menyulitkan recovery.",
      },
      {
        type: "bunker",
        zone: "right",
        label: "Bunker kanan",
        note: "Miss kanan dekat green perlu dihindari.",
      },
      {
        type: "obi",
        zone: "left",
        label: "OB kiri",
        note: "Kiri sangat berisiko.",
      },
      {
        type: "obi",
        zone: "right",
        label: "OB kanan",
        note: "Kanan juga sangat berisiko.",
      },
    ],
    pinZones: [
      {
        zone: "front",
        label: "Pin depan",
        difficulty: "medium",
        advice: "Short front masih lebih aman daripada miss kanan-kiri.",
      },
      {
        zone: "middle",
        label: "Pin tengah",
        difficulty: "hard",
        advice: "Perlu target presisi karena bunker tengah.",
      },
      {
        zone: "back",
        label: "Pin belakang",
        difficulty: "hard",
        advice: "Jangan mengejar pin jika akurasi player rendah.",
      },
    ],
    approachNote:
      "Hole 17 sangat menuntut akurasi karena kanan-kiri OB dan banyak bunker.",
    caddieFocus: "Minimalkan risiko, pilih target paling aman, dan hindari bunker tengah.",
  },
  {
    holeNumber: 18,
    greenShape: "oval",
    approachType: "guarded",
    safeMiss: "center",
    dangerousMiss: ["left", "right"],
    hazards: [
      {
        type: "bunker",
        zone: "right",
        label: "Bunker kanan",
        note: "Miss kanan bisa masuk bunker.",
      },
      {
        type: "penalty",
        zone: "left",
        label: "Penalty kiri",
        note: "Miss kiri berisiko penalty.",
      },
      {
        type: "obi",
        zone: "right",
        label: "OB kanan",
        note: "Jangan buka target terlalu kanan.",
      },
    ],
    pinZones: [
      {
        zone: "front",
        label: "Pin depan",
        difficulty: "medium",
        advice: "Target depan tengah jika ingin aman.",
      },
      {
        zone: "middle",
        label: "Pin tengah",
        difficulty: "easy",
        advice: "Center green paling stabil.",
      },
      {
        zone: "backRight",
        label: "Pin belakang kanan",
        difficulty: "hard",
        advice: "Hindari kanan karena bunker dan OB.",
      },
    ],
    approachNote:
      "Hole penutup menuntut keputusan aman karena ada penalty kiri dan OB kanan.",
    caddieFocus: "Jaga emosi player, pilih target disiplin, dan hindari dua sisi bahaya.",
  },
];

export const greenDataByHole: Record<number, GreenLayout> = greenData.reduce(
  (accumulator, green) => {
    accumulator[green.holeNumber] = green;
    return accumulator;
  },
  {} as Record<number, GreenLayout>
);

export function getGreenLayoutByHole(holeNumber: number) {
  return greenDataByHole[holeNumber] ?? greenData[0];
}