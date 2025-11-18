import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronDown, CheckCircle2 } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';

const sampleList = [
  'Prevent duplicate vendors',
  'Ensure PO–GRN–Invoice match',
  'Non-PO invoices',
  'Detect post-invoice POs',
  'Monitor invoice discrepancies',
  'Automate purchase order creation',
  'Track invoice payments',
  'Analyze spending patterns',
  'Identify cost-saving opportunities',
];

import { useState, useEffect } from 'react';

type SectionState = {
  running: boolean;
  finished: boolean;
  itemStates: ('idle' | 'running' | 'done')[];
};

const Section = ({
  title,
  items,
  sectionState,
}: {
  title: string;
  items: string[];
  sectionState: SectionState;
}) => {
  return (
    <div className="mb-2">
      <Accordion type="single" collapsible>
        <AccordionItem value={title} className="border rounded-md">
          <AccordionTrigger className="w-full px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="w-full flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-base font-semibold">{title}</h3>
              </div>
              <div className="flex items-center gap-3">
                {sectionState.finished ? (
                  <div className="text-sm text-green-600 font-semibold flex items-center gap-1">
                    Completed <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                ) : sectionState.running ? (
                  <div className="text-sm text-blue-500 italic">Running...</div>
                ) : (
                  <div className="text-sm text-amber-500 italic">Waiting to run...</div>
                )}
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <div className="px-4 py-2">
              <div className="max-h-56 overflow-y-auto pr-2">
                <ul className="space-y-2">
                  {items.map((it, idx) => {
                    const state = sectionState.itemStates[idx];
                    return (
                      <li
                        key={idx}
                        className={
                          state === 'done'
                            ? 'text-sm font-semibold flex items-center gap-2'
                            : state === 'running'
                            ? 'text-sm text-blue-500 font-medium'
                            : 'text-sm text-muted-foreground'
                        }
                      >
                        {state === 'done' ? (
                          <span className="flex items-center gap-2">
                            <span className="bg-green-600 rounded-full p-1 flex items-center justify-center">
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            </span>
                            <span className="text-gray-600">{it}</span>
                          </span>
                        ) : (
                          <>
                            {it}
                            {state === 'running' && (
                              <span className="ml-2 animate-pulse">Running...</span>
                            )}
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const ProcedureReview = () => {
  const navigate = useNavigate();

  // Section states - derived from selected bots in sessionStorage.step1
  const [sections, setSections] = useState<{
    title: string;
    items: string[];
    state: SectionState;
  }[]>([]);

  // On mount, read selected bots from sessionStorage and build sections grouped by category
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('step1');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const selected = Array.isArray(parsed.selected_bots) ? parsed.selected_bots : [];

      // group auditProcedure names by category
      const groups: Record<string, string[]> = {};
      selected.forEach((b: any) => {
        const category = (b.category || 'Uncategorized').toString();
        const name = (b.auditProcedure || b.name || '').toString();
        if (!name) return;
        if (!groups[category]) groups[category] = [];
        groups[category].push(name);
      });

      const built = Object.keys(groups).map((category) => {
        const items = Array.from(new Set(groups[category])); // dedupe
        return {
          title: `${category} Audit Procedures`,
          items,
          state: {
            running: false,
            finished: false,
            itemStates: Array(items.length).fill('idle') as SectionState['itemStates'],
          },
        };
      });

      // If no selected bots, fall back to previous sample sections so UI doesn't appear empty
      if (built.length === 0) {
        setSections([
          {
            title: 'P2P Audit Procedures',
            items: sampleList,
            state: { running: false, finished: false, itemStates: Array(sampleList.length).fill('idle') },
          },
        ]);
      } else {
        setSections(built);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  const handleRun = async () => {
    // For each section, run items one by one
    for (let sIdx = 0; sIdx < sections.length; sIdx++) {
      // Mark section as running
      setSections((prev) => {
        const copy = [...prev];
        copy[sIdx] = {
          ...copy[sIdx],
          state: {
            ...copy[sIdx].state,
            running: true,
            finished: false,
            itemStates: Array(copy[sIdx].items.length).fill('idle'),
          },
        };
        return copy;
      });

      for (let i = 0; i < sections[sIdx].items.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setSections((prev) => {
          const copy = [...prev];
          const itemStates = [...copy[sIdx].state.itemStates];
          itemStates[i] = 'running';
          // Mark previous as done
          if (i > 0) itemStates[i - 1] = 'done';
          copy[sIdx] = {
            ...copy[sIdx],
            state: {
              ...copy[sIdx].state,
              itemStates,
            },
          };
          return copy;
        });
      }
      // After last item, mark all as done and section as finished
      setSections((prev) => {
        const copy = [...prev];
        copy[sIdx] = {
          ...copy[sIdx],
          state: {
            ...copy[sIdx].state,
            running: false,
            finished: true,
            itemStates: Array(copy[sIdx].items.length).fill('done'),
          },
        };
        return copy;
      });
    }
  };

  // Check if all sections are finished
  const allFinished = sections.every((s) => s.state.finished);

  return (
    <div className="p-6">
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="">
              <h1 className="text-2xl font-bold">Processing Bots</h1>
              <p className="text-sm text-muted-foreground mt-1">
                This may take a moment while we run AI checks and validations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              className="hover:cursor-pointer"
              onClick={() => navigate('../data-filtering')}
            >
              Edit Parameters
            </Button>
            <Button size="lg" className="hover:cursor-pointer" onClick={handleRun}>
              Run
            </Button>
          </div>
        </div>

        {sections.map((section) => (
          <Section
            key={section.title}
            title={section.title}
            items={section.items}
            sectionState={section.state}
          />
        ))}

        {allFinished && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => navigate('/generate-report')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow"
              size="lg"
            >
              Check Report
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProcedureReview;
