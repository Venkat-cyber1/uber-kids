import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Search, Bell, ChevronRight, Home, Clock,
  Phone, MessageSquare, Video, Camera, Mic,
  PhoneOff, AlertTriangle, CheckCircle,
  User, Activity, ArrowUpDown, Calendar,
  ChevronLeft, Eye, Volume2, Send, Settings,
  Shield, Star, LogOut, MapPin
} from 'lucide-react';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  black: '#000000', white: '#FFFFFF',
  surface: '#F6F6F6', surfaceDark: '#EEEEEE',
  textSecondary: '#545454', textTertiary: '#AAAAAA',
  safe: '#198754', blue: '#276EF1',
  alert: '#FFC043', danger: '#E11900',
  safeBg: '#F0FFF4', alertBg: '#FFFBEB', dangerBg: '#FFF0EE',
};

// ─── Primitive components ─────────────────────────────────────────────────────
function StatusBar({ dark = false, green = false, red = false }) {
  const bg = red ? C.danger : green ? C.safe : dark ? C.black : C.white;
  const color = (dark || green || red) ? C.white : C.black;
  return (
    <div style={{ height: 44, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
      <span style={{ fontSize: 12, fontWeight: 500, color }}>9:41</span>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color, opacity: 0.8 }}>●●●</span>
        <span style={{ fontSize: 10, color, opacity: 0.8 }}>WiFi</span>
        <span style={{ fontSize: 10, color, opacity: 0.8 }}>⚡</span>
      </div>
    </div>
  );
}

