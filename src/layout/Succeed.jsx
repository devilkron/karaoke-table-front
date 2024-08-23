import { useNavigate } from "react-router-dom";

export default function Succeed() {
  const navigate = useNavigate();

  const hdlHome = () => {
    navigate("/");
  };

  const hdlBookingUser = () => {
    navigate("/DataBookingUser");
  };

  return (
    <div className="h-screen flex items-center justify-center mt-10 bg-gradient-to-r from-sky-200 to-blue-200">
      <div className="flex flex-col items-center bg-white shadow-2xl rounded-3xl p-10 w-full max-w-5xl h-[80vh] mt-10">
        <img
          src="https://cdn.pixabay.com/photo/2017/01/13/01/22/ok-1976099_1280.png"
          alt="Success"
          className="w-48 h-48 mb-16 rounded-full shadow-lg transition-transform transform hover:scale-105 duration-300"
        />
        <div className="text-center">
          <h1
            className="text-6xl font-bold text-green-600 mb-6 text-shadow-lg"
            style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)" }}
          >
            จองโต๊ะสำเร็จ
          </h1>
          <p className="text-2xl text-gray-700 mb-20 font-medium">
            คุณได้ทำการจองโต๊ะอาหารเรียบร้อยแล้ว
          </p>

          <div className="flex flex-row items-center space-x-5">
            <button
              onClick={hdlHome}
              className="relative w-80 p-4 h-14 bg-blue-600 text-white border-none rounded-lg text-lg font-semibold cursor-pointer overflow-hidden group transition-transform duration-500 ease-in-out hover:bg-blue-700 shadow-lg"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
              <span className="relative z-10">กลับไปหน้าหลัก</span>
              <span className="absolute w-full h-full bg-blue-800 rounded-full -top-10 -left-10 -z-10 group-hover:bg-blue-900 transition-all duration-500"></span>
            </button>

            <button
              onClick={hdlBookingUser}
              className="relative w-80 p-4 h-14 bg-red-600 text-white border-none rounded-lg text-lg font-semibold cursor-pointer overflow-hidden group transition-transform duration-500 ease-in-out hover:bg-red-700 shadow-lg"
            >
              <span className="absolute inset-0 bg-gradient-to-l from-red-500 to-yellow-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
              <span className="relative z-10">ดูประวัติการจอง</span>
              <span className="absolute w-full h-full bg-red-800 rounded-full -top-10 -left-10 -z-10 group-hover:bg-red-900 transition-all duration-500"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
