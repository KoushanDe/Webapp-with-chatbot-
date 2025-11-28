import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { MessageSquare, X, Send, Mic, MicOff, Sparkles, Globe } from 'lucide-react';
import { ChatMessage } from '../types';
import { generateSessionId, sendToWebhook } from '../services/chatService';

const LANGUAGES = [
  { code: 'en-IN', label: 'English' },
  { code: 'hi-IN', label: 'हिंदी' },
  { code: 'bn-IN', label: 'বাংলা' },
  { code: 'th-TH', label: 'ไทย' }
];

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(generateSessionId());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: "Hi there! I'm Roxy, your virtual assistant. I can help you book appointments or answer questions. Try saying 'Book a haircut for tomorrow'.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [voiceTranscript, setVoiceTranscript] = useState(''); // Separate state for live voice bubble
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-IN');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Refs to track state inside event listeners/timeouts without stale closures
  const isListeningRef = useRef(false);
  const handleSendMessageRef = useRef<(text?: string) => Promise<void>>(async () => {});

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, voiceTranscript, isOpen]);

  // Keep handleSendMessageRef updated
  useEffect(() => {
    handleSendMessageRef.current = handleSendMessage;
  });

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  // Update recognition language when state changes
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
            // Guard clause: If we've already stopped listening (e.g. sending msg), ignore late results
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
                    // Double check ref inside timeout
                    if (isListeningRef.current && currentText.trim()) {
                        handleSendMessageRef.current(currentText);
                        stopListening();
                    }
                }, 1000);
            }
        };

        recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            // Only stop if it's a fatal error, otherwise ignore (like 'no-speech' sometimes)
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
        setVoiceTranscript(''); // Clear if manually stopped
    } else {
        setInputValue('');
        setVoiceTranscript(''); // Start fresh
        
        isListeningRef.current = true;
        setIsListening(true);
        
        try {
            recognitionRef.current.start();
        } catch (e) {
            console.error("Error starting recognition:", e);
            // Sometimes it's already started
            recognitionRef.current.stop();
            setTimeout(() => recognitionRef.current.start(), 100);
        }
    }
  };

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputValue;
    
    if (!textToSend.trim()) return;

    // Immediately update refs to prevent race conditions
    isListeningRef.current = false;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();

    // Reset UI states
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
    // Send on Enter ONLY if no modifier keys are pressed
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !isListening) {
      e.preventDefault();
      handleSendMessage();
    }
    // Otherwise allow default behavior (insert new line)
  };

  const QuickAction = ({ label, prompt }: { label: string, prompt: string }) => (
    <button 
        onClick={() => handleSendMessage(prompt)}
        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full border border-gray-300 transition-colors whitespace-nowrap"
    >
        {label}
    </button>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'bg-zinc-800 rotate-90' : 'bg-salon-gold hover:bg-yellow-600'
        } text-white`}
        aria-label="Toggle Chat"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      <div
        className={`fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 z-40 origin-bottom-right border border-gray-200 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-zinc-900 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-salon-gold flex items-center justify-center">
                    <Sparkles size={20} className="text-white" />
                </div>
                <div>
                    <h3 className="font-serif font-semibold text-lg">Roxy Assistant</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <p className="text-xs text-gray-300 font-medium">Online</p>
                    </div>
                </div>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center gap-2 bg-zinc-800 rounded px-2 py-1 border border-zinc-700">
                <Globe size={14} className="text-salon-gold" />
                <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent text-white text-xs outline-none cursor-pointer border-none"
                    disabled={isListening} // Disable while listening to prevent errors
                >
                    {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code} className="bg-zinc-800 text-white">
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
                        className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                            msg.sender === 'user'
                                ? 'bg-salon-gold text-white rounded-br-none'
                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                        }`}
                    >
                        {msg.text}
                    </div>
                </div>
            ))}
            
            {/* Live Voice Transcript Bubble */}
            {isListening && voiceTranscript && (
                 <div className="flex justify-end">
                    <div className="max-w-[80%] p-3 rounded-2xl rounded-br-none text-sm leading-relaxed bg-salon-gold/50 text-white italic border-2 border-salon-gold animate-pulse shadow-sm">
                        {voiceTranscript}
                        <span className="inline-block w-1 h-1 bg-white rounded-full ml-1 animate-bounce"></span>
                    </div>
                 </div>
            )}

            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex items-center">
                        <span className="text-xs text-gray-500 font-medium mr-1">Typing</span>
                        <span className="flex space-x-0.5 mt-1">
                            <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
                        </span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {!isLoading && !isListening && messages.length < 5 && (
            <div className="px-4 py-2 bg-gray-50 flex gap-2 overflow-x-auto scrollbar-hide border-t border-gray-100">
                <QuickAction label="📅 Book Appt" prompt="I want to book an appointment" />
                <QuickAction label="💰 Prices" prompt="What are your prices?" />
                <QuickAction label="📍 Location" prompt="Where are you located?" />
            </div>
        )}

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
            <div className={`flex items-end gap-2 rounded-3xl px-4 py-2 transition-all duration-300 ${isListening ? 'bg-red-50 ring-1 ring-red-200' : 'bg-gray-100'}`}>
                <textarea
                    ref={textareaRef}
                    value={isListening ? '' : inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    readOnly={isListening}
                    placeholder={isListening ? "Listening..." : "Type your message..."}
                    rows={1}
                    className={`flex-1 bg-transparent outline-none text-sm placeholder-gray-500 resize-none overflow-hidden py-2 scrollbar-hide ${isListening ? 'text-red-500' : 'text-gray-800'}`}
                    style={{ minHeight: '20px', maxHeight: '120px' }}
                />
                
                <button 
                    onClick={toggleListening}
                    className={`p-2 rounded-full transition-all duration-300 mb-1 ${isListening ? 'bg-red-500 text-white scale-110 shadow-md' : 'hover:bg-gray-200 text-gray-500'}`}
                    title="Voice Input"
                >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                {!isListening && (
                    <button
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim() || isLoading}
                        className="p-2 mb-1 text-salon-gold disabled:opacity-50 hover:text-yellow-600 transition-colors"
                    >
                        <Send size={18} />
                    </button>
                )}
            </div>
        </div>
      </div>
    </>
  );
};