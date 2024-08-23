import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/userAuth";

const guestNav = [
  { to: "/", text: "เข้าสู่ระบบ" },
  { to: "/register", text: "สมัครสมาชิก" },
];

const userNav = [
  { to: "/", text: "หน้าหลัก" },
  { to: "/new", text: "new Todo" },
];

const adminNav = [
  { to: "/", text: "หน้าหลัก" },
  { to: "/new", text: "new Todo" },
];

export default function HeaderAdmin() {
  const { user, logout, setTheme } = useAuth();
  const finalRouter = user?.user_id
    ? user.role === "ADMIN"
      ? adminNav
      : userNav
    : guestNav;

  const navigate = useNavigate();

  const hdlLogout = () => {
    logout();
    navigate("/");
  };

  const hdlDashboard = () => {
    navigate("/DataUser");
  };

  const hdlAdminHome = () => {
    navigate("/Dashboard");
  };

  const hdlProfileAdmin = () => {
    navigate("/ProfileAdmin");
  };

  return (
    <div className="navbar bg-gradient-to-r from-cyan-500 to-blue-500 fixed top-0 w-full z-50">
      <div className="flex-1">
        {/* สวัสดี, {user?.user_id ? user.username : 'Guest'} */}
        <div className="navbar">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white-100 rounded-box w-52"
              >
                <li>
                  <a onClick={hdlAdminHome}>หน้าหลัก</a>
                </li>
                <li>
                  <a onClick={hdlDashboard}>ข้อมูล</a>
                </li>
              </ul>
            </div>
            <a
              className="btn btn-ghost text-xl text-white"
              onClick={hdlAdminHome}
            >
              ระบบจองโต๊ะอาหาร
            </a>
          </div>
          <div className="navbar-center hidden lg:flex text-white">
            <ul className="menu menu-horizontal px-1 bg-white-100">
              <li>
                <a onClick={hdlAdminHome}>หน้าหลัก</a>
              </li>
              <li>
                <a onClick={hdlDashboard}>ข้อมูล</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex-none gap-2">
        <span className="text-white mr-4 text-lg">
          สวัสดี, <span className="text-sm">{user?.user_id ? user.username : 'Guest'}</span>
        </span>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-40"
          >
            <li>
              <a onClick={hdlProfileAdmin}>
                <svg
                  className="w-3 h-3 text-gray-800 dark:text-black"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
                ดูโปรไฟล์
              </a>
            </li>
            <li>
              <a onClick={hdlLogout}>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3"
                  />
                </svg>
                ออกจากระบบ
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
