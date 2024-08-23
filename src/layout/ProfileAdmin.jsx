import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/userAuth";

const guestNav = [{ to: "/" }];

const userNav = [
  { to: "/", text: "Home" },
  { to: "/", text: "Home" },
];

export default function ProfileAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const hdlUpdateProfile = () => {
    navigate("/updateProfile");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-1 bg-sky-200"
    >
      <div className="mt-20">
        <p className="text-center text-3xl font-bold">
          บัญชีของ{" "}
          <span className="text-red-600">
            {user?.user_id ? user.username : "Guest"}
          </span>
        </p>
      </div>
      {user ? (
        <div className="w-3/5 mx-auto shadow-lg rounded-lg mt-5 border-2 border-black bg-white">
          <div className="p-10">
            <div className="text-3xl font-bold mb-4 text-center">
              ข้อมูลส่วนตัว
            </div>
            <div className="flex items-center justify-center">
              <div className="h-40 w-40 bg-gray-300 rounded-full overflow-hidden shadow-2xl">
                <img
                  className="w-full object-cover"
                  src="https://cdn-icons-png.freepik.com/512/13481/13481872.png"
                  alt="โปรไฟล์ของคุณ"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-center">
              <div>
                <p className="text-gray-700 font-semibold">ชื่อผู้ใช้</p>
                <p>{user.username}</p>
              </div>
              <div>
                <p className="text-gray-700 font-semibold">ชื่อ</p>
                <p>{user.firstname}</p>
              </div>
              <div>
                <p className="text-gray-700 font-semibold">นามสกุล</p>
                <p>{user.lastname}</p>
              </div>
              <div>
                <p className="text-gray-700 font-semibold">ที่อยู่</p>
                <p>{user.address}</p>
              </div>
              <div>
                <p className="text-gray-700 font-semibold">เบอร์โทรศัพท์</p>
                <p>{user.phone}</p>
              </div>
              <div>
                <p className="text-gray-700 font-semibold">อีเมล</p>
                <p>{user.email}</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-gray-100 border-t border-gray-200 justify-center">
          </div>
        </div>
      ) : null}
    </div>
  );
}
