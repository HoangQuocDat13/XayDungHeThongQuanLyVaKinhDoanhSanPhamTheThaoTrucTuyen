import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "SportZone – Cửa hàng thể thao trực tuyến",
    template: "%s | SportZone",
  },
  description:
    "Mua sắm sản phẩm thể thao chính hãng: giày, quần áo, dụng cụ thể thao từ Nike, Adidas, Mizuno và hàng trăm thương hiệu khác. Giao hàng toàn quốc, đổi trả dễ dàng.",
  keywords: ["thể thao", "mua sắm thể thao", "giày thể thao", "quần áo thể thao", "SportZone"],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "SportZone",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="antialiased">
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          aria-label="Thông báo"
        />
      </body>
    </html>
  );
}
