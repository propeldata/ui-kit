import React from 'react'

/**
 * Higher-order component that wraps a React component with a div element, allowing manipulation of the component's appearance or behavior based on a theme.
 * This HOC is useful for adding theme-related styling or functionality to a component without modifying its core implementation.
 *
 * The HOC accepts a `setRef` function to update the reference to the div element. This function is typically provided by a parent component and is used to manage the ref's current value.
 * The `themeWrapper` function returned by the HOC wraps the input component with a div element, providing a designated container for applying theme-related styling or behavior.
 *
 * @param {setRef} setRef - A callback function to set the ref's current value, typically provided by a parent component.
 * @returns A function that takes a React component as input and returns a wrapped version of the component with a div element as its container.
 *          The div element serves as the container for applying theme-related styling or behavior to the wrapped component.
 */
export const withThemeWrapper = <T extends HTMLDivElement>(setRef: (node: T | null) => void) =>
  function themeWrapper(component: React.ReactElement) {
    return (
      <div data-testid="theme-wrapper" ref={setRef}>
        {component}
      </div>
    )
  }
