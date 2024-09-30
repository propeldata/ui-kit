import React from 'react'
import { Tabs as TabsBase } from '@radix-ui/themes'
import { Card as CardBase } from '../Card'
import '@radix-ui/themes/styles.css'
import { TabsCSS } from './TabsCSS'

type TabsBase = typeof TabsBase

interface Tabs extends Omit<TabsBase, 'List' | 'Root'> {
  Root: typeof Root
  Card: typeof Card
  List: typeof List
}

const Root = ({ children, ...props }: React.ComponentProps<typeof TabsBase.Root>) => {
  return (
    <>
      <TabsBase.Root {...props}>{children}</TabsBase.Root>
      <TabsCSS />
    </>
  )
}

const List = ({ children, ...props }: React.ComponentProps<typeof TabsBase.List>) => {
  return <TabsBase.List {...props}>{children}</TabsBase.List>
}

const Card = ({ children, ...props }: React.ComponentProps<typeof TabsBase.Trigger>) => (
  <TabsBase.Trigger {...props}>
    <CardBase style={props.style} className={props.className}>
      {children}
    </CardBase>
  </TabsBase.Trigger>
)

const Tabs: Tabs = {
  ...TabsBase,
  Root,
  Card,
  List
}

export { Tabs }
