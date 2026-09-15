import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  Lock, 
  FileText,
  UserCheck,
  Compass,
  Bookmark
} from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';
import { CustodianBoundary } from './CustodianBoundary';
import { getLocalizedNote } from '../data/fieldNotesData';
import { UI_TRANSLATIONS } from '../data/translations';

export const StoryScroll = ({
  note,
  activeLanguage,
  onBackToMap,
  onOpenCustodian,
  onCompleteJourney,
  onAudioPlayStateChange
}) => {
  const [isSaved, setIsSaved] = useState(false);

  // Derive localized version of note based on currently active language
  const localizedNote = getLocalizedNote(note, activeLanguage.id);
  const t = UI_TRANSLATIONS[activeLanguage.id] || UI_TRANSLATIONS.en;

  return (
    <article className="story-scroll-view transition-level-3-unfold" aria-labelledby="story-title">
      <div className="story-journal-container">
        {/* Breadcrumb Navigation Bar */}
        <div className="story-nav-bar">
          <button onClick={onBackToMap} className="btn btn-secondary nav-back-btn">
            <ArrowLeft size={16} />
            <span>{t.storyScreen.returnToMap}</span>
          </button>

          <div className="story-quick-actions">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`util-btn ${isSaved ? 'active' : ''}`}
              title="Bookmark in field notes"
              aria-label="Bookmark field note"
            >
              <Bookmark size={14} />
              <span>{isSaved ? t.storyScreen.bookmarked : t.storyScreen.saveNote}</span>
            </button>
          </div>
        </div>

        {/* Spec Page 7: Journal Entry Layout Header */}
        <div className="journal-entry-header">
          <div className="field-meta-row">
            <span className="journey-label">{localizedNote.label}</span>
            
            <div className="verification-badges-group">
              {/* Spec Page 8: CUSTODIAN VERIFIED small green seal */}
              <span className="seal-verified" title="Verified by community elders">
                <ShieldCheck size={14} />
                {localizedNote.verifiedBadge}
              </span>

              {localizedNote.permissions.map((p, idx) => (
                <span key={idx} className={`badge-permission ${p.type}`}>
                  {p.text}
                </span>
              ))}
            </div>
          </div>

          <h1 id="story-title" className="story-title-display">
            {localizedNote.title.toUpperCase()}
          </h1>

          <div className="story-location-line">
            <MapPin size={16} className="loc-pin" />
            <span>{t.storyScreen.locPrefix} {localizedNote.location}, {localizedNote.region}</span>
          </div>

          <div className="story-divider"></div>

          {/* Pull quote in Cormorant Garamond italic (Spec Page 7) */}
          <blockquote className="custodian-pull-quote">
            “{localizedNote.quote}”
          </blockquote>

          {/* Custodian Attribution (Spec Page 7) */}
          <div className="custodian-attribution-bar">
            <div className="custodian-info">
              <span className="told-by-prefix">{t.storyScreen.toldBy}</span>
              <button 
                onClick={() => onOpenCustodian(localizedNote)} 
                className="custodian-name-link"
                title="View full custodian profile"
              >
                {localizedNote.custodian.name}
              </button>
              <span className="role-chip">· {localizedNote.custodian.role}</span>
            </div>

            <button
              onClick={() => onOpenCustodian(localizedNote)}
              className="btn btn-secondary view-profile-btn"
            >
              <UserCheck size={14} />
              <span>{t.storyScreen.attributionBtn}</span>
            </button>
          </div>
        </div>

        {/* Spec Page 8: Audio Experience */}
        <AudioPlayer
          note={localizedNote}
          activeLanguage={activeLanguage}
          onAudioPlayStateChange={onAudioPlayStateChange}
        />

        {/* Narrative Field Body (Spec Page 4: 16-18px min 16px Inter) */}
        <div className="journal-narrative-content">
          <p className="narrative-paragraph lead-p">
            {localizedNote.bodyText}
          </p>

          <p className="narrative-paragraph">
            {localizedNote.secondaryText}
          </p>
        </div>

        {/* Spec Page 8: Custodian Boundary Pattern */}
        {localizedNote.custodianBoundary && localizedNote.custodianBoundary.hasBoundary && (
          <CustodianBoundary
            boundary={localizedNote.custodianBoundary}
            custodianName={localizedNote.custodian.name}
            activeLanguage={activeLanguage}
          />
        )}

        {/* Chapter Closure Action Bar */}
        <div className="story-closure-footer">
          <div className="closure-note">
            <CheckCircle2 size={16} className="check-icon" />
            <span>Field Note {localizedNote.noteNumber} {t.storyScreen.completedNoteText}</span>
          </div>

          <div className="closure-buttons">
            <button onClick={() => onOpenCustodian(localizedNote)} className="btn btn-secondary">
              {t.storyScreen.provenanceBtn}
            </button>

            <button onClick={onCompleteJourney} className="btn btn-primary">
              <span>{t.storyScreen.continueJourneyBtn}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .story-scroll-view {
          padding: 2.5rem 1.5rem 4rem 1.5rem;
          display: flex;
          justify-content: center;
          min-height: calc(100vh - 65px);
        }

        .story-journal-container {
          max-width: 860px;
          width: 100%;
          background-color: var(--color-paper-100);
          border: 1px solid var(--color-paper-200);
          box-shadow: var(--shadow-panel);
          padding: 3rem 3.5rem;
          border-radius: var(--radius-sm);
        }

        .story-nav-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--color-paper-200);
        }

        .nav-back-btn {
          padding-left: 0;
          font-size: 0.875rem;
        }

        .field-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .verification-badges-group {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
        }

        .story-title-display {
          font-size: 2.75rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--color-ink-900);
          margin-bottom: 0.5rem;
          line-height: 1.15;
        }

        .story-location-line {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 1.15rem;
          font-family: var(--font-display);
          color: var(--color-ink-700);
          margin-bottom: 1.25rem;
        }

        .loc-pin {
          color: var(--color-terracotta);
        }

        .story-divider {
          width: 100%;
          height: 1px;
          background-color: var(--color-paper-200);
          margin: 1.25rem 0 1.75rem 0;
        }

        .custodian-pull-quote {
          font-family: var(--font-display);
          font-size: 1.55rem;
          font-style: italic;
          color: var(--color-ink-900);
          line-height: 1.4;
          margin: 1.5rem 0;
          padding-left: 1.25rem;
          border-left: 3px solid var(--color-terracotta);
        }

        .custodian-attribution-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--color-paper-50);
          padding: 0.85rem 1.25rem;
          border: 1px solid var(--color-paper-200);
          border-radius: var(--radius-sm);
          margin-bottom: 1.75rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .custodian-info {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.95rem;
        }

        .told-by-prefix {
          color: var(--color-ink-500);
        }

        .custodian-name-link {
          background: none;
          border: none;
          font-family: var(--font-ui);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-ink-900);
          cursor: pointer;
          text-decoration: underline;
          text-decoration-color: var(--color-paper-300);
          text-underline-offset: 3px;
        }

        .custodian-name-link:hover {
          color: var(--color-terracotta);
        }

        .role-chip {
          color: var(--color-ink-500);
          font-size: 0.85rem;
        }

        .view-profile-btn {
          font-size: 0.825rem;
        }

        .journal-narrative-content {
          margin: 2rem 0;
        }

        .narrative-paragraph {
          font-family: var(--font-ui);
          font-size: 1.1rem;
          line-height: 1.75;
          color: var(--color-ink-900);
          margin-bottom: 1.35rem;
          max-width: 100%;
        }

        .lead-p::first-letter {
          font-family: var(--font-display);
          font-size: 3.4rem;
          float: left;
          line-height: 0.85;
          margin-right: 0.5rem;
          color: var(--color-terracotta);
          font-weight: 700;
        }

        .story-closure-footer {
          margin-top: 3.5rem;
          padding-top: 1.75rem;
          border-top: 1px solid var(--color-paper-200);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.25rem;
        }

        .closure-note {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--color-forest);
          font-weight: 500;
        }

        .check-icon {
          color: var(--color-forest);
        }

        .closure-buttons {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        @media (max-width: 768px) {
          .story-journal-container {
            padding: 1.75rem 1.25rem;
          }
          .story-title-display {
            font-size: 2rem;
          }
          .custodian-pull-quote {
            font-size: 1.3rem;
          }
          .story-closure-footer {
            flex-direction: column;
            align-items: stretch;
          }
          .closure-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </article>
  );
};
