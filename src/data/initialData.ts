import { SafeShelter, DisasterAlert, FirstAidGuide, EmergencyContact, IncidentReport, RescueRequest, Volunteer } from "../types";

export const DEFAULT_SHELTERS: SafeShelter[] = [
  // --- BALLARI DISTRICT SHELTERS ---
  {
    id: "shelter-blr-1",
    name: "Ballari District Relief Center & Town Hall",
    address: "Royal Road, Cantonment Area, Ballari",
    lat: 15.1394,
    lng: 76.9214,
    capacity: 500,
    currentOccupancy: 140,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 6,
    contactPhone: "+91 83922 74210",
    shelterType: "Community Hall",
    district: "Ballari",
    city: "Ballari",
  },
  {
    id: "shelter-blr-2",
    name: "Government Shelter Home & Indoor Sports Complex",
    address: "Infantry Road, Near District Stadium, Ballari",
    lat: 15.1480,
    lng: 76.9280,
    capacity: 750,
    currentOccupancy: 310,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 5,
    contactPhone: "+91 83922 74211",
    shelterType: "Stadium",
    district: "Ballari",
    city: "Ballari",
  },
  {
    id: "shelter-blr-3",
    name: "VIMS Emergency Relief Ward & Trauma Haven",
    address: "Vijayanagar Institute of Medical Sciences, Cantonment, Ballari",
    lat: 15.1550,
    lng: 76.9350,
    capacity: 350,
    currentOccupancy: 280,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 7,
    contactPhone: "+91 83922 74212",
    shelterType: "Hospital Wing",
    district: "Ballari",
    city: "Ballari",
  },
  {
    id: "shelter-blr-4",
    name: "Ballari Municipal Community Relief Center",
    address: "Siruguppa Road, Cowl Bazaar, Ballari",
    lat: 15.1320,
    lng: 76.9150,
    capacity: 450,
    currentOccupancy: 180,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 4,
    contactPhone: "+91 83922 74213",
    shelterType: "Community Hall",
    district: "Ballari",
    city: "Ballari",
  },
  {
    id: "shelter-blr-5",
    name: "Cantonment Multi-Purpose Relief Camp",
    address: "Near Old Railway Station, Ballari Cantonment",
    lat: 15.1600,
    lng: 76.9400,
    capacity: 600,
    currentOccupancy: 210,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 6,
    contactPhone: "+91 83922 74214",
    shelterType: "Relief Camp",
    district: "Ballari",
    city: "Ballari",
  },

  // --- BENGALURU URBAN DISTRICT SHELTERS ---
  {
    id: "shelter-bgr-1",
    name: "St. Jude Community Hall & Relief Center",
    address: "MG Road Sector 4, Central Bengaluru",
    lat: 12.9716,
    lng: 77.5946,
    capacity: 400,
    currentOccupancy: 215,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 5,
    contactPhone: "+91 80229 87654",
    shelterType: "Community Hall",
    district: "Bengaluru Urban",
    city: "Bengaluru",
  },
  {
    id: "shelter-bgr-2",
    name: "National High School Indoor Sports Complex",
    address: "12th Cross, Jayanagar, South Bengaluru",
    lat: 12.9250,
    lng: 77.5838,
    capacity: 650,
    currentOccupancy: 480,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 4,
    contactPhone: "+91 80229 87655",
    shelterType: "School/College",
    district: "Bengaluru Urban",
    city: "Bengaluru",
  },
  {
    id: "shelter-bgr-3",
    name: "Kanteerava Indoor Stadium Evacuation Zone",
    address: "Kasturba Road, Sampangi Rama Nagar, Bengaluru",
    lat: 12.9698,
    lng: 77.5929,
    capacity: 1200,
    currentOccupancy: 620,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 8,
    contactPhone: "+91 80229 87656",
    shelterType: "Stadium",
    district: "Bengaluru Urban",
    city: "Bengaluru",
  },
  {
    id: "shelter-bgr-4",
    name: "City Civil Hospital Safe Wing & Trauma Camp",
    address: "Victoria Hospital Road, Fort District, Bengaluru",
    lat: 12.9620,
    lng: 77.5750,
    capacity: 300,
    currentOccupancy: 290,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 7,
    contactPhone: "+91 80229 87657",
    shelterType: "Hospital Wing",
    district: "Bengaluru Urban",
    city: "Bengaluru",
  },
  {
    id: "shelter-bgr-5",
    name: "Yelahanka Relief Pavilion & High Grounds",
    address: "NES Office Circle, Yelahanka New Town, Bengaluru",
    lat: 13.1007,
    lng: 77.5963,
    capacity: 550,
    currentOccupancy: 120,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 6,
    contactPhone: "+91 80229 87658",
    shelterType: "Relief Camp",
    district: "Bengaluru Urban",
    city: "Bengaluru",
  },

  // --- MYSURU DISTRICT SHELTERS ---
  {
    id: "shelter-mys-1",
    name: "Mysuru District Disaster Relief Pavilion",
    address: "Subbarayanakatte, KR Circle, Mysuru",
    lat: 12.2958,
    lng: 76.6394,
    capacity: 500,
    currentOccupancy: 190,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 6,
    contactPhone: "+91 82124 51100",
    shelterType: "Community Hall",
    district: "Mysuru",
    city: "Mysuru",
  },
  {
    id: "shelter-mys-2",
    name: "Chamundi Indoor Sports Complex Evacuation Center",
    address: "Nazarbad Road, Mysuru",
    lat: 12.3020,
    lng: 76.6520,
    capacity: 800,
    currentOccupancy: 340,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 5,
    contactPhone: "+91 82124 51101",
    shelterType: "Stadium",
    district: "Mysuru",
    city: "Mysuru",
  },
  {
    id: "shelter-mys-3",
    name: "KR Hospital Emergency Trauma Haven",
    address: "Irwin Road, Lashkar Mohalla, Mysuru",
    lat: 12.3110,
    lng: 76.6480,
    capacity: 400,
    currentOccupancy: 320,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 7,
    contactPhone: "+91 82124 51102",
    shelterType: "Hospital Wing",
    district: "Mysuru",
    city: "Mysuru",
  },

  // --- MANGALURU (DAKSHINA KANNADA) SHELTERS ---
  {
    id: "shelter-mgl-1",
    name: "Mangaluru Coastal Relief & Marine Haven",
    address: "Panambur Beach Road, Mangaluru",
    lat: 12.9141,
    lng: 74.8560,
    capacity: 600,
    currentOccupancy: 220,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 5,
    contactPhone: "+91 82422 21100",
    shelterType: "Relief Camp",
    district: "Dakshina Kannada",
    city: "Mangaluru",
  },
  {
    id: "shelter-mgl-2",
    name: "Town Hall Community Refuge",
    address: "Hampankatta Junction, Mangaluru",
    lat: 12.8700,
    lng: 74.8400,
    capacity: 450,
    currentOccupancy: 170,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 6,
    contactPhone: "+91 82422 21101",
    shelterType: "Community Hall",
    district: "Dakshina Kannada",
    city: "Mangaluru",
  },
  {
    id: "shelter-mgl-3",
    name: "Father Muller Disaster Emergency Care Center",
    address: "Kankanady, Mangaluru",
    lat: 12.8650,
    lng: 74.8580,
    capacity: 350,
    currentOccupancy: 290,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 7,
    contactPhone: "+91 82422 21102",
    shelterType: "Hospital Wing",
    district: "Dakshina Kannada",
    city: "Mangaluru",
  },

  // --- BELAGAVI DISTRICT SHELTERS ---
  {
    id: "shelter-blg-1",
    name: "Belagavi District Indoor Stadium Relief Camp",
    address: "Subhash Nagar, Belagavi",
    lat: 15.8497,
    lng: 74.4977,
    capacity: 700,
    currentOccupancy: 260,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 5,
    contactPhone: "+91 83124 01100",
    shelterType: "Stadium",
    district: "Belagavi",
    city: "Belagavi",
  },
  {
    id: "shelter-blg-2",
    name: "KLE Hospital Emergency Relief Haven",
    address: "JNMC Campus, Nehru Nagar, Belagavi",
    lat: 15.8720,
    lng: 74.5080,
    capacity: 400,
    currentOccupancy: 310,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 8,
    contactPhone: "+91 83124 01101",
    shelterType: "Hospital Wing",
    district: "Belagavi",
    city: "Belagavi",
  },

  // --- HUBBALLI-DHARWAD SHELTERS ---
  {
    id: "shelter-hbl-1",
    name: "Hubballi Nehru Stadium Evacuation Haven",
    address: "Deshpande Nagar, Hubballi",
    lat: 15.3647,
    lng: 75.1240,
    capacity: 900,
    currentOccupancy: 380,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 6,
    contactPhone: "+91 83622 31100",
    shelterType: "Stadium",
    district: "Dharwad",
    city: "Hubballi",
  },
  {
    id: "shelter-hbl-2",
    name: "KIMS Hospital Emergency Trauma Ward",
    address: "Vidyanagar, Hubballi",
    lat: 15.3520,
    lng: 75.1380,
    capacity: 500,
    currentOccupancy: 420,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 7,
    contactPhone: "+91 83622 31101",
    shelterType: "Hospital Wing",
    district: "Dharwad",
    city: "Hubballi",
  },
  {
    id: "shelter-hbl-3",
    name: "Dharwad Municipal Community Hall Shelter",
    address: "Court Circle, Dharwad",
    lat: 15.4589,
    lng: 75.0078,
    capacity: 400,
    currentOccupancy: 150,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 5,
    contactPhone: "+91 83622 31102",
    shelterType: "Community Hall",
    district: "Dharwad",
    city: "Dharwad",
  },

  // --- KALABURAGI (GULBARGA) SHELTERS ---
  {
    id: "shelter-klb-1",
    name: "Kalaburagi Municipal Disaster Relief Center",
    address: "Super Market Main Road, Kalaburagi",
    lat: 17.3297,
    lng: 76.8343,
    capacity: 550,
    currentOccupancy: 200,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 6,
    contactPhone: "+91 84722 51100",
    shelterType: "Community Hall",
    district: "Kalaburagi",
    city: "Kalaburagi",
  },
  {
    id: "shelter-klb-2",
    name: "GIMS Government Hospital Safe Ward",
    address: "Sedam Road, Kalaburagi",
    lat: 17.3400,
    lng: 76.8450,
    capacity: 350,
    currentOccupancy: 280,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 7,
    contactPhone: "+91 84722 51101",
    shelterType: "Hospital Wing",
    district: "Kalaburagi",
    city: "Kalaburagi",
  },

  // --- SHIVAMOGGA SHELTERS ---
  {
    id: "shelter-smg-1",
    name: "Shivamogga Nehru Stadium Relief Center",
    address: "BH Road, Shivamogga",
    lat: 13.9299,
    lng: 75.5681,
    capacity: 650,
    currentOccupancy: 210,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 5,
    contactPhone: "+91 81822 71100",
    shelterType: "Stadium",
    district: "Shivamogga",
    city: "Shivamogga",
  },

  // --- TUMAKURU SHELTERS ---
  {
    id: "shelter-tmk-1",
    name: "Tumakuru District Indoor Sports Haven",
    address: "MG Road, Tumakuru",
    lat: 13.3392,
    lng: 77.1016,
    capacity: 500,
    currentOccupancy: 180,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 5,
    contactPhone: "+91 81622 81100",
    shelterType: "Stadium",
    district: "Tumakuru",
    city: "Tumakuru",
  },

  // --- DAVANAGERE SHELTERS ---
  {
    id: "shelter-[#DVG]-1",
    name: "Davanagere District Indoor Stadium Relief Haven",
    address: "PJ Extension, Davanagere",
    lat: 14.4644,
    lng: 75.9218,
    capacity: 600,
    currentOccupancy: 220,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 6,
    contactPhone: "+91 81922 61100",
    shelterType: "Stadium",
    district: "Davanagere",
    city: "Davanagere",
  },

  // --- RAICHUR SHELTERS ---
  {
    id: "shelter-rch-1",
    name: "Raichur Municipal Community Relief Center",
    address: "Station Road, Raichur",
    lat: 16.2076,
    lng: 77.3556,
    capacity: 500,
    currentOccupancy: 160,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 5,
    contactPhone: "+91 85322 41100",
    shelterType: "Community Hall",
    district: "Raichur",
    city: "Raichur",
  },

  // --- KOPPAL SHELTERS ---
  {
    id: "shelter-kpl-1",
    name: "Koppal District Administrative Relief Hall",
    address: "Hoskere Road, Koppal",
    lat: 15.3506,
    lng: 76.1548,
    capacity: 450,
    currentOccupancy: 130,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 5,
    contactPhone: "+91 85392 31100",
    shelterType: "Community Hall",
    district: "Koppal",
    city: "Koppal",
  },

  // --- GADAG SHELTERS ---
  {
    id: "shelter-gdg-1",
    name: "Gadag District Stadium & Evacuation Grounds",
    address: "Pala Badami Road, Gadag",
    lat: 15.4319,
    lng: 75.6315,
    capacity: 500,
    currentOccupancy: 140,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 5,
    contactPhone: "+91 83722 21100",
    shelterType: "Stadium",
    district: "Gadag",
    city: "Gadag",
  },

  // --- HASSAN SHELTERS ---
  {
    id: "shelter-hsn-1",
    name: "Hassan District Indoor Stadium Safe Shelter",
    address: "BM Road, Hassan",
    lat: 13.0033,
    lng: 76.1004,
    capacity: 550,
    currentOccupancy: 190,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 6,
    contactPhone: "+91 81722 61100",
    shelterType: "Stadium",
    district: "Hassan",
    city: "Hassan",
  },

  // --- MANDYA SHELTERS ---
  {
    id: "shelter-mnd-1",
    name: "Mandya District Sports Complex Haven",
    address: "Bengaluru-Mysuru Highway, Mandya",
    lat: 12.5218,
    lng: 76.8951,
    capacity: 600,
    currentOccupancy: 210,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 5,
    contactPhone: "+91 82322 41100",
    shelterType: "Stadium",
    district: "Mandya",
    city: "Mandya",
  },

  // --- CHITRADURGA SHELTERS ---
  {
    id: "shelter-cta-1",
    name: "Chitradurga Municipal Relief Hall & Sports Haven",
    address: "Holalkere Road, Chitradurga",
    lat: 14.2251,
    lng: 76.3980,
    capacity: 500,
    currentOccupancy: 170,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 5,
    contactPhone: "+91 81942 21100",
    shelterType: "Community Hall",
    district: "Chitradurga",
    city: "Chitradurga",
  },

  // --- VIJAYAPURA SHELTERS ---
  {
    id: "shelter-vjp-1",
    name: "Vijayapura District Indoor Stadium Haven",
    address: "Station Road, Vijayapura",
    lat: 16.8302,
    lng: 75.7100,
    capacity: 600,
    currentOccupancy: 200,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 6,
    contactPhone: "+91 83522 51100",
    shelterType: "Stadium",
    district: "Vijayapura",
    city: "Vijayapura",
  },

  // --- UDUPI SHELTERS ---
  {
    id: "shelter-udp-1",
    name: "Udupi District Indoor Stadium Haven",
    address: "Ajjarkad, Udupi",
    lat: 13.3409,
    lng: 74.7421,
    capacity: 500,
    currentOccupancy: 180,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 6,
    contactPhone: "+91 82025 21100",
    shelterType: "Stadium",
    district: "Udupi",
    city: "Udupi",
  },

  // --- KODAGU (MADIKERI) SHELTERS ---
  {
    id: "shelter-kdg-1",
    name: "Madikeri District Indoor Stadium Relief Center",
    address: "FMC College Road, Madikeri",
    lat: 12.4244,
    lng: 75.7382,
    capacity: 450,
    currentOccupancy: 160,
    medicalAvailable: true,
    foodAvailable: true,
    waterSupplyDays: 6,
    contactPhone: "+91 82722 21100",
    shelterType: "Stadium",
    district: "Kodagu",
    city: "Madikeri",
  },
];

