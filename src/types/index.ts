export interface Project {
  id: string;
  name: string;
  tagline: string;
  url: string;
  tags: string[];
  status: "live" | "coming-soon";
  size?: "sm" | "md" | "lg";
}
