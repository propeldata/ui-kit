import React from 'react'
import { Tabs as TabsBase } from '@radix-ui/themes'
import { Card as CardBase } from '../Card'
import '@radix-ui/themes/styles.css'
import './styles.scss'

type TabsBase = typeof TabsBase

interface Tabs extends Omit<TabsBase, 'List'> {
  Card: typeof Card
  List: typeof List
}

const List = ({ children, ...props }: React.ComponentProps<typeof TabsBase.List>) => (
  <TabsBase.List {...props}>{children}</TabsBase.List>
)

const Card = ({ children, ...props }: React.ComponentProps<typeof TabsBase.Trigger>) => (
  <TabsBase.Trigger {...props}>
    <CardBase style={props.style} className={props.className}>
      {children}
    </CardBase>
  </TabsBase.Trigger>
)

const Tabs: Tabs = {
  ...TabsBase,
  Card,
  List
}

export { Tabs }
