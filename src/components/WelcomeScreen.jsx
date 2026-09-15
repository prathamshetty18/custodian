import React from 'react';
import { ArrowRight, Compass, ShieldCheck, BookOpen, MapPin, Feather } from 'lucide-react';
import { UI_TRANSLATIONS } from '../data/translations';

export const WelcomeScreen = ({ onBegin, activeLanguage }) => {
  const t = UI_TRANSLATIONS[activeLanguage?.id] || UI_TRANSLATIONS.en;

  return (
    <section className="welcome-screen transition-level-1" aria-labelledby="welcome-heading">
      <div className="journal-cover-frame">
        {/* Subtle Journal Header Ornamentation */}
        <div className="cover-pretitle">{t.welcome.pretitle}</div>
        
        <h1 id="welcome-heading" className="cover-title">
          {t.brandTitle}
        </h1>
        
        <div className="cover-subtitle">{t.welcome.subtitle}</div>
        
        <div className="divider-line">
          <span className="divider-notch"></span>
        </div>

        {/* Illustrated Compass Rose Motif (Spec Page 1 & 5) */}
        <div className="compass-motif-wrapper" aria-hidden="true">
          <svg className="compass-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="92" stroke="var(--color-paper-200)" strokeWidth="1" strokeDasharray="3 3"/>
            <circle cx="100" cy="100" r="80" stroke="var(--color-ink-500)" strokeWidth="1" opacity="0.6"/>
            <circle cx="100" cy="100" r="64" stroke="var(--color-paper-200)" strokeWidth="1"/>
            <circle cx="100" cy="100" r="38" stroke="var(--color-ochre)" strokeWidth="1.2"/>
            
            {/* Cardinal ticks */}
            <line x1="100" y1="8" x2="100" y2="192" stroke="var(--color-ink-500)" strokeWidth="1" opacity="0.4"/>
            <line x1="8" y1="100" x2="192" y2="100" stroke="var(--color-ink-500)" strokeWidth="1" opacity="0.4"/>
            <line x1="35" y1="35" x2="165" y2="165" stroke="var(--color-paper-200)" strokeWidth="0.8"/>
            <line x1="35" y1="165" x2="165" y2="35" stroke="var(--color-paper-200)" strokeWidth="0.8"/>
            
            {/* North pointer needle */}
            <polygon points="100,24 106,94 100,100" fill="var(--color-terracotta)" />
            <polygon points="100,24 94,94 100,100" fill="#B35D3D" />
            <polygon points="100,176 105,106 100,100" fill="var(--color-ink-700)" />
            <polygon points="100,176 95,106 100,100" fill="var(--color-ink-500)" />

            <circle cx="100" cy="100" r="5" fill="var(--color-paper-50)" stroke="var(--color-terracotta)" strokeWidth="2"/>
            <text x="100" y="18" textAnchor="middle" fill="var(--color-ink-900)" fontSize="13" fontFamily="var(--font-ui)" fontWeight="600">N</text>
            <text x="188" y="104" textAnchor="middle" fill="var(--color-ink-500)" fontSize="10" fontFamily="var(--font-ui)">E</text>
            <text x="100" y="196" textAnchor="middle" fill="var(--color-ink-500)" fontSize="10" fontFamily="var(--font-ui)">S</text>
            <text x="12" y="104" textAnchor="middle" fill="var(--color-ink-500)" fontSize="10" fontFamily="var(--font-ui)">W</text>
          </svg>
        </div>

        <p className="cover-mission">
          {t.welcome.quote}
        </p>

        {/* Three Pillars Formula (Spec Page 2) */}
        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-header">
              <Feather size={16} className="pillar-icon" />
              <span>{t.welcome.parchmentTitle}</span>
            </div>
            <p className="pillar-desc">
              {t.welcome.parchmentDesc}
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-header">
              <BookOpen size={16} className="pillar-icon" />
              <span>{t.welcome.journalTitle}</span>
            </div>
            <p className="pillar-desc">
              {t.welcome.journalDesc}
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-header">
              <MapPin size={16} className="pillar-icon" />
              <span>{t.welcome.mapTitle}</span>
            </div>
            <p className="pillar-desc">
              {t.welcome.mapDesc}
            </p>
          </div>
        </div>

        {/* Guiding Protocol Note */}
        <div className="orientation-note">
          <ShieldCheck size={18} className="note-icon" />
          <div>
            <strong>{t.welcome.orientationBold}</strong> {t.welcome.orientationText}
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="action-row">
          <button onClick={onBegin} className="btn btn-primary btn-large">
            <span>{t.welcome.openBtn}</span>
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="cover-footer">
          <span>{t.welcome.footer}</span>
        </div>
      </div>

      <style>{`
        .welcome-screen {
          padding: 2.5rem 1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 70px);
        }

        .journal-cover-frame {
          max-width: 820px;
          width: 100%;
          background-color: var(--color-paper-100);
          border: 1px solid var(--color-paper-200);
          box-shadow: var(--shadow-panel);
          border-radius: var(--radius-sm);
          padding: 3.5rem 3.5rem 2.5rem 3.5rem;
          text-align: center;
          position: relative;
        }

        .journal-cover-frame::before {
          content: "";
          position: absolute;
          top: 12px;
          bottom: 12px;
          left: 12px;
          right: 12px;
          border: 1px solid rgba(223, 207, 173, 0.6);
          pointer-events: none;
        }

        .cover-pretitle {
          font-family: var(--font-ui);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          margin-bottom: 0.75rem;
        }

        .cover-title {
          font-size: 3.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--color-ink-900);
          margin-bottom: 0.25rem;
          line-height: 1;
        }

        .cover-subtitle {
          font-family: var(--font-display);
          font-size: 1.7rem;
          font-style: italic;
          color: var(--color-ink-700);
          margin-bottom: 1.5rem;
        }

        .divider-line {
          height: 1px;
          background-color: var(--color-paper-200);
          margin: 1.25rem auto 2rem auto;
          max-width: 320px;
          position: relative;
        }

        .divider-notch {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          width: 7px;
          height: 7px;
          background: var(--color-terracotta);
        }

        .compass-motif-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 1.75rem;
        }

        .compass-svg {
          width: 170px;
          height: 170px;
          filter: drop-shadow(0 2px 4px rgba(41, 37, 31, 0.05));
        }

        .cover-mission {
          font-family: var(--font-display);
          font-size: 1.45rem;
          font-style: italic;
          color: var(--color-ink-900);
          max-width: 540px;
          margin: 0 auto 2rem auto;
          line-height: 1.4;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
          text-align: left;
        }

        .pillar-card {
          background-color: var(--color-paper-50);
          border: 1px solid var(--color-paper-200);
          padding: 1.1rem;
          border-radius: var(--radius-sm);
        }

        .pillar-header {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--color-terracotta);
          margin-bottom: 0.4rem;
        }

        .pillar-icon {
          color: var(--color-terracotta);
        }

        .pillar-desc {
          font-size: 0.875rem;
          color: var(--color-ink-700);
          line-height: 1.45;
        }

        .orientation-note {
          background-color: var(--color-forest-soft);
          border: 1px solid rgba(64, 88, 68, 0.25);
          padding: 1rem 1.25rem;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          text-align: left;
          font-size: 0.875rem;
          color: var(--color-ink-900);
          margin-bottom: 2.25rem;
          line-height: 1.5;
        }

        .note-icon {
          color: var(--color-forest);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .action-row {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .btn-large {
          font-size: 1.05rem;
          padding: 0.95rem 2.25rem;
          letter-spacing: 0.02em;
        }

        .cover-footer {
          font-size: 0.75rem;
          color: var(--color-ink-500);
          letter-spacing: 0.05em;
          border-top: 1px solid var(--color-paper-200);
          padding-top: 1rem;
        }

        @media (max-width: 768px) {
          .journal-cover-frame {
            padding: 2rem 1.25rem 1.5rem 1.25rem;
          }
          .cover-title {
            font-size: 2.75rem;
          }
          .cover-subtitle {
            font-size: 1.35rem;
          }
          .pillars-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
