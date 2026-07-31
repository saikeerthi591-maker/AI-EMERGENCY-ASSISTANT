import { Language } from "../types";

export interface Translations {
  appName: string;
  liveTag: string;
  tagline: string;
  searchPlaceholder: string;
  online: string;
  offline: string;
  sync: string;
  sosButton: string;
  
  // Nav tabs
  navHome: string;
  navAlerts: string;
  navShelters: string;
  navSos: string;
  navRescue: string;
  navChat: string;
  navReporting: string;
  navFirstAid: string;
  navAdmin: string;
  navSettings: string;
  navProfile: string;

  // Home Screen
  heroTitle: string;
  heroSub: string;
  activateSos: string;
  quickActionsTitle: string;
  nearestShelters: string;
  openMap: string;
  firstAidPreparedness: string;
  manual: string;

  // Actions
  findShelter: string;
  findShelterDesc: string;
  reportHazard: string;
  reportHazardDesc: string;
  firstAidGuide: string;
  firstAidDesc: string;
  rescueTriage: string;
  rescueDesc: string;
  aiChatbot: string;
  aiChatbotDesc: string;

  // Profile
  profileTitle: string;
  fullName: string;
  emailAddress: string;
  phone: string;
  currentLocation: string;
  accountStatus: string;
  emergencyId: string;
  editProfile: string;
  saveProfile: string;
  locationManagement: string;
  useGpsLocation: string;
  selectLocationManually: string;
  searchLocationPlaceholder: string;

  // Settings
  settingsTitle: string;
  emergencyContacts: string;
  notifications: string;
  appearance: string;
  offlineData: string;
  accessibility: string;
  about: string;
  disasterAlertsNotif: string;
  weatherAlertsNotif: string;
  communityReportsNotif: string;
  browserNotif: string;
  sosStatusUpdatesNotif: string;
  lightMode: string;
  darkMode: string;
  systemTheme: string;
  syncData: string;
  clearCache: string;
  voiceNav: string;
  textToSpeech: string;
  speechToText: string;
  highContrast: string;
  largeText: string;
}

const english: Translations = {
  appName: "AI Emergency Assistant",
  liveTag: "LIVE",
  tagline: "Disaster Response Hub",
  searchPlaceholder: "Search shelters, alerts, first aid...",
  online: "Online",
  offline: "Offline",
  sync: "Sync",
  sosButton: "ACTIVATE SOS",

  navHome: "Home",
  navAlerts: "AI Alerts",
  navShelters: "Safe Shelters",
  navSos: "Smart SOS",
  navRescue: "Rescue Triage",
  navChat: "AI Assistant",
  navReporting: "Report Hazard",
  navFirstAid: "First Aid",
  navAdmin: "Admin Hub",
  navSettings: "Settings",
  navProfile: "User Profile",

  heroTitle: "Disaster Management & Smart SOS Hub",
  heroSub: "Real-time multi-lingual AI alert summarization, GPS safe shelter routing, smart SOS emergency broadcast, and rescue prioritization.",
  activateSos: "ACTIVATE SOS",
  quickActionsTitle: "Quick Action Modules",
  nearestShelters: "Nearest Evacuation Shelters",
  openMap: "Open Map →",
  firstAidPreparedness: "First Aid & Preparedness",
  manual: "Manual →",

  findShelter: "Find Shelter",
  findShelterDesc: "Live GPS & offline route navigation to safe havens",
  reportHazard: "Report Hazard",
  reportHazardDesc: "Citizen report road blocks, fallen trees & floods",
  firstAidGuide: "First Aid Guide",
  firstAidDesc: "Cached CPR & emergency medical instructions",
  rescueTriage: "Rescue Triage",
  rescueDesc: "AI prioritized dispatch for trapped citizens",
  aiChatbot: "AI Chatbot",
  aiChatbotDesc: "24/7 disaster response assistant in your language",

  profileTitle: "User Emergency Profile",
  fullName: "Full Name",
  emailAddress: "Email Address",
  phone: "Phone Number",
  currentLocation: "Current Location",
  accountStatus: "Account Status",
  emergencyId: "Emergency ID",
  editProfile: "Edit Profile",
  saveProfile: "Save Profile",
  locationManagement: "Location Management",
  useGpsLocation: "Use Current GPS Location",
  selectLocationManually: "Select Location Manually",
  searchLocationPlaceholder: "Search City, District, Area or PIN Code...",

  settingsTitle: "Emergency Settings",
  emergencyContacts: "Emergency Contacts",
  notifications: "Notifications",
  appearance: "Appearance",
  offlineData: "Offline Data",
  accessibility: "Accessibility",
  about: "About",
  disasterAlertsNotif: "Disaster Alerts",
  weatherAlertsNotif: "Weather Alerts",
  communityReportsNotif: "Community Reports",
  browserNotif: "Browser Notifications",
  sosStatusUpdatesNotif: "SOS Status Updates",
  lightMode: "Light Mode",
  darkMode: "Dark Mode",
  systemTheme: "System Theme",
  syncData: "Sync Data",
  clearCache: "Clear Cache",
  voiceNav: "Voice Navigation",
  textToSpeech: "Text-to-Speech",
  speechToText: "Speech-to-Text",
  highContrast: "High Contrast Mode",
  largeText: "Large Text",
};

