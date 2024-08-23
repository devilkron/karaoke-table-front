import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUser,
  faTable,
  faClipboardList,
  faCalendarCheck,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import Swal from "sweetalert2";

export default function DataUser() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(7);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const rs = await axios.get(`http://localhost:8889/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(rs.data.users);
        setTotalUsers(rs.data.users.filter(user => user.role !== "ADMIN").length);
      } catch (err) {
        console.error(err);
      }
    };
    getUsers();
  }, []);

  const hdlDelete = async (e, user_id) => {
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
          `http://localhost:8889/admin/deleteUser/${user_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUsers(users.filter((user) => user.user_id !== user_id));
        setTotalUsers(totalUsers - 1);

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

  const countUsersByRole = (role) => {
    return users.filter(user => user.role === role).length;
  };

  const filteredUsers = users
    .filter(
      (user) =>
        user.user_id.toString().includes(searchTerm.toLowerCase()) ||
        user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.role === "USER" && "ผู้ใช้งาน".includes(searchTerm.toLowerCase()))
    )
    .filter((user) => user.role !== "ADMIN");

  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredUsers.length / perPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center mt-20">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-info drawer-button lg:hidden text-white font-normal mt-5"
          >
            ดูข้อมูล
          </label>

          <div className="overflow-autos w-full h-screen mt-15">
            <p className="mt-3 ml-2 text-3xl font-bold drop-shadow-[2px_2px_var(--tw-shadow-color)] shadow-gray-300">
              รายละเอียดข้อมูลผู้ใช้
            </p>
            <hr className="border my-5 ml-10 border-sky-400 dark:border-sky-300" />
            <p className="text-2xl font-semibold text-gray-700 ml-10">
              จำนวนข้อมูลผู้ใช้งานทั้งหมด : <spen className="text-3xl text-red-600">{totalUsers}</spen>
            </p>
            <div className="flex justify-end items-end mb-4">
              <div className="flex items-center mt-8 mr-5">
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

            {notification && (
              <p className="text-center text-green-500 mt-4">{notification}</p>
            )}
            {filteredUsers.length > 0 ? (
              <table className="table mt-4">
                <thead>
                  <tr className="text-sm text-black uppercase bg-gradient-to-r from-sky-400 to-cyan-300 text-center">
                    <th>ลำดับ</th>
                    <th>ชื่อผู้ใช้</th>
                    <th>ชื่อ</th>
                    <th>นามสกุล</th>
                    <th>ที่อยู่</th>
                    <th>เบอร์โทรศัพท์</th>
                    <th>อีเมล</th>
                    <th>ตำแหน่ง</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-black text-center">
                  {currentItems.map((user, index) => (
                    <tr
                      key={user.user_id}
                      className="bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <td>{index + 1 + indexOfFirstItem}</td>
                      <td>{user.username}</td>
                      <td>{user.firstname}</td>
                      <td>{user.lastname}</td>
                      <td>{user.address}</td>
                      <td>{user.phone}</td>
                      <td>{user.email}</td>
                      <td>{user.role === "USER" ? "ผู้ใช้งาน" : ""}</td>
                      <td className="border border-gray-300">
                        <div className="justify-center items-center">
                          <button
                            className="btn btn-error font-normal text-white text-xs shadow-xl rounded-xl"
                            onClick={(e) => hdlDelete(e, user.user_id)}
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
                <table className="table table-zebra mt-4">
                  <thead>
                    <tr className="text-sm text-black uppercase bg-gradient-to-r from-sky-400 to-cyan-300 text-center">
                      <th>ลำดับ</th>
                      <th>ชื่อ</th>
                      <th>นามสกุล</th>
                      <th>ที่อยู่</th>
                      <th>เบอร์โทรศัพท์</th>
                      <th>อีเมล</th>
                      <th>ตำแหน่ง</th>
                      <th>ตัวเลือก</th>
                    </tr>
                  </thead>
                </table>
                <p className="text-center text-xl font-bold text-gray-500 mt-10">
                  ไม่พบข้อมูลผู้ใช้งาน
                </p>
              </div>
            )}
            {filteredUsers.length > perPage && (
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
                  {Math.ceil(filteredUsers.length / perPage)}
                </span>
                <button
                  className="bg-sky-500 text-white rounded-full px-4 py-2 hover:bg-sky-600 disabled:bg-sky-300 text-xs"
                  onClick={nextPage}
                  disabled={
                    currentPage === Math.ceil(filteredUsers.length / perPage)
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
                <FontAwesomeIcon icon={faUser} className="mr-2" /> ข้อมูลผู้ใช้
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
