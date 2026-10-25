'use client';
import React, { useActionState, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { advanceWizard } from './actions';

export function CinematicWizard({ sessionToken }: { sessionToken: string }) {
  const [step, setStep] = useState(1);
  const formCardRef = useRef<HTMLDivElement | null>(null);
  const [state, formAction, isPending] = useActionState(advanceWizard, { success: true });

  useEffect(() => {
    if (formCardRef.current) {
      gsap.fromTo(
        formCardRef.current,
        { opacity: 0, scale: 0.95, filter: 'blur(8px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.6, ease: 'back.out(1.4)' }
      );
    }
  }, [step]);

  return (
    <div className="cinematic-wizard-root" data-testid="wizard-root">
      <div className="stepper-track">
        <div className={`step-pill ${step >= 1 ? 'done' : ''}`}>1. Corporate Legal</div>
        <div className={`step-pill ${step >= 2 ? 'done' : ''}`}>2. Signatory & Biometrics</div>
        <div className={`step-pill ${step >= 3 ? 'done' : ''}`}>3. Global Clearance</div>
      </div>

      <div ref={formCardRef} className="wizard-glass-card">
        <h3>Step 1: Entity Identification</h3>
        <form action={formAction} className="wizard-form">
          <input type="hidden" name="sessionToken" value={sessionToken} />
          <div className="input-group">
            <label htmlFor="companyName">Legal Entity Name</label>
            <input id="companyName" name="companyLegalName" required defaultValue="Skydance Orbital LLC" className="cinema-input" />
          </div>
          <div className="input-group">
            <label htmlFor="country">Jurisdiction Code (ISO 2)</label>
            <input id="country" name="countryCode" maxLength={2} required defaultValue="US" className="cinema-input" />
          </div>
          <button type="submit" disabled={isPending} className="btn-cinema-glow" data-testid="wizard-submit">
            {isPending ? 'Verifying Registry...' : 'Authorize & Proceed →'}
          </button>
        </form>
      </div>
    </div>
  );
}