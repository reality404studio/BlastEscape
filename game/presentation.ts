export type FactoryZoneId =
  | 'mobility-test'
  | 'coolant-works'
  | 'thermal-processing'
  | 'induction-transfer'
  | 'dispatch';

export type FactoryZonePresentation = {
  id: FactoryZoneId;
  levelRange: readonly [number, number];
  functionLabel: string;
  accent: 'hot' | 'cold' | 'mint' | 'gold';
  motifs: readonly string[];
};

export const FACTORY_ZONES: readonly FactoryZonePresentation[] = [
  {
    id: 'mobility-test',
    levelRange: [1, 8],
    functionLabel: 'MOBILITY TEST LINE',
    accent: 'hot',
    motifs: ['calibration-ruler', 'blast-cell', 'repeated-test-bay'],
  },
  {
    id: 'coolant-works',
    levelRange: [9, 14],
    functionLabel: 'COOLANT WORKS',
    accent: 'cold',
    motifs: ['insulated-pipe', 'condensate-drip', 'transfer-tank'],
  },
  {
    id: 'thermal-processing',
    levelRange: [15, 19],
    functionLabel: 'THERMAL PROCESSING',
    accent: 'hot',
    motifs: ['furnace-column', 'vent-slit', 'quench-housing'],
  },
  {
    id: 'induction-transfer',
    levelRange: [20, 24],
    functionLabel: 'INDUCTION TRANSFER',
    accent: 'mint',
    motifs: ['overhead-rail', 'induction-coil', 'unit-carrier'],
  },
  {
    id: 'dispatch',
    levelRange: [25, 25],
    functionLabel: 'FINAL INSPECTION / DISPATCH',
    accent: 'gold',
    motifs: ['empty-unit-bay', 'inspection-frame', 'outbound-chevron'],
  },
] as const;

export function factoryZoneForLevelIndex(levelIndex: number): FactoryZonePresentation {
  const levelNumber = Math.max(1, Math.floor(levelIndex) + 1);
  return FACTORY_ZONES.find(
    ({ levelRange }) => levelNumber >= levelRange[0] && levelNumber <= levelRange[1],
  ) ?? FACTORY_ZONES[FACTORY_ZONES.length - 1];
}
