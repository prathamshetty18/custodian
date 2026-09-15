import React from 'react';
import { LANGUAGES } from '../data/fieldNotesData';
import { UI_TRANSLATIONS } from '../data/translations';
import { Globe, Check, ArrowRight, Volume2, Sparkles, BookOpen } from 'lucide-react';

export const LanguageScreen = ({ activeLanguage, setActiveLanguage, onConfirm }) => {
  const t = UI_TRANSLATIONS[activeLanguage.id] || UI_TRANSLATIONS.en;

  return (
    <section className="language-screen transition-level-1" aria-labelledby="lang-heading">
      <div className="language-panel parchment-panel">
        <div className="panel-header">
          <div className="journey-label">{t.languageScreen.protocol}</div>
          <h2 id="lang-heading" className="panel-title">{t.languageScreen.title}</h2>
          <p className="panel-subtitle">
            {t.languageScreen.subtitle}
          </p>
        </div>

        {/* Language Grid */}
        <div className="language-grid" role="radiogroup" aria-label="Available languages">
          {LANGUAGES.map((lang) => {
            const isSelected = activeLanguage.id === lang.id;
            return (
              <div
                key={lang.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                className={`language-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setActiveLanguage(lang)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveLanguage(lang);
                  }
                }}
              >
                <div className="card-top">
                  <div className="native-text">{lang.nativeName}</div>
                  <div className="check-indicator">
                    {isSelected ? <Check size={16} strokeWidth={2.5} /> : <span className="empty-circle"></span>}
                  </div>
                </div>

                <div className="english-name">{lang.name}</div>

                <div className="card-features">
                  <span className="lang-tag">
                    <Volume2 size={12} />
                    {lang.badge}
                  </span>
                  {isSelected && (
                    <span className="active-selection-chip">
                      ✓ {t.languageScreen.activeNote}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cultural Context Callout */}
        <div className="locale-context-box">
          <div className="context-title">
            <BookOpen size={16} />
            <span>{t.languageScreen.provenanceTitle} ({activeLanguage.nativeName})</span>
          </div>
          <p>
            {t.languageScreen.provenanceText}
          </p>
        </div>

        {/* Action Controls */}
        <div className="action-footer">
          <button onClick={onConfirm} className="btn btn-primary btn-large">
            <span>{t.languageScreen.confirmBtn}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .language-screen {
          padding: 3rem 1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 70px);
        }

        .language-panel {
          max-width: 760px;
          width: 100%;
          padding: 3rem 3rem 2.5rem 3rem;
          box-shadow: var(--shadow-panel);
        }

        .panel-header {
          text-align: center;
          margin-bottom: 2.25rem;
        }

        .panel-title {
          font-size: 2.4rem;
          margin-top: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .panel-subtitle {
          margin: 0 auto;
          font-size: 1.05rem;
          color: var(--color-ink-700);
        }

        .language-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .language-card {
          background-color: var(--color-paper-50);
          border: 1px solid var(--color-paper-200);
          border-radius: var(--radius-sm);
          padding: 1.25rem 1.35rem;
          cursor: pointer;
          transition: all 180ms var(--ease-journal);
          position: relative;
        }

        .language-card:hover {
          border-color: var(--color-terracotta);
          transform: translateY(-2px);
          box-shadow: var(--shadow-parchment);
        }

        .language-card.selected {
          border: 2px solid var(--color-terracotta);
          background-color: #FAF5EB;
          box-shadow: 0 3px 12px rgba(154, 79, 50, 0.15);
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.35rem;
        }

        .native-text {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--color-ink-900);
          line-height: 1.2;
        }

        .check-indicator {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-paper-100);
          color: var(--color-ink-500);
          border: 1px solid var(--color-paper-200);
        }

        .language-card.selected .check-indicator {
          background: var(--color-terracotta);
          color: #FFF;
          border-color: var(--color-terracotta);
        }

        .empty-circle {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: transparent;
        }

        .english-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-ink-700);
          margin-bottom: 0.85rem;
        }

        .card-features {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .lang-tag {
          font-size: 0.72rem;
          color: var(--color-ink-500);
          background: var(--color-paper-100);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          border: 1px solid var(--color-paper-200);
        }

        .active-selection-chip {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--color-forest);
          background: var(--color-forest-soft);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(64, 88, 68, 0.3);
        }

        .locale-context-box {
          background: var(--color-paper-50);
          border: 1px solid var(--color-paper-200);
          padding: 1.15rem 1.35rem;
          border-radius: var(--radius-sm);
          margin-bottom: 2rem;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .context-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: var(--color-ink-900);
          margin-bottom: 0.35rem;
        }

        .action-footer {
          display: flex;
          justify-content: center;
        }

        @media (max-width: 600px) {
          .language-panel {
            padding: 2rem 1.25rem;
          }
          .language-grid {
            grid-template-columns: 1fr;
          }
          .panel-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
};
