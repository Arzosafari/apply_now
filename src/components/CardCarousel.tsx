import { Children, isValidElement, useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent, PointerEvent, ReactNode } from 'react';
import { ArrowLeft, ArrowRight, MoveHorizontal } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface Metrics {
  distance: number;
  max: number;
  step: number;
  pages: number;
}

/** A native touch-scroll carousel with mouse dragging and non-swipe controls. */
export function CardCarousel({
  children,
  label,
  variant,
}: {
  children: ReactNode;
  label: string;
  variant: 'experts' | 'testimonials';
}) {
  const { t, isRtl, formatNumber } = useLocale();
  const slides = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; x: number; scrollLeft: number; startPage: number; delta: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const trackId = useId();
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const measure = useCallback((track: HTMLDivElement): Metrics => {
    const first = track.children[0] as HTMLElement | undefined;
    const second = track.children[1] as HTMLElement | undefined;
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    if (!first) return { distance: 0, max, step: 1, pages: 1 };
    const firstBox = first.getBoundingClientRect();
    const trackBox = track.getBoundingClientRect();
    const distance = Math.max(0, Math.min(max, isRtl ? firstBox.right - trackBox.right : trackBox.left - firstBox.left));
    const step = second ? Math.abs(second.getBoundingClientRect().left - firstBox.left) : firstBox.width;
    const safeStep = Math.max(1, step);
    return { distance, max, step: safeStep, pages: max > 1 ? Math.ceil((max - 1) / safeStep) + 1 : 1 };
  }, [isRtl]);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { distance, max, step, pages: count } = measure(track);
    const current = max > 1 && max - distance <= 1
      ? count - 1
      : Math.min(count - 1, Math.round(distance / step));
    setPages(count);
    setPage(current);
  }, [measure]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // The first slide is the logical start in both LTR and RTL.
    track.scrollLeft = 0;
    update();
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(track);
    return () => {
      track.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      observer?.disconnect();
    };
  }, [update, slides.length]);

  const goTo = (requestedPage: number) => {
    const track = trackRef.current;
    if (!track) return;
    const { distance, max, step, pages: count } = measure(track);
    const targetPage = Math.max(0, Math.min(count - 1, requestedPage));
    const target = Math.min(max, targetPage * step);
    const delta = target - distance;
    // Avoid a fractional nudge triggering a backwards CSS snap after a drag.
    if (Math.abs(delta) < 1) {
      update();
      return;
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: (isRtl ? -1 : 1) * delta, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const next = isRtl ? event.key === 'ArrowLeft' : event.key === 'ArrowRight';
      goTo(page + (next ? 1 : -1));
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      goTo(event.key === 'Home' ? 0 : pages - 1);
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, scrollLeft: event.currentTarget.scrollLeft, startPage: page, delta: 0, moved: false };
    suppressClick.current = false;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    drag.delta = event.clientX - drag.x;
    if (!drag.moved && Math.abs(drag.delta) > 6) {
      drag.moved = true;
      event.currentTarget.classList.add('is-dragging');
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (drag.moved) {
      event.preventDefault();
      event.currentTarget.scrollLeft = drag.scrollLeft - drag.delta;
    }
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    event.currentTarget.classList.remove('is-dragging');
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (drag.moved) {
      suppressClick.current = true;
      const movedEnough = !cancelled && Math.abs(drag.delta) > 45;
      const forward = isRtl ? drag.delta > 0 : drag.delta < 0;
      goTo(drag.startPage + (movedEnough ? (forward ? 1 : -1) : 0));
      window.setTimeout(() => { suppressClick.current = false; }, 0);
    }
  };

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (suppressClick.current) {
      event.preventDefault();
      event.stopPropagation();
      suppressClick.current = false;
    }
  };

  if (!slides.length) return null;

  return (
    <div className={cn('card-carousel', `card-carousel-${variant}`)} role="group" aria-roledescription={t('carousel.role')} aria-label={label} dir={isRtl ? 'rtl' : 'ltr'} data-slide-count={slides.length}>
      <div
        ref={trackRef}
        id={trackId}
        className="card-carousel-track"
        tabIndex={0}
        role="group"
        aria-label={t('carousel.trackLabel')}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => finishDrag(event)}
        onPointerCancel={(event) => finishDrag(event, true)}
        onClickCapture={onClickCapture}
        onDragStart={(event) => event.preventDefault()}
      >
        {slides.map((slide, index) => (
          <div
            className="card-carousel-slide"
            key={isValidElement(slide) ? slide.key ?? index : index}
            role="group"
            aria-roledescription={t('carousel.slide')}
            aria-label={`${formatNumber(index + 1)} / ${formatNumber(slides.length)}`}
          >
            {slide}
          </div>
        ))}
      </div>
      {pages > 1 && (
        <div className="card-carousel-footer">
          <span className="card-carousel-hint"><MoveHorizontal size={15} aria-hidden="true" /> {t('carousel.hint')}</span>
          <div className="card-carousel-controls">
            <button type="button" className="icon-btn card-carousel-arrow" onClick={() => goTo(page - 1)} disabled={page === 0} aria-label={t('carousel.previous')} aria-controls={trackId}>
              {isRtl ? <ArrowRight size={17} aria-hidden="true" /> : <ArrowLeft size={17} aria-hidden="true" />}
            </button>
            <div className="card-carousel-indicators" aria-hidden="true">
              {Array.from({ length: pages }, (_, index) => <span key={index} className={cn(index === page && 'is-active')} />)}
            </div>
            <button type="button" className="icon-btn card-carousel-arrow" onClick={() => goTo(page + 1)} disabled={page >= pages - 1} aria-label={t('carousel.next')} aria-controls={trackId}>
              {isRtl ? <ArrowLeft size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
            </button>
          </div>
          <span className="sr-only" aria-live="polite" aria-atomic="true">{t('carousel.status', { current: formatNumber(page + 1), total: formatNumber(pages) })}</span>
        </div>
      )}
    </div>
  );
}
