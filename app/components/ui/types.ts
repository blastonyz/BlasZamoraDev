export type ProjectFeature = {
  title: string;
  text: string;
};

export type Project3DItem = {
  id: number;
  title: string;
  image: string;
  url: string;
  colorCard: [number, number, number];
  type: string;
  description: string;
  features: ProjectFeature[];
  tech: string[];
  live: string;
  repo: string;
  status?: string;
  year?: string;
  role?: string;
};