export const DEFAULT_ALERTS: DisasterAlert[] = [
  {
    id: "alert-101",
    title: "Severe Urban Flash Flood & Inundation Warning",
    rawText: "Heavy torrential rainfall exceeding 180mm over the last 6 hours has triggered severe flash flooding in low-lying residential sectors along the Vrishabhavathi basin. Citizens are strongly urged to move to higher floor levels or nearby relief shelters immediately. Avoid underpasses, electric poles, and flooded roadways.",
    disasterType: "Flash Flood",
    severity: "High",
    affectedAreas: ["Vrishabhavathi Basin", "Sector 4 Lowlands", "MG Road Metro Junction", "Jayanagar 4th Block"],
    importantSafetyInstructions: [
      "Evacuate ground floor apartments if water level exceeds 1 foot.",
      "Switch off main electricity breaker panels before evacuating.",
      "Move to St. Jude or Kanteerava safe shelters.",
      "Do not attempt to wade through moving floodwaters."
    ],
    summaryText: "Torrential 180mm rainfall triggered flash floods in Sector 4 and low-lying basins. Immediate evacuation recommended for ground floor residents to nearby St. Jude Hall or Kanteerava Stadium. Turn off main power switches and avoid flooded roads.",
    timestamp: "2026-07-30 02:30 AM",
    source: "Meteorological Center & State Disaster Management Authority",
  },
  {
    id: "alert-102",
    title: "Category 2 Tropical Cyclone Wind Advisory",
    rawText: "Tropical Cyclone Alert: High velocity gusty winds reaching up to 90 km/h accompanied by heavy lightning strikes predicted over coastal and inland metro zones. Unsecured structures, hoardings, and mature trees pose falling hazards. Stay indoors away from glass windows.",
    disasterType: "Cyclone",
    severity: "Critical",
    affectedAreas: ["Coastal Belt", "East Metro Zone", "Outer Ring Corridor"],
    importantSafetyInstructions: [
      "Secure or bring indoors all balcony furniture and loose items.",
      "Stay away from window panes and glass facades.",
      "Keep emergency flashlights and fully charged power banks ready."
    ],
    summaryText: "Category 2 Cyclone approaching with 90 km/h winds and lightning. Citizens must remain indoors away from glass windows. Secure loose outdoor objects and charge emergency flashlights.",
    timestamp: "2026-07-30 01:15 AM",
    source: "National Disaster Response Force (NDRF)",
  }
];

