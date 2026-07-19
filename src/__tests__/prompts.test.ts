import { describe, it, expect } from 'vitest';
import { getPromptForRole, getPromptForRoleAndLanguage, ROLE_PROMPTS } from '../lib/prompts';
import type { Role } from '../lib/types';

describe('prompts module', () => {
  describe('getPromptForRole', () => {
    const roles: Role[] = ['Fan', 'Organizer', 'Volunteer', 'Staff'];

    it.each(roles)('returns a non-empty prompt for role "%s"', (role) => {
      const prompt = getPromptForRole(role);
      expect(prompt).toBeTruthy();
      expect(prompt.length).toBeGreaterThan(50);
    });

    it('returns the Fan prompt as fallback for an unknown role', () => {
      // Cast to bypass type checking for this edge-case test
      const prompt = getPromptForRole('Unknown' as Role);
      expect(prompt).toBe(ROLE_PROMPTS.Fan);
    });

    it('includes the base context in every role prompt', () => {
      for (const role of roles) {
        const prompt = getPromptForRole(role);
        expect(prompt).toContain('Movra');
        expect(prompt).toContain('FIFA World Cup 2026');
        expect(prompt).toContain('safety');
        expect(prompt).toContain('accessibility');
        expect(prompt).toContain('sustainability');
      }
    });

    it('includes multilingual support instructions in the base context', () => {
      const prompt = getPromptForRole('Fan');
      expect(prompt).toContain('multilingual');
      expect(prompt.toLowerCase()).toContain('spanish');
    });

    it('Fan prompt focuses on navigation and transport', () => {
      const prompt = getPromptForRole('Fan');
      expect(prompt.toLowerCase()).toContain('navigation');
      expect(prompt.toLowerCase()).toContain('transport');
    });

    it('Organizer prompt focuses on crowd management and operational intelligence', () => {
      const prompt = getPromptForRole('Organizer');
      expect(prompt.toLowerCase()).toContain('crowd management');
      expect(prompt.toLowerCase()).toContain('operational intelligence');
      expect(prompt.toLowerCase()).toContain('decision support');
    });

    it('Staff prompt focuses on incident response and decision support', () => {
      const prompt = getPromptForRole('Staff');
      expect(prompt.toLowerCase()).toContain('incident response');
      expect(prompt.toLowerCase()).toContain('decision support');
    });

    it('Volunteer prompt focuses on assisting fans and coordination', () => {
      const prompt = getPromptForRole('Volunteer');
      expect(prompt.toLowerCase()).toContain('assisting fans');
      expect(prompt.toLowerCase()).toContain('coordination');
    });
  });

  describe('getPromptForRoleAndLanguage', () => {
    it('returns base prompt for English (no additional instruction)', () => {
      const prompt = getPromptForRoleAndLanguage('Fan', 'en');
      expect(prompt).toBe(getPromptForRole('Fan'));
    });

    it('appends Spanish instruction for "es" language', () => {
      const prompt = getPromptForRoleAndLanguage('Fan', 'es');
      expect(prompt).toContain('Spanish');
      expect(prompt).toContain('Español');
    });

    it('appends French instruction for "fr" language', () => {
      const prompt = getPromptForRoleAndLanguage('Organizer', 'fr');
      expect(prompt).toContain('French');
      expect(prompt).toContain('Français');
    });

    it('appends Arabic instruction for "ar" language', () => {
      const prompt = getPromptForRoleAndLanguage('Staff', 'ar');
      expect(prompt).toContain('Arabic');
    });

    it('appends Portuguese instruction for "pt" language', () => {
      const prompt = getPromptForRoleAndLanguage('Volunteer', 'pt');
      expect(prompt).toContain('Portuguese');
      expect(prompt).toContain('Português');
    });

    it('defaults to English when no language is provided', () => {
      const prompt = getPromptForRoleAndLanguage('Fan');
      expect(prompt).toBe(getPromptForRole('Fan'));
    });
  });
});
