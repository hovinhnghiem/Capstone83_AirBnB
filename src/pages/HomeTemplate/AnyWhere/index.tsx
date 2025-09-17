import React from "react";

interface Place {
  id: number;
  title: string;
  img: string;
}

const places: Place[] = [
  {
    id: 1,
    title: "Toàn bộ nhà",
    img: "https://anphatgroups.vn/upload/post/mau-biet-thu-dep-9680.jpg",
  },
  {
    id: 2,
    title: "Chỗ ở độc đáo",
    img: "https://cafefcdn.com/203337114487263232/2023/7/13/1689238368-screenshot-1650-16892344811431460297302-1689240125711-16892401267161897923784.png",
  },
  {
    id: 3,
    title: "Trang trại và thiên nhiên",
    img: "https://sakos.vn/wp-content/uploads/2024/08/an-1.jpg",
  },
  {
    id: 4,
    title: "Cho phép mang theo thú cưng",
    img: "https://sakos.vn/wp-content/uploads/2023/05/kham-pha-khong-gian-song-ao-dang-yeu-tai-cac-quan-ca-phe-thu-cung-da-lat-5.jpg",
  },
];

const AnywhereSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Ở bất cứ đâu</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {places.map((place) => (
          <div key={place.id} className="group cursor-pointer">
            <img
              src={place.img}
              alt={place.title}
              className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
            />
            <p className="mt-2 text-sm font-medium">{place.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AnywhereSection;
