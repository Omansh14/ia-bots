import { Suspense } from 'react';
import Router from './router';
function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-screen w-full flex flex-col gap-3 justify-center items-center">
            <div className="flex gap-2 items-center">
              <img src="/auditbot-logo.png" className="w-8 h-8" />
              <h2 className='text-lg'>Auditbots</h2>
            </div>
          </div>
        }
      >
        <Router />
      </Suspense>
    </>
  );
}

export default App;
