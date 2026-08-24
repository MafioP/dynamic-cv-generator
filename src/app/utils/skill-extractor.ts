import { ResumeData } from '../interfaces/profile';

/**
 * Concatenates the free-text fields of a resume (about, experience, projects,
 * education) that skills are realistically mentioned in, for keyword matching.
 */
export function getSearchableText(data: Partial<ResumeData>): string {
  const parts: string[] = [];

  if (data.about) {
    parts.push(data.about);
  }

  (data.experiences ?? []).forEach(experience => {
    parts.push(experience.position, ...experience.details);
  });

  (data.projects ?? []).forEach(project => {
    parts.push(project.title, project.description);
  });

  if (data.education) {
    parts.push(data.education.degree);
  }

  return parts.join(' ');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Returns the entries of `dictionary` that appear as whole words/phrases in
 * `text` (case-insensitive). Boundaries are checked against alphanumerics
 * rather than \b so symbol-containing skills like "C++" or "C#" still match.
 */
export function extractSkillsFromText(text: string, dictionary: string[]): string[] {
  return dictionary.filter(skill => {
    const pattern = new RegExp(
      `(?<![a-zA-Z0-9])${escapeRegExp(skill)}(?![a-zA-Z0-9])`,
      'i'
    );
    return pattern.test(text);
  });
}
