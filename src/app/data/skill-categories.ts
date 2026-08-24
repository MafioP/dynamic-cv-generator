export interface SkillCategory {
  name: string;
  skills: string[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: 'Languages',
    skills: ['Java', 'Python', 'C++', 'C#', 'JavaScript', 'TypeScript'],
  },
  {
    name: 'Frameworks & Libraries',
    skills: ['Angular', 'Node.js'],
  },
  {
    name: 'Web',
    skills: ['HTML5', 'CSS3', 'REST APIs'],
  },
  {
    name: 'Databases',
    skills: ['MySQL', 'MongoDB'],
  },
  {
    name: 'Platforms & Tools',
    skills: ['Google Cloud Platform', 'Git', 'Docker'],
  },
  {
    name: 'Practices',
    skills: ['OOP', 'CI/CD', 'Agile/Scrum'],
  },
  {
    name: 'Other',
    skills: ['Embedded', 'OpenAi API', 'Robot Framework', '3D Printing', 'CAN Bus', 'Unity'],
  },
];
