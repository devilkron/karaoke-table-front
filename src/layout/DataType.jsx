import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faTrash,
  faEdit,
  faPlus,
  faUser,
  faTable,
  faClipboardList,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

export default function DataType() {
  const [types, setTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(7);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const getTypes = async () => {
      try {
        const rs = await axios.get("http://localhost:8889/admin/types", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTypes(rs.data.types);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getTypes();
  }, []);

  function FormatDate(dateString) {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", options);
  }

  const filteredTypes = types.filter(
    (type) =>
      type.type_id.toString().includes(searchTerm.toLowerCase()) ||
      type.type_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentItems = filteredTypes.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredTypes.length / perPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const hdlDelete = async (e, type_id) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "คุณต้องการลบข้อมูลหรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:8889/admin/deleteType/${type_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTypes(types.filter((type) => type.type_id !== type_id));

        Swal.fire({
          icon: "success",
          title: "ลบข้อมูลเรียบร้อย",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#3996fa",
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการลบข้อมูล",
          text: err.message,
          confirmButtonColor: "#3996fa",
        });
      }
    }
  };

  const hdlEdit = async (type_id, currentName) => {
    const { value: newName } = await Swal.fire({
      title: "แก้ไขข้อมูลประเภทโต๊ะ",
      html: `
        <label for="tableTypeName" class="font-bold text-left block">ชื่อประเภท :</label>
        <input id="tableTypeName" type="text" class="swal2-input text-lg w-96 rounded-lg border border-gray-400" value="${currentName}" placeholder="กรุณากรอกชื่อประเภทโต๊ะใหม่">
      `,
      confirmButtonText: "บันทึก",
      showCloseButton: true,
      closeButtonAriaLabel: "ปิด",
      reverseButtons: true,
      confirmButtonColor: "#27ba48",
      inputValidator: (value) => {
        if (!value) {
          return "กรุณากรอกชื่อประเภทโต๊ะ";
        }
      },
      preConfirm: () => {
        const input = Swal.getPopup().querySelector("#tableTypeName");
        return input.value;
      },
      customClass: {
        confirmButton: "rounded-xl",
        cancelButton: "rounded-xl",
      },
    });

    if (newName) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.patch(
          `http://localhost:8889/admin/updateType/${type_id}`,
          { type_name: newName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          setTypes(
            types.map((type) =>
              type.type_id === type_id ? { ...type, type_name: newName } : type
            )
          );

          Swal.fire({
            icon: "success",
            title: "สำเร็จ!",
            text: "คุณทำการแก้ไขข้อมูลเรียบร้อย",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          throw new Error("ไม่สามารถอัปเดตข้อมูลได้");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถแก้ไขข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
          confirmButtonColor: "#3996fa",
        });
      }
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center mt-20">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-info drawer-button lg:hidden text-white font-normal mt-5"
          >
            ดูข้อมูล
          </label>
          <div className="overflow-auto w-full h-screen mt-15">
            <p className="mt-3 ml-2 text-3xl font-bold drop-shadow-md shadow-gray-300">
              รายละเอียดข้อมูลประเภทโต๊ะ
            </p>
            <hr className="border my-5 ml-10 border-sky-400 dark:border-sky-300" />
            <p className="text-2xl font-semibold text-gray-700 ml-10">
              จำนวนข้อมูลประเภทโต๊ะทั้งหมด : <spen className="text-3xl text-red-600"> {types.length}</spen>
            </p>
            <div className="flex justify-end items-end mb-2">
              <div className="flex items-center mr-5">
                <label
                  htmlFor="default-search"
                  className="text-sm font-bold text-gray-700 dark:text-gray-300 mr-2"
                >
                  ค้นหา
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="default-search"
                    className="block p-2 pl-10 text-sm w-80 border border-gray-500 rounded-lg bg-gray-50 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="ค้นหา"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mr-8">
              <div className="mt-1">
                <Link
                  className="btn btn-success text-white font-normal rounded-xl shadow-xl flex items-center"
                  to="/CreateType"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Link>
              </div>
            </div>
            {filteredTypes.length > 0 ? (
              <table className="table mt-2">
                <thead>
                  <tr className="text-sm text-black uppercase bg-gradient-to-r from-sky-400 to-cyan-300 text-center">
                    <th>ลำดับ</th>
                    <th>ประเภท</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-black text-center">
                  {currentItems.map((type, index) => (
                    <tr
                      key={type.type_id}
                      className="bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <td>{index + 1 + indexOfFirstItem}</td>
                      <td>{type.type_name}</td>
                      <td className="border border-gray-300">
                        <div className="flex justify-center items-center ">
                          <button
                            className="btn btn-warning text-black text-xs font-normal rounded-xl shadow-xl flex items-center mr-2"
                            onClick={() =>
                              hdlEdit(type.type_id, type.type_name)
                            }
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="btn btn-error text-white text-xs font-normal rounded-xl shadow-xl flex items-center"
                            onClick={(e) => hdlDelete(e, type.type_id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>
                <table className="table mt-2">
                  <thead>
                    <tr className="text-sm text-black uppercase bg-gradient-to-r from-sky-400 to-cyan-300 text-center">
                      <th>ลำดับ</th>
                      <th>ประเภท</th>
                      <th>จัดการ</th>
                    </tr>
                  </thead>
                </table>
                <p className="text-center text-xl font-bold text-gray-500 mt-10">
                  ไม่พบข้อมูลประเภทโต๊ะ
                </p>
              </div>
            )}
            {filteredTypes.length > perPage && (
              <div className="mt-2 flex items-center justify-center space-x-4">
                <button
                  className="bg-sky-500 text-white rounded-full px-4 py-2 hover:bg-sky-600 disabled:bg-sky-300 text-xs"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  ก่อนหน้า
                </button>
                <span className="text-sm text-gray-900">
                  หน้า {currentPage} จาก{" "}
                  {Math.ceil(filteredTypes.length / perPage)}
                </span>
                <button
                  className="bg-sky-500 text-white rounded-full px-4 py-2 hover:bg-sky-600 disabled:bg-sky-300 text-xs"
                  onClick={nextPage}
                  disabled={
                    currentPage === Math.ceil(filteredTypes.length / perPage)
                  }
                >
                  ถัดไป
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="drawer-side mt-20 overflow-y-hidden">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-60 min-h-full bg-gradient-to-r from-sky-100 to-sky-400">
            <li>
              <Link
                to="/DataUser"
                className={`flex items-center p-2 rounded-lg ${
                  isActive("/DataUser")
                    ? "bg-black text-white font-bold"
                    : "bg-opacity-55 text-black"
                }`}
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                ข้อมูลผู้ใช้
              </Link>
            </li>
            <li>
              <Link
                to="/DataType"
                className={`flex items-center p-2 rounded-lg ${
                  isActive("/DataType")
                    ? "bg-black text-white font-bold"
                    : "bg-opacity-55 text-black"
                }`}
              >
                <FontAwesomeIcon icon={faTable} className="mr-2" />
                ข้อมูลประเภทโต๊ะ
              </Link>
            </li>
            <li>
              <Link
                to="/DataTable"
                className={`flex items-center p-2 rounded-lg ${
                  isActive("/DataTable")
                    ? "bg-black text-white font-bold"
                    : "bg-opacity-55 text-black"
                }`}
              >
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                ข้อมูลโต๊ะ
              </Link>
            </li>
            <li>
              <Link
                to="/DataBooing_Approval"
                className={`flex items-center p-2 rounded-lg ${
                  isActive("/DataBooing_Approval")
                    ? "bg-black text-white font-bold"
                    : "bg-opacity-55 text-black"
                }`}
              >
                <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
                ข้อมูลการจอง (รออนุมัติ)
              </Link>
            </li>
            <li>
              <Link
                to="/DataBooking"
                className={`flex items-center p-2 rounded-lg ${
                  isActive("/DataBooking")
                    ? "bg-black text-white font-bold"
                    : "bg-opacity-55 text-black"
                }`}
              >
                <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
                ข้อมูลการจอง
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
