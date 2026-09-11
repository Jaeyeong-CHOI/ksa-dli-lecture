export const STORAGE_KEY = 'ksa-agentic-practice-v1';
export const TEAM_TOKEN = '{{TEAM}}', PROJECT_TOKEN = '{{PROJECT}}';
export function destinationValid(team, project) {
  return /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,99}$/.test(team.trim()) && /^(?!.*---)[a-z0-9][a-z0-9-]{0,98}[a-z0-9]$/.test(project.trim());
}
export function fillPrompt(template, team = '', project = '') {
  return template.replaceAll(TEAM_TOKEN, team.trim() || '<TEAM>').replaceAll(PROJECT_TOKEN, project.trim() || '<PROJECT_NAME>');
}
export function restoreProgress(value, ids) {
  const allowed = new Set(ids);
  return {done:Array.isArray(value?.done) ? [...new Set(value.done.filter(id => allowed.has(id)))] : [], current:allowed.has(value?.current) ? value.current : ids[0]};
}
export function resolveStep(hash, ids, fallback) {
  let id; try {id = decodeURIComponent(hash.replace(/^#/,''));} catch {id='';}
  return ids.includes(id) ? id : fallback;
}
