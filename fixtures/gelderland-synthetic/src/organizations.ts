/**
 * FICTIONAL DATA. "Elzendaal" and "Vossenbeek" are invented place names —
 * there is no municipality, energy cooperative, or healthcare group by
 * these names in Gelderland or anywhere else. Any resemblance to a real
 * organization is coincidental and unintended. Every Organization below
 * carries fictional: true explicitly — see packages/schema Organization
 * type, which requires this field with no default.
 */
import type { Organization, Asset } from '@civic-sentry/schema';

export const organizations: Organization[] = [
  {
    id: 'org_elzendaal_gemeente',
    name: 'Gemeente Elzendaal (fictional)',
    sector: 'Local government',
    location: { lat: 52.05, lon: 5.95, label: 'Elzendaal, Gelderland — fictional district' },
    fictional: true,
  },
  {
    id: 'org_elzendaal_energie',
    name: 'Elzendaal Energie Coöperatie (fictional)',
    sector: 'Energy cooperative',
    location: { lat: 52.06, lon: 5.97, label: 'Elzendaal, Gelderland — fictional district' },
    fictional: true,
  },
  {
    id: 'org_vossenbeek_zorg',
    name: 'Vossenbeek Zorggroep (fictional)',
    sector: 'Healthcare',
    location: { lat: 52.03, lon: 5.93, label: 'Vossenbeek, Gelderland — fictional district' },
    fictional: true,
  },
];

export const assets: Asset[] = [
  {
    id: 'asset_elzendaal_gemeente',
    organizationId: 'org_elzendaal_gemeente',
    type: 'DOMAIN',
    value: 'elzendaal-fictional.nl',
    discoveredAt: '2026-09-10T00:00:00.000Z',
    discoveryConfidence: 'VERIFIED',
  },
  {
    id: 'asset_elzendaal_energie',
    organizationId: 'org_elzendaal_energie',
    type: 'DOMAIN',
    value: 'elzendaal-energie-fictional.nl',
    discoveredAt: '2026-09-10T00:00:00.000Z',
    discoveryConfidence: 'VERIFIED',
  },
  {
    id: 'asset_vossenbeek_zorg',
    organizationId: 'org_vossenbeek_zorg',
    type: 'DOMAIN',
    value: 'vossenbeek-zorg-fictional.nl',
    discoveredAt: '2026-09-10T00:00:00.000Z',
    discoveryConfidence: 'VERIFIED',
  },
];
