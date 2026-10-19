import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  HelpCircle, 
  FileText, 
  Info
} from 'lucide-react';

export function CleanBotModal({ 
  isOpen, 
  onClose, 
  darkMode 
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I am CleanBot, your CleanCity AI civic guidance assistant. You can ask me how to report waste or road hazards in Phagwara, Jalandhar, Ludhiana, or Amritsar, how automated complaint generation works, or how to manage demo reports in the dashboard.",
      time: "Just now"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "How do I report an issue in Phagwara?",
    "How does the complaint generator work?",
    "Which cities are covered in the demo?",
    "Are these complaints submitted to the government?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: "Just now"
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "";
      const lower = query.toLowerCase();

      if (lower.includes("phagwara") || lower.includes("report")) {
        botResponse = "📝 **Reporting in Phagwara**:\n1. Click 'Report Issue' in the navigation bar.\n2. Select **Phagwara** and choose your locality (e.g. Model Town, Law Gate, Hadiabad, or Satnampura).\n3. Pick the issue category (Potholes, Garbage, Open Drains, etc.) and write a brief description.\n4. Click 'Draft Formal Complaint' to auto-generate a structured letter addressed to the Municipal Commissioner, then click 'Save Report to Dashboard'.";
      } else if (lower.includes("complaint") || lower.includes("generator") || lower.includes("llm")) {
        botResponse = "⚖️ **Complaint Generator Engine**:\nCleanCity AI formats citizen descriptions into structured administrative grievance letters adhering to Punjab Municipal Corporation protocols. If a Gemini API key (`VITE_GEMINI_API_KEY`) is configured in `.env`, it invokes the model; otherwise, it relies on our built-in formal legal fallback template. You can copy the generated text for your records.";
      } else if (lower.includes("government") || lower.includes("submit") || lower.includes("real")) {
        botResponse = "⚠️ **Transparency Notice**:\nNo, CleanCity AI is an academic and evaluation prototype. It does **not** transmit complaints to municipal government servers without authorized API credentials and government integration. All ~200 baseline reports are synthetic demonstrations, and newly submitted reports are saved to your browser session storage.";
      } else if (lower.includes("cit") || lower.includes("punjab") || lower.includes("covered")) {
        botResponse = "🏙️ **Covered Cities**:\n1. **Phagwara** (Model Town, Law Gate, Hadiabad, Satnampura, Palahi Rd)\n2. **Jalandhar** (Model Town, Civil Lines, Rama Mandi, Cantt, Jyoti Chowk)\n3. **Ludhiana** (Sarabha Nagar, Focal Point, Ghumar Mandi, Dugri)\n4. **Amritsar** (Ranjit Avenue, Heritage Street, Lawrence Rd, Majitha Rd)\nThe dashboard hosts ~50 synthetic reports per city for testing.";
      } else {
        botResponse = `Thanks for asking about "${query}". You can use CleanCity AI to file issues, filter ~200 synthetic reports in the dashboard by city and status, or update demo resolution stages.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse,
          time: "Just now"
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl flex flex-col h-[560px] overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Top Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          darkMode ? 'bg-slate-800/80 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[2px] flex items-center justify-center">
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm sm:text-base">CleanBot Assistant</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  Demo
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Civic Guidance & Complaint Advice</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
              darkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs sm:text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-none'
                  : darkMode
                    ? 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none'
                    : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none'
              }`}>
                <div className="whitespace-pre-line">{msg.text}</div>
                <div className={`text-[10px] mt-1 font-mono ${
                  msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'
                }`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-1.5 p-3 rounded-2xl bg-slate-800/60 w-16 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.15s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.3s]" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Question Pills */}
        <div className={`p-2.5 border-t overflow-x-auto flex space-x-2 scrollbar-none ${
          darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className={`px-3 py-1 rounded-xl text-[11px] font-medium border shrink-0 transition-colors ${
                darkMode
                  ? 'border-slate-700 bg-slate-800 text-slate-300 hover:border-emerald-500/50 hover:text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-emerald-500 hover:text-slate-900 shadow-xs'
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className={`p-3 border-t flex items-center space-x-2 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about reporting, complaints, or dashboard..."
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-transparent border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              darkMode ? 'border-slate-700 text-white placeholder-slate-500' : 'border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
