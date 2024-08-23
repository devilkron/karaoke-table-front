import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faSave } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

export default function CreateType() {
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setType(e.target.value);
  };

  const checkDuplicateType = async (typeName) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return false;
      }
      const response = await axios.get(
        `http://localhost:8889/admin/types/check/${typeName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.exists;
    } catch (err) {
      console.error("Error checking for duplicate type:", err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถตรวจสอบความซ้ำซ้อนได้",
      });
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!type.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกชื่อประเภท",
        text: "ชื่อประเภทไม่สามารถเป็นค่าว่างได้",
      });
      return;
    }

    setLoading(true);

    try {

      const isDuplicate = await checkDuplicateType(type);
      if (isDuplicate) {
        Swal.fire({
          icon: "warning",
          title: "ข้อมูลซ้ำ",
          text: "ชื่อประเภทนี้มีอยู่แล้ว",
          showCancelButton: false, 
          confirmButtonText: "ปิด", 
          confirmButtonColor: "#dc3545",
        });
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      await axios.post(
        "http://localhost:8889/admin/types",
        { type_name: type },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "คุณได้เพิ่มข้อมูลประเภทโต๊ะเรียบร้อยแล้ว",
      });
      navigate("/DataType");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: error.response?.data?.msg || "ไม่สามารถบันทึกข้อมูลได้",
    });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-white to-sky-400">
      <div className="flex absolute top-0 left-0 mt-20">
        <Link to="/DataType" className="text-black rounded-4xl p-2">
          <i className="fas fa-arrow-left" aria-label="Back"></i>
        </Link>
      </div>
      <form
        className="flex flex-col min-w-[600px] min-h-64 p-14 gap-6 mt-10 rounded-xl shadow-2xl bg-white border border-gray-500"
        onSubmit={handleSubmit}
      >
        <div className="text-4xl font-bold [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-gray-500">
          เพิ่มข้อมูลประเภทโต๊ะ
        </div>
        <div className="mt-5">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">
                <FontAwesomeIcon icon={faTag} className="mr-2" />
                ชื่อประเภท
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                className="input input-bordered w-full pl-5"
                value={type}
                onChange={handleChange}
                aria-label="Type name"
              />
            </div>
          </label>
          <div className="flex justify-end items-end mt-10">
            <button
              type="submit"
              className={`bg-green-500 text-white w-36 h-12 font-normal rounded-3xl drop-shadow-xl ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              {loading ? "บันทึก..." : "บันทึก"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