export const DEFAULT_CONTACTS: EmergencyContact[] = [
  {
    id: "c-1",
    name: "Primary Emergency Contact",
    relation: "Primary SOS Recipient",
    email: "nehapkolagada@gmail.com",
    phone: "+91 98765 43210",
    isPrimary: true,
  },
  {
    id: "c-2",
    name: "Dr. Rajesh Sharma (Brother)",
    relation: "Family",
    email: "rajesh.sharma.med@gmail.com",
    phone: "+91 98123 45678",
    isPrimary: false,
  },
  {
    id: "c-3",
    name: "City Emergency Control Room",
    relation: "Civic Authority",
    email: "controlroom@disastermanagement.gov.in",
    phone: "112 / 108",
    isPrimary: false,
  }
];

export const DEFAULT_FIRST_AID: FirstAidGuide[] = [
  {
    id: "fa-flood",
    title: "Flood Emergency Survival Guide",
    category: "Flood",
    summary: "Comprehensive protocol for flood preparedness, evacuation, water wading safety, and drowning/hypothermia response.",
    steps: [
      "Move to higher ground immediately when flood warnings are issued.",
      "Avoid walking, swimming, or driving through flood water.",
      "Stay away from electric wires and submerged electrical equipment.",
      "Use clean bottled or boiled drinking water to prevent waterborne disease."
    ],
    beforeList: [
      "Move to higher ground immediately",
      "Store emergency supplies (clean water, canned food, flashlight, medical kit)",
      "Disconnect main electricity breakers and gas valves",
      "Keep important documents safe in waterproof plastic pouches"
    ],
    duringList: [
      "Avoid walking or driving through flood water (6 inches can knock you down)",
      "Stay away from power lines, poles, and electrical installations",
      "Use clean drinking water (boil before consumption)",
      "Follow official evacuation instructions and stick to safe routes"
    ],
    afterList: [
      "Avoid contaminated water and standing flood pools",
      "Check injuries on yourself and family members",
      "Clean and disinfect wounds thoroughly with antiseptic",
      "Avoid damaged or structurally unstable buildings"
    ],
    emergencySteps: [
      "Drowning response: Throw a life ring, rope, or buoyant object; do not jump into rushing water without a tether; begin CPR if victim is unresponsive.",
      "Water contamination safety: Boil drinking water for at least 3 minutes, wash hands thoroughly, and throw away any food that contacted floodwater.",
      "Hypothermia prevention: Remove wet clothing immediately, wrap person in dry warm blankets, and provide warm non-alcoholic beverages."
    ],
    emergencyDoList: [
      "Keep phone, powerbank, and emergency documents in sealed plastic bags.",
      "Boil water for at least 3 minutes before drinking or cooking."
    ],
    emergencyDontList: [
      "Do not touch electrical switches or cables in standing water.",
      "Do not attempt to drive into flooded underpasses or submerged bridges."
    ],
    icon: "Waves"
  },
  {
    id: "fa-earthquake",
    title: "Earthquake Emergency Survival Protocol",
    category: "Earthquake",
    summary: "Seismic protective measures before, during tremors, and safe evacuation & trapping rescue steps.",
    steps: [
      "DROP down onto hands and knees to avoid being knocked over.",
      "COVER your head and neck under a sturdy table or desk.",
      "HOLD ON to your shelter until all shaking stops completely.",
      "Move to open areas away from buildings and power lines after shaking."
    ],
    beforeList: [
      "Prepare a 72-hour emergency survival kit",
      "Secure heavy furniture, tall bookcases, and appliances to wall studs"
    ],
    duringList: [
      "Drop down onto your hands and knees",
      "Cover your head and neck under a sturdy table or desk",
      "Hold on to your shelter until shaking stops",
      "Stay away from windows, glass, mirrors, and exterior walls"
    ],
    afterList: [
      "Check injuries and apply first aid immediately",
      "Move calmly to open outdoor areas away from structures",
      "Avoid damaged buildings and cracked bridges",
      "Watch for aftershocks and secondary tremors"
    ],
    emergencySteps: [
      "Rescue trapped people safely: Assess structural stability before entering rubble; call out for victims; do not move injured persons unless immediate collapse or fire threatens.",
      "Treat injuries: Stop bleeding with direct pressure, immobilize suspected spinal injuries and broken bones with rigid splints.",
      "Emergency evacuation: Exit via stairwells carefully; never use elevators during or after tremors; assemble at open evacuation grounds."
    ],
    emergencyDoList: [
      "Protect your head and neck with arms, pillows, or thick books.",
      "Keep emergency flashlights and sturdy shoes easily accessible."
    ],
    emergencyDontList: [
      "Do not run outside while active shaking is occurring.",
      "Do not use elevators or matches/lighters during gas leak risks."
    ],
    icon: "Activity"
  },
  {
    id: "fa-burns",
    title: "Burn Emergency First Aid & Warning Signs",
    category: "Burns",
    summary: "Immediate first-aid for thermal, chemical, or electrical burns to minimize tissue damage and prevent infection.",
    steps: [
      "Cool the burn area under cool running water for 10 to 20 minutes.",
      "Remove tight items near the burn before swelling begins.",
      "Cover loosely with a clean, sterile cloth or cling film.",
      "Do not apply ice, butter, or oils to the burned area."
    ],
    burnTypes: {
      minor: [
        "First-degree & small second-degree burns under 2 inches in size",
        "Redness, mild swelling, and painful superficial blisters",
        "Can be safely treated with cool water, antiseptic, and non-stick bandage"
      ],
      severe: [
        "Third-degree burns with charred, white, or leathery skin texture",
        "Burns covering large body areas or joints",
        "Electrical, chemical, or high-voltage thermal burns requiring trauma ER"
      ]
    },
    warningSigns: [
      "Large burns covering area bigger than victim's hand palm",
      "Face, throat, eye, hand, feet, or groin burns",
      "Electrical burns or inhalation burns with soot around nose/mouth"
    ],
    emergencyDoList: [
      "Cool burn with running tap water immediately for 10-20 minutes.",
      "Keep victim warm and calm while arranging medical transport."
    ],
    emergencyDontList: [
      "Do not apply ice directly—ice causes frostbite-like tissue necrosis.",
      "Do not break or pop blister bubbles as they guard against bacteria."
    ],
    icon: "Flame"
  },
  {
    id: "fa-cpr",
    title: "CPR (Cardiopulmonary Resuscitation) Protocol",
    category: "CPR",
    summary: "Step-by-step life support procedure for cardiac arrest victims with Adult, Child, and Infant protocols.",
    steps: [
      "1. Check responsiveness: Tap shoulders firmly and speak loudly.",
      "2. Call emergency services: Dial 112 / 108 immediately.",
      "3. Check breathing: Look for chest rising for 5-10 seconds.",
      "4. Start chest compressions: Push hard and fast in center of chest.",
      "5. Rescue breaths if trained: Give 2 breaths after every 30 compressions."
    ],
    cprVariants: [
      {
        title: "Adult CPR",
        target: "Adults & Adolescents",
        ratio: "30 Compressions : 2 Breaths (100-120 BPM)",
        instructions: [
          "Place heel of 2 interlocked hands in center of chest.",
          "Push down firmly 2 inches (5-6 cm) deep.",
          "Perform compressions at 100-120 beats per minute."
        ]
      },
      {
        title: "Child CPR",
        target: "Children (1 to 8 years)",
        ratio: "30 Compressions : 2 Gentle Breaths",
        instructions: [
          "Place heel of 1 or 2 hands in center of chest.",
          "Push down 2 inches (5 cm) deep with moderate force.",
          "Give 2 gentle rescue breaths after 30 compressions."
        ]
      },
      {
        title: "Infant CPR",
        target: "Infants (Under 1 year)",
        ratio: "30 Compressions : 2 Puff Breaths",
        instructions: [
          "Place 2 fingers in center of chest just below nipple line.",
          "Push down 1.5 inches (4 cm) deep softly.",
          "Deliver 2 small puff breaths covering both mouth and nose."
        ]
      }
    ],
    emergencyDoList: [
      "Push hard and fast in the center of the chest to 'Stayin' Alive' beat.",
      "Use an Automated External Defibrillator (AED) as soon as available."
    ],
    emergencyDontList: [
      "Do not stop chest compressions for more than 10 seconds.",
      "Do not lean on victim's chest between compressions—allow full recoil."
    ],
    icon: "HeartPulse"
  },
  {
    id: "fa-bleeding",
    title: "Severe Bleeding First Aid & Wound Safety",
    category: "Bleeding",
    summary: "Immediate steps to control severe hemorrhaging, apply pressure, and prevent life-threatening shock.",
    steps: [
      "1. Apply direct pressure on wound using a clean cloth or bandage.",
      "2. Elevate the wound above heart level if no fracture is present.",
      "3. Use a clean cloth or sterile bandage to wrap firmly.",
      "4. Monitor bleeding continuously and add more layers if soaking.",
      "5. Seek emergency medical help immediately."
    ],
    severeWarnings: [
      "Heavy blood loss: Pulsating or continuous dark red blood flow from wound",
      "Deep wounds: Exposed fat, muscle, bone, or embedded foreign objects",
      "Shock symptoms: Pale cold skin, rapid weak pulse, confusion, and dizziness"
    ],
    emergencyDoList: [
      "Keep firm, continuous direct pressure on wound for at least 10 minutes.",
      "Keep victim lying flat, calm, and warm with a blanket."
    ],
    emergencyDontList: [
      "Do not remove blood-soaked bandages—place new cloths on top.",
      "Do not pull out embedded objects like knives or glass shards."
    ],
    icon: "HeartPulse"
  },
  {
    id: "fa-cyclone",
    title: "Cyclone & High Wind Protocol",
    category: "Cyclone",
    summary: "Safety procedures before, during, and after a severe cyclone or hurricane.",
    steps: [
      "Board up windows and secure outdoor items before the storm.",
      "Stay indoors in a windowless room or on the lowest floor.",
      "Do not go outside during the calm eye of the storm.",
      "Use battery-operated radios for official updates."
    ],
    beforeList: [
      "Board up windows and secure loose objects",
      "Stockpile water, non-perishable food, and batteries",
      "Keep phones charged and ready"
    ],
    duringList: [
      "Stay indoors, away from windows",
      "Turn off gas and electricity",
      "Do not go outside during the calm 'eye'"
    ],
    afterList: [
      "Watch for fallen power lines",
      "Do not drink tap water until declared safe",
      "Check property for structural damage"
    ],
    emergencyDoList: [
      "Stay in the strongest part of your home",
      "Listen to official weather warnings"
    ],
    emergencyDontList: [
      "Do not tape windows (it doesn't work)",
      "Do not go outside during the storm"
    ],
    icon: "wind"
  },
  {
    id: "fa-fire",
    title: "Fire Safety & Evacuation",
    category: "Fire",
    summary: "Emergency procedures for building fires and smoke inhalation.",
    steps: [
      "Activate the nearest fire alarm and call emergency services.",
      "Evacuate immediately using stairs, NEVER use elevators.",
      "Crawl low under smoke to avoid inhalation.",
      "If clothes catch fire: Stop, Drop, and Roll."
    ],
    beforeList: [
      "Identify two escape routes from every room",
      "Test smoke alarms monthly",
      "Keep flammable items away from heat sources"
    ],
    duringList: [
      "Crawl low under smoke",
      "Feel doors for heat before opening",
      "Use stairs, never elevators"
    ],
    afterList: [
      "Do not re-enter the building",
      "Report to the designated assembly point",
      "Seek medical help for smoke inhalation or burns"
    ],
    emergencyDoList: [
      "Evacuate immediately",
      "Close doors behind you to slow the fire"
    ],
    emergencyDontList: [
      "Do not use elevators",
      "Do not go back inside for belongings"
    ],
    icon: "flame"
  },
  {
    id: "fa-landslide",
    title: "Landslide & Mudslide Safety",
    category: "Landslide",
    summary: "Immediate actions to take during ground movement, mudslides, or debris flows.",
    steps: [
      "Move away from the path of the landslide immediately.",
      "If escape is not possible, curl into a tight ball and protect your head.",
      "Avoid river valleys and low-lying areas.",
      "Listen for unusual sounds like trees cracking or boulders knocking."
    ],
    beforeList: [
      "Monitor weather for intense rainfall",
      "Listen for unusual rumbling sounds",
      "Be prepared to evacuate at a moment's notice"
    ],
    duringList: [
      "Move away from the path of the slide",
      "If stuck indoors, move to a second story if possible",
      "Curl into a ball and protect your head if escape is impossible"
    ],
    afterList: [
      "Stay away from the slide area",
      "Check for injured or trapped persons nearby",
      "Report broken utility lines"
    ],
    emergencyDoList: [
      "Evacuate immediately if warned",
      "Stay alert and awake during heavy storms"
    ],
    emergencyDontList: [
      "Do not return to the area until officials say it's safe",
      "Do not assume the danger has passed after one slide"
    ],
    icon: "mountain-snow"
  }
];

