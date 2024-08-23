import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/core";

const UserHome = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [backgroundSize, setBackgroundSize] = useState("cover");
  const [animation, setAnimation] = useState("slideIn");

  const images = [
    "https://png.pngtree.com/background/20231101/original/pngtree-chic-dining-destination-modern-contemporary-interior-design-in-cozy-restaurant-3d-picture-image_5833843.jpg",
    "https://png.pngtree.com/background/20231018/original/pngtree-3d-render-of-a-dining-space-in-a-coffeehouse-picture-image_5596553.jpg",
    "https://png.pngtree.com/thumb_back/fw800/background/20230718/pngtree-sleek-and-cozy-coffee-shop-seating-area-with-laptop-on-wooden-image_3900897.jpg",
    "https://png.pngtree.com/thumb_back/fw800/background/20230526/pngtree-full-restaurant-in-a-space-full-of-wooden-chairs-image_2658883.jpg",
    "https://png.pngtree.com/background/20231101/original/pngtree-3d-rendering-of-a-coffee-shop-or-dining-area-picture-image_5836805.jpg",
  ];

  const imageArr = [
    {
      src: "https://sabuyjaishop.com/shop/wallbkk/images/zvvkhk20wyxtple30kjx1782021223017902.jpg",
    },
    {
      src: "https://www.bloggang.com/data/t/tathaitravel/picture/1659527277.jpg",
    },
    {
      src: "https://www.bloggang.com/data/t/tathaitravel/picture/1659527299.jpg",
    },
    {
      src: "https://www.bloggang.com/data/t/tathaitravel/picture/1659527244.jpg",
    },
    {
      src: "https://www.ryoiireview.com/upload/article/201912/1575460965_f7e90e57514ef13099ad72d91271cfc5.jpg",
    },
    {
      src: "https://nocnoc.com/blog/wp-content/uploads/2020/12/shape-table.jpg",
    },
    {
      src: "https://nocnoc.com/blog/wp-content/uploads/2023/01/10_how-to-start-a-restaurant-business.jpg",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimation("slideOut");
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setAnimation("slideIn");
      }, 9000); 
    }, 16000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      setBackgroundSize("100% auto");
      setTimeout(() => setBackgroundSize("cover"), 3000);
    }, 6000);

    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="bg-white min-h-screen flex flex-col items-center py-10 px-1">
      <div className="overflow-hidden w-full max-w-10xl">
        <div className="relative overflow-hidden w-full mt-10 h-[450px]">
          <img
            src={images[currentImageIndex]}
            className={`w-full h-[450px] object-cover absolute ${animation}`}
          />

          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center ">
            <div className="text-white text-8xl font-bold bg-white bg-opacity-30 [text-shadow:2px_2px_2px_var(--tw-shadow-color)] shadow-gray-400 p-20">
              <h1 className="animate-bounce inline-block duration-90000 ease-out">
                ยินดีต้อนรับ
              </h1>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center mt-2 bg-gradient-to-tl bg-blue-600 via-sky-400 from-yellow-200 w-full p-10">
            <h2 className="text-5xl font-bold text-white [text-shadow:2px_2px_4px_var(--tw-shadow-color)] shadow-gray-800">
              ระบบจองโต๊ะอาหาร
            </h2>
            <p className="mt-8 text-white text-xl [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-gray-600">
              ระบบการจองโต๊ะอาหารออนไลน์
              เพื่อจองที่นั่งล่วงหน้าไม่ต้องไปรอลุ้นหน้าร้านว่าจะมีโต๊ะไหม
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-1 gap-5 ">
            <div className="flex flex-col items-center p-8 bg-white border-2 border-gray-200 rounded-3xl shadow-md">
              <div className="max-w-[300rem]">
                <Splide
                  options={{
                    rewind: true,
                    autoplay: true,
                    interval: 2000,
                    perPage: 3,
                    perMove: 1,
                    speed: 500,
                    gap: "3rem",
                    focus: "center",
                    type: "loop",
                    pagination: false,
                    arrows: true,
                    direction: "ltr",
                  }}
                  aria-label="slide images"
                >
                  {imageArr.map((el, index) => (
                    <SplideSlide key={index}>
                      <div className="h-[300px]">
                        <div className="relative h-full">
                          <img
                            className="rounded-xl w-full h-full object-cover"
                            src={el.src}
                            alt={el.alt}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-opacity duration-300 rounded-xl"></div>
                        </div>
                      </div>
                    </SplideSlide>
                  ))}
                </Splide>
              </div>

              <div className="justify-end items-end p-4 text-lg">
                สามารถเลือกดูโต๊ะอาหาร ได้ที่นี้
                <span className="mr-2"></span>
                <Link
                  to="/Tables"
                  className="text-red-600 font-bold hover:underline text-2xl animate-pulse"
                >
                  ดูโต๊ะอาหาร
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-40 py-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="relative overflow-hidden">
            <img
              src="https://img.kapook.com/u/2015/pree/pet8/a40.jpg"
              alt="Image 1"
              className="w-full h-auto hover:grayscale-0 transition duration-300 animate-zoom-in-out"
            />
          </div>
          <div className="relative overflow-hidden">
            <img
              src="https://img.kapook.com/u/2015/pree/pet8/a37.jpg"
              alt="Image 2"
              className="w-full h-auto hover:grayscale-0 transition duration-300 animate-zoom-in-out"
            />
          </div>
          <div className="relative overflow-hidden">
            <img
              src="https://img.kapook.com/u/2015/pree/pet8/a31_2.jpg"
              alt="Image 3"
              className="w-full h-auto hover:grayscale-0 transition duration-300 animate-zoom-in-out"
            />
          </div>
          <div className="col-span-3 relative overflow-hidden">
            <img
              src="https://mpics.mgronline.com/pics/Images/563000004761002.JPEG"
              alt="Image 4"
              className="w-full h-96 hover:grayscale-0 transition duration-300 animate-zoom-in-out"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
