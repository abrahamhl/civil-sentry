import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { AuthorizationGrant } from '@civil-sentry/schema';
import { assertAuthorized, AuthorizationError } from './authorization.js';

const baseGrant: AuthorizationGrant = {
  id: 'grant_1',
  organizationId: 'org_1',
  scope: ['*.elzendaal-fictional.nl'],
  grantedBy: 'Fictional IT Manager, Gemeente Elzendaal (synthetic engagement)',
  grantedAt: '2026-09-01T00:00:00.000Z',
  expiresAt: '2026-12-01T00:00:00.000Z',
  documentHash: 'sha256-of-a-fictional-authorization-letter',
};

test('STREET_PASSIVE mode never requires a grant', () => {
  assert.doesNotThrow(() =>
    assertAuthorized({ mode: 'STREET_PASSIVE', targetAssetValue: 'anything.example.nl', organizationId: 'org_1' })
  );
});

test('AUTHORIZED_ASSESSMENT mode rejects a missing grant', () => {
  assert.throws(
    () =>
      assertAuthorized({
        mode: 'AUTHORIZED_ASSESSMENT',
        targetAssetValue: 'mail.elzendaal-fictional.nl',
        organizationId: 'org_1',
      }),
    AuthorizationError
  );
});

test('AUTHORIZED_ASSESSMENT mode rejects an out-of-scope target', () => {
  assert.throws(
    () =>
      assertAuthorized({
        mode: 'AUTHORIZED_ASSESSMENT',
        targetAssetValue: 'unrelated-target.example.com',
        organizationId: 'org_1',
        grant: baseGrant,
      }),
    AuthorizationError
  );
});

test('AUTHORIZED_ASSESSMENT mode rejects an expired grant', () => {
  const expired: AuthorizationGrant = { ...baseGrant, expiresAt: '2020-01-01T00:00:00.000Z' };
  assert.throws(
    () =>
      assertAuthorized({
        mode: 'AUTHORIZED_ASSESSMENT',
        targetAssetValue: 'mail.elzendaal-fictional.nl',
        organizationId: 'org_1',
        grant: expired,
        now: new Date('2026-09-10'),
      }),
    AuthorizationError
  );
});

test('AUTHORIZED_ASSESSMENT mode rejects a grant belonging to a different organization', () => {
  assert.throws(
    () =>
      assertAuthorized({
        mode: 'AUTHORIZED_ASSESSMENT',
        targetAssetValue: 'mail.elzendaal-fictional.nl',
        organizationId: 'org_999',
        grant: baseGrant,
      }),
    AuthorizationError
  );
});

test('AUTHORIZED_ASSESSMENT mode accepts a valid, in-scope, unexpired grant', () => {
  assert.doesNotThrow(() =>
    assertAuthorized({
      mode: 'AUTHORIZED_ASSESSMENT',
      targetAssetValue: 'mail.elzendaal-fictional.nl',
      organizationId: 'org_1',
      grant: baseGrant,
      now: new Date('2026-09-10'),
    })
  );
});
