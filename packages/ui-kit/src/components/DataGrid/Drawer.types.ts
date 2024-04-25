export interface DrawerProps {
  isOpen: boolean
  row?: RowElement | null
  cell?: CellElement | null
  onClose: () => void
}

export interface RowElement {
  id: string
  cells: CellElement[]
}

export interface CellElement {
  id: string
  header: string
  value: string
}
