import React, { useState, useRef, useEffect } from 'react';

export default function VoiceRecorder({ onTranscript, onStop }) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [seconds, setSeconds] = useState(0);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!SpeechRecognition);
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      let finalTranscript = '';
      recognition.onresult = (e) => {
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) finalTranscript += e.results[i][0].transcript + ' ';
          else interim += e.results[i][0].transcript;
        }
        const combined = finalTranscript + interim;
        setTranscript(combined);
        if (onTranscript) onTranscript(combined);
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        stopRecording();
      };

      recognitionRef.current = recognition;
    }
    return () => { clearInterval(timerRef.current); };
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) return;
    setTranscript('');
    setSeconds(0);
    recognitionRef.current.start();
    setRecording(true);
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
  };

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    clearInterval(timerRef.current);
    setRecording(false);
    if (onStop) onStop(transcript);
  };

  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  if (!supported) return (
    <div style={{ padding:'12px 16px', borderRadius:12, background:'#fef2f2', border:'1px solid #fecaca',
      fontSize:13, color:'#dc2626' }}>
      ⚠️ Voice recording is not supported in this browser. Try Chrome or Edge.
    </div>
  );

  return (
    <div style={{ borderRadius:16, padding:'20px', background:'var(--soft-gray)', border:'1px solid var(--border)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom: transcript ? 12 : 0 }}>
        {/* Record button */}
        <button onClick={recording ? stopRecording : startRecording} style={{
          width:56, height:56, borderRadius:'50%', border:'none', cursor:'pointer',
          background: recording ? '#ef4444' : '#7c3aed',
          color:'white', fontSize:22, display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow: recording ? '0 0 0 8px rgba(239,68,68,0.2)' : '0 4px 12px rgba(124,58,237,0.3)',
          transition:'all 0.2s',
          animation: recording ? 'pulse-ring 1.5s ease-in-out infinite' : 'none'
        }}>
          {recording ? '⬛' : '🎙️'}
        </button>

        <div>
          {recording ? (
            <>
              <p style={{ fontWeight:600, color:'#ef4444', display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:'#ef4444',
                  display:'inline-block', animation:'blink 1s ease-in-out infinite' }} />
                Recording... {formatTime(seconds)}
              </p>
              <p style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2 }}>Speak clearly. Tap stop when done.</p>
            </>
          ) : (
            <>
              <p style={{ fontWeight:600 }}>Voice Journal</p>
              <p style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2 }}>
                Tap to speak. Your words will be transcribed.
              </p>
            </>
          )}
        </div>
      </div>

      {transcript && (
        <div style={{ padding:'12px 14px', borderRadius:12, background:'white',
          border:'1px solid var(--border)', fontSize:13, lineHeight:1.7, color:'var(--text-primary)',
          maxHeight:120, overflowY:'auto' }}>
          {transcript}
        </div>
      )}

      <style>{`
        @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 100%{box-shadow:0 0 0 20px rgba(239,68,68,0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}
