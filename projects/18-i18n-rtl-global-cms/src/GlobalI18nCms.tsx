'use client';

import React, { useState } from 'react';

type SupportedLocale = 'en-US' | 'ar-SA' | 'ja-JP';

const LOCALE_DATA: Record<SupportedLocale, { dir: 'ltr' | 'rtl'; headline: string; regionCount: string }> = {
  'en-US': {
    dir: 'ltr',
    headline: 'Global Edge Mesh Architecture 2026',
    regionCount: '42 Active Edge PoPs Deployed',
  },
  'ar-SA': {
    dir: 'rtl',
    headline: 'هندسة الشبكة السحابية العالمية ٢٠٢٦',
    regionCount: '٤٢ نقطة حضور سحابية نشطة',
  },
  'ja-JP': {
    dir: 'ltr',
    headline: 'グローバル・エッジメッシュ・アーキテクチャ 2026',
    regionCount: '42箇所のエッジPoPが稼働中',
  },
};

export function GlobalI18nCms(): React.JSX.Element {
  const [locale, setLocale] = useState<SupportedLocale>('en-US');
  const active = LOCALE_DATA[locale];

  return (
    <section
      aria-label="Global i18n, BiDi RTL Layout & ICU CMS"
      dir={active.dir}
      data-testid="bidi-container"
      style={{
        padding: '2rem',
        background: '#090d16',
        color: '#f8fafc',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem' }}>
        {(['en-US', 'ar-SA', 'ja-JP'] as const).map((loc) => (
          <button
            key={loc}
            type="button"
            aria-pressed={locale === loc}
            onClick={() => setLocale(loc)}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              background: locale === loc ? '#38bdf8' : '#1e293b',
              color: locale === loc ? '#090d16' : '#f8fafc',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {loc}
          </button>
        ))}
      </div>

      <article
        style={{
          borderInlineStart: '4px solid #38bdf8',
          paddingInlineStart: '1.25rem',
          background: 'rgba(15, 23, 42, 0.7)',
          paddingBlock: '1rem',
          borderRadius: '10px',
        }}
      >
        <h2 data-testid="localized-headline" style={{ margin: '0 0 0.4rem', fontSize: '1.5rem', fontWeight: 800 }}>
          {active.headline}
        </h2>
        <p style={{ margin: 0, color: '#4ade80', fontWeight: 600 }}>
          {active.regionCount} • Direction: {active.dir.toUpperCase()}
        </p>
      </article>
    </section>
  );
}
