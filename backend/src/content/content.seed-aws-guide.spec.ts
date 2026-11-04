import { AWS_GUIDE_CONCEPTS, AWS_GUIDE_QUESTIONS } from './aws-guide.data';
import { buildAwsGuideQuestions, polishGuideQuestion } from './content.seed-aws-guide';

describe('guide question copy', () => {
  it('turns the scenario template into one sentence', () => {
    const raw = AWS_GUIDE_QUESTIONS.find((q) => q.number === 4)!;
    const concept = AWS_GUIDE_CONCEPTS.find((c) => c.key === raw.conceptKey)!;
    const polished = polishGuideQuestion(raw, concept);
    expect(polished.stem).toBe(
      'Necesitas una máquina virtual para instalar y ejecutar una aplicación web con control sobre el sistema operativo. ¿Qué servicio de AWS usas?',
    );
    expect(polished.optionExplanations.join('\n')).not.toMatch(/objetivo descrito|organización/);
  });

  it('replaces the broken “no es una sigla” question', () => {
    const raw = AWS_GUIDE_QUESTIONS.find((q) => q.number === 27)!;
    const concept = AWS_GUIDE_CONCEPTS.find((c) => c.key === 'dynamodb')!;
    const polished = polishGuideQuestion(raw, concept);
    expect(polished.stem).toBe('¿Para qué sirve Amazon DynamoDB?');
    expect(polished.choices.join(' ')).not.toMatch(/No aplica|terceros/);
    expect(polished.correctIndex).toBe(0);
  });

  it('names the other service instead of leaving it in lowercase', () => {
    const questions = buildAwsGuideQuestions();
    const ec2 = questions.find((q) => q.id === 'eq-guide-002')!;
    expect(ec2.explanation).toContain('AWS Lambda');
    expect(ec2.explanation).not.toMatch(/aws lambda/);
    expect(questions).toHaveLength(100);
  });
});
