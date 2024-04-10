export function buildGridTemplateAreas(layout?: Array<Array<string | null | undefined> | null | undefined>) {
  return layout?.map((row) => `"${row?.map((cell) => `report-area-${cell}`).join(' ')}"`).join(' ')
}
