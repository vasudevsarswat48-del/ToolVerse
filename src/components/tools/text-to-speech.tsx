import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

export default function TextToSpeech() {
  const [text, setText] = useState("Hello from TulEra.");
  const [rate, setRate] = useState(1);
  const speak = () => {
    if (!("speechSynthesis" in window)) return alert("Not supported in this browser");
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    window.speechSynthesis.speak(u);
  };
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={6} className="code-output" />
      <label className="text-sm" style={{display:"block"}}>
        <span className="text-muted">Speed: {rate.toFixed(1)}x</span>
        <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={e=>setRate(Number(e.target.value))} className="w-full mt-2" />
      </label>
      <div className="flex flex-wrap gap-2">
        <ActionButton onClick={speak}>Speak</ActionButton>
        <ActionButton variant="secondary" onClick={()=>window.speechSynthesis?.cancel()}>Stop</ActionButton>
      </div>
    </div>
  );
}
