import React, { useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

import { FaTimesCircleIcon } from '../Icon'
import { UnstyledButton } from '../Button'
import { Item } from './types'

export type Props<T> = {
  item: Item<T> & { deletable?: boolean }
  disabled: boolean
  onDelete: (item: Item<T>) => void
  enableEllipsis?: boolean
  onEllipsis?: () => void
}

export function MultiSelectedItemInner<T>({
  item,
  disabled,
  onDelete,
  enableEllipsis,
  onEllipsis,
}: Props<T>) {
  const theme = useTheme()
  const labelRef = useRef<HTMLDivElement>(null)
  const { deletable = true } = item

  useEffect(() => {
    const elem = labelRef.current
    if (!elem || !enableEllipsis || !onEllipsis) {
      return
    }
    if (elem.offsetWidth < elem.scrollWidth) {
      onEllipsis()
    }
  }, [enableEllipsis, onEllipsis])

  const classNames = useClassNames().multi

  return (
    <Wrapper themes={theme} disabled={disabled} className={classNames.selectedItem}>
      <ItemLabel
        themes={theme}
        enableEllipsis={enableEllipsis}
        className={classNames.selectedItemLabel}
        ref={labelRef}
      >
        {item.label}
      </ItemLabel>

      {deletable && (
        <DeleteButton
          type="button"
          themes={theme}
          className={classNames.deleteButton}
          disabled={disabled}
          onClick={() => {
            onDelete && onDelete(item)
          }}
        >
          <FaTimesCircleIcon
            size={11}
            color={'inherit'}
            visuallyHiddenText={`${item.label}を削除`}
          />
        </DeleteButton>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ themes: Theme; disabled?: boolean }>`
  ${({ themes, disabled }) => {
    const { border, color, fontSize, leading, spacingByChar } = themes

    return css`
      position: relative;
      display: flex;
      align-items: center;
      min-height: calc(${leading.NONE}rem + ${spacingByChar(0.5)} * 2);
      border-radius: 1rem;
      box-sizing: border-box;
      border: ${border.shorthand};
      background-color: ${disabled ? color.disableColor(color.WHITE) : color.WHITE};
      color: ${disabled ? color.TEXT_DISABLED : color.TEXT_BLACK};
      font-size: ${fontSize.S};
      line-height: ${leading.NORMAL};
    `
  }}
`
const ItemLabel = styled.div<{ enableEllipsis?: boolean; themes: Theme }>`
  ${({ enableEllipsis, themes: { border, spacingByChar } }) => {
    return css`
      flex-grow: 1;
      padding: calc(${spacingByChar(0.25)} - ${border.lineWidth}) ${spacingByChar(0.5)};

      ${enableEllipsis &&
      css`
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `}
    `
  }}
`
const DeleteButton = styled(UnstyledButton)<{ themes: Theme; disabled?: boolean }>`
  ${({ themes: { border, spacingByChar, shadow }, disabled }) => {
    return css`
      flex-grow: 0;
      padding: calc(${spacingByChar(0.25)} - ${border.lineWidth}) ${spacingByChar(0.5)};
      border-radius: 50%;
      cursor: ${disabled ? 'not-allowed' : 'pointer'};
      line-height: 0;

      &:focus {
        outline: 0;
      }

      &:focus > svg {
        border-radius: 50%;
        box-shadow: ${shadow.OUTLINE};
      }
    `
  }}
`