const kannada: Translations = {
  appName: "ಅಲರ್ಟ್ AI",
  liveTag: "ಲೈವ್",
  tagline: "ವಿಪತ್ತು ನಿರ್ವಹಣಾ ಕೇಂದ್ರ",
  searchPlaceholder: "ಆಶ್ರಯ ತಾಣ, ಎಚ್ಚರಿಕೆಗಳನ್ನು ಹುಡುಕಿ...",
  online: "ಆನ್‌ಲೈನ್",
  offline: "ಆಫ್‌ಲೈನ್",
  sync: "ಸಿಂಕ್ ಮಾಡಿ",
  sosButton: "SOS ಸಕ್ರಿಯಗೊಳಿಸಿ",

  navHome: "ಮುಖಪುಟ",
  navAlerts: "AI ಎಚ್ಚರಿಕೆಗಳು",
  navShelters: "ಸುರಕ್ಷಿತ ಆಶ್ರಯ",
  navSos: "ಸ್ಮಾರ್ಟ್ SOS",
  navRescue: "ರಕ್ಷಣೆ ನೀಡಿಕೆ",
  navChat: "AI ಸಹಾಯಕ",
  navReporting: "ವರದಿ ಮಾಡಿ",
  navFirstAid: "ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ",
  navAdmin: "ಆಡಳಿತ",
  navSettings: "ಸಂಯೋಜನೆಗಳು",
  navProfile: "ಬಳಕೆದಾರರ ವಿವರ",

  heroTitle: "ವಿಪತ್ತು ನಿರ್ವಹಣೆ ಮತ್ತು ಸ್ಮಾರ್ಟ್ SOS ಕೇಂದ್ರ",
  heroSub: "ನೈಜ ಸಮಯದ ಬಹುಭಾಷಾ AI ಎಚ್ಚರಿಕೆ ಸಾರಾಂಶ, ಸುರಕ್ಷಿತ ಆಶ್ರಯ ಮಾರ್ಗ, ತುರ್ತು SOS ಮತ್ತು ರಕ್ಷಣಾ ಆದ್ಯತೆ.",
  activateSos: "SOS ಸಕ್ರಿಯಗೊಳಿಸಿ",
  quickActionsTitle: "ತ್ವರಿತ ಕ್ರಿಯೆ ಮಾಡ್ಯೂಲ್‌ಗಳು",
  nearestShelters: "ಹತ್ತಿರದ ಸುರಕ್ಷಿತ ಆಶ್ರಯ ತಾಣಗಳು",
  openMap: "ನಕ್ಷೆ ತೆರೆಯಿರಿ →",
  firstAidPreparedness: "ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ ಮತ್ತು ಸಿದ್ಧತೆ",
  manual: "ಕೈಪಿಡಿ →",

  findShelter: "ಆಶ್ರಯ ತಾಣ ಹುಡುಕಿ",
  findShelterDesc: "ಸುರಕ್ಷಿತ ಸ್ಥಳಗಳಿಗೆ ಜಿಪಿಎಸ್ ಮತ್ತು ಆಫ್‌ಲೈನ್ ಮಾರ್ಗ",
  reportHazard: "ಅಪಾಯ ವರದಿ ಮಾಡಿ",
  reportHazardDesc: "ರಸ್ತೆ ತಡೆ, ಮರ ಬಿದ್ದಿರುವುದು ಮತ್ತು ಪ್ರವಾಹ ವರದಿ ಮಾಡಿ",
  firstAidGuide: "ಪ್ರಥಮ ಚಿಕಿತ್ಸಾ ಮಾರ್ಗದರ್ಶಿ",
  firstAidDesc: "CPR ಮತ್ತು ತುರ್ತು ವೈದ್ಯಕೀಯ ಸೂಚನೆಗಳು",
  rescueTriage: "ರಕ್ಷಣಾ ಆದ್ಯತೆ",
  rescueDesc: "ಸಿಲುಕಿರುವ ಜನರಿಗೆ AI ಆದ್ಯತೆಯ ರಕ್ಷಣೆ",
  aiChatbot: "AI ಚಾಟ್‌ಬಾಟ್",
  aiChatbotDesc: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ 24/7 ವಿಪತ್ತು ಪರಿಹಾರ ಸಹಾಯಕ",

  profileTitle: "ಬಳಕೆದಾರರ ತುರ್ತು ವಿವರಣೆ",
  fullName: "ಪೂರ್ಣ ಹೆಸರು",
  emailAddress: "ಇಮೇಲ್ ವಿಳಾಸ",
  phone: "ಫೋನ್ ಸಂಖ್ಯೆ",
  currentLocation: "ಪ್ರಸ್ತುತ ಸ್ಥಳ",
  accountStatus: "ಖಾತೆ ಸ್ಥಿತಿ",
  emergencyId: "ತುರ್ತು ಐಡಿ",
  editProfile: "ವಿವರ ತಿದ್ದಿ",
  saveProfile: "ವಿವರ ಉಳಿಸಿ",
  locationManagement: "ಸ್ಥಳ ನಿರ್ವಹಣೆ",
  useGpsLocation: "ಪ್ರಸ್ತುತ ಜಿಪಿಎಸ್ ಸ್ಥಳ ಬಳಸಿ",
  selectLocationManually: "ಸ್ಥಳವನ್ನು ಕೈಯಾರೆ ಆಯ್ಕೆಮಾಡಿ",
  searchLocationPlaceholder: "ನಗರ, ಜಿಲ್ಲೆ ಅಥವಾ ಪಿನ್ ಕೋಡ್ ಹುಡುಕಿ...",

  settingsTitle: "ತುರ್ತು ಸಂಯೋಜನೆಗಳು",
  emergencyContacts: "ತುರ್ತು ಸಂಪರ್ಕಗಳು",
  notifications: "ಸೂಚನೆಗಳು",
  appearance: "ವಿನ್ಯಾಸ",
  offlineData: "ಆಫ್‌ಲೈನ್ ಡೇಟಾ",
  accessibility: "ಸುಲಭ ಚಾಲನೆ",
  about: "ಕುರಿತು",
  disasterAlertsNotif: "ವಿಪತ್ತು ಎಚ್ಚರಿಕೆಗಳು",
  weatherAlertsNotif: "ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು",
  communityReportsNotif: "ಸಮುದಾಯ ವರದಿಗಳು",
  browserNotif: "ಬ್ರೌಸರ್ ಸೂಚನೆಗಳು",
  sosStatusUpdatesNotif: "SOS ಸ್ಥಿತಿ ನವೀಕರಣಗಳು",
  lightMode: "ಬೆಳಕಿನ ಶೈಲಿ",
  darkMode: "ಕತ್ತಲೆಯ ಶೈಲಿ",
  systemTheme: "ಸಿಸ್ಟಮ್ ಥೀಮ್",
  syncData: "ಡೇಟಾ ಸಿಂಕ್ ಮಾಡಿ",
  clearCache: "ಕ್ಯಾಶ್ ತೆರವುಗೊಳಿಸಿ",
  voiceNav: "ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ",
  textToSpeech: "ಪಠ್ಯದಿಂದ ಧ್ವನಿ",
  speechToText: "ಧ್ವನಿಯಿಂದ ಪಠ್ಯ",
  highContrast: "ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್",
  largeText: "ದೊಡ್ಡ ಅಕ್ಷರಗಳು",
};

