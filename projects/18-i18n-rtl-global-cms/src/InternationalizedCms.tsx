'use client';
import React, { useState } from 'react';

export function InternationalizedCms() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  const content = {
    en: { dir: 'ltr', title: 'Global Cloud Security & Resilience', text: 'Modern enterprise systems mandate zero-trust architecture.' },
    ar: { dir: 'rtl', title: 'أمن السحابة العالمية والمرونة', text: 'تفرض أنظمة المؤسسات الحديثة بنية انعدام الثقة الشاملة.' }
  };

  const cur = content[lang];

  return (
    <div className="i18n-root" dir={cur.dir} data-testid="i18n-root">
      <header className="i18n-header">
        <h2>{lang === 'en' ? 'Enterprise Global CMS' : 'نظام إدارة المحتوى العالمي'}</h2>
        <div className="lang-buttons">
          <button onClick={() => setLang('en')} className={lang === 'en' ? 'active' : ''} data-testid="lang-en">English</button>
          <button onClick={() => setLang('ar')} className={lang === 'ar' ? 'active' : ''} data-testid="lang-ar">العربية</button>
        </div>
      </header>

      <article className="cms-article">
        <h3>{cur.title}</h3>
        <p>{cur.text}</p>
      </article>
    </div>
  );
}