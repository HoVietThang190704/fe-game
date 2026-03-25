import { Users, TrendingUp, Flag } from "lucide-react";

const features = [
  {
    icon: <Flag className="h-6 w-6" />, 
    title: "Đối kháng PvP",
    description:
      "Hệ thống ghép trận thông minh dựa trên ELO. Thi đấu thời gian thực với hàng ngàn người chơi khác.",
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: <Users className="h-6 w-6" />, 
    title: "Chơi cùng bạn bè",
    description:
      "Tạo phòng riêng, nhập mã phòng và so tài. Cao thủ với bạn bè của bạn bất cứ lúc nào.",
    color: "from-blue-500 to-sky-500",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />, 
    title: "Leo bảng xếp hạng",
    description:
      "Thắng trận để tăng điểm ELO. Khẳng định vị thế của bạn trên bảng xếp hạng danh dự toàn server.",
    color: "from-emerald-500 to-lime-500",
  },
];

export function FeatureCardsSection() {
  return (
    <section className="bg-gradient-to-br from-slate-950 via-teal-950 to-cyan-950 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="feature-card rounded-2xl p-6 backdrop-blur"
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${feature.color} text-white`}
              >
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
