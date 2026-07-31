// Web Speech API Helpers for Accessibility

export function getSpeechLangCode(lang: string = "English"): string {
  const l = lang.toLowerCase();
  if (l.includes("kannada")) return "kn-IN";
  if (l.includes("hindi")) return "hi-IN";
  if (l.includes("tamil")) return "ta-IN";
  if (l.includes("telugu")) return "te-IN";
  if (l.includes("malayalam")) return "ml-IN";
  if (l.includes("marathi")) return "mr-IN";
  if (l.includes("bengali")) return "bn-IN";
  if (l.includes("gujarati")) return "gu-IN";
  if (l.includes("spanish")) return "es-ES";
  if (l.includes("french")) return "fr-FR";
  return "en-US";
}

export function speakText(text: string, lang: string = "en-US"): void {
  if (!("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported in this browser.");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set voice language code
  utterance.lang = getSpeechLangCode(lang);

  utterance.rate = 0.95; // slightly deliberate speed for clarity in emergencies
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export interface VoiceRecognitionOptions {
  onResult: (text: string) => void;
  onError?: (error: any) => void;
  onEnd?: () => void;
  lang?: string;
}

export function startVoiceRecognition(options: VoiceRecognitionOptions): any {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (options.onError) options.onError("Voice recognition is not supported in this browser.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = getSpeechLangCode(options.lang || "English");

  recognition.onresult = (event: any) => {
    const transcript = event.results[0]?.[0]?.transcript;
    if (transcript) {
      options.onResult(transcript);
    }
  };

  recognition.onerror = (event: any) => {
    console.error("Speech recognition error:", event.error);
    if (options.onError) options.onError(event.error);
  };

  recognition.onend = () => {
    if (options.onEnd) options.onEnd();
  };

  recognition.start();
  return recognition;
}
