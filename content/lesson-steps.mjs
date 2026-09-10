// Stable hashes retain the original notebook/section citation URLs.
export function buildLessonSteps(note, source) {
  const used = new Set();
  const sectionBlocks = note.sections.map(section => (section.cells || []).flatMap(cell => {
    const block = source?.blocks.find(item => item.cell === cell);
    if (!block || used.has(cell)) return [];
    used.add(cell); return [block];
  }));
  const extraBlocks = source?.blocks.filter(block => !used.has(block.cell)) || [];
  const steps = note.sections.map((section, index) => ({id: `section-${index}`, title: section.title, kind: '개념', index}));
  if (extraBlocks.length) steps.push({id: 'source-code', title: '실습 준비와 추가 코드', kind: '준비'});
  note.exercises.forEach((exercise, index) => steps.push({id: index === 0 ? 'exercises' : `exercise-${index}`, title: exercise.title, kind: '실습', index}));
  steps.push({id: 'review', title: '핵심 정리와 학습 확인', kind: '정리'});
  const targets = Object.fromEntries(steps.map(step => [step.id, step.id]));
  Object.assign(targets, {explanation: 'section-0', troubleshooting: 'review', references: 'review', main: 'section-0'});
  sectionBlocks.forEach((blocks, index) => blocks.forEach(block => { targets[`cell-${block.cell}`] = `section-${index}`; }));
  extraBlocks.forEach(block => { targets[`cell-${block.cell}`] = 'source-code'; });
  return {sectionBlocks, extraBlocks, steps, targets};
}
export function stepFromHash(hash, targets) {
  try { const id = decodeURIComponent(hash.replace(/^#/, '')); return Object.hasOwn(targets, id) ? targets[id] : 'section-0'; }
  catch { return 'section-0'; }
}
