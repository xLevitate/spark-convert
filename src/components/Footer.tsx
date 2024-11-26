export default function Footer() {
  return (
    <footer className="border-t border-gray-800/50 mt-auto backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} SparkConvert. Open source file conversion.
          </p>
          <div className="flex gap-8">
            <a
              href="#privacy"
              className="text-gray-400 hover:text-amber-500 text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-gray-400 hover:text-amber-500 text-sm transition-colors"
            >
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
