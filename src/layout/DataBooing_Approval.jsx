import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faTable,
  faClipboardList,
  faCalendarCheck,
  faTimesCircle,
  faStamp,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";

export default function DataBooking_Approval() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);

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

        const datesResponse = await axios.get(
          "http://localhost:8889/admin/availableDates",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAvailableDates(datesResponse.data.dates);
      } catch (error) {
        console.error("Error fetching bookings or available dates:", error);
      }
    };
    getBookings();
  }, [token]);

  const hdlModalAccept = async (tableId, bookingId) => {
    try {
      // ดึงข้อมูลการจองทั้งหมด
      const existingBookingsResponse = await axios.get("http://localhost:8889/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const existingBookings = existingBookingsResponse.data.bookings;
  
      // เช็คว่ามีการอนุมัติซ้ำหรือไม่
      const isTableAlreadyApproved = existingBookings.some(
        (booking) =>
          booking.table.table_id === tableId &&
          booking.status_booking === "APPROVE" &&
          booking.booking_id !== bookingId
      );
  
      if (isTableAlreadyApproved) {
        Swal.fire({
          title: "ข้อผิดพลาด",
          text: "โต๊ะนี้ถูกอนุมัติไปแล้วซ้ำ",
          icon: "error",
          showConfirmButton: true,
        });
        return;
      }
  
      // อัปเดตสถานะโต๊ะและการจอง
      const tableStatusUpdate = { table_status: "BUSY" };
      const bookingStatusUpdate = { status_booking: "APPROVE" };
  
      const [updateTableStatusResponse, updateBookingStatusResponse] = await Promise.all([
        axios.patch(`http://localhost:8889/admin/updateStatus/${tableId}`, tableStatusUpdate, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.patch(`http://localhost:8889/admin/updateStatusBooking/${bookingId}`, bookingStatusUpdate, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);
  
      if (updateTableStatusResponse.status === 200 && updateBookingStatusResponse.status === 200) {
        Swal.fire({
          title: "สำเร็จ",
          text: "คุณได้ทำการอนุมัติการจองเรียบร้อยแล้ว",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          setTimeout(() => {
            window.location.href = "/DataBooking";
          }, 2000);
        });
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถอนุมัติการจองได้",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };
  

  
  const handleApproveClick = (booking) => {
    Swal.fire({
      title: `
        <div class="flex justify-center">
          <span style="font-size: 27px;">คุณต้องการอนุมัติการจองหรือไม่?</span>
        </div>
      `,
      icon: "warning",
      confirmButtonText: '<span class="text-white py-1 px-4 rounded">อนุมัติ</span>',
      confirmButtonColor: "#28a745",
      showCloseButton: true,
      closeButtonAriaLabel: "ปิด",
      reverseButtons: true,
      customClass: {
        title: "text-xl text-center",
        confirmButton: "mx-2",
        cancelButton: "mx-2",
        popup: "relative",
        closeButton: "absolute top-2 right-2",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        hdlModalAccept(booking.table.table_id, booking.booking_id);
      }
    });
  };
  
  const handleCancelClick = (booking) => {
    Swal.fire({
      title: `
        <div class="flex justify-center">
          <span style="font-size: 27px;">คุณต้องการยกเลิกการจองหรือไม่?</span>
        </div>
      `,
      icon: "warning",
      html: `
        <div class="text-left">
          <span class="text-lg">หมายเหตุ :</span>
        </div>
        <textarea 
          class="mt-3 p-2 border border-gray-300 rounded-lg w-96 h-36 text-lg" 
          placeholder="กรอกข้อมูลการยกเลิก..."
          aria-label="ข้อมูลยกเลิก"
          id="cancel-note"
        ></textarea>
      `,
      confirmButtonText: "ยกเลิกการจอง",
      confirmButtonColor: "#28a745",
      showCloseButton: true,
      closeButtonAriaLabel: "ปิด",
      reverseButtons: true,
      customClass: {
        title: "text-xl text-left font-bold",
        confirmButton: "mr-2",
        cancelButton: "ml-5",
        validationMessage: "text-red-600"
      },
      preConfirm: () => {
        const note = Swal.getPopup().querySelector("#cancel-note").value;
        if (!note.trim()) {
          Swal.showValidationMessage("กรุณากรอกข้อมูลยกเลิก");
          return false;
        }
        return note;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const note = result.value;
        hdlModalCancel(booking.table.table_id, booking.booking_id, note);
      }
    });
  };
  
  
  const hdlModalCancel = async (tableId, bookingId, noteBooking) => {
    try {
      const data = { table_status: "FREE" };
      const data2 = { status_booking: "CANCEL", note_booking: noteBooking };
  
      const [updateTableStatusResponse, updateBookingStatusResponse] = await Promise.all([
        axios.patch(`http://localhost:8889/admin/updateStatus/${tableId}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.patch(`http://localhost:8889/admin/updateStatusBooking/${bookingId}`, data2, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);
  
      if (updateTableStatusResponse.status === 200 && updateBookingStatusResponse.status === 200) {
        Swal.fire({
          title: "สำเร็จ",
          text: "คุณได้ทำการยกเลิกการจองเรียบร้อยแล้ว",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          setTimeout(() => {
            window.location.href = "/DataBooking";
          }, 2000);
        });
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถยกเลิกการจองได้",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };
  

  function FormatDate(dateString) {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return formatter.format(date);
  }

  function formatISODateToThai(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear() + 543;
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  const extractUniqueDates = (bookings) => {
    const dates = bookings
      .filter((booking) => booking.status_booking === "WAIT")
      .map(
        (booking) =>
          new Date(booking.booking_datatime).toISOString().split("T")[0]
      );

    const uniqueDates = [...new Set(dates)];

    const sortedDates = uniqueDates
      .map((date) => new Date(date))
      .sort((a, b) => a - b)
      .map((date) => date.toISOString().split("T")[0]);

    return sortedDates;
  };

  const uniqueDates = extractUniqueDates(bookings);

  const filteredBookings_Approval = bookings.filter((booking) => {
    const searchTermLower = searchTerm.trim().toLowerCase();
    const thaiStatusMapping = {
      APPROVE: "อนุมัติ",
      CANCEL: "ยกเลิก",
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

  const handleClear = () => {
    setSelectedDate("");
  };

  const counts = {
    approved: bookings.filter((b) => b.status_booking === "APPROVE").length,
    canceled: bookings.filter((b) => b.status_booking === "CANCEL").length,
    waiting: bookings.filter((b) => b.status_booking === "WAIT").length,
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
            aria-label="Toggle sidebar"
          >
            ดูข้อมูล
          </label>
          <div className="overflow-auto w-full h-screen mt-15">
            <p className="mt-3 ml-2 text-3xl font-bold drop-shadow-lg">
              รายละเอียดข้อมูลการจอง (รออนุมัติ)
            </p>
            <hr className="border my-3 ml-10 border-sky-400 dark:border-sky-300" />
            <p className="text-2xl font-bold text-gray-700 ml-10">
              จำนวนข้อมูลการจองที่รออนุมัติทั้งหมด :{" "}
              <span className="text-3xl text-red-600"> {counts.waiting}</span>
            </p>
            <div className="flex justify-between items-center mb-3 mt-3">
              <div className="ml-4 flex items-center space-x-2">
                <label
                  htmlFor="date-filter"
                  className="text-sm font-bold text-gray-700 dark:text-gray-300"
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
                  aria-label="Clear date filter"
                >
                  ล้าง
                </button>
              </div>
              <div className="flex items-center mt-1 mr-5">
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
                    aria-label="Search bookings"
                  />
                </div>
              </div>
            </div>

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
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody className="font-medium text-black text-center">
                {filteredBookings_Approval.length > 0 ? (
                  filteredBookings_Approval.filter(
                    (booking) => booking.status_booking === "WAIT"
                  ).length > 0 ? (
                    filteredBookings_Approval
                      .filter((booking) => booking.status_booking === "WAIT")
                      .map((booking, index) => (
                        <tr
                          key={booking.booking_id}
                          className="bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:border-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <td>{index + 1}</td>
                          <td>
                            {formatISODateToThai(booking.booking_datatime)}
                          </td>
                          <td>{booking.table.table_name}</td>
                          <td>{booking.table.type_table.type_name}</td>
                          <td>{booking.table.table_seat}</td>
                          <td>{booking.table.table_price}</td>
                          <td>{booking.user.firstname}</td>
                          <td className="text-yellow-400 font-medium items-center">
                            <i className="fas fa-clock mr-2"></i>
                            <span className="text-xs">รออนุมัติ</span>
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            <button
                              onClick={() => handleApproveClick(booking)}
                              className="bg-green-500 text-white rounded px-3 py-2 mr-2"
                              aria-label={`Approve booking ${booking.booking_id}`}
                            >
                              <FontAwesomeIcon icon={faStamp} />{" "}
                              <span className="text-xs">อนุมัติ</span>
                            </button>
                            <button
                              onClick={() => handleCancelClick(booking)}
                              className="bg-red-500 text-white rounded px-3 py-2"
                              aria-label={`Cancel booking ${booking.booking_id}`}
                            >
                              <FontAwesomeIcon icon={faTimesCircle} />{" "}
                              <span className="text-xs">ยกเลิก</span>
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="text-center text-xl font-bold text-gray-500 py-10"
                      >
                        ไม่พบข้อมูลการจองที่รออนุมัติ
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center text-xl font-bold text-gray-500 py-10"
                    >
                      {searchTerm ? "ไม่พบข้อมูลการค้นหา" : "ไม่มีข้อมูลการจอง"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="drawer-side mt-20 overflow-y-hidden">
          <label
            htmlFor="my-drawer-2"
            aria-label="Close sidebar"
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
                to="/DataBooking_Approval"
                className={`flex items-center p-2 rounded-lg ${
                  isActive("/DataBooking_Approval")
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
