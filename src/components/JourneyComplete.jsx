import React, { useState } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  RotateCcw, 
  ArrowRight, 
  Heart, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  PenTool,
  BookmarkCheck
} from 'lucide-react';
import { UI_TRANSLATIONS } from '../data/translations';

export const JourneyComplete = ({
  completedNotes,
  activeLanguage,
  onReturnToMap,
  onStartNewRegion
}) => {
  const t = UI_TRANSLATIONS[activeLanguage?.id] || UI_TRANSLATIONS.en;

  const defaultReflections = {
    en: "Witnessed the midnight Chande drum invocation in Udupi with deep gratitude. Respected the sacred Chowki dressing sanctum boundary as requested by Elder Ravi Shetty.",
    kn: "ಉಡುಪಿಯ ಮಧ್ಯರಾತ್ರಿಯ ಚಂಡೆಯ ನಾದವನ್ನು ಕೃತಜ್ಞತೆಯಿಂದ ಆಲಿಸಿದೆ. ಹಿರಿಯ ರವಿ ಶೆಟ್ಟಿಯವರ ಕೋರಿಕೆಯಂತೆ ಚೌಕಿಯ ಪವಿತ್ರ ಗಡಿಯನ್ನು ಗೌರವಿಸಿದೆ.",
    tu: "ಉಡುಪಿದ ಚಂಡೆದ ಪೆಟ್ಟ್‌ನ್ ಗೌರವೊಡು ಕೇಂಡೆ. ರಕ್ಷಕೆರಾಯಿನ ರವಿ ಶೆಟ್ರೆನ ಕೋರಿಕೆದ ಲೆಕ್ಕ ಚೌಕಿದ ಪವಿತ್ರ ಗಡಿನ್ ಮರ್ಯಾದೆಡ್ ಒಪ್ಪಿಯೆ.",
    hi: "उडुपी में आधी रात के चंडे ढोल के वादन को कृतज्ञतापूर्वक सुना। वरिष्ठ रवि शेट्टी के अनुरोध पर चौकी की पवित्र सीमा का सम्मान किया।"
  };

  const [reflectionText, setReflectionText] = useState(
    defaultReflections[activeLanguage?.id] || defaultReflections.en
  );
  const [reflectionSaved, setReflectionSaved] = useState(false);

  return (
    <section className="journey-complete-view transition-level-3-stamp" aria-labelledby="complete-heading">
      <div className="complete-journal-spread parchment-panel">
        <div className="complete-top">
          <span className="journey-label">{t.completeScreen.specTag}</span>
        </div>

        {/* Animated Journal Stamp / Seal (Spec Page 6 & 12) */}
        <div className="stamp-seal-wrapper">
          <div className="expedition-stamp-seal" aria-label="Field Journal Verified Seal">
            <div className="stamp-border-outer">
              <div className="stamp-border-inner">
                <div className="stamp-text-arc">{t.completeScreen.stampText}</div>
                <div className="stamp-date">{t.completeScreen.stampDate}</div>
                <div className="stamp-center-icon">
                  <ShieldCheck size={28} />
                </div>
                <div className="stamp-subtext">{t.completeScreen.stampSubtext}</div>
              </div>
            </div>
          </div>
        </div>

        <h1 id="complete-heading" className="complete-title">
          {t.completeScreen.title}
        </h1>

        <p className="complete-lead">
          {t.completeScreen.lead}
        </p>

        {/* Expedition Metrics Summary */}
        <div className="metrics-summary-grid">
          <div className="metric-cell">
            <div className="metric-number">03</div>
            <div className="metric-title">{t.completeScreen.metric1Title}</div>
            <div className="metric-desc">Udupi, Moodabidri, Western Ghats</div>
          </div>

          <div className="metric-cell">
            <div className="metric-number">100%</div>
            <div className="metric-title">{t.completeScreen.metric2Title}</div>
            <div className="metric-desc">Sacred Chowki ritual held in trust</div>
          </div>

          <div className="metric-cell">
            <div className="metric-number">05:42</div>
            <div className="metric-title">{t.completeScreen.metric3Title}</div>
            <div className="metric-desc">{activeLanguage?.name} / Native Dialects</div>
          </div>
        </div>

        {/* Interactive Field Reflection Ledger */}
        <div className="reflection-ledger-box">
          <div className="ledger-header">
            <PenTool size={16} className="pen-icon" />
            <h3 className="ledger-title">{t.completeScreen.ledgerTitle}</h3>
          </div>

          <p className="ledger-hint">
            {t.completeScreen.ledgerHint}
          </p>

          <textarea
            className="reflection-textarea"
            rows={3}
            value={reflectionText}
            onChange={(e) => {
              setReflectionText(e.target.value);
              setReflectionSaved(false);
            }}
            placeholder="Record your reflection on what you learned and respected..."
            aria-label="Traveller reflection note"
          />

          <div className="ledger-actions">
            <button
              onClick={() => setReflectionSaved(true)}
              className="btn btn-secondary save-ledger-btn"
            >
              <BookmarkCheck size={15} />
              <span>{reflectionSaved ? t.completeScreen.savedLedgerBtn : t.completeScreen.sealLedgerBtn}</span>
            </button>
          </div>
        </div>

        {/* Final Navigation Actions */}
        <div className="complete-action-buttons">
          <button onClick={onReturnToMap} className="btn btn-secondary">
            <RotateCcw size={16} />
            <span>{t.completeScreen.returnMapBtn}</span>
          </button>

          <button onClick={onStartNewRegion} className="btn btn-primary">
            <span>{t.completeScreen.nextSectorBtn}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .journey-complete-view {
          padding: 3rem 1.5rem 4rem 1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 65px);
        }

        .complete-journal-spread {
          max-width: 820px;
          width: 100%;
          background-color: var(--color-paper-100);
          border: 1px solid var(--color-paper-200);
          box-shadow: var(--shadow-panel);
          padding: 3.5rem 3.5rem 3rem 3.5rem;
          border-radius: var(--radius-sm);
          text-align: center;
        }

        .complete-top {
          margin-bottom: 1.5rem;
        }

        /* Animated Journal Stamp Seal */
        .stamp-seal-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .expedition-stamp-seal {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px dashed var(--color-terracotta);
          padding: 6px;
          color: var(--color-terracotta);
          transform: rotate(-4deg);
          box-shadow: 0 4px 14px rgba(154, 79, 50, 0.15);
        }

        .stamp-border-outer {
          width: 100%;
          height: 100%;
          border: 1.5px solid var(--color-terracotta);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .stamp-border-inner {
          width: 100%;
          height: 100%;
          border: 1px solid var(--color-terracotta);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(154, 79, 50, 0.04);
        }

        .stamp-text-arc {
          font-family: var(--font-ui);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .stamp-date {
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          margin-top: 2px;
        }

        .stamp-center-icon {
          margin: 6px 0;
          color: var(--color-forest);
        }

        .stamp-subtext {
          font-family: var(--font-ui);
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--color-forest);
        }

        .complete-title {
          font-size: 2.8rem;
          font-weight: 700;
          color: var(--color-ink-900);
          margin-bottom: 0.75rem;
        }

        .complete-lead {
          font-size: 1.1rem;
          color: var(--color-ink-700);
          max-width: 600px;
          margin: 0 auto 2.5rem auto;
          line-height: 1.6;
        }

        .metrics-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-bottom: 2.5rem;
          text-align: left;
        }

        .metric-cell {
          background-color: var(--color-paper-50);
          border: 1px solid var(--color-paper-200);
          padding: 1.25rem;
          border-radius: var(--radius-sm);
        }

        .metric-number {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--color-terracotta);
          line-height: 1;
          margin-bottom: 0.35rem;
        }

        .metric-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-ink-900);
          margin-bottom: 0.2rem;
        }

        .metric-desc {
          font-size: 0.75rem;
          color: var(--color-ink-500);
        }

        .reflection-ledger-box {
          background-color: var(--color-paper-50);
          border: 1px solid var(--color-paper-200);
          border-radius: var(--radius-sm);
          padding: 1.5rem;
          text-align: left;
          margin-bottom: 2.5rem;
        }

        .ledger-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.4rem;
        }

        .pen-icon {
          color: var(--color-terracotta);
        }

        .ledger-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-ink-900);
        }

        .ledger-hint {
          font-size: 0.85rem;
          color: var(--color-ink-500);
          margin-bottom: 0.75rem;
        }

        .reflection-textarea {
          width: 100%;
          background: var(--color-paper-100);
          border: 1px solid var(--color-paper-200);
          border-radius: var(--radius-sm);
          padding: 0.85rem;
          font-family: var(--font-ui);
          font-size: 0.95rem;
          line-height: 1.5;
          color: var(--color-ink-900);
          resize: vertical;
          margin-bottom: 0.75rem;
          outline: none;
        }

        .reflection-textarea:focus {
          border-color: var(--color-terracotta);
        }

        .ledger-actions {
          display: flex;
          justify-content: flex-end;
        }

        .save-ledger-btn {
          font-size: 0.825rem;
        }

        .complete-action-buttons {
          display: flex;
          justify-content: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .complete-journal-spread {
            padding: 2rem 1.25rem;
          }
          .complete-title {
            font-size: 2.1rem;
          }
          .metrics-summary-grid {
            grid-template-columns: 1fr;
          }
          .complete-action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
};
