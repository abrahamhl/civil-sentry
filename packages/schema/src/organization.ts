import type { Confidence } from './confidence.js';

/** The operating mode of a Run. See docs/adr/ADR-001-authorization-gate.md. */
export type Mode = 'STREET_PASSIVE' | 'AUTHORIZED_ASSESSMENT';

export interface GeoLocation {
  lat: number;
  lon: number;
  /** Human-readable label. For synthetic data this MUST say so explicitly. */
  label: string;
}

export interface Organization {
  id: string;
  name: string;
  sector: string;
  location?: GeoLocation;
  /**
   * True for fixture/demo data. There is no default: every Organization
   * must state explicitly whether it is fictional, so a synthetic org can
   * never be mistaken for a real one by omission.
   */
  fictional: boolean;
}

export type AssetType = 'DOMAIN' | 'SUBDOMAIN' | 'IP' | 'EMAIL_DOMAIN' | 'TLS_CERT';

export interface Asset {
  id: string;
  organizationId: string;
  type: AssetType;
  /** e.g. a domain name, an IP literal, a certificate fingerprint. */
  value: string;
  discoveredAt: string;
  discoveryConfidence: Confidence;
}
