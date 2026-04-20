import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import SectionTitle from "../../components/ui/SectionTitle";
import { Search, ShoppingCart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white p-10 space-y-16">
      {/* ── SECTION TITLE PREVIEW ── */}
      <div>
        <SectionTitle
          title="Sản Phẩm Mới"
          subtitle="Khám phá bộ sưu tập rượu vang cao cấp mới nhất"
        />
      </div>

      {/* ── BUTTON PREVIEW ── */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">
          Buttons
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Add to Cart</Button>
          <Button variant="primary" size="sm">
            <ShoppingCart size={14} />
            Add to Cart
          </Button>
          <Button variant="primary" size="lg">
            Xem Thêm
          </Button>
          <Button variant="outline">Xem Chi Tiết</Button>
          <Button variant="dark">Đặt Hàng Ngay</Button>
          <Button variant="ghost">Bỏ qua</Button>
          <Button variant="primary" loading>
            Đang xử lý...
          </Button>
          <Button variant="primary" disabled>
            Hết hàng
          </Button>
        </div>
      </div>

      {/* ── INPUT PREVIEW ── */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">
          Inputs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <Input label="Email" placeholder="Nhập email của bạn" type="email" />
          <Input label="Mật khẩu" placeholder="••••••••" type="password" />
          <Input
            label="Tìm kiếm"
            placeholder="Tìm sản phẩm..."
            leftIcon={<Search size={16} />}
          />
          <Input
            label="Email (lỗi)"
            placeholder="email@example.com"
            error="Email không hợp lệ"
          />
        </div>
      </div>

      {/* ── COLOR PALETTE ── */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">
          Colors
        </h3>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-(--color-primary) rounded mb-2" />
            <p className="text-xs">Primary</p>
            <p className="text-xs text-gray-400">#c9a047</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-(--color-dark) rounded mb-2" />
            <p className="text-xs">Dark</p>
            <p className="text-xs text-gray-400">#1a1a1a</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-(--color-price) rounded mb-2" />
            <p className="text-xs">Price</p>
            <p className="text-xs text-gray-400">#e07b2a</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-(--color-muted) rounded mb-2" />
            <p className="text-xs">Muted</p>
            <p className="text-xs text-gray-400">#888888</p>
          </div>
        </div>
      </div>
    </div>
  );
}
