import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Globe } from 'lucide-react';
import { globalAudio } from '../utils/audioEngine';
import { UI_TRANSLATIONS } from '../data/translations';

export const AudioPlayer = ({ note, activeLanguage, onAudioPlayStateChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Initialize and automatically adapt active transcript tab when activeLanguage changes
  const initialTab = activeLanguage.id === 'kn' ? 'kannada' :
                     activeLanguage.id === 'tu' ? 'tulu' :
                     activeLanguage.id === 'hi' ? 'hindi' : 'english';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [prevLangId, setPrevLangId] = useState(activeLanguage.id);
  const [prevNoteId, setPrevNoteId] = useState(note.id);
  const [actualDuration, setActualDuration] = useState(note.audioDuration || 26);

  // Synchronize state during render when props change
  if (activeLanguage.id !== prevLangId) {
    setPrevLangId(activeLanguage.id);
    if (activeLanguage.id === 'kn') setActiveTab('kannada');
    else if (activeLanguage.id === 'tu') setActiveTab('tulu');
    else if (activeLanguage.id === 'hi') setActiveTab('hindi');
    else setActiveTab('english');
  }

  if (note.id !== prevNoteId) {
    setPrevNoteId(note.id);
    setCurrentTime(0);
    setIsPlaying(false);
    globalAudio.pause();
  }

  const duration = actualDuration || note.audioDuration || 26;
  const t = UI_TRANSLATIONS[activeLanguage.id] || UI_TRANSLATIONS.en;

  // Get current transcript text based on active tab
  const getTranscriptText = (tab = activeTab) => {
    if (!note.audioTranscript) return "";
    if (tab === 'kannada') return note.audioTranscript.kannada || note.audioTranscript.original;
    if (tab === 'tulu') return note.audioTranscript.tulu || note.audioTranscript.original;
    if (tab === 'hindi') return note.audioTranscript.hindi || note.audioTranscript.english;
    return note.audioTranscript.english;
  };

  useEffect(() => {
    const unsubscribe = globalAudio.subscribe((time, playing, extra) => {
      setCurrentTime(time);
      setIsPlaying(playing);
      if (extra?.duration) {
        setActualDuration(extra.duration);
      }
      if (onAudioPlayStateChange) {
        onAudioPlayStateChange(playing);
      }
    });

    return () => {
      unsubscribe();
      globalAudio.pause();
    };
  }, [onAudioPlayStateChange]);

  const togglePlay = () => {
    if (isPlaying) {
      globalAudio.pause();
      setIsPlaying(false);
      if (onAudioPlayStateChange) onAudioPlayStateChange(false);
    } else {
      const text = getTranscriptText();
      globalAudio.play({
        duration,
        text,
        lang: activeTab,
        noteId: note.id,
        custodianName: note.custodian.name
      });
      setIsPlaying(true);
      if (onAudioPlayStateChange) onAudioPlayStateChange(true);
    }
  };

  const handleRestart = () => {
    const text = getTranscriptText();
    globalAudio.restart({
      duration,
      text,
      lang: activeTab,
      noteId: note.id,
      custodianName: note.custodian.name
    });
    setIsPlaying(true);
    if (onAudioPlayStateChange) onAudioPlayStateChange(true);
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    if (isPlaying) {
      const newText = getTranscriptText(newTab);
      globalAudio.play({
        duration,
        text: newText,
        lang: newTab,
        noteId: note.id,
        custodianName: note.custodian.name
      });
    }
  };

  const handleSeek = (e) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    globalAudio.seek(val);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`audio-experience-container parchment-panel ${isPlaying ? 'is-playing' : ''}`} aria-label="Custodian Field Audio Recording">
      {/* Audio Header Line */}
      <div className="audio-header">
        <div className="audio-provenance">
          <Volume2 size={16} className={`speaker-icon ${isPlaying ? 'pulse' : ''}`} />
          <span className="provenance-credit">{t.storyScreen.audio.recordedBy}</span>
          <span className="provenance-dot">·</span>
          <span className="provenance-custodian">{note.custodian.name}</span>
        </div>

        <div className="audio-language-tag">
          <Globe size={13} />
          <span>{note.language}</span>
        </div>
      </div>

      {/* Custodian Voice Status Banner */}
      <div className={`audio-voice-banner ${isPlaying ? 'active' : 'idle'}`}>
        <div className="voice-badge-indicator">
          {isPlaying ? (
            <div className="voice-equalizer" aria-hidden="true">
              <span className="eq-bar bar1" />
              <span className="eq-bar bar2" />
              <span className="eq-bar bar3" />
              <span className="eq-bar bar4" />
            </div>
          ) : (
            <span className="mic-icon" role="img" aria-label="Microphone">🎙️</span>
          )}
        </div>
        <div className="voice-status-content">
          <span className="voice-status-title">
            {isPlaying ? (
              <>
                Voice of <strong>{note.custodian.name}</strong> speaking
                <span className="voice-sub-lang">
                  {' '}({activeTab === 'english' ? 'English Oral Recording' : activeTab === 'kannada' ? 'ಕನ್ನಡ ಮೂಲ ಧ್ವನಿ' : activeTab === 'tulu' ? 'ತುಳು ಉಚ್ಚಾರಣೆ' : 'हिन्दी पाठ'})
                </span>
              </>
            ) : (
              <>Custodian Oral Voice Recording · <strong>{note.custodian.name}</strong></>
            )}
          </span>
          <span className="voice-status-desc">
            {isPlaying ? "Accompanied by traditional temple drone and chande bronze chime" : "Click play to listen to authentic oral story"}
          </span>
        </div>
      </div>

      {/* Main Controls Row: Play/Pause, Restart, and Scrubber */}
      <div className="audio-controls-row">
        <button
          onClick={togglePlay}
          className="audio-play-btn"
          aria-label={isPlaying ? "Pause custodian recording" : "Listen to custodian story"}
          title={isPlaying ? "Pause voice recording" : "Play custodian oral story"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="play-icon-offset" />}
        </button>

        <button
          onClick={handleRestart}
          className="audio-restart-btn"
          aria-label="Restart audio from beginning"
          title="Restart from beginning"
        >
          <RotateCcw size={15} />
        </button>

        <div className="scrubber-track-wrapper">
          <div className="time-labels">
            <span className="time-current">{formatTime(currentTime)}</span>
            <span className="time-total">{formatTime(duration)}</span>
          </div>

          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="audio-scrubber-range"
            aria-label="Audio playback position"
          />
        </div>
      </div>

      {/* Structured Transcript & Translation Toggles */}
      <div className="transcript-section">
        <div className="transcript-tabs" role="tablist" aria-label="Transcript languages">
          <button
            role="tab"
            aria-selected={activeTab === 'english'}
            className={`transcript-tab ${activeTab === 'english' ? 'active' : ''}`}
            onClick={() => handleTabChange('english')}
          >
            English
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'kannada'}
            className={`transcript-tab ${activeTab === 'kannada' ? 'active' : ''}`}
            onClick={() => handleTabChange('kannada')}
          >
            ಕನ್ನಡ (Kannada)
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'tulu'}
            className={`transcript-tab ${activeTab === 'tulu' ? 'active' : ''}`}
            onClick={() => handleTabChange('tulu')}
          >
            ತುಳು (Tulu)
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'hindi'}
            className={`transcript-tab ${activeTab === 'hindi' ? 'active' : ''}`}
            onClick={() => handleTabChange('hindi')}
          >
            हिन्दी (Hindi)
          </button>
        </div>

        <div className="transcript-body" role="tabpanel">
          <p className={`transcript-text ${activeTab !== 'english' ? 'original-phonetic' : ''} ${isPlaying ? 'speaking-active' : ''}`}>
            “{getTranscriptText()}”
          </p>
        </div>
      </div>

      <style>{`
        .audio-experience-container {
          background-color: var(--color-paper-50);
          border: 1px solid var(--color-paper-200);
          padding: 1.5rem;
          margin: 1.75rem 0;
          border-radius: var(--radius-sm);
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }

        .audio-experience-container.is-playing {
          border-color: var(--color-terracotta);
          box-shadow: 0 4px 18px rgba(154, 79, 50, 0.08);
        }

        .audio-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.85rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--color-paper-200);
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .audio-provenance {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.82rem;
          color: var(--color-ink-700);
        }

        .speaker-icon {
          color: var(--color-forest);
          transition: transform 300ms ease;
        }

        .speaker-icon.pulse {
          color: var(--color-terracotta);
          animation: speakerPulse 1.2s infinite ease-in-out;
        }

        @keyframes speakerPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .provenance-credit {
          font-weight: 600;
          color: var(--color-ink-900);
          letter-spacing: 0.02em;
        }

        .provenance-dot {
          color: var(--color-ink-500);
        }

        .provenance-custodian {
          color: var(--color-terracotta);
          font-weight: 600;
        }

        .audio-language-tag {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: var(--color-ink-500);
          background: var(--color-paper-100);
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-paper-200);
        }

        .audio-voice-banner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-sm);
          margin-bottom: 1.1rem;
          font-size: 0.8rem;
          transition: all 200ms ease;
        }

        .audio-voice-banner.idle {
          background-color: var(--color-paper-100);
          border: 1px dashed var(--color-paper-200);
          color: var(--color-ink-700);
        }

        .audio-voice-banner.active {
          background-color: #FAF4EE;
          border: 1px solid var(--color-terracotta);
          color: var(--color-ink-900);
        }

        .voice-badge-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--color-paper-50);
          border: 1px solid var(--color-paper-200);
          flex-shrink: 0;
        }

        .voice-equalizer {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 14px;
        }

        .eq-bar {
          width: 3px;
          background-color: var(--color-terracotta);
          border-radius: 1px;
          animation: eqBounce 1s infinite ease-in-out;
        }

        .bar1 { height: 6px; animation-delay: 0.1s; }
        .bar2 { height: 12px; animation-delay: 0.3s; }
        .bar3 { height: 9px; animation-delay: 0.2s; }
        .bar4 { height: 14px; animation-delay: 0.4s; }

        @keyframes eqBounce {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }

        .voice-status-content {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .voice-status-title {
          font-size: 0.82rem;
          color: var(--color-ink-900);
        }

        .voice-sub-lang {
          color: var(--color-terracotta);
          font-weight: 500;
        }

        .voice-status-desc {
          font-size: 0.72rem;
          color: var(--color-ink-500);
        }

        .audio-controls-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .audio-play-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: var(--color-terracotta);
          color: #FFF;
          border: 1px solid var(--color-terracotta-hover);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 180ms ease;
          box-shadow: 0 2px 6px rgba(154, 79, 50, 0.2);
        }

        .audio-play-btn:hover {
          background-color: var(--color-terracotta-hover);
          transform: scale(1.05);
        }

        .play-icon-offset {
          margin-left: 2px;
        }

        .audio-restart-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--color-paper-100);
          color: var(--color-ink-700);
          border: 1px solid var(--color-paper-200);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 150ms ease;
        }

        .audio-restart-btn:hover {
          background: var(--color-paper-50);
          color: var(--color-ink-900);
          border-color: var(--color-ink-500);
        }

        .scrubber-track-wrapper {
          flex: 1;
        }

        .time-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--color-ink-500);
          font-variant-numeric: tabular-nums;
          margin-bottom: 0.35rem;
        }

        .audio-scrubber-range {
          width: 100%;
          height: 6px;
          -webkit-appearance: none;
          background: var(--color-paper-200);
          border-radius: 3px;
          outline: none;
          cursor: pointer;
        }

        .audio-scrubber-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: var(--color-terracotta);
          border: 2px solid #FFF;
          box-shadow: 0 1px 3px rgba(41, 37, 31, 0.3);
          cursor: pointer;
        }

        .transcript-section {
          background: var(--color-paper-100);
          border: 1px solid var(--color-paper-200);
          border-radius: var(--radius-sm);
          padding: 1rem;
        }

        .transcript-tabs {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 0.85rem;
          border-bottom: 1px solid var(--color-paper-200);
          padding-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .transcript-tab {
          border: none;
          background: transparent;
          font-family: var(--font-ui);
          font-size: 0.78rem;
          color: var(--color-ink-500);
          cursor: pointer;
          padding: 0.3rem 0.6rem;
          border-radius: var(--radius-sm);
          transition: all 150ms ease;
        }

        .transcript-tab:hover {
          color: var(--color-ink-900);
        }

        .transcript-tab.active {
          color: var(--color-ink-900);
          font-weight: 700;
          background: var(--color-paper-50);
          border: 1px solid var(--color-paper-200);
        }

        .transcript-text {
          font-size: 0.95rem;
          line-height: 1.65;
          color: var(--color-ink-900);
          font-style: italic;
          transition: color 200ms ease;
        }

        .transcript-text.speaking-active {
          color: #2D241E;
        }

        .original-phonetic {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-style: normal;
          color: var(--color-ink-900);
        }
      `}</style>
    </div>
  );
};
