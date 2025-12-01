import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { MessageSquare, X, Send, Mic, MicOff, Stethoscope, Globe, User, Sparkles } from 'lucide-react';
import { generateSessionId, sendToWebhook } from '../services/chatService';
import { generateGeminiSuggestions } from '../services/geminiService';
import { ChatMessage, QuickReply } from '../types';

const LANGUAGES = [
  { code: 'en-IN', label: 'English' },
  { code: 'hi-IN', label: 'हिंदी' },
  { code: 'bn-IN', label: 'বাংলা' },
  { code: 'th-TH', label: 'ไทย' }
];

const DEFAULT_SUGGESTIONS: QuickReply[] = [
    { label: "✨ New Patient Special ($199)", prompt: "I want to book the New Patient Special" },
    { label: "🚑 Emergency/Pain", prompt: "I have a dental emergency. My tooth hurts." },
    { label: "🦷 Invisalign Info", prompt: "Tell me about Invisalign and financing." },
    { label: "🛡️ Do you take Insurance?", prompt: "Do you accept insurance?" }
];

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(generateSessionId());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: "Welcome to Dr. Smith's! I'm Sarah. Are you a new or returning patient?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-IN');
  const [suggestions, setSuggestions] = useState<QuickReply[]>(DEFAULT_SUGGESTIONS);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const isListeningRef = useRef(false);
  const handleSendMessageRef = useRef<(text?: string) => Promise<void>>(async () => {});

  // --- Fallback Regex Logic (used if Gemini fails or key is missing) ---
  const getRegexSuggestions = (lastBotMessage: string): QuickReply[] => {
      const lowerMsg = lastBotMessage.toLowerCase();
      
      if (lowerMsg.includes("welcome to dr. smith's") || lowerMsg.includes("new or returning patient")) {
          return DEFAULT_SUGGESTIONS;
      }

      const newSuggestions: QuickReply[] = [];
      const questionPhrases = ["would you", "do you want", "shall i", "can i", "should we", "ready to"];
      const isQuestion = lastBotMessage.trim().endsWith('?') || questionPhrases.some(p => lowerMsg.includes(p));

      if (isQuestion) {
          newSuggestions.push(
              { label: "✅ Yes", prompt: "Yes" },
              { label: "❌ No", prompt: "No" }
          );
      }

      const timeRegex = /\b((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))\b/g;
      const foundTimes = lastBotMessage.match(timeRegex);
      
      if (foundTimes && foundTimes.length > 0) {
          foundTimes.slice(0, 3).forEach(time => {
              newSuggestions.push({
                  label: `📅 Book ${time}`,
                  prompt: `I would like to book the appointment at ${time}.`
              });
          });
      }

      const mappings = [
          {
              keywords: ['price', 'cost', 'dollar', '$', 'expensive', 'quote', 'money'],
              replies: [
                  { label: "💳 Payment Plans?", prompt: "Do you offer financing?" },
                  { label: "🛡️ Insurance", prompt: "Do you accept insurance?" }
              ]
          },
          {
              keywords: ['pain', 'hurt', 'emergency', 'broken'],
              replies: [
                  { label: "🚑 Book Emergency", prompt: "I need an emergency appointment." },
                  { label: "📞 Call Clinic", prompt: "Please provide your phone number." }
              ]
          },
          {
              keywords: ['location', 'address', 'where'],
              replies: [
                  { label: "📍 Directions", prompt: "Send me the location map." }
              ]
          }
      ];

      mappings.forEach(map => {
          if (map.keywords.some(k => lowerMsg.includes(k))) {
              newSuggestions.push(...map.replies);
          }
      });

      // Dedupe
      const unique = newSuggestions.filter((v, i, a) => a.findIndex(t => (t.label === v.label)) === i);
      return unique.length > 0 ? unique.slice(0, 5) : DEFAULT_SUGGESTIONS;
  };

  // --- Main Suggestion Handler ---
  const updateSmartSuggestions = async (lastBotMessage: string) => {
      // 1. Try Gemini
      const aiSuggestions = await generateGeminiSuggestions(lastBotMessage, DEFAULT_SUGGESTIONS);
      
      if (aiSuggestions && aiSuggestions.length > 0) {
          setSuggestions(aiSuggestions);
      } else {
          // 2. Fallback to Regex if AI fails/returns empty
          const fallback = getRegexSuggestions(lastBotMessage);
          setSuggestions(fallback);
      }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  // Auto-scroll when messages update, typing indicator appears, or suggestions change (resize)
  useEffect(() => {
    if (isOpen) {
        // Add a small delay to ensure DOM has updated (e.g. typing indicator rendered)
        const timeoutId = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timeoutId);
    }
  }, [messages, isLoading, isOpen, suggestions]);

  // Handle suggestions separately
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender === 'bot') {
        updateSmartSuggestions(lastMsg.text);
    }
  }, [messages]);

  useEffect(() => {
    handleSendMessageRef.current = handleSendMessage;
  });

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
  }, [language]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = language;

        recognitionRef.current.onresult = (event: any) => {
            if (!isListeningRef.current) return;

            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            
            const currentText = finalTranscript || interimTranscript;

            if (currentText) {
                setVoiceTranscript(currentText);

                if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

                silenceTimerRef.current = setTimeout(() => {
                    if (isListeningRef.current && currentText.trim()) {
                        handleSendMessageRef.current(currentText);
                        stopListening();
                    }
                }, 1000);
            }
        };

        recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            if (event.error !== 'no-speech') {
                stopListening();
            }
        };
    }
    
    return () => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const stopListening = () => {
      isListeningRef.current = false;
      setIsListening(false);
      
      if (recognitionRef.current) {
          recognitionRef.current.stop();
      }
      
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
        alert("Your browser does not support speech recognition.");
        return;
    }

    if (isListening) {
        stopListening();
        setVoiceTranscript(''); 
    } else {
        setInputValue('');
        setVoiceTranscript(''); 
        
        isListeningRef.current = true;
        setIsListening(true);
        
        try {
            recognitionRef.current.start();
        } catch (e) {
            console.error("Error starting recognition:", e);
            recognitionRef.current.stop();
            setTimeout(() => recognitionRef.current.start(), 100);
        }
    }
  };

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputValue;
    
    if (!textToSend.trim()) return;

    isListeningRef.current = false;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();

    setVoiceTranscript(''); 
    setInputValue('');
    setIsListening(false);
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setSuggestions([]);

    const responseText = await sendToWebhook({
        sessionId,
        message: userMsg.text
    });

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: responseText,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !isListening) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 shadow-2xl transition-all duration-300 ease-in-out flex items-center justify-center gap-2 ${
          isOpen 
          ? 'w-12 h-12 rounded-full bg-gray-800 text-white hover:bg-gray-700 hover:scale-105' 
          : 'px-6 py-4 rounded-full bg-dental-teal text-white hover:bg-teal-700 hover:scale-105'
        }`}
        aria-label="Toggle Chat"
      >
        {isOpen ? (
            <X size={24} className="animate-in fade-in zoom-in duration-300" />
        ) : (
            <>
                <MessageSquare size={24} />
                <span className="font-semibold text-sm whitespace-nowrap animate-in fade-in slide-in-from-right-2 duration-300">Chat with Assistant</span>
            </>
        )}
      </button>

      <div
        className={`fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 z-40 origin-bottom-right border border-gray-200 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-dental-teal text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                    <User size={20} className="text-white" />
                </div>
                <div>
                    <h3 className="font-serif font-semibold text-lg">Dr. Smith's Support</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        <p className="text-xs text-teal-100 font-medium">Online</p>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-2 bg-teal-800/50 rounded px-2 py-1 border border-teal-600">
                <Globe size={14} className="text-teal-100" />
                <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent text-white text-xs outline-none cursor-pointer border-none"
                    disabled={isListening} 
                >
                    {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code} className="bg-gray-800 text-white">
                            {lang.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 scrollbar-hide">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                        className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                            msg.sender === 'user'
                                ? 'bg-dental-teal text-white rounded-br-none'
                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                        }`}
                    >
                        {msg.text}
                    </div>
                </div>
            ))}
            
            {isListening && voiceTranscript && (
                 <div className="flex justify-end">
                    <div className="max-w-[80%] p-3 rounded-2xl rounded-br-none text-sm leading-relaxed bg-dental-teal/50 text-white italic border-2 border-dental-teal animate-pulse shadow-sm">
                        {voiceTranscript}
                        <span className="inline-block w-1 h-1 bg-white rounded-full ml-1 animate-bounce"></span>
                    </div>
                 </div>
            )}

            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 flex items-center">
                        <span className="text-xs text-gray-500 font-medium mr-1">Typing</span>
                        <span className="flex space-x-0.5 mt-1">
                            <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
                        </span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} className="h-px w-full" />
        </div>

        {/* Suggestions */}
        {!isLoading && !isListening && suggestions.length > 0 && (
            <div className="px-4 py-3 bg-white flex gap-2 overflow-x-auto scrollbar-hide border-t border-gray-100">
                {suggestions.map((action, idx) => (
                    <button 
                        key={idx}
                        onClick={() => handleSendMessage(action.prompt)}
                        className="text-xs bg-gray-50 hover:bg-dental-light text-dental-teal font-medium px-3 py-1.5 rounded-full border border-gray-200 hover:border-dental-teal transition-all whitespace-nowrap flex items-center gap-1 shrink-0"
                    >
                        {idx === 0 && <Sparkles size={10} className="text-yellow-500" />} 
                        {action.label}
                    </button>
                ))}
            </div>
        )}

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-100">
            <div className={`flex items-end gap-2 rounded-[24px] px-2 py-1 transition-all duration-200 border ${isListening ? 'bg-red-50 border-red-200' : 'bg-gray-100 border-transparent focus-within:bg-white focus-within:ring-2 focus-within:ring-dental-teal/20 focus-within:border-dental-teal'}`}>
                <textarea
                    ref={textareaRef}
                    value={isListening ? '' : inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    readOnly={isListening}
                    placeholder={isListening ? "Listening..." : "Type a message..."}
                    rows={1}
                    className={`flex-1 bg-transparent outline-none text-sm placeholder-gray-400 resize-none overflow-hidden py-2 px-2 scrollbar-hide leading-relaxed ${isListening ? 'text-red-500' : 'text-gray-800'}`}
                    style={{ minHeight: '36px', maxHeight: '120px' }}
                />
                
                <div className="flex gap-1 pb-1 pr-1.5">
                    <button 
                        onClick={toggleListening}
                        className={`p-1.5 rounded-full transition-all duration-200 ${isListening ? 'bg-red-500 text-white shadow-lg animate-pulse' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'}`}
                        title="Voice Input"
                    >
                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>

                    {!isListening && (
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim() || isLoading}
                            className={`p-1.5 rounded-full transition-all duration-200 ${inputValue.trim() ? 'bg-dental-teal text-white shadow-md transform hover:scale-105' : 'text-gray-300'}`}
                        >
                            <Send size={18} className={inputValue.trim() ? 'ml-0.5' : ''} /> 
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </>
  );
};