const hindi: Translations = {
  appName: "अलर्ट AI",
  liveTag: "लाइव",
  tagline: "आपदा प्रबंधन केंद्र",
  searchPlaceholder: "आश्रय, अलर्ट, प्राथमिक चिकित्सा खोजें...",
  online: "ऑनलाइन",
  offline: "ऑफलाइन",
  sync: "सिंक करें",
  sosButton: "SOS सक्रिय करें",

  navHome: "होम",
  navAlerts: "AI अलर्ट",
  navShelters: "सुरक्षित आश्रय",
  navSos: "स्मार्ट SOS",
  navRescue: "बचाव प्राथमिकता",
  navChat: "AI सहायक",
  navReporting: "खतरा रिपोर्ट करें",
  navFirstAid: "प्राथमिक चिकित्सा",
  navAdmin: "एडमिन",
  navSettings: "सेटिंग्स",
  navProfile: "प्रोफ़ाइल",

  heroTitle: "आपदा प्रबंधन एवं स्मार्ट SOS केंद्र",
  heroSub: "वास्तविक समय बहुभाषी AI अलर्ट, GPS सुरक्षित आश्रय रूटिंग, स्मार्ट SOS और बचाव प्राथमिकता।",
  activateSos: "SOS सक्रिय करें",
  quickActionsTitle: "त्वरित कार्रवाई मॉड्यूल",
  nearestShelters: "निकटतम सुरक्षित आश्रय",
  openMap: "मैप खोलें →",
  firstAidPreparedness: "प्राथमिक चिकित्सा एवं तैयारी",
  manual: "मैनुअल →",

  findShelter: "आश्रय खोजें",
  findShelterDesc: "सुरक्षित स्थानों के लिए लाइव जीपीएस और ऑफलाइन नेविगेशन",
  reportHazard: "खतरे की रिपोर्ट करें",
  reportHazardDesc: "सड़क रुकावट, गिरे पेड़ और बाढ़ की सूचना दें",
  firstAidGuide: "प्राथमिक चिकित्सा गाइड",
  firstAidDesc: "सीपीआर और आपातकालीन चिकित्सा निर्देश",
  rescueTriage: "बचाव प्राथमिकता",
  rescueDesc: "फंसे नागरिकों के लिए AI प्राथमिकता बचाव",
  aiChatbot: "AI चैटबॉट",
  aiChatbotDesc: "आपकी भाषा में 24/7 आपदा प्रतिक्रिया सहायक",

  profileTitle: "उपयोगकर्ता प्रोफ़ाइल",
  fullName: "पूरा नाम",
  emailAddress: "ईमेल पता",
  phone: "फोन नंबर",
  currentLocation: "वर्तमान स्थान",
  accountStatus: "खाता स्थिति",
  emergencyId: "इमरजेंसी आईडी",
  editProfile: "प्रोफ़ाइल संपादित करें",
  saveProfile: "प्रोफ़ाइल सहेजें",
  locationManagement: "स्थान प्रबंधन",
  useGpsLocation: "वर्तमान GPS स्थान का उपयोग करें",
  selectLocationManually: "मैन्युअल रूप से स्थान चुनें",
  searchLocationPlaceholder: "शहर, जिला या पिन कोड खोजें...",

  settingsTitle: "आपातकालीन सेटिंग्स",
  emergencyContacts: "आपातकालीन संपर्क",
  notifications: "सूचनाएं",
  appearance: "रंग व थीम",
  offlineData: "ऑफलाइन डेटा",
  accessibility: "सुलभता",
  about: "ऐप के बारे में",
  disasterAlertsNotif: "आपदा अलर्ट",
  weatherAlertsNotif: "मौसम अलर्ट",
  communityReportsNotif: "समुदाय रिपोर्ट",
  browserNotif: "ब्राउज़र सूचनाएं",
  sosStatusUpdatesNotif: "SOS स्थिति अपडेट",
  lightMode: "लाइट मोड",
  darkMode: "डार्क मोड",
  systemTheme: "सिस्टम थीम",
  syncData: "डेटा सिंक करें",
  clearCache: "कैश साफ़ करें",
  voiceNav: "वॉयस नेविगेशन",
  textToSpeech: "टेक्स्ट-टू-स्पीच",
  speechToText: "स्पीच-टू-टेक्स्ट",
  highContrast: "हाई कन्ट्रास्ट",
  largeText: "बड़ा टेक्स्ट",
};

