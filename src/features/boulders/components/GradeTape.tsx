import { Tape } from '@/shared/ui/Tape'

export function GradeTape({ grade }: { grade: string }) {
  return <Tape className="justify-self-start px-4 pt-1.5 pb-1 text-3xl">{grade}</Tape>
}
