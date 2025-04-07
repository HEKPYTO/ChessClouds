import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative border-t border-amber-200/30 dark:border-slate-700/30 py-12 mt-12 bg-amber-100 dark:bg-slate-800">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/noise.png)',
          backgroundRepeat: 'repeat',
          opacity: 0.025,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded bg-amber-600 dark:bg-amber-500 mr-2"></div>
            <span className="font-semibold text-amber-900 dark:text-amber-100">
              ChessCloud
            </span>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link
              href="#"
              className="text-sm text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
