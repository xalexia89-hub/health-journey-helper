import { useState, useEffect, useCallback, useRef } from "react";

interface UseSpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

interface SpeechRecognitionResult {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  resetTranscript: () => void;
}

// Declare types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: {
    isFinal: boolean;
    [index: number]: {
      transcript: string;
      confidence: number;
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): SpeechRecognitionResult {
  const {
    language = "el-GR", // Greek by default
    continuous = true,
    interimResults = true,
    onResult,
    onError,
    onEnd,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check if Speech Recognition is supported
  const isSupported = typeof window !== "undefined" && 
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionAPI = 
      window.SpeechRecognition || window.webkitSpeechRecognition;
    
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptText = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcriptText;
        } else {
          interimText += transcriptText;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
        onResult?.(finalTranscript, true);
      }
      
      setInterimTranscript(interimText);
      if (interimText) {
        onResult?.(interimText, false);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      
      let errorMessage = "Σφάλμα αναγνώρισης φωνής";
      switch (event.error) {
        case "not-allowed":
          errorMessage = "Δεν επιτρέπεται η πρόσβαση στο μικρόφωνο";
          break;
        case "no-speech":
          errorMessage = "Δεν εντοπίστηκε ομιλία";
          break;
        case "network":
          errorMessage = "Σφάλμα δικτύου";
          break;
        case "audio-capture":
          errorMessage = "Δεν βρέθηκε μικρόφωνο";
          break;
      }
      
      onError?.(errorMessage);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
      onEnd?.();
    };

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [isSupported, language, continuous, interimResults, onResult, onError, onEnd]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    
    try {
      setTranscript("");
      setInterimTranscript("");
      recognitionRef.current.start();
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error("Failed to stop speech recognition:", error);
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
  };
}