function NavBar({ title, onBack, green = false }) {
  const bg = green ? C.safe : C.white;
  const color = green ? C.white : C.black;
  return (
    <div style={{ height: 52, background: bg, borderBottom: green ? 'none' : `1px solid ${C.surfaceDark}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, flexShrink: 0 }}>
      {onBack && (
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} color={color} />
        </button>
      )}
      <span style={{ flex: 1, fontSize: 16, fontWeight: 600, color }}>{title}</span>
    </div>
  );
}

function BottomNav({ active, go }) {
  const tabs = [
    { id: 'home', label: 'Home', screen: 'S3', Icon: Home },
    { id: 'activity', label: 'Activity', screen: 'S14', Icon: Activity },
    { id: 'account', label: 'Account', screen: 'S15', Icon: User },
  ];
  return (
    <div style={{ background: C.white, borderTop: `1px solid ${C.surfaceDark}`, height: 56, display: 'flex', flexShrink: 0 }}>
      {tabs.map(({ id, label, screen, Icon }) => {
        const isActive = active === id;
        return (
          <button key={id} onClick={() => go(screen)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', gap: 3 }}>
            <Icon size={20} color={isActive ? C.black : C.textTertiary} />
            <span style={{ fontSize: 11, fontWeight: 500, color: isActive ? C.black : C.textTertiary }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function PrimaryBtn({ label, onClick }) {
  return (
    <button onClick={onClick} style={{ width: '100%', height: 52, background: C.black, color: C.white, fontSize: 15, fontWeight: 600, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
      {label}
    </button>
  );
}

function SecondaryBtn({ label, onClick, red = false }) {
  return (
    <button onClick={onClick} style={{ width: '100%', height: 52, background: C.white, color: red ? C.danger : C.black, fontSize: 15, fontWeight: 600, borderRadius: 8, border: `1.5px solid ${red ? C.danger : C.black}`, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
      {label}
    </button>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: C.white, borderRadius: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.08)', padding: 16, ...style }}>{children}</div>;
}

function SurfaceCard({ children, style = {} }) {
  return <div style={{ background: C.surface, borderRadius: 12, padding: 16, ...style }}>{children}</div>;
}

function Badge({ label, variant = 'neutral' }) {
  const map = {
    safe: { bg: C.safeBg, color: C.safe },
    danger: { bg: C.dangerBg, color: C.danger },
    alert: { bg: C.alertBg, color: '#92400E' },
    neutral: { bg: C.surface, color: C.textSecondary },
    black: { bg: C.black, color: C.white },
  };
  const s = map[variant] || map.neutral;
  return <span style={{ background: s.bg, color: s.color, borderRadius: 4, fontSize: 11, fontWeight: 600, padding: '3px 8px', textTransform: 'uppercase', letterSpacing: 0.3, display: 'inline-block', whiteSpace: 'nowrap' }}>{label}</span>;
}

function Chip({ label, selected, onClick }) {
  return (
    <button onClick={onClick} style={{ background: selected ? C.black : C.surface, color: selected ? C.white : C.black, borderRadius: 100, padding: '8px 16px', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'DM Sans, sans-serif' }}>
      {label}
    </button>
  );
}

function Label({ text }) {
  return <span style={{ fontSize: 11, fontWeight: 500, color: C.textTertiary, letterSpacing: 0.5, textTransform: 'uppercase' }}>{text}</span>;
}

function Divider() {
  return <div style={{ height: 1, background: C.surfaceDark, margin: '12px 0' }} />;
}

function Avatar({ letter, size = 40, bg = C.surface, color = C.black }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(size * 0.38), fontWeight: 600, flexShrink: 0 }}>
      {letter}
    </div>
  );
}

function BottomBar({ children }) {
  return <div style={{ background: C.white, padding: '12px 20px 20px', borderTop: `1px solid ${C.surfaceDark}`, flexShrink: 0 }}>{children}</div>;
}

function InputLabel({ text }) {
  return <div style={{ fontSize: 11, fontWeight: 500, color: C.textTertiary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>{text}</div>;
}

function ProgressDots({ active, total = 4 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '8px 0 20px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i + 1 === active ? C.black : C.surfaceDark }} />
      ))}
    </div>
  );
}

// ─── OTP Input ────────────────────────────────────────────────────────────────
function OTPInput({ value, onChange }) {
  const r0 = useRef(), r1 = useRef(), r2 = useRef(), r3 = useRef();
  const refs = [r0, r1, r2, r3];

  const handle = (i, e) => {
    const v = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...value]; next[i] = v; onChange(next);
    if (v && i < 3) refs[i + 1].current?.focus();
  };

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs[i - 1].current?.focus();
  };

  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
      {value.map((d, i) => (
        <input key={i} ref={refs[i]} value={d} onChange={e => handle(i, e)} onKeyDown={e => handleKey(i, e)}
          maxLength={1} inputMode="numeric"
          style={{ width: 58, height: 58, flexShrink: 0, borderRadius: 10, background: d ? C.black : C.white, border: `1.5px solid ${d ? 'transparent' : C.surfaceDark}`, textAlign: 'center', fontSize: 24, fontWeight: 700, color: d ? C.white : C.textTertiary, fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box', boxShadow: d ? 'none' : '0 1px 3px rgba(0,0,0,0.06)' }} />
      ))}
    </div>
  );
}

// ─── Dark Map SVG ─────────────────────────────────────────────────────────────
function MapSVG({ height = 200, showCar = true, deviation = false, sosDot = false }) {
  return (
    <div style={{ height, borderRadius: 12, overflow: 'hidden', position: 'relative', background: '#1A1A1A', flexShrink: 0 }}>
      <svg width="100%" height="100%" viewBox="0 0 350 200" preserveAspectRatio="xMidYMid slice">
        <rect width="350" height="200" fill="#1A1A1A" />
        <line x1="0" y1="80" x2="350" y2="80" stroke="#2A2A2A" strokeWidth="8" />
        <line x1="0" y1="140" x2="350" y2="140" stroke="#2A2A2A" strokeWidth="6" />
        <line x1="80" y1="0" x2="80" y2="200" stroke="#2A2A2A" strokeWidth="6" />
        <line x1="200" y1="0" x2="200" y2="200" stroke="#2A2A2A" strokeWidth="8" />
        <line x1="300" y1="0" x2="300" y2="200" stroke="#2A2A2A" strokeWidth="5" />
        {deviation && <path d="M 40 160 Q 100 80 200 80 L 320 80" stroke="#555" strokeWidth="3" fill="none" strokeDasharray="8,4" />}
        <path d={deviation ? "M 40 160 Q 80 140 120 140 L 260 80 L 320 80" : "M 40 160 Q 130 80 200 80 L 320 80"} stroke={C.blue} strokeWidth="3" fill="none" />
        <circle cx="40" cy="160" r="7" fill={C.safe} /><circle cx="40" cy="160" r="3.5" fill="white" />
        <circle cx="320" cy="80" r="7" fill={C.black} /><circle cx="320" cy="80" r="3.5" fill="white" />
        {sosDot && <>
          <circle cx="175" cy="120" r="18" fill={C.danger} opacity="0.25" className="pulse-dot" />
          <circle cx="175" cy="120" r="9" fill={C.danger} />
        </>}
        {showCar && !sosDot && (
          <g className="car-animate" transform="translate(165, 92)">
            <rect x="-10" y="-6" width="20" height="13" rx="4" fill="white" />
            <rect x="-6" y="-4" width="12" height="5" rx="2" fill="#333" />
            <circle cx="-6" cy="7" r="2.5" fill="#444" />
            <circle cx="6" cy="7" r="2.5" fill="#444" />
          </g>
        )}
        {deviation && <>
          <text x="145" y="72" fontSize="9" fill="#888" fontFamily="DM Sans">Expected</text>
          <text x="130" y="135" fontSize="9" fill={C.blue} fontFamily="DM Sans">Actual route</text>
        </>}
      </svg>
      {!sosDot && (
        <div style={{ position: 'absolute', bottom: 10, left: 10, background: C.white, borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, color: C.black, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
          {deviation ? '8 min' : '14 min'}
        </div>
      )}
      {showCar && !deviation && !sosDot && (
        <div style={{ position: 'absolute', top: 10, right: 10, background: C.white, borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: C.black, display: 'flex', alignItems: 'center', gap: 5 }}>
          <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: C.safe, display: 'inline-block' }} />
          LIVE
        </div>
      )}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="screen-enter" style={{ position: 'absolute', bottom: 80, left: 20, right: 20, background: '#1A1A1A', color: C.white, borderRadius: 10, padding: '12px 16px', fontSize: 14, fontWeight: 500, zIndex: 600, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.35)', pointerEvents: 'none' }}>
      {message}
    </div>
  );
}

// ─── Call Overlay ─────────────────────────────────────────────────────────────
function CallOverlay({ onClose }) {
  const [sec, setSec] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSec(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="screen-enter" style={{ position: 'absolute', inset: 0, background: '#0D1117', zIndex: 800, display: 'flex', flexDirection: 'column', padding: '60px 24px 48px', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {/* Pulsing ring */}
        <div style={{ position: 'relative', width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="pulse-dot" style={{ position: 'absolute', inset: -18, borderRadius: '50%', background: 'rgba(25,135,84,0.12)' }} />
          <div className="pulse-dot" style={{ position: 'absolute', inset: -9, borderRadius: '50%', background: 'rgba(25,135,84,0.18)', animationDelay: '0.4s' }} />
          <Avatar letter="R" size={130} bg="#1C2128" color={C.white} />
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: C.white }}>Ramesh K.</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Caretaker · Encrypted call</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: C.safe, fontVariantNumeric: 'tabular-nums', letterSpacing: 1 }}>{fmt(sec)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: C.safe, display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: C.safe }}>Secure · Caretaker line</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
        {[
          { Icon: muted ? Mic : Mic, label: muted ? 'Unmute' : 'Mute', size: 56, bg: muted ? '#374151' : '#1C2128', action: () => setMuted(m => !m) },
          { Icon: PhoneOff, label: 'End call', size: 72, bg: C.danger, action: onClose },
          { Icon: Volume2, label: 'Speaker', size: 56, bg: speaker ? C.safe : '#1C2128', action: () => setSpeaker(s => !s) },
        ].map(({ Icon, label, size, bg, action }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <button onClick={action} style={{ width: size, height: size, borderRadius: '50%', background: bg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={Math.round(size * 0.38)} color={C.white} />
            </button>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Chat Overlay (bottom sheet) ──────────────────────────────────────────────
const CHAT_MESSAGES = [
  { from: 'ramesh', text: "I'm outside your building. Arjun is ready at the gate 👍", time: '5:28 PM' },
  { from: 'priya', text: "Great! Please make sure he has his water bottle", time: '5:29 PM' },
  { from: 'ramesh', text: "Got it, checking now. He looks happy and ready to go!", time: '5:29 PM' },
  { from: 'ramesh', text: "We're on our way. ETA 22 minutes ✅", time: '5:31 PM' },
  { from: 'priya', text: "Thank you Ramesh 🙏", time: '5:31 PM' },
];

function ChatOverlay({ onClose }) {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const bottomRef = useRef();

  const send = () => {
    if (!text.trim()) return;
    setMessages(m => [...m, { from: 'priya', text: text.trim(), time: '5:32 PM' }]);
    setText('');
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <div className="screen-enter" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: C.white, borderRadius: '20px 20px 0 0', zIndex: 800, maxHeight: '78%', display: 'flex', flexDirection: 'column', boxShadow: '0 -8px 32px rgba(0,0,0,0.18)' }}>
      {/* Handle */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
        <div style={{ width: 36, height: 4, background: C.surfaceDark, borderRadius: 2 }} />
      </div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px 14px', borderBottom: `1px solid ${C.surfaceDark}` }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 2 }}>
          <ChevronLeft size={22} color={C.black} />
        </button>
        <Avatar letter="R" size={40} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Ramesh K.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.safe, display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: C.textSecondary }}>Online</span>
          </div>
        </div>
        <Badge label="VERIFIED ✓" variant="safe" />
      </div>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.from === 'priya' ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
            {m.from === 'ramesh' && <Avatar letter="R" size={28} />}
            <div style={{ maxWidth: '72%' }}>
              <div style={{ background: m.from === 'priya' ? C.black : C.surface, borderRadius: m.from === 'priya' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', padding: '10px 14px' }}>
                <div style={{ fontSize: 14, color: m.from === 'priya' ? C.white : C.black, lineHeight: 1.4 }}>{m.text}</div>
              </div>
              <div style={{ fontSize: 11, color: C.textTertiary, marginTop: 3, textAlign: m.from === 'priya' ? 'right' : 'left' }}>{m.time}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {/* Input */}
      <div style={{ padding: '10px 16px 20px', borderTop: `1px solid ${C.surfaceDark}`, display: 'flex', gap: 10, alignItems: 'center' }}>
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type a message…"
          style={{ flex: 1, background: C.surface, border: 'none', borderRadius: 24, height: 44, padding: '0 18px', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
        <button onClick={send} style={{ width: 44, height: 44, borderRadius: '50%', background: text.trim() ? C.black : C.surface, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Send size={18} color={text.trim() ? C.white : C.textTertiary} />
        </button>
      </div>
    </div>
  );
}

// ─── Backdrop ─────────────────────────────────────────────────────────────────
function Backdrop({ onClick }) {
  return <div onClick={onClick} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 700 }} />;
}

// ─── Support Sheet ────────────────────────────────────────────────────────────
function SupportSheet({ onClose }) {
  return (
    <div className="screen-enter" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: C.white, borderRadius: '20px 20px 0 0', zIndex: 800, display: 'flex', flexDirection: 'column', boxShadow: '0 -8px 32px rgba(0,0,0,0.18)' }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
        <div style={{ width: 36, height: 4, background: C.surfaceDark, borderRadius: 2 }} />
      </div>
      <div style={{ padding: '14px 20px 6px', borderBottom: `1px solid ${C.surfaceDark}` }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>Contact Support</div>
        <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>We're here to help 24/7</div>
      </div>
      <div style={{ padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { emoji: '💬', title: 'WhatsApp Chat', sub: 'Chat with a support agent on WhatsApp', color: '#25D366', action: () => onClose() },
          { emoji: '🧑‍💼', title: 'Live Chat Agent', sub: 'Get instant help from our support team', color: C.blue, action: () => onClose() },
          { emoji: '📞', title: 'Call Support', sub: 'Speak to an agent (Mon–Sun, 6 AM–10 PM)', color: C.black, action: () => onClose() },
        ].map(({ emoji, title, sub, color, action }) => (
          <button key={title} onClick={action} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: C.surface, borderRadius: 12, border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>{emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color }}>{title}</div>
              <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>{sub}</div>
            </div>
            <ChevronRight size={16} color={C.textTertiary} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Driver data ──────────────────────────────────────────────────────────────
const DRIVERS = [
  { letter: 'R', name: 'Ramesh K.', rating: '4.9', badges: [['VERIFIED ✓', 'safe'], ['CARETAKER CERT.', 'black']], car: 'Swift Dzire · MH01 AB 1234', bio: '2 yrs with kids 6–12. First aid certified.', lang: 'Hindi, Marathi', rides: 847 },
  { letter: 'P', name: 'Priya D.', rating: '4.8', badges: [['VERIFIED ✓', 'safe'], ['WOMEN DRIVER', 'black']], car: 'Maruti Baleno · MH02 CD 5678', bio: '3 yrs experience. Calm & attentive caretaker.', lang: 'Tamil, English', rides: 614 },
  { letter: 'S', name: 'Sunil M.', rating: '4.7', badges: [['VERIFIED ✓', 'safe'], ['CARETAKER CERT.', 'black']], car: 'Hyundai i10 · MH04 EF 9012', bio: '1.5 yrs with kids 5–10. Patient & punctual.', lang: 'Hindi, English', rides: 389 },
];

function DriverCarousel({ selected, onSelect }) {
  return (
    <div>
      <Label text="AVAILABLE CARETAKER-DRIVERS" />
      <div style={{ overflowX: 'auto', display: 'flex', gap: 12, marginTop: 10, paddingBottom: 4, scrollbarWidth: 'none' }}>
        {DRIVERS.map((d, i) => (
          <div key={i} onClick={() => onSelect(i)} style={{ minWidth: 218, border: `2px solid ${selected === i ? C.black : C.surfaceDark}`, borderRadius: 12, padding: 14, cursor: 'pointer', background: selected === i ? '#FAFAFA' : C.white, flexShrink: 0, transition: 'border-color 0.15s' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
              <Avatar letter={d.letter} size={44} bg={selected === i ? C.black : C.surface} color={selected === i ? C.white : C.black} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{d.name}</div>
                <div style={{ fontSize: 12, color: C.textTertiary }}>{d.rating} ★ · {d.rides} rides</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
              {d.badges.map(([label, variant]) => <Badge key={label} label={label} variant={variant} />)}
            </div>
            <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 4 }}>{d.car}</div>
            <div style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.5 }}>{d.bio}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: C.textTertiary, marginTop: 8, background: C.surface, borderRadius: 8, padding: '8px 12px' }}>
        ℹ️ Your preference is noted. Final assignment confirmed before pickup.
      </div>
    </div>
  );
}

// ─── Trusted adults data ──────────────────────────────────────────────────────
const TRUSTED_ADULTS = [
  { letter: 'S', name: 'Suresh', role: 'Football coaching centre', phone: '+91 98765 11111' },
  { letter: 'R', name: 'Rahul Sharma', role: 'Father (backup contact)', phone: '+91 98765 00000' },
];

// ─── SL Login ─────────────────────────────────────────────────────────────────
function SL({ go }) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const allFilled = otp.every(d => d !== '');
  return (
    <div className="screen-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
      <StatusBar />
      <NavBar title="" onBack={() => go('S0')} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px' }}>
        <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Welcome back</div>
        <div style={{ fontSize: 14, color: C.textSecondary, marginBottom: 28 }}>Log in to your Uber for Kids account</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <InputLabel text="PHONE NUMBER" />
            <div style={{ display: 'flex', gap: 8 }}>
              <input readOnly value="+91" style={{ width: 72, background: C.surface, border: 'none', borderRadius: 8, height: 52, padding: '0 12px', fontSize: 14, fontFamily: 'DM Sans, sans-serif' }} />
              <input readOnly value="98765 43210" style={{ flex: 1, background: C.surface, border: 'none', borderRadius: 8, height: 52, padding: '0 16px', fontSize: 14, fontFamily: 'DM Sans, sans-serif' }} />
            </div>
          </div>
          <SurfaceCard>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.safe, marginBottom: 12 }}>OTP sent to +91 98765 43210</div>
            <OTPInput value={otp} onChange={setOtp} />
            <div style={{ fontSize: 12, color: C.textTertiary, textAlign: 'center', marginTop: 10 }}>Resend in 45s</div>
          </SurfaceCard>
          <div style={{ textAlign: 'center', paddingTop: 4 }}>
            <span style={{ fontSize: 13, color: C.textSecondary }}>New here? </span>
            <button onClick={() => go('S1')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: C.black, textDecoration: 'underline', fontFamily: 'DM Sans, sans-serif' }}>Create an account</button>
          </div>
        </div>
        <div style={{ height: 100 }} />
      </div>
      <div style={{ background: C.white, padding: '12px 20px 20px', borderTop: `1px solid ${C.surfaceDark}`, flexShrink: 0 }}>
        <button onClick={() => allFilled && go('S3')} style={{ width: '100%', height: 52, background: allFilled ? C.black : C.surfaceDark, color: allFilled ? C.white : C.textTertiary, fontSize: 15, fontWeight: 600, borderRadius: 8, border: 'none', cursor: allFilled ? 'pointer' : 'default', fontFamily: 'DM Sans, sans-serif', transition: 'background 0.15s' }}>
          {allFilled ? 'Log in' : 'Enter OTP to continue'}
        </button>
      </div>
    </div>
  );
}

// ─── S0 Splash ────────────────────────────────────────────────────────────────
function S0({ go }) {
  return (
    <div className="screen-enter" style={{ background: C.black, flex: 1, display: 'flex', flexDirection: 'column', padding: 20, overflowY: 'auto' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: C.white, letterSpacing: 3, textTransform: 'uppercase' }}>UBER FOR KIDS</span>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 56 }}>🚗👦</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: C.white }}>Uber for Kids</div>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: 280 }}>
            A trusted caretaker who brings your child safely to their destination
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignSelf: 'stretch' }}>
          {['Verified caretaker-drivers', 'Live tracking & video check-in', 'Safe handover at every destination'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: C.safe, fontSize: 15, fontWeight: 600 }}>✓</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 8 }}>
        <button onClick={() => go('S1')} style={{ width: '100%', height: 52, background: C.white, color: C.black, fontSize: 15, fontWeight: 600, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Get started</button>
        <button onClick={() => go('SL')} style={{ width: '100%', height: 52, background: 'transparent', color: C.white, fontSize: 15, fontWeight: 600, borderRadius: 8, border: '1.5px solid rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>I already have an account</button>
      </div>
    </div>
  );
}

// ─── S1 Account Creation ──────────────────────────────────────────────────────
function S1({ go, toast }) {
  const [lang, setLang] = useState('English');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [tcAccepted, setTcAccepted] = useState(false);
  const allFilled = otp.every(d => d !== '');
  const canContinue = allFilled && tcAccepted;
  return (
    <div className="screen-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
        <ProgressDots active={1} />
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Create your account</div>
        <div style={{ fontSize: 14, color: C.textSecondary, marginBottom: 24 }}>Enter your mobile number to get started</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <InputLabel text="FULL NAME" />
            <input readOnly value="Priya Sharma" style={{ width: '100%', background: C.surface, border: 'none', borderRadius: 8, height: 52, padding: '0 16px', fontSize: 14, fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box' }} />
          </div>
          <div>
            <InputLabel text="PHONE NUMBER" />
            <div style={{ display: 'flex', gap: 8 }}>
              <input readOnly value="+91" style={{ width: 72, background: C.surface, border: 'none', borderRadius: 8, height: 52, padding: '0 12px', fontSize: 14, fontFamily: 'DM Sans, sans-serif' }} />
              <input readOnly value="98765 43210" style={{ flex: 1, background: C.surface, border: 'none', borderRadius: 8, height: 52, padding: '0 16px', fontSize: 14, fontFamily: 'DM Sans, sans-serif' }} />
            </div>
          </div>
          <div>
            <InputLabel text="PREFERRED LANGUAGE" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['English', 'हिंदी', 'मराठी', 'தமிழ்'].map(l => (
                <Chip key={l} label={l} selected={lang === l} onClick={() => setLang(l)} />
              ))}
            </div>
          </div>
          <SurfaceCard>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.safe, marginBottom: 12 }}>OTP sent to +91 98765 43210</div>
            <OTPInput value={otp} onChange={setOtp} />
            <div style={{ fontSize: 12, color: C.textTertiary, textAlign: 'center', marginTop: 10 }}>Resend in 45s</div>
          </SurfaceCard>
          <button onClick={() => setTcAccepted(v => !v)} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${tcAccepted ? C.black : C.surfaceDark}`, background: tcAccepted ? C.black : C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'background 0.15s' }}>
              {tcAccepted && <span style={{ color: C.white, fontSize: 13, fontWeight: 700 }}>✓</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>I agree to the Terms & Conditions</div>
              <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2, lineHeight: 1.5 }}>
                <span onClick={e => { e.stopPropagation(); toast('📄 Terms & Conditions opened'); }} style={{ color: C.blue, textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span>
                {' '}and{' '}
                <span onClick={e => { e.stopPropagation(); toast('🔒 Privacy Policy opened'); }} style={{ color: C.blue, textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>
              </div>
            </div>
          </button>
        </div>
        <div style={{ height: 100 }} />
      </div>
      <BottomBar>
        <button onClick={() => canContinue && go('S2')} style={{ width: '100%', height: 52, background: canContinue ? C.black : C.surfaceDark, color: canContinue ? C.white : C.textTertiary, fontSize: 15, fontWeight: 600, borderRadius: 8, border: 'none', cursor: canContinue ? 'pointer' : 'default', fontFamily: 'DM Sans, sans-serif', transition: 'background 0.15s' }}>
          {allFilled ? (tcAccepted ? 'Verify & continue' : 'Accept T&C to continue') : 'Enter OTP to continue'}
        </button>
      </BottomBar>
    </div>
  );
}

// ─── S2 Child Profile ─────────────────────────────────────────────────────────
function S2({ go, toast }) {
  const [age, setAge] = useState(8);
  return (
    <div className="screen-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
      <StatusBar />
      <NavBar title="Child profile" onBack={() => go('S1')} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
        <ProgressDots active={2} />
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Tell us about your child</div>
        <div style={{ fontSize: 14, color: C.textSecondary, marginBottom: 20 }}>This helps the caretaker-driver identify and care for your child</div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: C.surface, border: `2px dashed ${C.surfaceDark}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => toast('📷 Camera access required')}>
              <Camera size={24} color={C.textTertiary} />
            </div>
            <span style={{ fontSize: 12, color: C.textTertiary }}>Add photo</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <InputLabel text="CHILD'S NAME" />
                <input readOnly value="Arjun Sharma" style={{ width: '100%', background: C.surface, border: 'none', borderRadius: 8, height: 52, padding: '0 16px', fontSize: 14, fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box' }} />
              </div>
              <div>
                <InputLabel text="AGE" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {[5,6,7,8,9,10,11,12].map(a => <Chip key={a} label={String(a)} selected={age===a} onClick={() => setAge(a)} />)}
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Special instructions</div>
            <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 12 }}>Your caretaker-driver will follow these</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <InputLabel text="FOR PICKUP RIDES" />
                <textarea readOnly value="Arjun gets nervous with strangers, please greet him by name"
                  style={{ width: '100%', background: C.surface, border: 'none', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: C.black, resize: 'none', fontFamily: 'DM Sans, sans-serif', minHeight: 60, boxSizing: 'border-box' }} />
              </div>
              <div>
                <InputLabel text="FOR RETURN RIDES" />
                <textarea readOnly value="Give him water after session, he gets dehydrated easily"
                  style={{ width: '100%', background: C.surface, border: 'none', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: C.black, resize: 'none', fontFamily: 'DM Sans, sans-serif', minHeight: 60, boxSizing: 'border-box' }} />
              </div>
            </div>
          </Card>
          <Card>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Emergency contacts</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar letter="R" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Rahul Sharma</div>
                <div style={{ fontSize: 12, color: C.textSecondary }}>Father · +91 98765 00000</div>
              </div>
              <Badge label="PRIMARY" variant="safe" />
            </div>
            <div style={{ marginTop: 12 }}>
              <SecondaryBtn label="+ Add emergency contact" onClick={() => toast('✓ Emergency contact form opened')} />
            </div>
          </Card>
          <Card>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Trusted adults for pickup & dropoff</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar letter="S" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Suresh</div>
                <div style={{ fontSize: 12, color: C.textSecondary }}>Football coaching centre</div>
              </div>
              <Badge label="AUTHORIZED" variant="black" />
            </div>
            <div style={{ marginTop: 12 }}>
              <SecondaryBtn label="+ Add trusted adult" onClick={() => toast('✓ Add trusted adult form opened')} />
            </div>
          </Card>
        </div>
        <div style={{ height: 100 }} />
      </div>
      <BottomBar><PrimaryBtn label="Save & continue" onClick={() => go('S3')} /></BottomBar>
    </div>
  );
}

// ─── S3 Home ──────────────────────────────────────────────────────────────────
function S3({ go }) {
  return (
    <div className="screen-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
      <StatusBar dark />
      <div style={{ background: C.black, padding: '14px 20px 22px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Tuesday, 15 April</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.white, marginTop: 2 }}>Good evening, Priya</div>
          </div>
          <button onClick={() => go('S15')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <Bell size={22} color={C.white} />
          </button>
        </div>
        <div style={{ marginTop: 20 }}>
          <button onClick={() => go('S4')} style={{ width: '100%', height: 56, background: C.white, color: C.black, fontSize: 16, fontWeight: 700, borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            Schedule a ride
          </button>
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <button onClick={() => go('S4')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'rgba(255,255,255,0.55)', fontFamily: 'DM Sans, sans-serif' }}>
              ⚡ Need a ride right now? <span style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'underline' }}>Book now</span>
            </button>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <button onClick={() => go('S2')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar letter="A" bg={C.black} color={C.white} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Arjun Sharma</div>
                <div style={{ fontSize: 12, color: C.textSecondary }}>Age 8</div>
              </div>
              <ChevronRight size={18} color={C.textTertiary} />
            </div>
            <Divider />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.safe, display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: C.textSecondary }}>Special instructions set</span>
            </div>
          </Card>
        </button>
        <Card>
          <Label text="UPCOMING SCHEDULE" />
          <SurfaceCard style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Today, 5:30 PM</span>
              <Badge label="SCHEDULED" variant="black" />
            </div>
            <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 12 }}>Home → Football Ground · Lokhandwala</div>
            <Divider />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar letter="R" size={28} />
              <span style={{ fontSize: 13, color: C.textSecondary }}>Ramesh K. · Verified caretaker</span>
            </div>
          </SurfaceCard>
          <div style={{ marginTop: 12 }}>
            <button disabled style={{ width: '100%', height: 52, background: C.surfaceDark, color: C.textTertiary, fontSize: 15, fontWeight: 600, borderRadius: 8, border: 'none', cursor: 'default', fontFamily: 'DM Sans, sans-serif' }}>
              Track live ride
            </button>
            <div style={{ marginTop: 8 }}>
              <span style={{ fontSize: 12, color: C.textTertiary }}>Ride not started · Starts 5:30 PM</span>
            </div>
          </div>
        </Card>
        <Card>
          <Label text="SAVED LOCATIONS" />
          <div style={{ marginTop: 10 }}>
            {[
              { icon: '🏠', label: 'Home', sub: 'Andheri West' },
              { icon: '🏫', label: "St. Xavier's School", sub: 'Vile Parle' },
              { icon: '⚽', label: 'Football Ground', sub: 'Lokhandwala' },
            ].map((loc, i) => (
              <div key={i}>
                {i > 0 && <Divider />}
                <button onClick={() => go('S4')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0', width: '100%', textAlign: 'left' }}>
                  <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{loc.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14 }}>{loc.label}</div>
                    <div style={{ fontSize: 12, color: C.textSecondary }}>{loc.sub}</div>
                  </div>
                  <ChevronRight size={16} color={C.textTertiary} />
                </button>
              </div>
            ))}
          </div>
        </Card>
        <div style={{ height: 8 }} />
      </div>
      <BottomNav active="home" go={go} />
    </div>
  );
}

// ─── S4 Booking ───────────────────────────────────────────────────────────────
function S4({ go }) {
  const [rideType, setRideType] = useState('Recurring');
  const [driverPref, setDriverPref] = useState('Any caretaker');
  const [payment, setPayment] = useState('UPI');
  const [days, setDays] = useState(['Mon', 'Wed', 'Fri']);
  const [swapped, setSwapped] = useState(false);
  const [driverIdx, setDriverIdx] = useState(0);
  const [selectedAdults, setSelectedAdults] = useState([0]);
  const toggleDay = d => setDays(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);
  const toggleAdult = i => setSelectedAdults(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

  const pickup = swapped ? 'Football Ground · Lokhandwala' : 'Home · Andheri West';
  const dropoff = swapped ? 'Home · Andheri West' : 'Football Ground · Lokhandwala';

  return (
    <div className="screen-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
      <StatusBar />
      <NavBar title="Book a ride for Arjun" onBack={() => go('S3')} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.safe }} />
                <div style={{ borderLeft: `2px dashed ${C.textTertiary}`, height: 28 }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.black }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ background: C.surface, borderRadius: 8, height: 48, padding: '0 14px', fontSize: 14, display: 'flex', alignItems: 'center' }}>{pickup}</div>
                <div style={{ background: C.surface, borderRadius: 8, height: 48, padding: '0 14px', fontSize: 14, display: 'flex', alignItems: 'center' }}>{dropoff}</div>
              </div>
              <button onClick={() => setSwapped(s => !s)} style={{ background: C.surface, border: 'none', borderRadius: 6, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ArrowUpDown size={16} />
              </button>
            </div>
          </Card>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, background: C.surface, borderRadius: 8, height: 52, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8 }}>
              <Calendar size={16} color={C.textTertiary} /><span style={{ fontSize: 14 }}>Tue, 15 Apr</span>
            </div>
            <div style={{ flex: 1, background: C.surface, borderRadius: 8, height: 52, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8 }}>
              <Clock size={16} color={C.textTertiary} /><span style={{ fontSize: 14 }}>5:30 PM</span>
            </div>
          </div>
          <Card>
            <Label text="RIDE TYPE" />
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              {['One-time','Recurring'].map(t => <Chip key={t} label={t} selected={rideType===t} onClick={() => setRideType(t)} />)}
            </div>
            {rideType === 'Recurring' && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                {['Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <Chip key={d} label={d} selected={days.includes(d)} onClick={() => toggleDay(d)} />)}
              </div>
            )}
          </Card>
          <Card>
            <Label text="DRIVER PREFERENCE" />
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {['Any caretaker','Women driver only'].map(p => <Chip key={p} label={p} selected={driverPref===p} onClick={() => setDriverPref(p)} />)}
            </div>
          </Card>
          <Card style={{ overflow: 'hidden' }}>
            <DriverCarousel selected={driverIdx} onSelect={setDriverIdx} />
          </Card>
          <Card>
            <Label text="DROPOFF NOTIFICATION" />
            <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 4, marginBottom: 12 }}>Select trusted adults who'll receive driver info & OTP</div>
            {TRUSTED_ADULTS.map((a, i) => (
              <div key={i}>
                {i > 0 && <Divider />}
                <button onClick={() => toggleAdult(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', textAlign: 'left' }}>
                  <Avatar letter={a.letter} size={36} bg={selectedAdults.includes(i) ? C.black : C.surface} color={selectedAdults.includes(i) ? C.white : C.black} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: C.textSecondary }}>{a.role}</div>
                  </div>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${selectedAdults.includes(i) ? C.black : C.surfaceDark}`, background: selectedAdults.includes(i) ? C.black : C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {selectedAdults.includes(i) && <span style={{ color: C.white, fontSize: 13, fontWeight: 700 }}>✓</span>}
                  </div>
                </button>
              </div>
            ))}
            <div style={{ marginTop: 12 }}>
              <SecondaryBtn label="+ Add trusted adult" onClick={() => {}} />
            </div>
          </Card>
          <Card>
            <Label text="FARE BREAKDOWN" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {[['Base fare','₹120'],['Distance 6.2 km','₹186'],['Caretaker premium','₹174']].map(([l,v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: C.textSecondary }}>{l}</span>
                  <span style={{ fontSize: 14 }}>{v}</span>
                </div>
              ))}
              <Divider />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: 18, fontWeight: 700 }}>₹480</span>
              </div>
              <div style={{ fontSize: 11, color: C.textTertiary }}>Caretaker premium includes verified driver, live monitoring & safe handover</div>
            </div>
          </Card>
          <Card>
            <Label text="PAYMENT" />
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {['UPI','Card','Paytm','PhonePe'].map(p => <Chip key={p} label={p} selected={payment===p} onClick={() => setPayment(p)} />)}
            </div>
            {payment === 'UPI' && (
              <div style={{ marginTop: 10 }}>
                <input readOnly value="priya.sharma@upi" style={{ width: '100%', background: C.surface, border: 'none', borderRadius: 8, height: 44, padding: '0 14px', fontSize: 13, fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box' }} />
              </div>
            )}
          </Card>
        </div>
        <div style={{ height: 100 }} />
      </div>
      <BottomBar><PrimaryBtn label="Confirm booking · ₹480" onClick={() => go('S5')} /></BottomBar>
    </div>
  );
}

