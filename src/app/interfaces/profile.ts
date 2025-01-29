// Interface for Contact Details
export interface ContactDetails {
  name: string;
  title: string;
  phoneNumber: string;
  gmailAddress: string;
  livingAddress: string;
}

// Interface for Work Experience
export interface WorkExperience {
  position: string;
  company: string;
  date: string;
  details: string[];
}

// Interface for Projects
export interface Project {
  title: string;
  description: string;
}

// Interface for Education
export interface Education {
  degree: string;
  university: string;
  graduation_date: string;
}

// Main Interface for the Entire Data Structure
export interface ResumeData {
  contactDetails: ContactDetails;
  about: string;
  experiences: WorkExperience[];
  projects: Project[];
  education: Education;
  languages: string[];
  softSkills: string[];
}
