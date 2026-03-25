export function MatchSettingsSection() {
  return (
    <section className="mb-5 rounded-xl border border-sky-200/20 bg-slate-900/45 p-4">
      <h2 className="mb-3 text-2xl font-black tracking-wide text-cyan-300">CÀI ĐẶT TRẬN ĐẤU</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-sky-100/65">Kích thước bản đồ</p>
          <p className="mt-1 text-xl font-bold text-cyan-100">10 x 10</p>
        </div>
        <div>
          <p className="text-sm text-sky-100/65">Số lượng bom</p>
          <p className="mt-1 text-2xl font-bold text-cyan-100">20 bom</p>
        </div>
        <div>
          <p className="text-sm text-sky-100/65">Máu mỗi người</p>
          <p className="mt-1 text-2xl font-bold text-cyan-100">3 máu</p>
        </div>
        <div>
          <p className="text-sm text-sky-100/65">Thời gian mỗi lượt</p>
          <p className="mt-1 text-2xl font-bold text-cyan-100">30 giây</p>
        </div>
      </div>
    </section>
  );
}
