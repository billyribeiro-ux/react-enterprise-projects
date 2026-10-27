'use client';
import './styles.css';

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
      className="l8-styled-node"
    >
      <div className="l8-styled-node">
        {(['en-US', 'ar-SA', 'ja-JP'] as const).map((loc) => (
          <button
            key={loc}
            type="button"
            aria-pressed={locale === loc}
            onClick={() => setLocale(loc)}
            className="l8-styled-node"
          >
            {loc}
          </button>
        ))}
      </div>

      <article
        className="l8-styled-node"
      >
        <h2 data-testid="localized-headline" className="l8-styled-node">
          {active.headline}
        </h2>
        <p className="l8-styled-node">
          {active.regionCount} • Direction: {active.dir.toUpperCase()}
        </p>
      </article>
    </section>
  );
}
