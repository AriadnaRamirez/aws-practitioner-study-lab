import { factsToQuestions } from './content.seed-extra';
import { CCP_PRACTICE_FACTS } from './content.seed-ccp';

describe('CCP practice questions', () => {
  const questions = factsToQuestions(CCP_PRACTICE_FACTS, 'ccp');

  it('keeps one correct answer and unique ids', () => {
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(questions.length).toBeGreaterThanOrEqual(24);
    for (const q of questions) {
      expect(q.choices).toHaveLength(4);
      expect(q.choices[q.correctIndex]?.length).toBeGreaterThan(0);
      expect(q.explanation.length).toBeGreaterThan(40);
    }
  });

  it('teaches the host and the guest as different jobs', () => {
    const byKey = new Map(CCP_PRACTICE_FACTS.map((f) => [f.key, f.correct]));
    expect(byKey.get('ccp-host-os')).toBe('AWS');
    expect(byKey.get('ccp-guest-os')).toMatch(/Tú/);
    expect(byKey.get('ccp-ec2-guest-os')).toMatch(/EC2/);
  });

  it('matches the current support-plan severities', () => {
    const support = CCP_PRACTICE_FACTS.find((f) => f.key === 'ccp-business-plus')!;
    expect(support.correct).toBe('En menos de 1 hora');
    expect(support.explanation).toMatch(/30 minutos/);
    expect(support.explanation).toMatch(/15 minutos/);
  });
});