const tamil: Translations = {
  appName: "அலர்ட் AI",
  liveTag: "லைவ்",
  tagline: "பேரிடர் மேலாண்மை மையம்",
  searchPlaceholder: "பாதுகாப்பு மையங்கள், எச்சரிக்கைகளைத் தேடுக...",
  online: "ஆன்லைன்",
  offline: "ஆஃப்லைன்",
  sync: "சிங்க் செய்",
  sosButton: "SOS இயக்கு",

  navHome: "முகப்பு",
  navAlerts: "AI எச்சரிக்கைகள்",
  navShelters: "பாதுகாப்பு மையம்",
  navSos: "ஸ்மார்ட் SOS",
  navRescue: "மீட்பு முன்னுரிமை",
  navChat: "AI உதவியாளர்",
  navReporting: "புகார் செய்",
  navFirstAid: "முதலுதவி",
  navAdmin: "நிர்வாகம்",
  navSettings: "அமைப்புகள்",
  navProfile: "சுயவிவரம்",

  heroTitle: "பேரிடர் மேலாண்மை & ஸ்மார்ட் SOS மையம்",
  heroSub: "நிகழ்நேர பன்மொழி AI எச்சரிக்கை, GPS பாதுகாப்பு மைய வழிகாட்டல் மற்றும் அவசர SOS.",
  activateSos: "SOS இயக்கு",
  quickActionsTitle: "விரைவு செயல் தொகுதிகள்",
  nearestShelters: "அருகிலுள்ள பாதுகாப்பு மையங்கள்",
  openMap: "வரைபடம் திற →",
  firstAidPreparedness: "முதலுதவி & ஆயத்தம்",
  manual: "கையேடு →",

  findShelter: "மையம் காண்க",
  findShelterDesc: "பாதுகாப்பான இடங்களுக்கான ஜிபிஎஸ் & ஆஃப்லைன் வழித் தேடல்",
  reportHazard: "ஆபத்தை பதிவுசெய்",
  reportHazardDesc: "சாலை அடைப்பு, மரம் விழுந்தது மற்றும் வெள்ள அறிவிப்பு",
  firstAidGuide: "முதலுதவி கையேடு",
  firstAidDesc: "CPR மற்றும் அவசர மருத்துவ வழிமுறைகள்",
  rescueTriage: "மீட்பு முன்னுரிமை",
  rescueDesc: "சிக்கிய மக்களுக்கு AI முன்னுரிமை மீட்பு",
  aiChatbot: "AI சேட்பாட்",
  aiChatbotDesc: "உங்கள் மொழியில் 24/7 பேரிடர் உதவி மையம்",

  profileTitle: "பயனர் சுயவிவரம்",
  fullName: "முழு பெயர்",
  emailAddress: "மின்னஞ்சல் முகவரி",
  phone: "தொலைபேசி எண்",
  currentLocation: "தற்போதைய இருப்பிடம்",
  accountStatus: "கணக்கு நிலை",
  emergencyId: "அவசர ஐடி",
  editProfile: "சுயவிவரம் திருத்து",
  saveProfile: "சுயவிவரம் சேமி",
  locationManagement: "இருப்பிட நிர்வாகம்",
  useGpsLocation: "தற்போதைய GPS இருப்பிடத்தைப் பயன்படுத்து",
  selectLocationManually: "இருப்பிடத்தை தேர்வு செய்",
  searchLocationPlaceholder: "நகரம், மாவட்டம் அல்லது பின் கோட் தேடுக...",

  settingsTitle: "அவசர அமைப்புகள்",
  emergencyContacts: "அவசர தொடர்புகள்",
  notifications: "அறிவிப்புகள்",
  appearance: "தோற்றம்",
  offlineData: "ஆஃப்லைன் தரவு",
  accessibility: "அணுகல்தன்மை",
  about: "பற்றி",
  disasterAlertsNotif: "பேரிடர் எச்சரிக்கைகள்",
  weatherAlertsNotif: "வானிலை எச்சரிக்கைகள்",
  communityReportsNotif: "சமூக அறிக்கைகள்",
  browserNotif: "உலாவி அறிவிப்புகள்",
  sosStatusUpdatesNotif: "SOS நிலை தகவல்கள்",
  lightMode: "லைட் மோட்",
  darkMode: "டார்க் மோட்",
  systemTheme: "சிஸ்டம் தீம்",
  syncData: "தரவை ஒத்திசைக்க",
  clearCache: "கேச் நீக்கு",
  voiceNav: "குரல் வழிசெலுத்தல்",
  textToSpeech: "உரையிலிருந்து பேச்சு",
  speechToText: "பேச்சிலிருந்து உரை",
  highContrast: "அதிக மாறுபாடு",
  largeText: "பெரிய எழுத்துக்கள்",
};

