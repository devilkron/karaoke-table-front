import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/userAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const guestNav = [{ to: "/" }];
const userNav = [{ to: "/", text: "Home" }];

export default function UpdateProfile() {
  const { user, logout } = useAuth();
  const finalNav = user?.user_id ? userNav : guestNav;
  const navigate = useNavigate();

  const [input, setInput] = useState({
    username: "",
    firstname: "",
    lastname: "",
    address: "",
    phone: "",
    email: "",
  });

  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    setInput({
      username: user?.username,
      firstname: user?.firstname,
      lastname: user?.lastname,
      address: user?.address,
      phone: user?.phone,
      email: user?.email,
    });
  }, [user?.user_id]);

  const validateName = (value) => /^[A-Za-zก-ฮะ-์]+$/.test(value);
  const validatePhone = (value) => /^[0-9]{10}$/.test(value);
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const hdlChange = (e) => {
    const { name, value } = e.target;

    if (name === "firstname") {
      if (!validateName(value)) {
        setFirstnameError("กรุณากรอกชื่อให้ถูกต้อง (ภาษาไทยหรือภาษาอังกฤษ)");
      } else {
        setFirstnameError("");
      }
    }

    if (name === "lastname") {
      if (!validateName(value)) {
        setLastnameError("กรุณากรอกนามสกุลให้ถูกต้อง (ภาษาไทยหรือภาษาอังกฤษ)");
      } else {
        setLastnameError("");
      }
    }

    if (name === "phone") {
      if (!validatePhone(value)) {
        setPhoneError("กรุณากรอกให้ถูกต้อง เบอร์โทรศัพท์ต้องประกอบด้วยตัวเลข 10 ตัวเท่านั้น");
        setInput((prv) => ({ ...prv, [name]: value.slice(0, 10) }));
        return;
      } else {
        setPhoneError("");
      }
    }

    if (name === "email") {
      if (!validateEmail(value)) {
        setEmailError("กรุณากรอกอีเมลให้ถูกต้อง");
      } else {
        setEmailError("");
      }
    }

    setInput((prv) => ({ ...prv, [name]: value }));
  };

  const hdlSubmit = async (e) => {
    try {
      e.preventDefault();
      if (firstnameError || lastnameError || phoneError || emailError) {
        Swal.fire({
          icon: "warning",
          title: "ข้อมูลไม่ถูกต้อง",
          text: "กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนบันทึก",
          confirmButtonText: "ตกลง",
        });
        return;
      }
      const output = { ...input };
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8889/user/${user.user_id}`,
        output,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "คุณได้แก้ไขข้อมูลบัญชีเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/Profile");
        location.reload();
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.message,
        confirmButtonText: "ตกลง",
      });
    }
  };

  return (
    <div className="text-center min-h-screen pb-16">
      <div className="flex absolute top-0 left-0 mt-20">
        <Link to="/Profile" className="text-black rounded-4xl p-2">
          <i className="fas fa-arrow-left"></i>
        </Link>
      </div>
      <p className="text-3xl pt-24 font-bold">
        แก้ไขบัญชีของ{" "}
        <label className="text-3xl pt-24 text-red-600">
          {user?.user_id ? user.username : "Guest"}
        </label>
      </p>
      <form
        className="flex flex-col min-w-[600px] border-2 w-4/5 border-black mx-auto p-14 gap-1 mt-1 rounded-xl bg-sky-200 shadow-xl"
        onSubmit={hdlSubmit}
      >
        <div className="flex items-center justify-center h-40 w-40 bg-gray-300 rounded-full overflow-hidden shadow-2xl">
          <img
            className="w-full object-cover"
            src="https://cdn-icons-png.freepik.com/512/13481/13481872.png"
            alt="โปรไฟล์ของคุณ"
          />
        </div>
        <div className="flex flex-wrap col-3 justify-between">
          <div className="w-full sm:w-1/3 p-1">
            <label className="form-control w-full max-w rounded-full">
              <div className="label">
                <span className="label font-bold">ชื่อผู้ใช้</span>
              </div>
              <input
                className="input input-bordered w-4/5 max-w-lg rounded-2xl border-gray-400"
                type="text"
                name="username"
                value={input.username}
                onChange={hdlChange}
              />
            </label>
          </div>
          <div className="w-full sm:w-1/3 p-1">
            <label className="form-control w-full max-w rounded-full">
              <div className="label">
                <span className="label font-bold">ชื่อ</span>
              </div>
              <input
                className="input input-bordered w-5/6 max-w-lg rounded-2xl border-gray-400"
                type="text"
                name="firstname"
                value={input.firstname}
                onChange={hdlChange}
              />
              {firstnameError && (
                <div className="absolute mt-1 text-red-600 text-sm border border-white bg-white p-2 rounded-lg shadow-md">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  {firstnameError}
                </div>
              )}
            </label>
          </div>
          <div className="w-full sm:w-1/3 p-1">
            <label className="form-control w-full max-w rounded-full">
              <div className="label">
                <span className="label font-bold">นามสกุล</span>
              </div>
              <input
                className="input input-bordered w-4/5 max-w-lg rounded-2xl border-gray-400"
                type="text"
                name="lastname"
                value={input.lastname}
                onChange={hdlChange}
              />
              {lastnameError && (
                <div className="absolute mt-1 text-red-600 text-sm border border-white bg-white p-2 rounded-lg shadow-md">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  {lastnameError}
                </div>
              )}
            </label>
          </div>
          <div className="w-full sm:w-1/3 p-1">
            <label className="form-control w-full max-w rounded-full">
              <div className="label">
                <span className="label font-bold">ที่อยู่</span>
              </div>
              <input
                className="input input-bordered w-4/5 max-w-lg rounded-2xl border-gray-400"
                type="text"
                name="address"
                value={input.address}
                onChange={hdlChange}
              />
            </label>
          </div>
          <div className="w-full sm:w-1/3 p-1">
            <label className="form-control w-full max-w rounded-full">
              <div className="label">
                <span className="label font-bold">เบอร์โทรศัพท์</span>
              </div>
              <input
                className="input input-bordered w-4/5 max-w-lg rounded-2xl border-gray-400"
                type="text"
                name="phone"
                value={input.phone}
                onChange={hdlChange}
              />
              {phoneError && (
                <div className="absolute mt-1 text-red-600 text-sm border border-white bg-white p-2 rounded-lg shadow-md">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  {phoneError}
                </div>
              )}
            </label>
          </div>
          <div className="w-full sm:w-1/3 p-1">
            <label className="form-control w-full max-w rounded-full">
              <div className="label">
                <span className="label font-bold">อีเมล</span>
              </div>
              <input
                className="input input-bordered w-4/5 max-w-lg rounded-2xl border-gray-400"
                type="text"
                name="email"
                value={input.email}
                onChange={hdlChange}
              />
              {emailError && (
                <div className="absolute mt-1 text-red-600 text-sm border border-white bg-white p-2 rounded-lg shadow-md">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  {emailError}
                </div>
              )}
            </label>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            className="text-black bg-gradient-to-br from-yellow-300 to-yellow-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-yellow-200 dark:focus:ring-yellow-800 font-medium rounded-3xl text-sm px-5 py-2.5 text-center mr-4 mb-2 w-72 shadow-xl"
            type="submit"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
}
