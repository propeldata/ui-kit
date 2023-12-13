import { storybookCodeTemplate } from './storybookCodeTemplate'

describe('storybookCodeTemplate', () => {
  it('generates a basic template with default component name and no imports', () => {
    const context = { title: 'Button' }
    const body = '<Button>Click me</Button>'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const template = storybookCodeTemplate(body, context as any)

    expect(template).toContain('function ButtonComponent()')
    expect(template).toContain('<Button>Click me</Button>')
    expect(template).not.toContain('import')
  })

  it('includes custom imports if specified', () => {
    const context = { parameters: { imports: 'Button' }, title: 'Button' }
    const body = '<Button>Click me</Button>'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const template = storybookCodeTemplate(body, context as any)

    expect(template).toContain("import { Button } from '@propeldata/ui-kit'")
  })

  it('uses a custom component name if provided', () => {
    const context = { parameters: { componentName: 'CustomButton' }, title: 'Button' }
    const body = '<Button>Click me</Button>'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const template = storybookCodeTemplate(body, context as any)

    expect(template).toContain('function CustomButton()')
  })

  it('transforms the body if a transform function is provided', () => {
    const transformBody = jest.fn().mockImplementation((body) => `<div>${body}</div>`)
    const context = { parameters: { transformBody }, title: 'Button' }
    const body = '<Button>Click me</Button>'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const template = storybookCodeTemplate(body, context as any)

    expect(transformBody).toHaveBeenCalledWith(body)
    expect(template).toContain('<div><Button>Click me</Button></div>')
  })
})
