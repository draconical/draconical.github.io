export function getSemiboldText(str: string): string {
  return `<span class="jost semibold">${str}</span>`;
}

export function getChipsText(items: string[], type: 'verb' | 'noun' | 'direction'): string {
  const wrap = (innerStr: string) => {
    return `<div class="chips-wrapper">${innerStr}</div>`;
  };

  const chipsString = items.map((str) => {
    return `<span class="chip ${type}">${str}</span>`
  }).join('');

  return wrap(chipsString);
}