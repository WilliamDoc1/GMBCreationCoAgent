export const MadeWithDyad = () => {
  return (
    <div className="p-8 text-center space-y-4">
      <div className="flex justify-center gap-6 text-xs text-slate-400">
        <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
        <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
        <a href="/documentation" className="hover:text-primary transition-colors">Documentation</a>
      </div>
      <a
        href="https://www.dyad.sh/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        Made with Dyad
      </a>
    </div>
  );
};