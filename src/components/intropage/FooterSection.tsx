export function FooterSection() {
  return (
    <footer className="footer-section py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between px-4 text-center text-sm text-slate-300 md:flex-row md:text-left">
        <div>
          © {new Date().getFullYear()} Minesweeper PvP. Design inspired by original concept.
        </div>
        <div className="mt-2 space-x-4 md:mt-0">
          <a href="/privacy" className="text-slate-300 hover:text-white">
            Chính sách bảo mật
          </a>
          <a href="/terms" className="text-slate-300 hover:text-white">
            Điều khoản dịch vụ
          </a>
        </div>
      </div>
    </footer>
  );
}
