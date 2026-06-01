// Product work showcased on /projects. Edit freely; `featured` items appear on the home page.
export interface Project {
  title: string;
  org?: string;
  period?: string;
  description: string;
  points?: string[];
  tags?: string[];
  featured?: boolean;
}

export const PROJECTS: Project[] = [];
