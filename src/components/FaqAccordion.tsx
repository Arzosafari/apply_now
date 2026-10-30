import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { Faq } from '@shared/types';
import { useLocale } from '@/lib/i18n';

export function FaqAccordion({ items, single = true }: { items: Faq[]; single?: boolean }) {
  const { locale } = useLocale();
  const [open, setOpen] = useState<number | null>(items[0]?.id ?? null);
  if (items.length === 0) return null;
  return (
    <div>
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div className="accordion-item" key={item.id}>
            <button
              type="button"
              className="accordion-trigger"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${item.id}`}
              onClick={() => setOpen(isOpen ? null : item.id)}
            >
              <span>{locale === 'fa' ? item.question_fa : item.question_en}</span>
              <span className="accordion-icon">{isOpen ? <Minus size={13} /> : <Plus size={13} />}</span>
            </button>
            <div className="accordion-panel" data-open={isOpen} id={`faq-panel-${item.id}`}>
              <div className="accordion-panel-inner">
                <p>{locale === 'fa' ? item.answer_fa : item.answer_en}</p>
              </div>
            </div>
          </div>
        );
      })}
      {single && null}
    </div>
  );
}
