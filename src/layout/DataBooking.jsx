import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faUser,
  faTable,
  faClipboardList,
  faCalendarCheck,
  faList,
  faCheckCircle,
  faTimesCircle,
  faStamp
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";

export default function DataBooking() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(6);
  const [selectedDate, setSelectedDate] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [counts, setCounts] = useState({
    approved: 0,
    canceled: 0,
    succeeded: 0,
  });
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getBookings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8889/admin/bookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookings(response.data.bookings);
        setCounts({
          approved: response.data.bookings.filter(
            (b) => b.status_booking === "APPROVE"
          ).length,
          canceled: response.data.bookings.filter(
            (b) => b.status_booking === "CANCEL"
          ).length,
          succeeded: response.data.bookings.filter(
            (b) => b.status_booking === "SUCCEED"
          ).length,
        });
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    getBookings();
  }, [token]);

  const handleStatusChange = async (
    e,
    booking_id,
    currentStatus,
    newStatus,
    table_id
  ) => {
    e.stopPropagation();
  
    const confirmTexts = {
      SUCCEED: {
        title:
          '<span style="font-size: 20px;">คุณต้องการทำรายการให้เสร็จสมบูรณ์หรือไม่?</span>',
        confirmButtonText: "ยืนยัน",
        confirmButtonColor: "#28a745",
      },
      CANCEL: {
        title:
          '<span style="font-size: 28px;">คุณต้องการยกเลิกการจองหรือไม่?</span>',
        confirmButtonText: "ยกเลิกการจอง",
        confirmButtonColor: "#28a745",
      },
    };
  
    const updateTableStatus = async (table_id) => {
      try {
        await axios.patch(
          `http://localhost:8889/admin/updateStatus/${table_id}`,
          { table_status: "FREE" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Error updating table status:", err);
      }
    };
  
    if (confirmTexts[newStatus]) {
      Swal.fire({
        title: `${confirmTexts[newStatus].title}`,
        icon: "warning",
        html: newStatus === "CANCEL" ? `<div style="text-align: left;">หมายเหตุ :</div>` : '',
        confirmButtonColor: "#28a745",
        confirmButtonText: confirmTexts[newStatus].confirmButtonText,
        showCloseButton: true,
        closeButtonAriaLabel: "ปิด",
        reverseButtons: true,
        customClass: {
          validationMessage: "text-red-600"
        },
        input: newStatus === "CANCEL" ? 'textarea' : null,
        inputPlaceholder: newStatus === "CANCEL" ? 'กรอกข้อมูลการยกเลิก...' : null,
        inputAttributes: newStatus === "CANCEL" ? { 'aria-label': 'กรอกข้อมูลการยกเลิก' } : null,
        preConfirm: () => {
          if (newStatus === "CANCEL") {
            const note = Swal.getPopup().querySelector('textarea').value.trim();
            if (!note) {
              Swal.showValidationMessage("กรุณากรอกข้อมูลยกเลิก");
              return false;
            }
            return note;
          }
          return null;
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          const noteBooking = newStatus === "CANCEL" ? result.value : null;
  
          try {
            const response = await axios.patch(
              `http://localhost:8889/admin/updateStatusBooking/${booking_id}`,
              { status_booking: newStatus, note_booking: noteBooking },
              { headers: { Authorization: `Bearer ${token}` } }
            );
  
            if (response.status === 200) {
              if (newStatus === "SUCCEED" || newStatus === "CANCEL") {
                await updateTableStatus(table_id);
              }
  
              Swal.fire({
                title: "สำเร็จ",
                text: `คุณได้ทำรายการ ${
                  newStatus === "SUCCEED" ? "สำเร็จ" : "ยกเลิก"
                } แล้ว`,
                icon: "success",
                timer: 2000,
              }).then(() => {
                setBookings(
                  bookings.map((b) =>
                    b.booking_id === booking_id
                      ? { ...b, status_booking: newStatus }
                      : b
                  )
                );
              });
            } else {
              Swal.fire(
                "เกิดข้อผิดพลาด",
                "ไม่สามารถเปลี่ยนสถานะการจองได้",
                "error"
              );
            }
          } catch (err) {
            console.error("Error updating booking status:", err);
            Swal.fire(
              "เกิดข้อผิดพลาด",
              "ไม่สามารถเปลี่ยนสถานะการจองได้",
              "error"
            );
          }
        }
      });
    } else {
      Swal.fire({
        title: "ไม่สามารถเปลี่ยนสถานะนี้ได้",
        text: "การจองนี้ไม่สามารถเปลี่ยนเป็นสถานะนี้ได้ในสถานะปัจจุบัน",
        icon: "info",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
      });
    }
  };
  
  

  const FormatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const formatISODateToThai = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear() + 543;
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const extractUniqueDates = (bookings) => {
    const dates = bookings
      .filter((booking) =>
        ["APPROVE", "CANCEL", "SUCCEED"].includes(booking.status_booking)
      )
      .map(
        (booking) =>
          new Date(booking.booking_datatime).toISOString().split("T")[0]
      );
    return [...new Set(dates)]
      .sort()
      .map((date) => new Date(date).toISOString().split("T")[0]);
  };

  const uniqueDates = extractUniqueDates(bookings);

  const filteredBookings = bookings.filter((booking) => {
    const searchTermLower = searchTerm.trim().toLowerCase();
    const thaiStatusMapping = {
      APPROVE: "อนุมัติ",
      CANCEL: "ยกเลิก",
      SUCCEED: "สำเร็จ",
    };
    const formattedDateTime = new Date(booking.booking_datatime)
      .toLocaleString("th-TH")
      .toLowerCase();
    const bookingDate = new Date(booking.booking_datatime)
      .toISOString()
      .split("T")[0];

    return (
      (selectedDate === "" || selectedDate === bookingDate) &&
      (booking.table.table_name.toLowerCase().includes(searchTermLower) ||
        booking.table.type_table.type_name
          .toLowerCase()
          .includes(searchTermLower) ||
        booking.user.firstname.toLowerCase().includes(searchTermLower) ||
        thaiStatusMapping[booking.status_booking].includes(searchTermLower) ||
        formattedDateTime.includes(searchTermLower))
    );
  });

  const handleClear = () => setSelectedDate("");

  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentItems = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredBookings.length / perPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFilter = (status) => setFilterStatus(status);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen p-0 m-0">
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
            <p className="mt-3 ml-2 text-3xl font-bold drop-shadow-[2px_2px_var(--tw-shadow-color)] shadow-gray-300">
              รายละเอียดข้อมูลการจอง
            </p>
            <hr className="border my-3 ml-10 border-sky-400 dark:border-sky-300" />
            <div className="flex justify-start gap-4 mt-1 p-4">
              <div className="flex items-center p-4 border-2 border-gray-500 rounded-lg shadow-md bg-gray-50 cursor-pointer transform transition-transform duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-500 text-white">
                  <FontAwesomeIcon icon={faList} size="lg" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium">ทั้งหมด</p>
                  <p className="text-gray-600">
                    ข้อมูลทั้งหมด : {counts.approved + counts.canceled}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-4 border-2 border-green-500 rounded-lg shadow-md bg-green-50 cursor-pointer transform transition-transform duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white">
                  <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium">สำเร็จ</p>
                  <p className="text-gray-600">
                    ข้อมูลสำเร็จทั้งหมด : {counts.succeeded}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 border-2 border-blue-500 rounded-lg shadow-md bg-blue-50 cursor-pointer transform transition-transform duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white">
                  <FontAwesomeIcon icon={faStamp} size="lg" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium">อนุมัติ</p>
                  <p className="text-gray-600">
                    ข้อมูลอนุมัติทั้งหมด : {counts.approved}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-4 border-2 border-red-500 rounded-lg shadow-md bg-red-50 cursor-pointer transform transition-transform duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white">
                  <FontAwesomeIcon icon={faTimes} size="lg" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium">ยกเลิก</p>
                  <p className="text-gray-600">
                    ข้อมูลยกเลิกทั้งหมด : {counts.canceled}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="ml-4 flex items-center space-x-2">
                <label
                  htmlFor="date-filter"
                  className="text-sm font-bold text-gray-700 dark:text-gray-300 "
                >
                  เลือกวันที่
                </label>
                <select
                  id="date-filter"
                  className="select select-bordered select-sm w-full max-w-xs max-h-48 overflow-auto"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  <option value="">ทั้งหมด</option>
                  {uniqueDates.map((date, index) => (
                    <option key={index} value={date}>
                      {FormatDate(date)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="px-2 py-1 text-sm font-medium text-gray-900 bg-gray-200 border border-gray-400 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-gray-300"
                  onClick={handleClear}
                >
                  ล้าง
                </button>
              </div>

              <div className="flex items-center mt-8 mr-5">
                <label
                  htmlFor="default-search"
                  className="text-sm font-bold text-gray-700 dark:text-gray-300 mr-2"
                >
                  ค้นหา :
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

            {filteredBookings.length > 0 ? (
              <table className="table mt-2">
                <thead>
                  <tr className="text-sm text-black uppercase bg-gradient-to-r from-sky-400 to-cyan-300 text-center">
                    <th>ลำดับ</th>
                    <th>วันที่/เวลาจอง</th>
                    <th>ชื่อโต๊ะ</th>
                    <th>ประเภทโต๊ะ</th>
                    <th>จำนวนที่นั่ง</th>
                    <th>ราคาโต๊ะ</th>
                    <th>ชื่อลูกค้า</th>
                    <th>สถานะ</th>
                    <th>หมายเหตุ</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-black text-center text-sm">
                  {currentItems
                    .filter((booking) => {
                      const statusMatch =
                        filterStatus === "SUCCEED"
                          ? booking.status_booking === "SUCCEED"
                          : filterStatus === "APPROVE"
                          ? booking.status_booking === "APPROVE"
                          : filterStatus === "CANCEL"
                          ? booking.status_booking === "CANCEL"
                          : booking.status_booking === "APPROVE" ||
                            booking.status_booking === "CANCEL" ||
                            booking.status_booking === "SUCCEED";

                      const dateMatch = selectedDate
                        ? new Date(booking.booking_datatime)
                            .toISOString()
                            .split("T")[0] === selectedDate
                        : true;

                      return statusMatch && dateMatch;
                    })
                    .map((booking, index) => (
                      <tr
                        key={booking.booking_id}
                        className="bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:border-gray-900"
                      >
                        <td className="py-4 px-6">
                          {index + 1 + indexOfFirstItem}
                        </td>
                        <td className="py-4 px-6">
                          {formatISODateToThai(booking.booking_datatime)}
                        </td>
                        <td className="py-4 px-6">
                          {booking.table.table_name}
                        </td>
                        <td className="py-4 px-6">
                          {booking.table.type_table.type_name}
                        </td>
                        <td className="py-4 px-6">
                          {booking.table.table_seat}
                        </td>
                        <td className="py-4 px-6">
                          {booking.table.table_price}
                        </td>
                        <td className="py-4 px-6">{booking.user.firstname}</td>
                        <td className="py-4 px-6">
                          {booking.status_booking === "APPROVE" ? (
                            <span className="text-blue-500 font-bold flex items-center text-xs">
                              <i className="fas fa-stamp mr-2"></i>{" "}
                              อนุมัติ
                            </span>
                          ) : booking.status_booking === "CANCEL" ? (
                            <span className="text-red-500 font-bold flex items-center text-xs">
                              <i className="fas fa-times-circle mr-2"></i>{" "}
                              ยกเลิก
                            </span>
                          ) : booking.status_booking === "SUCCEED" ? (
                            <span className="text-green-500 font-bold flex items-center text-xs">
                              <i className="fas fa-check-circle mr-2"></i> สำเร็จ
                            </span>
                          ) : null}
                        </td>

                        <td className="py-4 px-6">
                          {booking.status_booking === "CANCEL" ? (
                            <span className="text-red-500">
                              {booking.note_booking}
                            </span>
                          ) : (
                            "ไม่ระบุ"
                          )}
                        </td>

                        <td className="py-4 px-2 justify-center border-l border-gray-300">
                          {booking.status_booking === "APPROVE" ? (
                            <div className="flex space-x-2">
                              <button
                                className="bg-green-500 text-white rounded px-4 py-2"
                                onClick={(e) =>
                                  handleStatusChange(
                                    e,
                                    booking.booking_id,
                                    booking.status_booking,
                                    "SUCCEED",
                                    booking.table.table_id
                                  )
                                }
                              >
                                <FontAwesomeIcon icon={faCheckCircle} />{" "}
                                <spen className="text-xs">สำเร็จ</spen>
                              </button>
                              <button
                                className="bg-red-500 text-white rounded px-4 py-2"
                                onClick={(e) =>
                                  handleStatusChange(
                                    e,
                                    booking.booking_id,
                                    booking.status_booking,
                                    "CANCEL",
                                    booking.table.table_id
                                  )
                                }
                              >
                                <FontAwesomeIcon icon={faTimesCircle} />{" "}
                                <spen className="text-xs">ยกเลิก</spen>
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-500"></span>
                          )}
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
                      <th>วันที่/เวลา</th>
                      <th>ชื่อโต๊ะ</th>
                      <th>ประเภทโต๊ะ</th>
                      <th>ชื่อลูกค้า</th>
                      <th>สถานะ</th>
                      <th>หมายเหตุ</th>
                      <th>จัดการ</th>
                    </tr>
                  </thead>
                </table>
                <p className="text-center text-xl font-bold text-gray-500 mt-10">
                  ไม่พบข้อมูลการจอง
                </p>
              </div>
            )}
            {filteredBookings.length > perPage && (
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
                  {Math.ceil(filteredBookings.length / perPage)}
                </span>
                <button
                  className="bg-sky-500 text-white rounded-full px-4 py-2 hover:bg-sky-600 disabled:bg-sky-300 text-xs"
                  onClick={nextPage}
                  disabled={
                    currentPage === Math.ceil(filteredBookings.length / perPage)
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