export const DEFAULT_INCIDENTS: IncidentReport[] = [
  {
    id: "inc-1",
    title: "Submerged Road Underpass at Sector 4 Junction",
    category: "Flood",
    severity: "High",
    description: "Water level reached 3.5 feet inside the underpass. Two cars trapped. Traffic blocked completely.",
    location: "Sector 4 Subway Junction",
    lat: 12.9680,
    lng: 77.5890,
    timestamp: "2026-07-30 02:10 AM",
    reportedBy: "Anil Kumar (Citizen)",
    status: "Verified",
  },
  {
    id: "inc-2",
    title: "Fallen Banyan Tree Blocking Main Highway Lane",
    category: "Fallen Tree",
    severity: "Medium",
    description: "Heavy winds uprooted large banyan tree across 2 main lanes. Municipal clearing team notified.",
    location: "MG Road Km 12",
    lat: 12.9740,
    lng: 77.5980,
    timestamp: "2026-07-30 01:50 AM",
    reportedBy: "Saritha V. (Citizen)",
    status: "Verified",
  },
  {
    id: "inc-3",
    title: "High Voltage Transformer Sparking & Cable Snap",
    category: "Power Failure",
    severity: "High",
    description: "Sparks flying from transformer pole after lightning strike. Local grid power shut off.",
    location: "Jayanagar 3rd Block",
    lat: 12.9280,
    lng: 77.5810,
    timestamp: "2026-07-30 01:20 AM",
    reportedBy: "Rohan M. (Resident)",
    status: "Unverified",
  }
];

