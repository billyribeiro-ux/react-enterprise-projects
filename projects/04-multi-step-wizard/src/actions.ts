'use server';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const StepSchema = z.object({
  sessionToken: z.string(),
  companyLegalName: z.string().min(2),
  countryCode: z.string().length(2)
});

export async function advanceWizard(prevState: any, formData: FormData) {
  const parsed = StepSchema.safeParse({
    sessionToken: formData.get('sessionToken'),
    companyLegalName: formData.get('companyLegalName'),
    countryCode: formData.get('countryCode')
  });

  if (!parsed.success) return { success: false, error: 'Invalid input' };

  try {
    await prisma.onboardingSession.upsert({
      where: { sessionToken: parsed.data.sessionToken },
      update: { companyLegalName: parsed.data.companyLegalName, countryCode: parsed.data.countryCode, currentStep: 2 },
      create: { sessionToken: parsed.data.sessionToken, companyLegalName: parsed.data.companyLegalName, countryCode: parsed.data.countryCode, currentStep: 2 }
    });
    return { success: true, step: 2 };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}