// ─── S5 Pre-Ride ──────────────────────────────────────────────────────────────
function S5({ go, openCall, openChat, openSupport, toast }) {
  return (
    <div className="screen-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
      <StatusBar />
      <NavBar title="Ride confirmed" onBack={() => go('S3')} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: C.safeBg, borderLeft: `4px solid ${C.safe}`, borderRadius: 8, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <CheckCircle size={24} color={C.safe} style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.safe }}>Booking confirmed</div>
              <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>Ramesh is on his way to pick up Arjun</div>
            </div>
          </div>
          <MapSVG height={200} showCar />
          <Card>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Avatar letter="R" size={48} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>Ramesh K.</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>4.9 ★</span>
                </div>
                <div style={{ fontSize: 12, color: C.textSecondary }}>MH01 AB 1234 · Swift Dzire</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                  <Badge label="VERIFIED ✓" variant="safe" />
                  <Badge label="CARETAKER CERTIFIED" variant="black" />
                </div>
              </div>
            </div>
            <Divider />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={openCall} style={{ flex: 1, height: 44, background: C.surface, border: 'none', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
                <Phone size={16} /> Call Ramesh
              </button>
              <button onClick={openChat} style={{ flex: 1, height: 44, background: C.surface, border: 'none', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
                <MessageSquare size={16} /> Message
              </button>
            </div>
          </Card>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Driver details shared</div>
              <button onClick={() => toast('📤 Driver info & OTP link resent to all contacts')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: C.blue, fontFamily: 'DM Sans, sans-serif', textDecoration: 'underline' }}>Resend all</button>
            </div>
            <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 12 }}>Selected trusted adults received driver info + OTP</div>
            {TRUSTED_ADULTS.map((a, i) => (
              <div key={i}>
                {i > 0 && <Divider />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
                  <Avatar letter={a.letter} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14 }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: C.textSecondary }}>{a.role}</div>
                  </div>
                  <Badge label="SENT ✓" variant="safe" />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 12 }}>
              <SecondaryBtn label="+ Add contact" onClick={() => toast('✓ Add trusted adult form opened')} />
            </div>
          </Card>
          <Card>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Arjun's Pickup OTP</div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              {['4','7','2','9'].map((d,i) => (
                <div key={i} style={{ flex: 1, height: 64, borderRadius: 8, background: C.black, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: C.white }}>{d}</div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: C.textSecondary, textAlign: 'center' }}>Share with Arjun or the authorized person at pickup</div>
          </Card>
          <button onClick={openSupport} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: C.surface, borderRadius: 12, border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
            <span style={{ fontSize: 20 }}>🎧</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Need help?</div>
              <div style={{ fontSize: 12, color: C.textSecondary }}>WhatsApp, live chat or call support</div>
            </div>
            <ChevronRight size={16} color={C.textTertiary} />
          </button>
        </div>
        <div style={{ height: 100 }} />
      </div>
      <BottomBar><PrimaryBtn label="Track Arjun's ride" onClick={() => go('S6')} /></BottomBar>
    </div>
  );
}

