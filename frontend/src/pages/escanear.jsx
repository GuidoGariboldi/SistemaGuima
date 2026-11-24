import { CardScannerTerminal } from '@/components/admin/card-scanner-terminal'
import { StaffGate } from '@/components/admin/staff-access'

export default function TeosEscanear() {
  return <StaffGate role="caja"><CardScannerTerminal /></StaffGate>
}