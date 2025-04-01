export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center">
          <div className="flex-shrink-0 flex items-center">
            <svg className="h-8 w-8 text-primary-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14 4.14 5.57 2 7.71 3.43 9.14 2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22 14.86 20.57 16.29 22 17.71 20.57 19.14 18.43 17 16.29 19.14 14.86 20.57z"/>
            </svg>
            <h1 className="ml-2 text-xl font-semibold text-neutral-500">FitPlan AI</h1>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full text-neutral-400 hover:text-primary-500 hover:bg-neutral-50">
            <span className="material-icons">notifications</span>
          </button>
          <button className="p-2 rounded-full text-neutral-400 hover:text-primary-500 hover:bg-neutral-50">
            <span className="material-icons">settings</span>
          </button>
          <div className="ml-2">
            <button className="inline-flex items-center justify-center rounded-full overflow-hidden bg-primary-500 w-8 h-8 text-white">
              <span>FP</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
