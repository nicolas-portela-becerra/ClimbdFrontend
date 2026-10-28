import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { CloseIcon, SearchIcon } from '@/shared/icons'
import { cn } from '@/shared/lib/cn'
import { IconButton } from '@/shared/ui/IconButton'

const NOTICE_MS = 3000

// `action` is shown before the search icon (e.g. the admin's new-gym button).
export function GymHeader({ action }: { action?: ReactNode }) {
  const { t } = useTranslation('gyms')
  const [searchOpen, setSearchOpen] = useState(false)
  const [notice, setNotice] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!notice) return
    const id = setTimeout(() => setNotice(false), NOTICE_MS)
    return () => clearTimeout(id)
  }, [notice])

  // preventScroll: the overlay is still sliding in, focusing must not scroll the clipped row.
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus({ preventScroll: true })
  }, [searchOpen])

  const openSearch = () => {
    setSearchOpen(true)
    setNotice(true)
  }
  const closeSearch = () => {
    setSearchOpen(false)
    setNotice(false)
  }

  return (
    <header className="px-5 pt-5 pb-3">
      <div className="relative flex items-end justify-between gap-3 overflow-hidden">
        <h1 className="font-display text-5xl leading-none font-extrabold uppercase">
          {t('title')}
        </h1>
        <div className="flex items-center gap-1">
          {action}
          <IconButton label={t('search.open')} aria-expanded={searchOpen} onClick={openSearch}>
            <SearchIcon className="size-6" />
          </IconButton>
        </div>

        {/* Slides in from the right over the title and the buttons. */}
        <div
          inert={!searchOpen}
          className={cn(
            'absolute inset-0 flex items-center border-2 border-ink bg-raised',
            'transition-[translate,opacity] duration-250 ease-out',
            searchOpen
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0 motion-reduce:translate-x-0',
          )}
        >
          {/* TODO: pending search-gym implementation (the API has no search endpoint yet) */}
          <input
            ref={inputRef}
            type="search"
            name="search"
            placeholder={t('search.placeholder')}
            aria-label={t('search.placeholder')}
            className="min-h-11 min-w-0 flex-1 bg-transparent px-3 text-lg focus-visible:outline-none"
          />
          <IconButton label={t('search.close')} onClick={closeSearch}>
            <CloseIcon className="size-5" />
          </IconButton>
        </div>
      </div>

      <p role="status" className="mt-2 text-sm font-semibold text-muted empty:hidden">
        {notice ? t('search.underConstruction') : ''}
      </p>
    </header>
  )
}