// ─── S6 Live Ride ─────────────────────────────────────────────────────────────
function S6({ go, openCall, openChat, openSupport }) {
  const [sosProgress, setSosProgress] = useState(0);
  const sosAnimRef = useRef(null);
  const sosStartRef = useRef(null);
  const circumference = 2 * Math.PI * 40;

  const startSOS = useCallback(() => {
    sosStartRef.current = Date.now();
    const tick = () => {
      const prog = Math.min((Date.now() - sosStartRef.current) / 3000, 1);
      setSosProgress(prog);
      if (prog < 1) sosAnimRef.current = requestAnimationFrame(tick);
      else go('S10');
    };
    sosAnimRef.current = requestAnimationFrame(tick);
  }, [go]);

  const cancelSOS = useCallback(() => {
    setSosProgress(0);
    if (sosAnimRef.current) cancelAnimationFrame(sosAnimRef.current);
  }, []);

  return (
    <div className="screen-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
      <StatusBar green />
      <NavBar title="Arjun is in Ramesh's care" onBack={() => go('S3')} green />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <MapSVG height={210} showCar />
          <Card>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Ride progress</div>
            {[
              { done: true, label: 'Picked up', sub: '5:30 PM · Andheri West', isLast: false },
              { active: true, label: 'In transit', sub: 'On route · All good', isLast: false },
              { pending: true, label: 'Arriving at destination', sub: 'ETA 5:52 PM', isLast: true },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className={step.active ? 'pulse-blue' : ''} style={{ width: 20, height: 20, borderRadius: '50%', background: step.done ? C.safe : step.active ? C.blue : 'transparent', border: step.pending ? `2px solid ${C.surfaceDark}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {step.done && <span style={{ color: C.white, fontSize: 10 }}>✓</span>}
                  </div>
                  {!step.isLast && <div style={{ width: 2, height: 28, background: step.done ? C.safe : C.surfaceDark, margin: '4px 0' }} />}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: step.active ? 600 : 400, color: step.active ? C.blue : step.pending ? C.textSecondary : C.black }}>{step.label}</div>
                  <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: step.isLast ? 0 : 8 }}>{step.sub}</div>
                </div>
              </div>
            ))}
          </Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { Icon: Video, label: 'Video call', action: () => go('S7') },
              { Icon: Eye, label: 'Monitor ride', action: () => go('S8') },
              { Icon: MessageSquare, label: 'Message', action: openChat },
              { Icon: Phone, label: 'Call Ramesh', action: openCall },
            ].map(({ Icon, label, action }) => (
              <button key={label} onClick={action} style={{ background: C.surface, borderRadius: 12, padding: '16px 12px', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <Icon size={22} color={C.black} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
              </button>
            ))}
          </div>
          <button onClick={() => go('S9')} style={{ background: C.alertBg, borderRadius: 8, padding: '12px 14px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left' }}>
            <AlertTriangle size={20} color="#92400E" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#92400E' }}>Route deviation detected</div>
              <div style={{ fontSize: 12, color: C.textSecondary }}>Alternate route taken · Traffic on Link Road · Tap for details</div>
            </div>
            <ChevronRight size={18} color={C.textTertiary} />
          </button>
          {/* SOS */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '8px 0' }}>
            <Label text="EMERGENCY" />
            <div style={{ position: 'relative', width: 96, height: 96 }}>
              <svg width="96" height="96" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
                <circle cx="48" cy="48" r="40" fill="none" stroke={C.dangerBg} strokeWidth="5" />
                {sosProgress > 0 && (
                  <circle cx="48" cy="48" r="40" fill="none" stroke={C.danger} strokeWidth="5"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - sosProgress)}
                    strokeLinecap="round" />
                )}
              </svg>
              <button onMouseDown={startSOS} onMouseUp={cancelSOS} onMouseLeave={cancelSOS}
                onTouchStart={e => { e.preventDefault(); startSOS(); }} onTouchEnd={cancelSOS}
                style={{ position: 'absolute', top: 8, left: 8, width: 80, height: 80, borderRadius: '50%', background: C.danger, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: C.white }}>SOS</span>
              </button>
            </div>
            <span style={{ fontSize: 12, color: C.textTertiary }}>Hold 3 seconds</span>
            <span style={{ fontSize: 11, color: C.textTertiary }}>For emergencies only</span>
          </div>
          <button onClick={openSupport} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: C.surface, borderRadius: 12, border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
            <span style={{ fontSize: 20 }}>🎧</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Contact support</div>
              <div style={{ fontSize: 12, color: C.textSecondary }}>WhatsApp, live chat or call us</div>
            </div>
            <ChevronRight size={16} color={C.textTertiary} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── S7 Video Call ────────────────────────────────────────────────────────────
function S7({ go }) {
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  return (
    <div className="screen-enter" style={{ background: '#111827', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '50px 20px 16px' }}>
        <button onClick={() => go('S6')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
          <ChevronLeft size={24} color={C.white} />
        </button>
        <span style={{ fontSize: 15, color: C.white }}>Video call · Ramesh's phone</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32, padding: '0 20px 40px' }}>
        <div style={{ width: '100%', height: 220, background: '#1F2937', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>👦</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.white, marginTop: 10 }}>Arjun</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>In Ramesh's car</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: C.safe, display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: C.safe }}>Live · Encrypted</span>
          </div>
          <div style={{ position: 'absolute', bottom: 10, right: 10, width: 80, height: 60, background: '#374151', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <User size={18} color={C.textTertiary} />
            <span style={{ fontSize: 10, color: C.textTertiary }}>Priya</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {[
            { Icon: muted ? Mic : Mic, label: muted ? 'Unmute' : 'Mute', size: 52, bg: muted ? '#374151' : '#1C2128', action: () => setMuted(m => !m) },
            { Icon: PhoneOff, label: 'End call', size: 64, bg: C.danger, action: () => go('S6') },
            { Icon: camOff ? Camera : Camera, label: camOff ? 'Camera on' : 'Camera', size: 52, bg: camOff ? '#374151' : '#1C2128', action: () => setCamOff(c => !c) },
          ].map(({ Icon, label, size, bg, action }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <button onClick={action} style={{ width: size, height: size, borderRadius: '50%', background: bg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={Math.round(size * 0.38)} color={C.white} />
              </button>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── S8 Monitoring ────────────────────────────────────────────────────────────
function S8({ go }) {
  return (
    <div className="screen-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
      <StatusBar />
      <NavBar title="Monitoring Arjun's ride" onBack={() => go('S6')} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: '#1F2937', borderRadius: 12, height: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>👦</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.white }}>Arjun · Backseat</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: C.safe, display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: C.safe }}>Live feed · Encrypted</span>
            </div>
          </div>
          <SurfaceCard style={{ background: C.safeBg }}>
            <Label text="ALL CLEAR" />
            <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 6 }}>No inappropriate content · Calm environment · Arjun appears comfortable</div>
          </SurfaceCard>
          <Card>
            <Label text="CARETAKER MESSAGE FROM RAMESH" />
            <div style={{ background: C.surface, borderRadius: 8, padding: '12px 14px', marginTop: 10 }}>
              <div style={{ fontSize: 13 }}>Arjun seems a little tired today, all good though. He had some water.</div>
            </div>
            <div style={{ fontSize: 11, color: C.textTertiary, marginTop: 6, textAlign: 'right' }}>5:41 PM</div>
          </Card>
          <SecondaryBtn label="Back to live tracking" onClick={() => go('S6')} />
        </div>
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

// ─── S9 Route Deviation ───────────────────────────────────────────────────────
function S9({ go, openCall, openSupport }) {
  return (
    <div className="screen-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
      <StatusBar />
      <NavBar title="Route alert" onBack={() => go('S6')} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: C.alertBg, borderLeft: `4px solid ${C.alert}`, borderRadius: 8, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <AlertTriangle size={24} color="#92400E" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#92400E' }}>Route deviation detected</div>
              <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>Ramesh is 340m off the expected route. Detected at 5:46 PM.</div>
            </div>
          </div>
          <MapSVG height={160} showCar deviation />
          <Card>
            <Label text="WHY THIS HAPPENED" />
            <div style={{ fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>Heavy traffic on Link Road. Ramesh took the S.V. Road alternate. This is a known diversion.</div>
          </Card>
          <SecondaryBtn label="Call Ramesh" onClick={openCall} />
          <button onClick={openSupport} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: C.surface, borderRadius: 12, border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
            <span style={{ fontSize: 20 }}>🎧</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Contact support</div>
              <div style={{ fontSize: 12, color: C.textSecondary }}>WhatsApp, live chat or call us</div>
            </div>
            <ChevronRight size={16} color={C.textTertiary} />
          </button>
          <PrimaryBtn label="Back to tracking" onClick={() => go('S6')} />
        </div>
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

// ─── S10 SOS ──────────────────────────────────────────────────────────────────
function S10({ go }) {
  return (
    <div className="screen-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
      <StatusBar red />
      <div style={{ background: C.danger, padding: '14px 20px 18px', flexShrink: 0 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.white }}>🚨 SOS Activated</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>Emergency contacts and authorities are being notified</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card>
            <Label text="ALERTS SENT TO" />
            <div style={{ marginTop: 10 }}>
              {[
                { av: 'R', name: 'Rahul Sharma', sub: 'Father · Emergency contact', badge: 'NOTIFIED ✓', v: 'safe', pulse: false },
                { av: '🚔', name: 'Mumbai Police', sub: 'Via 112 India Emergency', badge: 'ALERTING...', v: 'danger', pulse: true },
                { av: '🧑‍💼', name: 'Emergency Support', sub: 'Uber for Kids ops team', badge: 'CONNECTED ✓', v: 'safe', pulse: false },
              ].map(({ av, name, sub, badge, v, pulse }, i) => (
                <div key={i}>
                  {i > 0 && <Divider />}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: av.length > 1 ? 18 : 15, fontWeight: 600, flexShrink: 0 }}>{av}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{name}</div>
                      <div style={{ fontSize: 12, color: C.textSecondary }}>{sub}</div>
                    </div>
                    <span className={pulse ? 'pulse-dot-fast' : ''} style={{ background: v==='safe' ? C.safeBg : C.dangerBg, color: v==='safe' ? C.safe : C.danger, borderRadius: 4, fontSize: 11, fontWeight: 600, padding: '3px 8px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{badge}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <Label text="LIVE LOCATION SHARED" />
            <div style={{ marginTop: 10 }}><MapSVG height={120} showCar={false} sosDot /></div>
            <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 8 }}>Real-time GPS stream active</div>
            <div style={{ fontSize: 12, color: C.danger, marginTop: 4 }}>SOS cannot be cancelled. Only resolvable by ops team.</div>
          </Card>
          <SecondaryBtn label="Back to tracking" onClick={() => go('S6')} red />
        </div>
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

// ─── S11 Handover ─────────────────────────────────────────────────────────────
function S11({ go, openSupport }) {
  return (
    <div className="screen-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
      <StatusBar green />
      <NavBar title="Arjun is arriving" onBack={() => go('S6')} green />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SurfaceCard style={{ background: C.safeBg }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.safe }}>🏟️ Arriving at Football Ground</div>
            <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>Ramesh will walk Arjun to Suresh at the gate</div>
          </SurfaceCard>
          <Card>
            <Label text="HANDOVER STEPS" />
            <div style={{ marginTop: 14 }}>
              {[
                { done: true, label: 'Ramesh arrived at destination', sub: '5:52 PM' },
                { done: true, label: 'Walking Arjun to gate', sub: 'Must Be Met protocol active' },
                { active: true, label: "Awaiting Suresh's OTP", sub: 'OTP sent to Suresh' },
                { pending: true, label: 'Photo confirmation', sub: 'Pending' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className={step.active ? 'pulse-blue' : ''} style={{ width: 20, height: 20, borderRadius: '50%', background: step.done ? C.safe : step.active ? C.blue : 'transparent', border: step.pending ? `2px solid ${C.surfaceDark}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {step.done && <span style={{ color: C.white, fontSize: 10 }}>✓</span>}
                    </div>
                    {i < 3 && <div style={{ width: 2, height: 26, background: step.done ? C.safe : C.surfaceDark, margin: '4px 0' }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: step.active ? 600 : 400, color: step.pending ? C.textSecondary : C.black }}>{step.label}</div>
                    <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 10 }}>{step.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Handover OTP</div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              {['8','3','5','1'].map((d,i) => (
                <div key={i} style={{ flex: 1, height: 64, borderRadius: 8, background: C.black, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: C.white }}>{d}</div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: C.textSecondary, textAlign: 'center' }}>Sent to Suresh · +91 98765 11111</div>
          </Card>
          <div style={{ border: `2px dashed ${C.surfaceDark}`, borderRadius: 12, height: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={{ fontSize: 28 }}>📸</span>
            <div style={{ fontSize: 13, color: C.textTertiary, textAlign: 'center', lineHeight: 1.5 }}>Waiting for handover photo<br />Ramesh will photograph Arjun with Suresh</div>
          </div>
          <button onClick={openSupport} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: C.surface, borderRadius: 12, border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
            <span style={{ fontSize: 20 }}>🎧</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Contact support</div>
              <div style={{ fontSize: 12, color: C.textSecondary }}>WhatsApp, live chat or call us</div>
            </div>
            <ChevronRight size={16} color={C.textTertiary} />
          </button>
          <PrimaryBtn label="Handover confirmed →" onClick={() => go('S12')} />
        </div>
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

// ─── S12 Safe Arrival ─────────────────────────────────────────────────────────
function S12({ go }) {
  return (
    <div className="screen-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: C.safeBg, border: `3px solid ${C.safe}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={52} color={C.safe} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.safe, textAlign: 'center' }}>Arjun reached safely</div>
          <div style={{ fontSize: 14, color: C.textSecondary, textAlign: 'center', lineHeight: 1.6 }}>Safely handed over to Suresh at Football Ground · 5:54 PM</div>
          <Card style={{ width: '100%' }}>
            <div style={{ background: C.surface, borderRadius: 8, height: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 12 }}>
              <div style={{ fontSize: 28 }}>🦺 🤝 👨‍🏫</div>
              <div style={{ fontSize: 12, color: C.textSecondary }}>Arjun with Suresh at the gate</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: C.textSecondary }}>OTP confirmed by Suresh</span>
              <Badge label="VERIFIED ✓" variant="safe" />
            </div>
          </Card>
          <Card style={{ width: '100%' }}>
            <Label text="RIDE SUMMARY" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {[['Total fare','₹480'],['Paid via','UPI'],['Duration','24 min'],['Caretaker','Ramesh K.']].map(([l,v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: C.textSecondary }}>{l}</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <PrimaryBtn label="Rate Ramesh as caretaker" onClick={() => go('S13')} />
            <SecondaryBtn label="Back to home" onClick={() => go('S3')} />
          </div>
        </div>
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

// ─── S13 Rating ───────────────────────────────────────────────────────────────
function S13({ go, toast }) {
  const [rating, setRating] = useState(5);
  const [comfort, setComfort] = useState('Yes, very');
  const [instructions, setInstructions] = useState('Yes');
  const [trust, setTrust] = useState('Absolutely');
  const [safety, setSafety] = useState(['Safe driving','Followed route','Appropriate environment']);
  const toggleSafety = c => setSafety(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);

  return (
    <div className="screen-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
      <StatusBar />
      <NavBar title="Rate your caretaker" onBack={() => go('S12')} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <Avatar letter="R" size={64} />
            <div style={{ fontSize: 18, fontWeight: 600 }}>Ramesh K.</div>
            <div style={{ fontSize: 13, color: C.textSecondary }}>How was Ramesh as a caretaker today?</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setRating(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}>
                  <span style={{ fontSize: 30, color: s <= rating ? '#F59E0B' : C.surfaceDark }}>★</span>
                </button>
              ))}
            </div>
          </Card>
          <Card>
            <Label text="CARETAKER FEEDBACK" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 12 }}>
              {[
                { q: 'Was Arjun comfortable?', val: comfort, set: setComfort, opts: ['Yes, very','Somewhat','No'] },
                { q: 'Did Ramesh follow special instructions?', val: instructions, set: setInstructions, opts: ['Yes','Partially','No'] },
                { q: 'Would you trust Ramesh with Arjun again?', val: trust, set: setTrust, opts: ['Absolutely','Maybe','No'] },
              ].map(({ q, val, set, opts }) => (
                <div key={q}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{q}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {opts.map(o => <Chip key={o} label={o} selected={val===o} onClick={() => set(o)} />)}
                  </div>
                </div>
              ))}
              <div>
                <Label text="ADD A NOTE (optional)" />
                <textarea readOnly value="Ramesh greeted Arjun by name, messaged me unprompted. Exactly what I needed."
                  style={{ width: '100%', marginTop: 8, background: C.surface, border: 'none', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: C.black, resize: 'none', fontFamily: 'DM Sans, sans-serif', minHeight: 72, boxSizing: 'border-box' }} />
              </div>
            </div>
          </Card>
          <Card>
            <Label text="SAFETY FEEDBACK" />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
              {['Safe driving','Followed route','Appropriate environment'].map(c => (
                <Chip key={c} label={c} selected={safety.includes(c)} onClick={() => toggleSafety(c)} />
              ))}
            </div>
          </Card>
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => toast('📋 Issue report form opened')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: C.danger, textDecoration: 'underline', fontFamily: 'DM Sans, sans-serif' }}>
              Report an issue
            </button>
          </div>
        </div>
        <div style={{ height: 100 }} />
      </div>
      <BottomBar>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PrimaryBtn label="Submit feedback" onClick={() => go('S14')} />
          <SecondaryBtn label="Skip" onClick={() => go('S3')} />
        </div>
      </BottomBar>
    </div>
  );
}

// ─── S14 Past Rides ───────────────────────────────────────────────────────────
function S14({ go }) {
  const rides = [
    { date: 'Today · 5:30 PM', route: 'Home → Football Ground · Lokhandwala', dur: '24 min', fare: '₹480' },
    { date: 'Mon, 14 Apr · 8:00 AM', route: "Home → St. Xavier's School · Vile Parle", dur: '18 min', fare: '₹380' },
    { date: 'Fri, 11 Apr · 5:30 PM', route: 'Home → Football Ground · Lokhandwala', dur: '22 min', fare: '₹480' },
  ];
  return (
    <div className="screen-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
      <StatusBar />
      <NavBar title="Activity" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        <div style={{ marginBottom: 12 }}><Label text="PAST RIDES" /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rides.map((r, i) => (
            <Card key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{r.date}</span>
                <Badge label="COMPLETED" variant="safe" />
              </div>
              <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 6 }}>{r.route}</div>
              <div style={{ fontSize: 13, color: C.textTertiary, marginBottom: 12 }}>{r.dur} · {r.fare}</div>
              <Divider />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar letter="R" size={32} />
                <span style={{ fontSize: 13 }}>Ramesh K.</span>
                <div style={{ flex: 1, display: 'flex' }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 12, color: '#F59E0B' }}>★</span>)}
                </div>
                <button onClick={() => go('S4')} style={{ background: C.white, border: `1.5px solid ${C.black}`, borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Rebook</button>
              </div>
            </Card>
          ))}
        </div>
        <div style={{ height: 20 }} />
      </div>
      <BottomNav active="activity" go={go} />
    </div>
  );
}