export const DEFAULT_RESCUES: RescueRequest[] = [
  {
    id: "res-1",
    requesterName: "Mrs. Savitri Devi",
    headcount: 4,
    elderly: true,
    children: true,
    pregnant: true,
    disabilities: false,
    medicalEmergencies: true,
    trappedStatus: "Rising floodwaters at 4ft on ground floor. Insulin required for elderly diabetic patient.",
    description: "Water rising fast. Ground floor completely submerged. 1 elderly lady (78 yrs), 1 pregnant lady (7 months), 2 children.",
    location: "House No 42, Vrishabhavathi Layout, Sector 4",
    lat: 12.9695,
    lng: 77.5875,
    priority: "High",
    priorityScore: 95,
    reasoningExplanation: "CRITICAL PRIORITY: High vulnerability group including pregnant woman (7 months), elderly diabetic patient needing insulin, and 2 children with 4ft rising floodwater.",
    status: "Pending",
    timestamp: "2026-07-30 02:25 AM",
    contactPhone: "+91 98450 12345"
  },
  {
    id: "res-2",
    requesterName: "Karan Verma",
    headcount: 2,
    elderly: false,
    children: false,
    pregnant: false,
    disabilities: false,
    medicalEmergencies: false,
    trappedStatus: "Car stalled in water logging. Standing on car roof.",
    description: "Car engine drowned in 2.5ft water. No injuries, safe on roof but need towing or boat lift.",
    location: "Underpass 3, Ring Road",
    lat: 12.9650,
    lng: 77.5910,
    priority: "Medium",
    priorityScore: 55,
    reasoningExplanation: "MEDIUM PRIORITY: 2 healthy adults stranded on vehicle roof. Stable position, no immediate medical emergency or life-threatening surge.",
    status: "Dispatched",
    timestamp: "2026-07-30 02:05 AM",
    contactPhone: "+91 98111 22233"
  }
];

export const DEFAULT_VOLUNTEERS: Volunteer[] = [
  {
    id: "v-1",
    name: "Vikram Reddy",
    skills: ["First Aid Certified", "Motorboat Operator", "Swimming Specialist"],
    phone: "+91 97777 11111",
    location: "Jayanagar District",
    lat: 12.9290,
    lng: 77.5840,
    status: "Available"
  },
  {
    id: "v-2",
    name: "Sujata Patel",
    skills: ["Nurse / Paramedic", "Elderly Care", "Kannada/Hindi Translation"],
    phone: "+91 97777 22222",
    location: "Central MG Road",
    lat: 12.9720,
    lng: 77.5950,
    status: "Available"
  },
  {
    id: "v-3",
    name: "Arun Swamy",
    skills: ["Civil Defense Rescue", "Chainsaw / Debris Clearing", "Ham Radio Operator"],
    phone: "+91 97777 33333",
    location: "Koramangala",
    lat: 12.9350,
    lng: 77.6200,
    status: "Assigned"
  }
];
