import * as React from 'react'
import classnames from 'classnames'
import { useButton } from '@mui/base/useButton'
import { ButtonProps as MUIButtonProps } from '@mui/base/Button'
import componentStyles from './Button.module.scss'
import { DefaultThemes } from '../ThemeProvider'

export interface ButtonProps extends MUIButtonProps, React.ComponentPropsWithoutRef<'button'> {
  baseTheme?: DefaultThemes
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, forwardedRef) => {
  const { children, disabled } = props
  const { active, focusVisible, getRootProps } = useButton({
    ...props,
    rootRef: forwardedRef
  })

  return (
    <button
      {...getRootProps()}
      className={classnames(componentStyles.rootButton)}
      //   className={clsx({
      //     active,
      //     disabled,
      //     focusVisible,
      //   })}
    >
      {children}
    </button>
  )
})

// const CustomButtonRoot = styled('button')(
//   ({ theme }) => `
//   font-family: 'IBM Plex Sans', sans-serif;
//   font-weight: 600;
//   font-size: 0.875rem;
//   line-height: 1.5;
//   background-color: ${blue[500]};
//   padding: 8px 16px;
//   border-radius: 8px;
//   color: white;
//   transition: all 150ms ease;
//   cursor: pointer;
//   border: 1px solid ${blue[500]};
//   box-shadow: 0 2px 1px ${
//     theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(45, 45, 60, 0.2)'
//   }, inset 0 1.5px 1px ${blue[400]}, inset 0 -2px 1px ${blue[600]};

//   &:hover {
//     background-color: ${blue[600]};
//   }

//   &.active {
//     background-color: ${blue[700]};
//     box-shadow: none;
//     transform: scale(0.99);
//   }

//   &.focusVisible {
//     box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? blue[300] : blue[200]};
//     outline: none;
//   }

//   &.disabled {
//     background-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
//     color: ${theme.palette.mode === 'dark' ? grey[200] : grey[700]};
//     border: 0;
//     cursor: default;
//     box-shadow: none;
//     transform: scale(1);
//   }
// `,
// );