// ─── S15 Account ──────────────────────────────────────────────────────────────
function S15({ go, toast }) {
  const settings = ['Safety & emergency contacts','Notification preferences','Payment methods','Language settings','Privacy & data','Help & support'];
  return (
    <div className="screen-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
      <StatusBar />
      <NavBar title="Account" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Profile */}
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <Avatar letter="P" size={72} bg={C.black} color={C.white} />
            <div style={{ fontSize: 18, fontWeight: 700 }}>Priya Sharma</div>
            <div style={{ fontSize: 13, color: C.textSecondary }}>+91 98765 43210</div>
            <div style={{ fontSize: 13, color: C.textSecondary }}>priya.sharma@email.com</div>
            <Divider />
            <div style={{ display: 'flex', gap: 28 }}>
              {[['24','Rides'],['4.9','Rating'],['2','Years']].map(([v, l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{v}</div>
                  <div style={{ fontSize: 12, color: C.textSecondary }}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
          {/* Child profiles */}
          <Card>
            <Label text="CHILD PROFILES" />
            <div style={{ marginTop: 10 }}>
              <button onClick={() => go('S2')} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '4px 0' }}>
                <Avatar letter="A" bg={C.black} color={C.white} size={44} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>Arjun Sharma</div>
                  <div style={{ fontSize: 12, color: C.textSecondary }}>Age 8 · Special instructions set</div>
                </div>
                <ChevronRight size={18} color={C.textTertiary} />
              </button>
            </div>
            <div style={{ marginTop: 12 }}>
              <SecondaryBtn label="+ Add child" onClick={() => toast('✓ Add child profile form opened')} />
            </div>
          </Card>
          {/* Trusted caretakers */}
          <Card>
            <Label text="TRUSTED CARETAKERS" />
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar letter="R" size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Ramesh K.</div>
                <div style={{ fontSize: 12, color: C.textSecondary }}>4.9 ★ · 24 rides with Arjun</div>
              </div>
              <Badge label="PREFERRED" variant="black" />
            </div>
          </Card>
          {/* Settings */}
          <Card>
            <Label text="SETTINGS" />
            <div style={{ marginTop: 10 }}>
              {settings.map((item, i) => (
                <div key={i}>
                  {i > 0 && <Divider />}
                  <button onClick={() => toast(`Opening: ${item}`)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>{item}</span>
                    <ChevronRight size={16} color={C.textTertiary} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
          <button onClick={() => go('S0')} style={{ width: '100%', padding: '14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: C.danger, fontFamily: 'DM Sans, sans-serif' }}>
            Sign out
          </button>
        </div>
        <div style={{ height: 20 }} />
      </div>
      <BottomNav active="account" go={go} />
    </div>
  );
}

// ─── Demo Panel ───────────────────────────────────────────────────────────────
function DemoPanel({ current, go }) {
  const groups = [
    { label: 'Onboarding', items: [['S0','Splash'],['SL','Login'],['S1','Account'],['S2','Child Profile'],['S15','My Account']] },
    { label: 'Core', items: [['S3','Home'],['S4','Booking'],['S5','Pre-Ride']] },
    { label: 'Live Ride', items: [['S6','Live'],['S7','Video'],['S8','Monitor'],['S9','Deviation'],['S10','SOS']] },
    { label: 'Handover', items: [['S11','Drop-off'],['S12','Arrival'],['S13','Rating'],['S14','Past Rides']] },
  ];
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: C.white, borderTop: `1px solid ${C.surfaceDark}`, padding: '8px 16px 12px', zIndex: 1000, overflowX: 'auto' }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', whiteSpace: 'nowrap', minWidth: 'max-content' }}>
        {groups.map((g, gi) => (
          <div key={gi} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: C.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5 }}>{g.label}</span>
            {g.items.map(([id, label]) => (
              <button key={id} onClick={() => go(id)} style={{ background: current === id ? C.black : C.surface, color: current === id ? C.white : C.black, border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 11, fontWeight: current === id ? 600 : 400, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                {label}
              </button>
            ))}
            {gi < groups.length - 1 && <span style={{ color: C.surfaceDark, fontSize: 14, marginLeft: 4 }}>|</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('S0');
  const [modal, setModal] = useState(null); // 'call' | 'chat' | 'support' | null
  const [toastMsg, setToastMsg] = useState(null);
  const toastTimer = useRef(null);

  const go = useCallback(s => {
    setModal(null);
    setScreen(s);
  }, []);

  const openCall = useCallback(() => setModal('call'), []);
  const openChat = useCallback(() => setModal('chat'), []);
  const openSupport = useCallback(() => setModal('support'), []);
  const closeModal = useCallback(() => setModal(null), []);

  const toast = useCallback(msg => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2400);
  }, []);

  const screens = { S0, SL, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15 };
  const Screen = screens[screen];
  const actions = { go, openCall, openChat, openSupport, toast };

  return (
    <div style={{ minHeight: '100vh', background: '#E5E5E5', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 24, paddingBottom: 76 }}>
      {/* Phone frame */}
      <div style={{ width: 390, height: 844, background: C.white, borderRadius: 40, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.22)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {Screen && <Screen key={screen} {...actions} />}

        {/* Overlays — rendered inside phone frame */}
        {(modal === 'chat' || modal === 'support') && <Backdrop onClick={closeModal} />}
        {modal === 'call' && <CallOverlay onClose={closeModal} />}
        {modal === 'chat' && <ChatOverlay onClose={closeModal} />}
        {modal === 'support' && <SupportSheet onClose={closeModal} />}

        {/* Toast */}
        {toastMsg && <Toast message={toastMsg} onDone={() => setToastMsg(null)} />}
      </div>

      <DemoPanel current={screen} go={go} />
    </div>
  );
}
