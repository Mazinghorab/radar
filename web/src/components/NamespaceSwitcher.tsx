import { forwardRef } from 'react'
import { NamespacePicker, copyText, type NamespacePickerHandle } from '@skyhook-io/k8s-ui'
import { useNamespaceScope, useSetActiveNamespace } from '../api/client'

export type NamespaceSwitcherHandle = NamespacePickerHandle

interface NamespaceSwitcherProps {
  className?: string
  disabled?: boolean
  disabledTooltip?: string
  variant?: 'chip' | 'segment'
  label?: string
}

/**
 * OSS Radar's namespace scope control — a thin data container over the shared
 * presentational NamespacePicker (@skyhook-io/k8s-ui). Wires Radar's own API
 * hooks; Radar Hub supplies its own container over the per-cluster apiBase.
 */
export const NamespaceSwitcher = forwardRef<NamespaceSwitcherHandle, NamespaceSwitcherProps>(function NamespaceSwitcher(
  { className, disabled, disabledTooltip, variant, label },
  ref,
) {
  const { data: scope, isLoading } = useNamespaceScope()
  const setActive = useSetActiveNamespace()

  const customHelpText = (
    <>
    Can&rsquo;t see a namespace? Your account can&rsquo;t list namespaces, so Radar only shows the ones it&rsquo;s been given. If you run Radar locally, add every namespace you use, then restart Radar:
      <div className="mt-1 flex flex-wrap items-center gap-1">
      <code
        className="cursor-pointer hover:bg-theme-hover px-1 rounded"
        onClick={() => copyText('--namespaces team-a,team-b')}
        title="Copy CLI flag"
      >
        --namespaces team-a,team-b
      </code>
      <span>or</span>
      <code
        className="cursor-pointer hover:bg-theme-hover px-1 rounded"
        onClick={() => copyText('{ "namespaces": ["team-a", "team-b"] }')}
        title="Copy config.json snippet"
      >
        "namespaces": [...]
      </code>
      <span>in <code>~/.radar/config.json</code> &middot; <a href="https://radarhq.io/docs/configuration/files#namespace-picker" target="_blank" rel="noreferrer" className="text-theme-interactive hover:underline">Learn more</a></span>
    </div>
    </>
  )

  return (
    <NamespacePicker
      ref={ref}
      scope={scope}
      loading={isLoading}
      pending={setActive.isPending}
      onApply={namespaces => setActive.mutate({ namespaces })}
      disabled={disabled}
      disabledTooltip={disabledTooltip}
      className={className}
      variant={variant}
      label={label}
      limitedListHelp={customHelpText}
    />
  )
})
