import { extractSkillsFromText, getSearchableText } from './skill-extractor';
import { ResumeData } from '../interfaces/profile';

describe('extractSkillsFromText', () => {
  it('matches dictionary entries present in the text, case-insensitively', () => {
    const result = extractSkillsFromText(
      'Built firmware in c++ and integrated the OpenAI API.',
      ['C++', 'OpenAi API', 'Python']
    );
    expect(result).toEqual(['C++', 'OpenAi API']);
  });

  it('does not match substrings of other words', () => {
    const result = extractSkillsFromText('Worked on Java concurrency.', ['C']);
    expect(result).toEqual([]);
  });

  it('matches multi-word phrases', () => {
    const result = extractSkillsFromText(
      'Experience with Robot Framework for test automation.',
      ['Robot Framework']
    );
    expect(result).toEqual(['Robot Framework']);
  });
});

describe('getSearchableText', () => {
  it('collects text from about, experiences, projects, and education', () => {
    const data: Partial<ResumeData> = {
      about: 'About text',
      experiences: [
        { position: 'Engineer', company: 'Acme', date: '2024', details: ['Detail one'] },
      ],
      projects: [{ title: 'Project title', description: 'Project description' }],
      education: { degree: 'Degree', university: 'Uni', graduation_date: '2024' },
    };

    const text = getSearchableText(data);

    expect(text).toContain('About text');
    expect(text).toContain('Engineer');
    expect(text).toContain('Detail one');
    expect(text).toContain('Project title');
    expect(text).toContain('Project description');
    expect(text).toContain('Degree');
  });

  it('handles missing optional sections gracefully', () => {
    expect(getSearchableText({})).toBe('');
  });
});
