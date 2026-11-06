// MOCK DATA – Tin tức thể thao (100% tiếng Việt tự nhiên)
// Thay thế bằng API call thực tế khi backend sẵn sàng

import type { TinTuc } from "@/types";

export const mockTinTuc: TinTuc[] = [
  {
    id: "tn-1",
    tieuDe: "10 bài tập chạy bộ giúp cải thiện tốc độ và sức bền an toàn",
    duongDanNgan: "top-10-bai-tap-chay-bo-tang-toc-do",
    noiDung: `<h2>Vì sao cần rèn luyện tốc độ đúng phương pháp?</h2>
<p>Tốc độ và sức bền là hai yếu tố bổ trợ lẫn nhau trong chạy bộ cũng như nhiều môn thể thao vận động khác. Dù bạn mới làm quen đường chạy hay đang hướng tới cự ly bán marathon, một lịch tập khoa học sẽ giúp cơ thể thích nghi êm ái và hạn chế chấn thương.</p>
<h2>Các phương pháp tập luyện hiệu quả nhất</h2>
<p><strong>1. Chạy biến tốc linh hoạt:</strong> Xen kẽ các quãng chạy nhanh vừa sức với quãng chạy chậm thả lỏng theo cảm nhận cơ thể. Bài tập này giúp buổi chạy bớt nhàm chán và cải thiện nhịp tim tự nhiên.</p>
<p><strong>2. Chạy lặp quãng ngắn:</strong> Chạy nhanh 400m ở mức 80% sức, đi bộ hoặc chạy nhẹ 2 phút để hồi nhịp thở, lặp lại từ 6 đến 8 tổ mỗi buổi.</p>
<p><strong>3. Chạy duy trì ngưỡng bền:</strong> Giữ tốc độ ổn định ở mức bạn vẫn có thể nói câu ngắn trong 20–35 phút liên tục để nâng nền tảng thể lực.</p>
<p><strong>4. Chạy dốc ngắn:</strong> Chạy lên dốc thoải trong 20–30 giây giúp tăng sức mạnh cơ đùi và cổ chân, sau đó đi bộ chậm xuống dốc để phục hồi.</p>
<blockquote>Lời khuyên: Chỉ nên tăng tổng quãng đường chạy tối đa 10% mỗi tuần để cơ khớp có đủ thời gian hồi phục.</blockquote>`,
    anhBia: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
    tacGiaId: "u-1",
    ngayDang: "2026-11-01T08:00:00Z",
    tacGia: { id: "u-1", taiKhoanId: "tk-1", hoTen: "Nguyễn Minh Tuấn", anhDaiDien: "https://picsum.photos/seed/author1/60/60", ngayTao: "2026-01-01T00:00:00Z", ngayCapNhat: "2026-01-01T00:00:00Z" },
  },
  {
    id: "tn-2",
    tieuDe: "Hướng dẫn chọn trang phục và kính bơi thoải mái cho người mới",
    duongDanNgan: "huong-dan-chon-giay-boi-dung-ky-thuat",
    noiDung: `<h2>Trang bị bơi lội ảnh hưởng thế nào đến buổi tập?</h2>
<p>Một bộ đồ bơi vừa vặn cùng chiếc kính bơi ôm khít hốc mắt giúp bạn tự tin lướt nước, không lo rò nước hay cọ xát da khi vận động liên tục dưới hồ bơi.</p>
<h2>Tiêu chí chọn đồ bơi dễ áp dụng</h2>
<p><strong>Chất liệu kháng nước hồ bơi:</strong> Ưu tiên vải pha sợi tổng hợp đàn hồi cao, giữ phom tốt và khô thoáng nhanh sau khi lên bờ.</p>
<p><strong>Độ ôm vừa phải:</strong> Khi thử đồ, hãy xoay nhẹ hai vai và vươn tay cao qua đầu — trang phục tốt sẽ ôm gọn cơ thể mà không gây hằn đỏ ở vai hay hông.</p>`,
    anhBia: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80",
    tacGiaId: "u-2",
    ngayDang: "2026-10-28T09:00:00Z",
    tacGia: { id: "u-2", taiKhoanId: "tk-2", hoTen: "Trần Thị Lan Anh", anhDaiDien: "https://picsum.photos/seed/author2/60/60", ngayTao: "2026-01-01T00:00:00Z", ngayCapNhat: "2026-01-01T00:00:00Z" },
  },
  {
    id: "tn-3",
    tieuDe: "5 bài tập rèn thể lực tại nhà không cần máy móc phức tạp",
    duongDanNgan: "5-bai-tap-gym-tai-nha-khong-can-dung-cu",
    noiDung: `<h2>Duy trì thói quen vận động ngay tại không gian sống</h2>
<p>Chỉ cần một tấm thảm tập êm ái và 25 phút mỗi sáng, bạn hoàn toàn có thể đánh thức toàn bộ nhóm cơ, giảm mỏi vai gáy và giữ tinh thần sảng khoái suốt ngày làm việc.</p>
<h2>5 động tác nền tảng dễ thực hiện</h2>
<p><strong>1. Chống đẩy cơ bản:</strong> Tác động đồng thời lên ngực, vai và tay sau. Người mới có thể bắt đầu với tư thế tỳ gối để giữ lưng thẳng.</p>
<p><strong>2. Ngồi xổm giữ lưng thẳng:</strong> Tăng sức mạnh cơ đùi và vùng hông. Chú ý mở gối theo hướng mũi chân và siết nhẹ cơ bụng.</p>
<p><strong>3. Giữ thân người thẳng trên khuỷu tay:</strong> Củng cố nhóm cơ trọng tâm, bảo vệ cột sống thắt lưng. Bắt đầu từ 30 giây mỗi hiệp và tăng dần theo tuần.</p>`,
    anhBia: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    tacGiaId: "u-1",
    ngayDang: "2026-10-20T10:00:00Z",
    tacGia: { id: "u-1", taiKhoanId: "tk-1", hoTen: "Nguyễn Minh Tuấn", anhDaiDien: "https://picsum.photos/seed/author1/60/60", ngayTao: "2026-01-01T00:00:00Z", ngayCapNhat: "2026-01-01T00:00:00Z" },
  },
  {
    id: "tn-4",
    tieuDe: "Làm quen với quần vợt: Cách chọn vợt và giày cho buổi đầu ra sân",
    duongDanNgan: "tennis-cho-nguoi-moi-bat-dau-tu-dau",
    noiDung: `<h2>Quần vợt – bộ môn kết hợp sự linh hoạt và tập trung</h2>
<p>Quần vợt phù hợp với nhiều lứa tuổi nhờ nhịp vận động đa dạng và tính kết nối bạn bè cao. Với người mới, nên chọn khung vợt trọng lượng nhẹ vừa phải (265g – 285g) cùng đôi giày đế bám sân chuyên dụng để bảo vệ cổ chân khi đổi hướng ngang.</p>`,
    anhBia: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=80",
    tacGiaId: "u-2",
    ngayDang: "2026-10-15T08:00:00Z",
    tacGia: { id: "u-2", taiKhoanId: "tk-2", hoTen: "Trần Thị Lan Anh", anhDaiDien: "https://picsum.photos/seed/author2/60/60", ngayTao: "2026-01-01T00:00:00Z", ngayCapNhat: "2026-01-01T00:00:00Z" },
  },
  {
    id: "tn-5",
    tieuDe: "Dinh dưỡng thể thao: Nên ăn nhẹ gì trước và sau buổi tập?",
    duongDanNgan: "dinh-duong-the-thao-an-gi-truoc-sau-khi-tap",
    noiDung: `<h2>Nạp năng lượng đúng thời điểm</h2>
<p>Trước giờ tập khoảng 45–60 phút, một quả chuối chín, lát bánh mì nguyên cám hoặc hộp sữa chua ít đường giúp cung cấp năng lượng bền bỉ mà không gây đầy bụng. Sau buổi tập, bổ sung nước điện giải và thực phẩm giàu đạm giúp cơ bắp phục hồi nhanh chóng.</p>`,
    anhBia: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    tacGiaId: "u-1",
    ngayDang: "2026-10-10T07:00:00Z",
    tacGia: { id: "u-1", taiKhoanId: "tk-1", hoTen: "Nguyễn Minh Tuấn", anhDaiDien: "https://picsum.photos/seed/author1/60/60", ngayTao: "2026-01-01T00:00:00Z", ngayCapNhat: "2026-01-01T00:00:00Z" },
  },
  {
    id: "tn-6",
    tieuDe: "Mẹo bảo quản giày đá bóng bền đẹp qua mùa mưa ẩm",
    duongDanNgan: "lich-thi-dau-bong-da-quoc-te-mua-2026-2027",
    noiDung: `<h2>Giữ phom giày và độ bám sân lâu dài</h2>
<p>Sau mỗi trận đấu dưới trời mưa, hãy tháo lót giày, lau sạch bùn đất bằng khăn ẩm mềm và nhét giấy hút ẩm bên trong thân giày. Tránh phơi trực tiếp dưới nắng gắt hoặc sấy nhiệt cao để lớp keo đế luôn bền chắc.</p>`,
    anhBia: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    tacGiaId: "u-2",
    ngayDang: "2026-10-05T11:00:00Z",
    tacGia: { id: "u-2", taiKhoanId: "tk-2", hoTen: "Trần Thị Lan Anh", anhDaiDien: "https://picsum.photos/seed/author2/60/60", ngayTao: "2026-01-01T00:00:00Z", ngayCapNhat: "2026-01-01T00:00:00Z" },
  },
];

export function getTinTucBySlug(slug: string): TinTuc | undefined {
  return mockTinTuc.find((tn) => tn.duongDanNgan === slug);
}