const telugu: Translations = {
  appName: "అలర్ట్ AI",
  liveTag: "లైవ్",
  tagline: "విపత్తు నిర్వహణ కేంద్రం",
  searchPlaceholder: "ఆశ్రయం, హెచ్చరికలు శోధించండి...",
  online: "ఆన్‌లైన్",
  offline: "ఆఫ్‌లైన్",
  sync: "సింక్ చేయండి",
  sosButton: "SOS సక్రియం చేయండి",

  navHome: "హోమ్",
  navAlerts: "AI హెచ్చరికలు",
  navShelters: "సురక్షిత ఆశ్రయం",
  navSos: "స్మార్ట్ SOS",
  navRescue: "రక్షణ ప్రాధాన్యత",
  navChat: "AI సహాయకుడు",
  navReporting: "నివేదించండి",
  navFirstAid: "ప్రథమ చికిత్స",
  navAdmin: "అడ్మిన్",
  navSettings: "సెట్టింగ్‌లు",
  navProfile: "ప్రొఫైల్",

  heroTitle: "విపత్తు నిర్వహణ & స్మార్ట్ SOS కేంద్రం",
  heroSub: "రియల్ టైమ్ బహుభాషా AI అలర్టులు, GPS సురక్షిత ఆశ్రయం మరియు అత్యవసర SOS.",
  activateSos: "SOS సక్రియం చేయండి",
  quickActionsTitle: "త్వరిత చర్య మాడ్యూల్స్",
  nearestShelters: "సమీప సురక్షిత ఆశ్రయాలు",
  openMap: "మ్యాప్ తెరవండి →",
  firstAidPreparedness: "ప్రథమ చికిత్స & సిద్ధత",
  manual: "మాన్యువల్ →",

  findShelter: "ఆశ్రయం కనుగొనండి",
  findShelterDesc: "సురక్షిత ప్రాంతాలకు లైవ్ GPS & ఆఫ్‌లైన్ నావిగేషన్",
  reportHazard: "ప్రమాదాన్ని నివేదించండి",
  reportHazardDesc: "రోడ్డు అడ్డంకులు, చెట్లు పడటం మరియు వరదల సమాచారం",
  firstAidGuide: "ప్రథమ చికిత్స గైడ్",
  firstAidDesc: "CPR మరియు అత్యవసర వైద్య సూచనలు",
  rescueTriage: "రక్షణ ప్రాధాన్యత",
  rescueDesc: "చిక్కుకున్న పౌరులకు AI ప్రాధాన్యత రక్షణ",
  aiChatbot: "AI చాట్‌బాట్",
  aiChatbotDesc: "మీ భాషలో 24/7 విపత్తు సహాయకుడు",

  profileTitle: "వినియోగదారు ప్రొఫైల్",
  fullName: "పూర్తి పేరు",
  emailAddress: "ఇమెయిల్ చిరునామా",
  phone: "ఫోన్ నంబర్",
  currentLocation: "ప్రస్తుత ప్రాంతం",
  accountStatus: "ఖాతా స్థితి",
  emergencyId: "ఎమర్జెన్సీ ఐడీ",
  editProfile: "ప్రొఫైల్ సవరించండి",
  saveProfile: "ప్రొఫైల్ సేవ్ చేయండి",
  locationManagement: "ప్రాంత నిర్వహణ",
  useGpsLocation: "ప్రస్తుత GPS ప్రాంతాన్ని ఉపయోగించండి",
  selectLocationManually: "ప్రాంతాన్ని నేరుగా ఎంచుకోండి",
  searchLocationPlaceholder: "నగరం, జిల్లా లేదా పిన్ కోడ్ శోధించండి...",

  settingsTitle: "అత్యవసర సెట్టింగ్‌లు",
  emergencyContacts: "అత్యవసర పరిచయాలు",
  notifications: "నోటిఫికేషన్‌లు",
  appearance: "రూపము",
  offlineData: "ఆఫ్‌లైన్ డేటా",
  accessibility: "యాక్సెసిబిలిటీ",
  about: "గురించి",
  disasterAlertsNotif: "విపత్తు హెచ్చరికలు",
  weatherAlertsNotif: "వాతావరణ హెచ్చరికలు",
  communityReportsNotif: "కమ్యూనిటీ నివేదికలు",
  browserNotif: "బ్రౌజర్ నోటిఫికేషన్‌లు",
  sosStatusUpdatesNotif: "SOS స్థితి నవీకరణలు",
  lightMode: "లైట్ మోడ్",
  darkMode: "డార్క్ మోడ్",
  systemTheme: "సిస్టమ్ థీమ్",
  syncData: "డేటా సింక్ చేయండి",
  clearCache: "క్యాష్ క్లియర్ చేయండి",
  voiceNav: "వాయిస్ నావిగేషన్",
  textToSpeech: "టెక్స్ట్-టు-స్పీచ్",
  speechToText: "స్పీచ్-టు-టెక్స్ట్",
  highContrast: "హై కాంట్రాస్ట్",
  largeText: "పెద్ద అక్షరాలు",
};

export const translations: Record<Language, Translations> = {
  English: english,
  Kannada: kannada,
  Hindi: hindi,
  Tamil: tamil,
  Telugu: telugu,
  Malayalam: english,
  Marathi: english,
  Bengali: english,
  Gujarati: english,
  Spanish: english,
  French: english,
};

export function getTranslation(lang: Language): Translations {
  return translations[lang] || english;
}
