import { DetailedHTMLProps, ProgressHTMLAttributes, VFC } from 'react'

export interface ProgressProps
  extends DetailedHTMLProps<
    ProgressHTMLAttributes<HTMLProgressElement>,
    HTMLProgressElement
  > {
  loading?: boolean
}

export const Progress: VFC<ProgressProps> = ({ className }) => {
  return (
    <div>
      <span />
    </div>
  )
}
