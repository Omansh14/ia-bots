import { useLocation } from 'react-router-dom';

const steps = [
  {
    id: 1,
    title: 'Select Procedure',
    subtitle: 'Select a procedure to automate',
    path: '',
  },
  {
    id: 2,
    title: 'Upload Data',
    subtitle: 'Upload the data files for selected client',
    path: 'upload-data',
  },
  {
    id: 3,
    title: 'Data Mapping',
    subtitle: 'Align your data with audit requirements',
    path: 'data-mapping',
  },

  {
    id: 4,
    title: 'Run Procedure',
    subtitle: 'Review and execute the audit procedure',
    path: 'organise-upload',
  },
];

const Stepper = () => {
  const { pathname } = useLocation();

  // determine active step by checking pathname end
  const activeIndex = (() => {
    if (pathname.endsWith('/upload-data')) return 1;
    if (pathname.endsWith('/data-mapping')) return 2;
    if (pathname.endsWith('/procedure-review')) return 3;
    return 0;
  })();

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center gap-3">
        {steps.map((step, idx) => {
          const isActive = idx === activeIndex;
          //   const isPast = idx < activeIndex;

          return (
            <li key={step.id} className="flex-1">
              <div className="relative">
                <div
                  className={`flex items-center gap-3 p-3 rounded-md ${
                    isActive ? 'bg-blue-500 text-white' : 'bg-white text-muted-foreground border'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      isActive ? 'border-white' : 'border-blue-200'
                    } ${isActive ? 'bg-white/10' : 'bg-white'}`}
                  >
                    <span
                      className={`text-sm font-medium ${isActive ? 'text-white' : 'text-blue-500'}`}
                    >
                      {String(step.id).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className={`font-medium ${isActive ? 'text-white' : 'text-foreground'}`}>
                      {step.title}
                    </span>
                    <span
                      className={`text-xs ${isActive ? 'text-white/90' : 'text-muted-foreground'}`}
                    >
                      {step.subtitle}
                    </span>
                  </div>
                </div>

                {/* Right slanted edge like the image for active step */}
                {isActive && (
                  <div className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 transform rotate-45 bg-blue-500 sm:block" />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Stepper;
