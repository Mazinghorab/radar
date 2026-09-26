// packages/k8s-ui/src/components/namespace-switcher/NamespacePicker.test.tsx
// @vitest-environment jsdom
import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NamespacePicker } from './NamespacePicker'

vi.mock('../ui/Tooltip', () => ({ Tooltip: ({ children }: { children: ReactNode }) => children }))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let root: Root

beforeEach(() => {
  const element = document.createElement('div')
  document.body.appendChild(element)
  root = createRoot(element)
})

afterEach(async () => {
  await act(async () => root.unmount())
  document.body.replaceChildren()
  vi.unstubAllGlobals()
})

const mockBaseScope = {
  actives: ['team-a'],
  accessibleNamespaces: ['team-a', 'team-b'],
  kubeconfigNamespace: 'team-a',
  deniedNamespaces: [],
  mode: 'namespace' as const,
  cacheScoped: false,
  namespaceRescope: false,
  canClearNamespace: true,
}

describe('NamespacePicker - Authoritative Logic', () => {
  it('renders the generic fallback text when authoritative is false and no help prop is provided', async () => {
    await act(async () => {
      root.render(
        <NamespacePicker 
          scope={{ ...mockBaseScope, authoritative: false }} 
          onApply={vi.fn()} 
        />
      )
    })
    
    // Open the dropdown
    const triggerBtn = Array.from(document.querySelectorAll('button')).find(el => el.getAttribute('aria-label') === 'Switch active namespaces')
    await act(async () => { triggerBtn!.click() })
    
    // The generic fallback text should be visible
    expect(document.body.textContent).toContain("account can't list namespaces")
  })

  it('renders the host-supplied help text when authoritative is false and limitedListHelp is provided', async () => {
    await act(async () => {
      root.render(
        <NamespacePicker 
          scope={{ ...mockBaseScope, authoritative: false }} 
          onApply={vi.fn()} 
          limitedListHelp={<span data-testid="custom-help">Custom CLI instructions</span>}
        />
      )
    })
    
    const triggerBtn = Array.from(document.querySelectorAll('button')).find(el => el.getAttribute('aria-label') === 'Switch active namespaces')
    await act(async () => { triggerBtn!.click() })
    
    // The injected prop should render, and the fallback should not
    expect(document.querySelector('[data-testid="custom-help"]')).not.toBeNull()
    expect(document.body.textContent).not.toContain("account can't list namespaces")
  })

  it('hides the footer completely when authoritative is true', async () => {
    await act(async () => {
      root.render(
        <NamespacePicker 
          scope={{ ...mockBaseScope, authoritative: true }} 
          onApply={vi.fn()} 
        />
      )
    })
    
    const triggerBtn = Array.from(document.querySelectorAll('button')).find(el => el.getAttribute('aria-label') === 'Switch active namespaces')
    await act(async () => { triggerBtn!.click() })
    
    // Neither the fallback nor the warning should be in the DOM
    expect(document.body.textContent).not.toContain("account can't list namespaces")
    expect(document.querySelector('[data-testid="custom-help"]')).toBeNull()
  })
})