import { useState } from "react";

export function useVoiceAssistant(role: string) {
  const [listening, setListening] = useState(false);
  const [response, setResponse] = useState("");

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;

      const res = await fetch("http://localhost:9000/api/voice/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({ query: transcript, role })
      });

      const text = await res.text();
      setResponse(text);

      // Speak response aloud
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    };

    recognition.start();
  };

  return { listening, response, startListening };
}
