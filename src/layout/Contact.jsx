import React, { useEffect, useState } from "react";
import { FaFacebook, FaEnvelope, FaHome, FaMobileAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";

export default function Contact() {
  const images = [
    "https://png.pngtree.com/background/20211215/original/pngtree-gourmet-food-tableware-gray-and-black-creative-banner-picture-image_1495471.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [animation, setAnimation] = useState("slideIn");

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

  return (
    <div className="min-h-screen">
    <div className="bg-pattern min-h-screen flex flex-col items-center py-10 px-1">
      <div className="overflow-hidden w-full max-w-10xl">
        <div className="relative overflow-hidden w-full mt-10 h-[200px]">
          <img
            src={images[currentImageIndex]}
            className={`w-full h-[400px] object-cover absolute ${animation}`}
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-6xl font-bold animate-bounce [text-shadow:2px_2px_4px_var(--tw-shadow-color)] shadow-gray-400">
              ติดต่อเรา
            </h1>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">ร้านอาหารเขตจังหวัดนครพนม</h2>
            <p className="mt-2 text-gray-600">
              ร้านอาหารอร่อยที่สุดในเมืองนครพนม
            </p>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center text-gray-700">
              <FaHome className="text-2xl" />
              <div className="ml-3">
                <p className="font-semibold">ที่อยู่:</p>
                <p>282 ตำบลมหาชัย อำเภอปลาปาก จังหวัดนครพนม</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <FaMobileAlt className="text-2xl" />
              <div className="ml-3">
                <p className="font-semibold">เบอร์โทรศัพท์:</p>
                <p>065-539-0921</p>
              </div>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col items-center p-6 bg-gradient-to-tr from-white to-blue-300 border-2 border-blue-300 rounded-xl shadow-xl hover:scale-90 transition duration-150 ease-in-out transform hover:shadow-2xl">
                <FaFacebook className="text-4xl text-blue-700 mb-2 drop-shadow-lg" />
                <h4 className="text-xl font-bold">Facebook</h4>
                <a
                  href="https://www.facebook.com/profile.php?id=100021929414668&locale=th_TH"
                  className="text-blue-600 hover:text-blue-400 "
                >
                  Sureelux Pangkhamhak
                </a>
              </div>
              <div className="flex flex-col items-center p-6 bg-gradient-to-tr from-white to-red-300 border-2 border-red-300 rounded-lg shadow-md hover:scale-90 transition duration-150 ease-in-out transform hover:shadow-2xl">
                <FaEnvelope className="text-4xl text-red-600 mb-2 drop-shadow-lg" />
                <h4 className="text-xl font-bold">อีเมล</h4>
                <a href="" className="text-red-600 hover:text-red-400">
                  sureelux.pa64@snru.ac.th
                </a>
              </div>
              <div className="flex flex-col items-center p-6 bg-gradient-to-tr from-white to-green-300  border-2 border-green-300 rounded-lg shadow-md hover:scale-90 transition duration-150 ease-in-out transform hover:shadow-2xl">
                <IoLocationSharp className="text-4xl text-green-500 mb-2 drop-shadow-lg" />
                <h4 className="text-xl font-bold">พิกัด</h4>
                <a
                  href="https://www.google.com/maps/place/17%C2%B010'52.2%22N+104%C2%B004'59.9%22E/@17.181159,104.083312,17z/data=!3m1!4b1!4m4!3m3!8m2!3d17.181159!4d104.083312?entry=ttu"
                  className="text-green-500 hover:text-green-400"
                >
                  17.181159, 104.083312
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
