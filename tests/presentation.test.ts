import assert from 'node:assert/strict';
import test from 'node:test';

import { FACTORY_ZONES, factoryZoneForLevelIndex } from '../game/presentation.ts';

test('factory presentation zones cover the complete 25-level progression', () => {
  assert.deepEqual(
    FACTORY_ZONES.map(({ id, levelRange }) => [id, ...levelRange]),
    [
      ['mobility-test', 1, 8],
      ['coolant-works', 9, 14],
      ['thermal-processing', 15, 19],
      ['induction-transfer', 20, 24],
      ['dispatch', 25, 25],
    ],
  );
  assert.equal(factoryZoneForLevelIndex(0).id, 'mobility-test');
  assert.equal(factoryZoneForLevelIndex(7).id, 'mobility-test');
  assert.equal(factoryZoneForLevelIndex(8).id, 'coolant-works');
  assert.equal(factoryZoneForLevelIndex(14).id, 'thermal-processing');
  assert.equal(factoryZoneForLevelIndex(19).id, 'induction-transfer');
  assert.equal(factoryZoneForLevelIndex(24).id, 'dispatch');
});

test('every factory zone carries restrained functional story motifs', () => {
  for (const zone of FACTORY_ZONES) {
    assert.ok(zone.functionLabel.length > 0);
    assert.equal(zone.motifs.length, 3);
    assert.ok(zone.motifs.every((motif) => motif.length > 0));
  }
});
