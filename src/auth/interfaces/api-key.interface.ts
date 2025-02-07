export interface ApiKey {
  name: string;
  description: string;
  ips: string[];
  key: string;
  permission: Record<string, any>;
  expires_at: number;
}
