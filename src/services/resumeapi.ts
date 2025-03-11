export interface Education {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
  gpa?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  image?: string;
}

export interface Resume {
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: {
    category: string;
    items: string[];
  }[];
}

class ResumeApi {
  async getResume(): Promise<Resume> {
    const response = await fetch('http://127.0.0.1:8000/api/v1/portfolio/resume/');
    if (!response.ok) {
      throw new Error('Failed to fetch resume data');
    }
    return response.json();
  }

  async downloadResume(): Promise<Blob> {
    const response = await fetch('http://127.0.0.1:8000/api/v1/portfolio/resume/download/');
    if (!response.ok) {
      throw new Error('Failed to download resume');
    }
    return response.blob();
  }
}

export const resumeApi = new ResumeApi();
