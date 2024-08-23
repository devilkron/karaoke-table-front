import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function RegisterForm() {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    address: "",
    phone: "",
    email: "",
    role: "USER",
  });
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");

  const hdlReset = () => {
    setInput({
      username: "",
      password: "",
      confirmPassword: "",
      firstname: "",
      lastname: "",
      address: "",
      phone: "",
      email: "",
      role: "USER",
    });
    setPhoneError("");
    setEmailError("");
    setNameError("");
    setLastnameError("");
  };

  const validateName = (value) => {
    const regex = /^[A-Za-zก-ฮะ-์]+$/;
    return regex.test(value);
  };

  const validatePhone = (value) => {
    const regex = /^[0-9]{0,10}$/;
    return regex.test(value);
  };

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const hdlChange = (e) => {
    const { name, value } = e.target;

    if (name === "firstname") {
      if (!validateName(value)) {
        setNameError("กรุณากรอกชื่อให้ถูกต้อง (ภาษาไทยหรือภาษาอังกฤษ)");
      } else {
        setNameError("");
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
        setInput((prv) => ({ ...prv, [name]: value }));
        return;
      } else {
        setEmailError("");
      }
    }

    setInput((prv) => ({ ...prv, [name]: value }));
  };

  const hdlSubmit = async (e) => {
    e.preventDefault();

    for (const [key, value] of Object.entries(input)) {
      if (!value && key !== "role") {
        Swal.fire({
          icon: "warning",
          title: "กรุณากรอกข้อมูลให้ครบถ้วน",
          confirmButtonColor: '#3996fa',
        });
        return;
      }
    }

    if (input.password !== input.confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาตรวจสอบรหัสผ่านอีกครั้ง",
        text: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน",
      });
      return;
    }

    try {
      const rs = await axios.post("http://localhost:8889/auth/register", input);
      console.log(rs);
      if (rs.status === 200) {
        Swal.fire({
          icon: "success",
          title: "คุณได้ลงทะเบียนสำเร็จแล้ว",
          text: "คุณสามารถเข้าสู่ระบบได้แล้ว",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/login");
      }
    } catch (err) {
      console.error(err.message);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.message,
      });
    }
  };

  return (
    <div
      className="hero min-h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url(https://nocnoc.com/blog/wp-content/uploads/2021/03/22-dining-table-decorate.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex absolute top-0 left-0 mt-20">
        <Link to="/login" className="text-black text-2xl rounded-full p-2 ">
          <i className="fas fa-arrow-left"></i>
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center p-16 border w-11/12 max-w-2lg mx-auto bg-white bg-opacity-90 rounded-xl shadow-2xl mt-24 mb-16">
        <form className="w-full" onSubmit={hdlSubmit}>
          <div className="flex flex-col items-center mb-4">
            <img
              src="https://marketplace.1c-bitrix.ru/upload/update/a22/1421081294_add_user.png"
              className="w-24 h-24"
            />
            <div className="text-5xl font-bold mt-4 text-blue-600">
              สมัครสมาชิก
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <label className="flex flex-col w-full">
              <div className="label mb-1">
                <span className="label-text font-bold text-gray-700 text-lg">
                  ชื่อผู้ใช้ :
                </span>
              </div>
              <input
                type="text"
                className="input input-bordered w-8/12  border-gray-400"
                name="username"
                value={input.username}
                onChange={hdlChange}
              />
            </label>
            <label className="w-full">
              <div className="label">
                <span className="label-text font-bold text-gray-700 text-lg">
                  รหัสผ่าน :
                </span>
              </div>
              <input
                type="password"
                className="input input-bordered w-8/12 border-gray-400"
                name="password"
                value={input.password}
                onChange={hdlChange}
              />
            </label>
            <label className="w-full">
              <div className="label">
                <span className="label-text font-bold text-gray-700 text-lg">
                  ยืนยันรหัสผ่าน :
                </span>
              </div>
              <input
                type="password"
                className="input input-bordered w-8/12 border-gray-400"
                name="confirmPassword"
                value={input.confirmPassword}
                onChange={hdlChange}
              />
            </label>
            <label className="w-full relative">
              <div className="label">
                <span className="label-text font-bold text-gray-700 text-lg">
                  ชื่อ :
                </span>
              </div>
              <input
                type="text"
                className="input input-bordered w-8/12 border-gray-400"
                name="firstname"
                value={input.firstname}
                onChange={hdlChange}
              />
              {nameError && (
                <div className="absolute mt-1 text-red-600 text-sm border border-white bg-white p-2 rounded-lg shadow-md">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  {nameError}
                </div>
              )}
            </label>
            <label className="w-full relative">
              <div className="label">
                <span className="label-text font-bold text-gray-700 text-lg">
                  นามสกุล :
                </span>
              </div>
              <input
                type="text"
                className="input input-bordered w-8/12 border-gray-400"
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
            <label className="w-full">
              <div className="label">
                <span className="label-text font-bold text-gray-700 text-lg">
                  ที่อยู่ :
                </span>
              </div>
              <input
                type="text"
                className="input input-bordered w-8/12 border-gray-400"
                name="address"
                value={input.address}
                onChange={hdlChange}
              />
            </label>
            <label className="w-full relative">
              <div className="label">
                <span className="label-text font-bold text-gray-700 text-lg">
                  เบอร์โทร :
                </span>
              </div>
              <input
                type="text"
                className="input input-bordered w-8/12 border-gray-400"
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
            <label className="w-full relative">
              <div className="label">
                <span className="label-text font-bold text-gray-700 text-lg">
                  อีเมล :
                </span>
              </div>
              <input
                type="email"
                className="input input-bordered w-8/12 border-gray-400"
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
          <div className="flex justify-end mt-8 gap-4 mr-20">
            <button
              type="submit"
              className="bg-sky-400 hover:bg-sky-500 text-white py-4 px-4 rounded-full w-64"
            >
              สมัครสมาชิก
            </button>
            <button
              type="button"
              onClick={hdlReset}
              className="bg-red-600 hover:bg-red-700 text-white py-4 px-2 rounded-full w-48"
            >
              ล้างข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
