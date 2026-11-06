import React from "react";
import Link from "next/link";
import { Camera, Dumbbell, Mail, MapPin, Phone, Play, Share2 } from "lucide-react";

const footerLinks = {
  "Hỗ trợ khách hàng": [
    { label: "Tất cả sản phẩm", href: "/products" },
    { label: "Theo dõi đơn hàng", href: "/orders" },
    { label: "Yêu cầu đổi / trả", href: "/returns" },
    { label: "Góc kiến thức thể thao", href: "/news" },
  ],
  "Môn thể thao": [
    { label: "Bóng đá", href: "/sports/bong-da" },
    { label: "Chạy bộ", href: "/sports/chay-bo" },
    { label: "Bơi lội", href: "/sports/boi-loi" },
    { label: "Gym & Fitness", href: "/sports/gym-fitness" },
  ],
  "Thương hiệu nổi bật": [
    { label: "Nike", href: "/brands/nike" },
    { label: "Adidas", href: "/brands/adidas" },
    { label: "Mizuno", href: "/brands/mizuno" },
    { label: "Wilson", href: "/brands/wilson" },
  ],
};

export function ClientFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white font-bold text-xl mb-4"
            >
              <Dumbbell size={24} className="shrink-0 text-teal-400" aria-hidden="true" />
              <span>SportZone</span>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Cửa hàng thể thao trực tuyến đồng hành cùng nhịp sống năng động mỗi ngày. Trang phục, giày dép và dụng cụ chính hãng dễ chọn, dễ đổi trả.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <a
                href="tel:19001234"
                className="inline-flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
              >
                <Phone size={16} className="shrink-0 text-teal-400" aria-hidden="true" />
                <span>1900 1234 (08:00 – 21:00)</span>
              </a>
              <div />
              <a
                href="mailto:support@sportzone.vn"
                className="inline-flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
              >
                <Mail size={16} className="shrink-0 text-teal-400" aria-hidden="true" />
                <span>support@sportzone.vn</span>
              </a>
              <div className="flex items-start gap-2.5 text-slate-300">
                <MapPin size={16} className="mt-1 shrink-0 text-teal-400" aria-hidden="true" />
                <span>123 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh</span>
              </div>
            </div>
            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Share2, href: "https://facebook.com", label: "Theo dõi trên Facebook" },
                { icon: Play, href: "https://youtube.com", label: "Kênh YouTube SportZone" },
                { icon: Camera, href: "https://instagram.com", label: "Hình ảnh trên Instagram" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-800 text-slate-200 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h2 className="text-white font-semibold text-sm mb-4">{title}</h2>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block py-0.5 text-sm text-slate-300 hover:text-teal-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            © 2026 SportZone. Tất cả quyền được bảo lưu.
          </p>
          <p className="text-xs text-slate-400 text-center sm:text-right">
            Giấy chứng nhận ĐKKD số 0123456789 – Sở KH&ĐT TP. Hồ Chí Minh
          </p>
        </div>
      </div>
    </footer>
  );
}
