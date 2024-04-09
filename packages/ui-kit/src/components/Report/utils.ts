export function buildGridTemplateAreas(layout: string[][]) {
  return layout.map((row) => `"${row.map((cell) => `report-area-${cell}`).join(' ')}"`).join(' ')
}
