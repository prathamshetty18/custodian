import React, { useState } from 'react';
import { Lock, ShieldCheck, HeartHandshake } from 'lucide-react';
import { UI_TRANSLATIONS } from '../data/translations';

export const CustodianBoundary = ({ boundary, custodianName, activeLanguage }) => {
  const [acknowledged, setAcknowledged] = useState(false);
  const t = UI_TRANSLATIONS[activeLanguage?.id] || UI_TRANSLATIONS.en;

  if (!boundary || !boundary.hasBoundary) return null;

  return (
    <div className="custodian-boundary-container parchment-panel" role="region" aria-label="Custodian Protected Cultural Boundary">
      <div className="boundary-card-inner">
        {/* Spec Page 8 Header: ~ LOCKED ~ */}
        <div className="boundary-pill">
          <Lock size={12} className="lock-icon" />
          <span>{t.storyScreen.boundary.locked}</span>
        </div>

        {/* CUSTODIAN BOUNDARY Heading */}
        <h3 className="boundary-title">{boundary.boundaryTitle || t.storyScreen.boundary.title}</h3>

        <div className="boundary-divider"></div>

        {/* Boundary Core Reason */}
        <div className="boundary-lead">
          {boundary.reason || "This part of the tradition isn't publicly shared."}
        </div>

        {/* Cultural Explanation */}
        <p className="boundary-detail">
          {boundary.explanation}
        </p>

        {/* Respect Action Button (Spec Page 9: Forest / neutral treatment) */}
        <div className="boundary-actions">
          {!acknowledged ? (
            <button
              onClick={() => setAcknowledged(true)}
              className="btn btn-respect"
              aria-label="Acknowledge and respect custodian boundary"
            >
              <HeartHandshake size={16} />
              <span>{t.storyScreen.boundary.respectBtn}</span>
            </button>
          ) : (
            <div className="boundary-acknowledged-badge" role="status">
              <ShieldCheck size={16} />
              <span>{t.storyScreen.boundary.acknowledged}</span>
            </div>
          )}
        </div>

        <div className="boundary-footer-note">
          {boundary.respectNote}
        </div>
      </div>

      <style>{`
        .custodian-boundary-container {
          background-color: var(--color-paper-50);
          border: 1px solid rgba(64, 88, 68, 0.45);
          border-radius: var(--radius-sm);
          margin: 2.5rem 0;
          box-shadow: var(--shadow-parchment);
          position: relative;
        }

        .boundary-card-inner {
          padding: 2.25rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .boundary-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-ui);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-forest);
          background-color: var(--color-forest-soft);
          border: 1px solid rgba(64, 88, 68, 0.3);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          margin-bottom: 0.75rem;
        }

        .lock-icon {
          color: var(--color-forest);
        }

        .boundary-title {
          font-family: var(--font-display);
          font-size: 1.85rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--color-ink-900);
          margin-bottom: 0.5rem;
        }

        .boundary-divider {
          width: 60px;
          height: 1px;
          background-color: rgba(64, 88, 68, 0.35);
          margin: 0.75rem 0 1.25rem 0;
        }

        .boundary-lead {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-style: italic;
          color: var(--color-ink-900);
          margin-bottom: 1rem;
          max-width: 500px;
        }

        .boundary-detail {
          font-size: 0.95rem;
          color: var(--color-ink-700);
          line-height: 1.6;
          max-width: 580px;
          margin-bottom: 1.75rem;
        }

        .boundary-actions {
          margin-bottom: 1.25rem;
        }

        .boundary-acknowledged-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-forest);
          background: var(--color-forest-soft);
          border: 1px solid rgba(64, 88, 68, 0.4);
          padding: 0.6rem 1.15rem;
          border-radius: var(--radius-sm);
        }

        .boundary-footer-note {
          font-size: 0.8rem;
          color: var(--color-ink-500);
          font-style: italic;
          max-width: 540px;
        }
      `}</style>
    </div>
  );
};
