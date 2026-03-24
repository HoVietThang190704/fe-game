import styles from "./FeatureHighlightsSection.module.css"

type FeatureItem = {
  title: string
  description: string
  tag: string
}

const FEATURE_ITEMS: FeatureItem[] = [
  {
    title: "PvP Realtime Không Độ Trễ",
    description:
      "Đồng bộ thao tác theo mili-giây, từng cú click đều được phản hồi tức thì để giữ nhịp trận đấu luôn căng thẳng.",
    tag: "Realtime",
  },
  {
    title: "Xếp Hạng Kỹ Năng Minh Bạch",
    description:
      "Hệ thống rank đánh giá dựa trên hiệu suất thực chiến, giúp người chơi tiến bộ theo đúng năng lực.",
    tag: "Ranked",
  },
  {
    title: "Phòng Đấu Riêng Tư Theo Team",
    description:
      "Tạo phòng mời bạn bè trong vài giây, hỗ trợ cấu hình luật chơi để luyện tập hoặc thi đấu nghiêm túc.",
    tag: "Custom Room",
  },
  {
    title: "Chống Gian Lận Chủ Động",
    description:
      "Pipeline phát hiện bất thường kết hợp kiểm tra hành vi, duy trì môi trường thi đấu công bằng và chuyên nghiệp.",
    tag: "Fair Play",
  },
]

export function FeatureHighlightsSection() {
  return (
    <section className={styles.section} aria-labelledby="feature-heading">
      <div className={styles.spotlight} aria-hidden="true" />
      <div className={styles.gridGlow} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.kicker}>TÍNH NĂNG NỔI BẬT</p>
          <h2 id="feature-heading" className={styles.heading}>
            Trải nghiệm Minesweeper PvP hiện đại, tốc độ và chuẩn thi đấu
          </h2>
          <p className={styles.description}>
            Mỗi thành phần trong hệ thống được thiết kế để tối ưu nhịp chơi,
            tăng chiều sâu chiến thuật và đem lại cảm giác cạnh tranh chuyên
            nghiệp ngay từ trận đầu tiên.
          </p>
        </div>

        <div className={styles.cards}>
          {FEATURE_ITEMS.map((item, index) => (
            <article
              key={item.title}
              className={styles.card}
              style={{ ["--delay" as string]: `${index * 90}ms` }}
            >
              <span className={styles.tag}>{item.tag}</span>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
