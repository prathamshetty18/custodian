import React from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  MapPin, 
  Scroll, 
  BookOpen, 
  HeartHandshake,
  CheckCircle,
  FileText
} from 'lucide-react';
import { getLocalizedNote } from '../data/fieldNotesData';
import { UI_TRANSLATIONS } from '../data/translations';

export const CustodianProfile = ({
  note,
  activeLanguage,
  onBackToStory,
  onCompleteJourney
}) => {
  const localizedNote = getLocalizedNote(note, activeLanguage?.id);
  const custodian = localizedNote.custodian;
  const t = UI_TRANSLATIONS[activeLanguage?.id] || UI_TRANSLATIONS.en;

  return (
    <section className="custodian-profile-view transition-level-3-pageturn" aria-labelledby="custodian-name">
      <div className="profile-journal-card parchment-panel">
        {/* Navigation Bar */}
        <div className="profile-top-bar">
          <button onClick={onBackToStory} className="btn btn-secondary profile-back-btn">
            <ArrowLeft size={16} />
            <span>{t.custodianScreen.returnToStory} ({localizedNote.label})</span>
          </button>

          <span className="journey-label">{t.custodianScreen.specTag}</span>
        </div>

        {/* Profile Header & Provenance Shield */}
        <div className="profile-hero">
          <div className="custodian-monogram-crest">
            <span className="crest-initial">{custodian.name[0]}</span>
            <div className="crest-seal-badge" title="Verified Custodian">
              <ShieldCheck size={16} />
            </div>
          </div>

          <div className="hero-text">
            <div className="profile-role-badge">
              <Scroll size={13} />
              <span>{custodian.role}</span>
            </div>
            
            <h1 id="custodian-name" className="custodian-fullname">
              {custodian.name}
            </h1>

            <div className="custodian-location-sub">
              <MapPin size={15} />
              <span>{custodian.village} · {localizedNote.region}</span>
            </div>
          </div>
        </div>

        {/* Heritage Lineage & Oral Authority */}
        <div className="profile-section-block">
          <h3 className="section-label">{t.custodianScreen.lineageTitle}</h3>
          <p className="lineage-quote">
            “{custodian.lineage}”
          </p>
          <p className="custodian-biography">
            {custodian.bio}
          </p>
        </div>

        {/* Cultural Consent & Trust Framework */}
        <div className="consent-framework-box">
          <div className="framework-header">
            <HeartHandshake size={18} className="framework-icon" />
            <h4 className="framework-title">{t.custodianScreen.covenantTitle}</h4>
          </div>

          <p className="framework-statement">
            {custodian.trustFraming}
          </p>

          <div className="consent-points-list">
            {t.custodianScreen.consentPoints.map((pt, idx) => (
              <div key={idx} className="consent-item">
                <CheckCircle size={14} className="check-point" />
                <span>{pt}</span>
              </div>
            ))}
          </div>

          <div className="community-seal-strip">
            <Award size={15} className="seal-icon" />
            <span>{custodian.communitySeal}</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="profile-actions-footer">
          <button onClick={onBackToStory} className="btn btn-secondary">
            {t.custodianScreen.returnBtn}
          </button>

          <button onClick={onCompleteJourney} className="btn btn-primary">
            <span>{t.custodianScreen.completeBtn}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .custodian-profile-view {
          padding: 3rem 1.5rem 4rem 1.5rem;
          display: flex;
          justify-content: center;
          min-height: calc(100vh - 65px);
        }

        .profile-journal-card {
          max-width: 820px;
          width: 100%;
          background-color: var(--color-paper-100);
          border: 1px solid var(--color-paper-200);
          box-shadow: var(--shadow-panel);
          padding: 3rem 3.5rem;
          border-radius: var(--radius-sm);
        }

        .profile-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--color-paper-200);
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .profile-back-btn {
          padding-left: 0;
          font-size: 0.85rem;
        }

        .profile-hero {
          display: flex;
          align-items: center;
          gap: 1.75rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .custodian-monogram-crest {
          width: 84px;
          height: 84px;
          border-radius: 50%;
          background-color: var(--color-paper-50);
          border: 2px solid var(--color-terracotta);
          box-shadow: 0 4px 12px rgba(41, 37, 31, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
        }

        .crest-initial {
          font-family: var(--font-display);
          font-size: 3rem;
          font-weight: 700;
          color: var(--color-ink-900);
          line-height: 1;
        }

        .crest-seal-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--color-forest);
          color: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--color-paper-100);
        }

        .profile-role-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-terracotta);
          background: var(--color-terracotta-soft);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-sm);
          margin-bottom: 0.4rem;
        }

        .custodian-fullname {
          font-size: 2.6rem;
          font-weight: 700;
          line-height: 1.1;
          color: var(--color-ink-900);
          margin-bottom: 0.35rem;
        }

        .custodian-location-sub {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.95rem;
          color: var(--color-ink-500);
        }

        .profile-section-block {
          margin-bottom: 2.25rem;
          border-top: 1px solid var(--color-paper-200);
          padding-top: 1.5rem;
        }

        .section-label {
          font-family: var(--font-ui);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-ink-500);
          margin-bottom: 0.75rem;
        }

        .lineage-quote {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-style: italic;
          color: var(--color-ink-900);
          margin-bottom: 1rem;
          line-height: 1.45;
        }

        .custodian-biography {
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--color-ink-700);
        }

        .consent-framework-box {
          background-color: var(--color-paper-50);
          border: 1px solid var(--color-paper-200);
          border-radius: var(--radius-sm);
          padding: 1.75rem;
          margin-bottom: 2.5rem;
        }

        .framework-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.75rem;
        }

        .framework-icon {
          color: var(--color-forest);
        }

        .framework-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--color-ink-900);
        }

        .framework-statement {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--color-ink-700);
          margin-bottom: 1.25rem;
        }

        .consent-points-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-bottom: 1.25rem;
        }

        .consent-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.875rem;
          color: var(--color-ink-900);
          line-height: 1.45;
        }

        .check-point {
          color: var(--color-forest);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .community-seal-strip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--color-forest-soft);
          color: var(--color-forest);
          border: 1px solid rgba(64, 88, 68, 0.35);
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
        }

        .seal-icon {
          color: var(--color-forest);
        }

        .profile-actions-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--color-paper-200);
          padding-top: 1.75rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .profile-journal-card {
            padding: 2rem 1.25rem;
          }
          .custodian-fullname {
            font-size: 2rem;
          }
          .profile-actions-footer {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </section>
  );
};
