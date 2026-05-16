import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2, Bot, User, Sparkles } from 'lucide-react';
import styles from './ChatBot.module.css';

const SYSTEM_PROMPT = `You are SkyBot, the friendly and knowledgeable AI assistant for MyCheapFlights — a world-class flight search platform created for the USA-Uganda Science & Tech Bootcamp. 

You help users:
- Find cheap flights and best deals
- Understand how to book flights step by step
- Compare airlines, cabin classes, and prices
- Answer travel questions (visas, baggage, layovers, etc.)
- Guide them through the MyCheapFlights platform
- Provide tips for saving money on flights
- Answer FAQs about the platform

You are warm, professional, and concise. You always offer actionable suggestions. When users ask about specific flights, remind them to use the search tool on the platform. Keep responses short (under 150 words) and friendly. Use emojis sparingly but effectively.`;

const QUICK_REPLIES = [
  "How do I find cheap flights?",
  "What's the best time to book?",
  "How do I compare airlines?",
  "Tell me about baggage rules",
  "How do I book a round trip?",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey there! ✈️ I'm **SkyBot**, your personal travel AI. I'm here to help you find the best flight deals, answer travel questions, and guide you through MyCheapFlights.\n\nWhat can I help you with today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, open, minimized]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;

    setInput('');
    setShowQuickReplies(false);
    setLoading(true);

    const newMessages = [
      ...messages,
      { role: 'user', content: userMsg, timestamp: new Date() }
    ];
    setMessages(newMessages);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          system: SYSTEM_PROMPT,
          messages: newMessages
            .filter(m => m.role !== 'system')
            .map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "I'm having trouble connecting right now. Please try again!";

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: reply,
        timestamp: new Date()
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having a brief connection issue. Try asking me again or use the search form to find flights! ✈️",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Chat toggle button */}
      <button
        className={`${styles.toggleBtn} ${open ? styles.toggleOpen : ''}`}
        onClick={() => { setOpen(v => !v); setMinimized(false); }}
        aria-label="Open chat assistant"
      >
        {open ? <X size={22} /> : (
          <>
            <Bot size={22} />
            <span className={styles.togglePulse} />
          </>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className={`${styles.chatWindow} ${minimized ? styles.minimized : ''} glass`}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.botInfo}>
              <div className={styles.botAvatar}>
                <Bot size={18} />
                <span className={styles.onlineDot} />
              </div>
              <div>
                <p className={styles.botName}>SkyBot <span className={styles.aiBadge}>AI</span></p>
                <p className={styles.botStatus}>
                  <span className={styles.statusDot} />
                  Online · Flight Expert
                </p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                className={styles.headerBtn}
                onClick={() => setMinimized(v => !v)}
                aria-label="Minimize chat"
              >
                <Minimize2 size={15} />
              </button>
              <button
                className={styles.headerBtn}
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className={styles.messages}>
                {messages.map((msg, i) => (
                  <div key={i} className={`${styles.msgRow} ${msg.role === 'user' ? styles.userRow : ''}`}>
                    {msg.role === 'assistant' && (
                      <div className={styles.botAvatarSm}>
                        <Bot size={12} />
                      </div>
                    )}
                    <div className={`${styles.bubble} ${msg.role === 'user' ? styles.userBubble : styles.botBubble}`}>
                      <p dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                      <span className={styles.msgTime}>{formatTime(msg.timestamp)}</span>
                    </div>
                    {msg.role === 'user' && (
                      <div className={styles.userAvatarSm}>
                        <User size={12} />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className={styles.msgRow}>
                    <div className={styles.botAvatarSm}><Bot size={12} /></div>
                    <div className={`${styles.bubble} ${styles.botBubble} ${styles.typingBubble}`}>
                      <span className={styles.dot} />
                      <span className={styles.dot} />
                      <span className={styles.dot} />
                    </div>
                  </div>
                )}

                {/* Quick replies */}
                {showQuickReplies && messages.length === 1 && (
                  <div className={styles.quickReplies}>
                    <p className={styles.quickLabel}><Sparkles size={12} /> Quick questions:</p>
                    {QUICK_REPLIES.map(q => (
                      <button
                        key={q}
                        className={styles.quickBtn}
                        onClick={() => sendMessage(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className={styles.inputArea}>
                <input
                  ref={inputRef}
                  className={styles.chatInput}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask about flights, deals, booking..."
                  disabled={loading}
                />
                <button
                  className={styles.sendBtn}
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>

              <p className={styles.footer}>Powered by Claude AI · MyCheapFlights</p>
            </>
          )}
        </div>
      )}
    </>
  );
}
