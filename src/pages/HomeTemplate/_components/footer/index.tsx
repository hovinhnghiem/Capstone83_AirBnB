import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-700">
        
        {/* Cột 1 */}
        <div>
          <h3 className="font-semibold mb-4">GIỚI THIỆU</h3>
          <ul className="space-y-2">
            <li>Phương thức hoạt động của Airbnb</li>
            <li>Trang tin tức</li>
            <li>Nhà đầu tư</li>
            <li>Airbnb Plus</li>
            <li>Airbnb Luxe</li>
            <li>HotelTonight</li>
            <li>Airbnb for Work</li>
            <li>Nhờ có Host, mọi điều đều có thể</li>
            <li>Cơ hội nghề nghiệp</li>
            <li>Thư của nhà sáng lập</li>
          </ul>
        </div>

        {/* Cột 2 */}
        <div>
          <h3 className="font-semibold mb-4">CỘNG ĐỒNG</h3>
          <ul className="space-y-2">
            <li>Sự đa dạng và Cảm giác thân thuộc</li>
            <li>Tiện nghi phù hợp cho người khuyết tật</li>
            <li>Đối tác liên kết Airbnb</li>
            <li>Chỗ ở cho tuyến đầu</li>
            <li>Lượt giới thiệu của khách</li>
            <li>Airbnb.org</li>
          </ul>
        </div>

        {/* Cột 3 */}
        <div>
          <h3 className="font-semibold mb-4">ĐÓN TIẾP KHÁCH</h3>
          <ul className="space-y-2">
            <li>Cho thuê nhà</li>
            <li>Tổ chức Trải nghiệm trực tuyến</li>
            <li>Tổ chức trải nghiệm</li>
            <li>Đón tiếp khách có trách nhiệm</li>
            <li>Trung tâm tài nguyên</li>
            <li>Trung tâm cộng đồng</li>
          </ul>
        </div>

        {/* Cột 4 */}
        <div>
          <h3 className="font-semibold mb-4">HỖ TRỢ</h3>
          <ul className="space-y-2">
            <li>Biện pháp ứng phó với đại dịch COVID-19 của chúng tôi</li>
            <li>Trung tâm trợ giúp</li>
            <li>Các tuỳ chọn huỷ</li>
            <li>Hỗ trợ khu dân cư</li>
            <li>Tin cậy và an toàn</li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>© 2021 Airbnb, Inc. All rights reserved · Quyền riêng tư · Điều khoản · Sơ đồ trang web</p>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span>🌐 Tiếng Việt (VN)</span>
            <span>$ USD</span>
            <div className="flex gap-3 text-gray-700">
              <FaFacebookF />
              <FaTwitter />
              <FaInstagram />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
