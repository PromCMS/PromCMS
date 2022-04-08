import { FC, ReactElement, useState } from 'react'
import { Popover as HeadlessPopover } from '@headlessui/react'
import { usePopper } from 'react-popper'
import { Placement } from '@popperjs/core'
import { createPortal } from 'react-dom'

export interface PopoverProps {
  buttonContent: ReactElement<any, any>
  disabled?: boolean
  placement?: Placement
  offset?: [number, number]
  buttonComponent?: React.ElementType<any>
  buttonClassName?: string
  children:
    | (({ open, close }: { open: boolean; close: () => void }) => ReactElement)
    | ReactElement[]
    | ReactElement
}

const Popover: FC<PopoverProps> = ({
  buttonContent,
  disabled,
  children,
  placement = 'bottom',
  buttonComponent = 'button',
  buttonClassName,
  offset = [0, 0],
}) => {
  let [referenceElement, setReferenceElement] = useState<any>()
  let [arrowElement, setArrowElement] = useState<any>()
  let [popperElement, setPopperElement] = useState<any>()
  let { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    modifiers: [
      {
        name: 'arrow',
        options: {
          element: arrowElement,
        },
      },
      {
        name: 'offset',
        options: {
          offset,
        },
      },
    ],
  })

  if (typeof document === 'undefined') return null

  return (
    <HeadlessPopover className="relative">
      <HeadlessPopover.Button
        as={buttonComponent}
        disabled={disabled}
        className={buttonClassName}
        ref={setReferenceElement}
      >
        {buttonContent}
      </HeadlessPopover.Button>

      {createPortal(
        <HeadlessPopover.Panel
          className="absolute z-10 rounded-lg border-2 border-project-border bg-white px-4 py-2 shadow-lg"
          ref={setPopperElement}
          style={styles.popper}
        >
          {children}
        </HeadlessPopover.Panel>,
        document.getElementById('popover-root') as Element
      )}
    </HeadlessPopover>
  )
}

export default Popover
