import { MapPin, Phone } from "lucide-react";

const brandMarks = ["Authentic", "Retrobrand", "Bearbrand"];

const footerColumns = [
  {
    title: "Thông tin",
    items: [
      "Về chúng tôi",
      "Giao hàng",
      "Cam kết",
      "Lưu trữ",
      "Chính sách riêng tư",
    ],
  },
  {
    title: "Mua hàng",
    items: [
      "Vận chuyển và trả hàng",
      "Mua hàng an toàn",
      "Vận quốc tế",
      "Liên kết",
      "Dịch vụ giảm giá",
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-border-soft bg-white/70">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-px overflow-hidden border border-border-soft bg-border-soft md:grid-cols-3">
          {brandMarks.map((mark) => (
            <div
              key={mark}
              className="flex h-28 items-center justify-center bg-white text-center"
            >
              <div>
                <p
                  className="text-4xl italic text-dark"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {mark}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.36em] text-muted">
                  Estate Selection
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-10 border-t border-border-soft pt-10 lg:grid-cols-[1fr_1fr_1.25fr_1.5fr]">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2
                className="text-2xl uppercase tracking-[0.16em]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {column.title}
              </h2>
              <div className="mt-4 space-y-2 text-[11px] uppercase tracking-[0.12em] text-muted">
                {column.items.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          ))}

          <div>
            <h2
              className="text-2xl uppercase tracking-[0.16em]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Gửi email
            </h2>
            <p className="mt-4 text-[11px] text-muted">
              Gửi email đến chúng tôi để được hỗ trợ
            </p>
            <div className="mt-4 flex max-w-sm overflow-hidden border border-dark">
              <input
                className="min-w-0 flex-1 border-0 bg-white px-4 py-2 text-xs outline-none"
                placeholder="Enter your email"
              />
              <button className="bg-dark px-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
                Gửi
              </button>
            </div>
          </div>

          <div>
            <h2
              className="text-2xl uppercase tracking-[0.16em]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Liên hệ
            </h2>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <p className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-black" />
                Tầng 4, Tòa nhà Hanoi Group, 442 Đội Cấn, Ba Đình, Hà Nội
              </p>
              <p className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-black" />
                (04) 6674 2332 · (04) 3786 8904 · (08) 6680 9686
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border-soft pt-6 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© Copyright 2008-2014 DKT Technology JSC</p>
          <p className="uppercase tracking-[0.3em]">Visa · PayPal · MasterCard</p>
        </div>
      </div>
    </footer>
  );
}
