import { css } from '@emotion/css'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Counter, CounterComponent } from './Counter'
// import * as path from 'path';
// import * as reactDocgenTypescript from 'react-docgen-typescript';

// import YourComponent from './YourComponent'; // Replace with your component path

// const filePath = path.resolve(__dirname, './YourComponent.tsx'); // Replace with the actual file path

// const parser = reactDocgenTypescript.withCustomConfig('./tsconfig.json', {
//   propFilter: (prop) => {
//     // Customize prop filtering as needed
//     return true;
//   },
// });

// const componentInfo = parser.parse(filePath);

// console.log({componentInfo})

// type TypeName<T> = T extends infer R ? keyof R : never
// type TypeName<T> = T extends { query: infer R } ? keyof R & string : never

// function getTypeName<T extends {}>(obj: T): TypeName<T> {
//   return Object.keys(obj) as TypeName<T>
// }

// type QueryType = {
//   title: string
// }

// type Test = {
//   query: QueryType
// }

// type TypeName<T> = T extends { query: infer R } ? keyof R : never

// const nameof = <T,>(name: keyof T) => name

// function getTypeofProperty<T, K extends keyof T>(o: T, name: K) {
//   return typeof o[name]
// }

// const queryTypeName: TypeName<Test> = 'title' // This will be "QueryType"
// console.log(nameof<CounterProps>('query'))
// console.log(CounterProps['query'])

// // type TypeName<T> = T extends { query: infer R } ? keyof R : never;

// // const queryTypeName: TypeName<CounterProps> = { query: { accessToken: 'test' } };

// const options = {
//   savePropValueAsString: true
// }

// Parse a file for docgen info
// docgen.parse('./Counter.tsx', options)

// console.log({ docgen })

const meta: Meta<typeof CounterComponent> = {
  title: 'Components/Counter',
  component: CounterComponent,
  render: Counter
  // argTypes: {
  //   styles: {
  //     table: {
  //       // subcategory: 'AAAA',
  //       // defaultValue: { summary: 'aaa' },
  //       // type: { detail: 'test', summary: getTypeName(testInstance.query ?? '') }
  //       type: { summary: 'CounterQueryProps', detail: '<a href="http://google.com">test</a>' },
  //       expanded: true
  //     }
  //     // description: 'SwitchTypeEnum'
  //     // defaultValue: { summary: 'SwitchTypeEnum.PRIMARY' }
  //   }
  //   // table: {
  //   //   summary: 'SwitchTypeEnum',
  //   //   defaultValue: { summary: 'SwitchTypeEnum.PRIMARY' }
  //   // }
  // }
}

export default meta

type Story = StoryObj<typeof CounterComponent>

const styles = {
  container: css`
    font-family: Inter;
    display: inline-flex;
  `,
  card: css`
    flex: 1 auto;
    box-sizing: border-box;
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    padding: 20px;
    background-color: var(--color-background);
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
  `,
  cardTitle: css`
    margin: 0;
    font-weight: 500;
    color: #2e90fa;
  `
}

export const SingleValueStory: Story = {
  name: 'Single value',
  args: {
    prefixValue: '$',
    value: '49291',
    localize: true
  }
}

export const ValueInCardStory: Story = {
  name: 'Value in card',
  args: {
    prefixValue: '$',
    value: '49291',
    localize: true,
    style: {
      fontSize: '40px',
      fontWeight: 600
    }
  },
  render: (args) => (
    <div className={css([styles.container, { minWidth: 300 }])}>
      <div className={styles.card}>
        <span className={styles.cardTitle}>Sales</span>
        <Counter {...args} />
      </div>
    </div>
  )
}

export const ValueInCardWithComparisonStory: Story = {
  name: 'Value in card with comparison',
  args: {
    prefixValue: '$',
    value: '123000',
    localize: true,
    style: {
      fontSize: '32px',
      fontWeight: 600
    }
  },
  render: (args) => (
    <div className={styles.container}>
      <div className={styles.card}>
        <span className={css([styles.cardTitle, { color: '#7d89b0' }])}>Sales</span>
        <div
          className={css`
            display: flex;
            align-items: flex-end;
            color: #7d89b0;
          `}
        >
          <Counter {...args} />
          <span
            className={css`
              margin: 4px 8px;
            `}
          >
            from{' '}
            <Counter
              prefix="$"
              value="16856"
              localize
              style={{
                color: '#7d89b0'
              }}
            />
          </span>
        </div>
      </div>
    </div>
  )
}
