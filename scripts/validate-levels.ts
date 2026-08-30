import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { validateLevel } from '../game/lab/evaluators.ts';
import { LEVELS } from '../game/levels.ts';
import { ACCEPTED_REPLAYS } from '../game/replays.ts';

const outputDirectory = path.resolve('artifacts/level-validation');
await mkdir(outputDirectory, { recursive: true });

let failed = false;
for (const replay of ACCEPTED_REPLAYS) {
  const level = LEVELS.find((candidate) => candidate.id === replay.levelId);
  if (!level) throw new Error(`Replay ${replay.id} references missing level ${replay.levelId}.`);

  const report = validateLevel(level, replay);
  const artifact = {
    generatedBy: 'npm run validate:levels',
    ...report,
  };
  const outputPath = path.join(outputDirectory, `${level.id}.json`);
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  console.log(`${report.status.toUpperCase()} ${level.id} -> ${path.relative('.', outputPath)}`);
  if (report.status === 'fail') failed = true;
}

if (failed) process.exitCode = 1;
