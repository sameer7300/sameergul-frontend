    const API_BASE_URL = 'http://127.0.0.1:8000/api/v1/portfolio';

export interface Skill {
  id: number;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'other';
  icon: string;
  proficiency: number;
  description?: string;
  years_experience: number;
  is_featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export const skillsApi = {
  getSkills: async (): Promise<{ results: Skill[] }> => {
    try {
      console.log('Fetching skills from:', `${API_BASE_URL}/skills/`);
      const response = await fetch(`${API_BASE_URL}/skills/`);
      if (!response.ok) {
        console.error('Skills API Error:', response.status, response.statusText);
        throw new Error(`Failed to fetch skills: ${response.status}`);
      }
      const data = await response.json();
      console.log('Skills API Response:', data);
      return data;
    } catch (error) {
      console.error('Skills API Error:', error);
      throw error;
    }
  },
};
