import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import userAuth from "../hooks/userAuth";
import Swal from "sweetalert2";

export default function LoginForm() {
  const { setUser } = userAuth();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const hdlChange = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    if (!input.username || !input.password) {
      alert("โปรดใส่ข้อมูลให้ครบ");
    }
    try {
      e.preventDefault();
      const rs = await axios.post("http://localhost:8889/auth/login", input);
      console.log(rs.data.token);
      localStorage.setItem("token", rs.data.token);
      const rs1 = await axios.get("http://localhost:8889/auth/me", {
        headers: { Authorization: `Bearer ${rs.data.token}` },
      });
      console.log(rs1.data);
      setUser(rs1.data);
      if (rs1.data !== "") {
        Swal.fire({
          icon: "success",
          title: "เข้าสู่ระบบเรียบร้อย",
          showConfirmButton: false,
          timer: 2500,
        });
        navigate("/");
      }
    } catch (err) {
      console.log(err.message);
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://nocnoc.com/blog/wp-content/uploads/2021/03/12-dining-table-decorate.jpg)",
      }}
    >
      <div className="skeleton w-32 h-32"></div>
      <div className=" container mx-auto flex justify-center items-center h-scree">
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mt-28">
          <form className="card-body" onSubmit={hdlSubmit}>
            <div className="justify-center">
              <img
                src="https://icons.veryicon.com/png/o/miscellaneous/free-insurance/login-account.png"
                className=""
                style={{ width: "100px", height: "100px" }}
              />
            </div>
            <h1 className="text-3xl font-bold text-center text-black">
              เข้าสู่ระบบ
            </h1>
            <label
              for="input-group-1"
              className="block text-sm font-medium  dark:text-gray-600 mt-4"
            >
              ชื่อผู้ใช้
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg
                  class="h-5 w-5 text-gray-500 dark:text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  {" "}
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />{" "}
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-sm rounded-xl w-full ps-10 p-3  dark:bg-white dark:border-gray-300 dark:text-gray-600"
                name="username"
                value={input.username}
                onChange={hdlChange}
              />
            </div>
            <label
              for="input-group-1"
              className="block text-sm font-medium  dark:text-gray-600 "
            >
              รหัสผ่าน
            </label>
            <div class="relative mb-5">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg
                  class="h-5 w-5 text-gray-500 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <input
                type="password"
                className="bg-gray-50 border border-gray-300 text-sm rounded-xl w-full ps-10 p-3  dark:bg-white dark:border-gray-600 dark:text-gray-700"
                name="password"
                value={input.password}
                onChange={hdlChange}
              />
            </div>
            <div className="form-control">
              <button className="btn btn-info text-white font-medium">
                เข้าสู่ระบบ
              </button>

              <div className="divider divider-stone-500 text-xs font-medium text-black ">หรือ</div>
              <Link
                to="/register"
                className="btn btn-neutral-content form-control mt-1 font-medium"
              >
                สมัครสมาชิก
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
