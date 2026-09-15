import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Globe, FileText, Check } from 'lucide-react';
import { globalAudio } from '../utils/audioEngine';
import { UI_TRANSLATIONS } from '../data/translations';

export const AudioPlayer = ({ note, activeLanguage, onAudioPlayStateChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Initialize and automatically adapt active transcript tab when activeLanguage changes
  const [activeTab, setActiveTab] = useState(activeLanguage.id || 'english');

  const duration = note.audioDuration || 132;
  const t = UI_TRANSLATIONS[activeLanguage.id] || UI_TRANSLATIONS.en;

  // React to global activeLanguage changes
  useEffect(() => {
    if (activeLanguage.id === 'kn') {
      setActiveTab('kannada');
    } else if (activeLanguage.id === 'tu') {
      setActiveTab('tulu');
    } else if (activeLanguage.id === 'hi') {
      setActiveTab('hindi');
    } else {
      setActiveTab('english');
    }
  }, [activeLanguage]);

  useEffect(() => {
    const unsubscribe = globalAudio.subscribe((time, playing) => {
      setCurrentTime(time);
      setIsPlaying(playing);
      if (onAudioPlayStateChange) {
        onAudioPlayStateChange(playing);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [onAudioPlayStateChange]);

  const togglePlay = () => {
    if (isPlaying) {
      globalAudio.pause();
      setIsPlaying(false);
      if (onAudioPlayStateChange) onAudioPlayStateChange(false);
    } else {
      globalAudio.play(duration);
      setIsPlaying(true);
      if (onAudioPlayStateChange) onAudioPlayStateChange(true);
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

  // Get current transcript text based on tab
  const getTranscriptText = () => {
    if (!note.audioTranscript) return "";
    if (activeTab === 'kannada') return note.audioTranscript.kannada || note.audioTranscript.original;
    if (activeTab === 'tulu') return note.audioTranscript.tulu || note.audioTranscript.original;
    if (activeTab === 'hindi') return note.audioTranscript.hindi || note.audioTranscript.english;
    return note.audioTranscript.english;
  };

  return (
    <div className="audio-experience-container parchment-panel" aria-label="Custodian Field Audio Recording">
      {/* Audio Header Line */}
      <div className="audio-header">
        <div className="audio-provenance">
          <Volume2 size={16} className="speaker-icon" />
          <span className="provenance-credit">{t.storyScreen.audio.recordedBy}</span>
          <span className="provenance-dot">·</span>
          <span className="provenance-custodian">{note.custodian.name}</span>
        </div>

        <div className="audio-language-tag">
          <Globe size={13} />
          <span>{note.language}</span>
        </div>
      </div>

      {/* Main Scrubber Control Row (Spec Page 8: Simple scrubber with elapsed time, play control) */}
      <div className="audio-controls-row">
        <button
          onClick={togglePlay}
          className="audio-play-btn"
          aria-label={isPlaying ? "Pause custodian recording" : "Listen to custodian story"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="play-icon-offset" />}
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

      {/* Structured Transcript & Translation Toggles (Spec Page 8 & 13) */}
      <div className="transcript-section">
        <div className="transcript-tabs" role="tablist" aria-label="Transcript languages">
          <button
            role="tab"
            aria-selected={activeTab === 'english'}
            className={`transcript-tab ${activeTab === 'english' ? 'active' : ''}`}
            onClick={() => setActiveTab('english')}
          >
            English
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'kannada'}
            className={`transcript-tab ${activeTab === 'kannada' ? 'active' : ''}`}
            onClick={() => setActiveTab('kannada')}
          >
            ಕನ್ನಡ (Kannada)
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'tulu'}
            className={`transcript-tab ${activeTab === 'tulu' ? 'active' : ''}`}
            onClick={() => setActiveTab('tulu')}
          >
            ತುಳು (Tulu)
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'hindi'}
            className={`transcript-tab ${activeTab === 'hindi' ? 'active' : ''}`}
            onClick={() => setActiveTab('hindi')}
          >
            हिन्दी (Hindi)
          </button>
        </div>

        <div className="transcript-body" role="tabpanel">
          <p className={`transcript-text ${activeTab !== 'english' ? 'original-phonetic' : ''}`}>
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
        }

        .audio-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--color-paper-200);
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .audio-provenance {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.8rem;
          color: var(--color-ink-700);
        }

        .speaker-icon {
          color: var(--color-forest);
        }

        .provenance-credit {
          font-weight: 600;
          color: var(--color-ink-900);
          letter-spacing: 0.02em;
        }

        .provenance-dot {
          color: var(--color-ink-500);
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

        .audio-controls-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 1.25rem;
        }

        .audio-play-btn {
          width: 46px;
          height: 46px;
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
          line-height: 1.6;
          color: var(--color-ink-900);
          font-style: italic;
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
