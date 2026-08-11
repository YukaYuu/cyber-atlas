export type CategoryId =
  | "ssh"
  | "ftp"
  | "mail"
  | "apache"
  | "imap"
  | "bots"
  | "bruteforcelogin";

export type AttackEvent = {
  ip: string;
  category: CategoryId;
  label: string;
  port: number | null;
  country: string | null;
  countryCode: string | null;
  city: string | null;
  lat: number;
  lon: number;
  isp: string | null;
  org: string | null;
  asn: string | null;
  timestamp: string;
};

export type Dataset = {
  generatedAt: string;
  replayWindowHours: number;
  sourceNote: string;
  categories: { id: CategoryId; label: string }[];
  events: AttackEvent[];
};
