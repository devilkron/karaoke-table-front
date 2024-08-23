import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import userAuth from "../hooks/userAuth";
import "@fortawesome/fontawesome-free/css/all.min.css";
import moment from "moment";

export default function BookingUser() {
  const { user } = userAuth();
  const [DataBookinguser, setBookingUser] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const fetchBookingUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8889/user/bookingUser`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookingUser(response.data.BookingUser);
        console.log(response.data.BookingUser);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBookingUsers();
  }, []);

  const showBookingDetails = (booking) => {
    let icon;
    let iconColor;
    let statusText;

    switch (booking.status_booking) {
      case "SUCCEED":
        icon = "fas fa-check-circle";
        iconColor = "text-green-500";
        statusText = "สำเร็จแล้ว";
        break;
      case "CANCEL":
        icon = "fas fa-times-circle";
        iconColor = "text-red-500";
        statusText = "ยกเลิกแล้ว";
        break;
      case "WAIT":
        icon = "fas fa-clock";
        iconColor = "text-yellow-500";
        statusText = "รออนุมัติ";
        break;
      case "APPROVE":
        icon = "fas fa-stamp";
        iconColor = "text-blue-500";
        statusText = "อนุมัติแล้ว";
        break;
      default:
        icon = "fas fa-question-circle";
        iconColor = "text-gray-500";
        statusText = "ไม่ทราบสถานะ";
    }

    MySwal.fire({
      title: "รายละเอียดประวัติการจอง",
      html: (
        <div className="bg-white p-6 rounded-lg shadow-lg text-left border border-gray-300 space-y-6">
          <div
            className={`flex flex-col items-center justify-center ${iconColor} mb-4 space-y-2`}
          >
            <i className={`fas ${icon} text-4xl`}></i>
            <span className="text-xl font-semibold text-gray-700">
              {statusText}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-lg font-medium text-gray-800">
              รหัสการจอง :
            </span>
            <span className="text-lg font-semibold text-gray-900">
              {booking.booking_id}
            </span>
          </div>

          <figure className="text-center justify-center">
            <img
              src={booking.table.table_img}
              alt={`ภาพของโต๊ะ ${booking.table.table_name}`}
              className="w-80 max-w-md h-auto object-cover rounded-md border border-gray-300 shadow-lg"
            />
          </figure>

          <div className="space-y-2">
            <p className="text-lg text-gray-800">
              <span className="font-semibold text-gray-700">
                วันที่/เวลาจอง :
              </span>
              <span className="font-normal text-gray-900">
                {moment(booking.booking_datatime).format("DD/MM/YYYY HH:mm")}
              </span>
            </p>

            <p className="text-lg text-gray-800">
              <span className="font-semibold text-gray-700">ชื่อโต๊ะ : </span>
              <span className="font-normal text-gray-900">
                {booking.table.table_name}
              </span>
            </p>

            <p className="text-lg text-gray-800">
              <span className="font-semibold text-gray-700">ประเภทโต๊ะ : </span>
              <span className="font-normal text-gray-900">
                {booking.table.type_table.type_name}
              </span>
            </p>

            <p className="text-lg text-gray-800">
              <span className="font-semibold text-gray-700">
                จำนวนที่นั่ง :{" "}
              </span>
              <span className="font-normal text-gray-900">
                {booking.table.table_seat}
              </span>
            </p>

            <p className="text-lg text-gray-800">
              <span className="font-semibold text-gray-700">ราคาโต๊ะ : </span>
              <span className="font-normal text-gray-900">
                {booking.table.table_price}
              </span>
            </p>

            <p className="text-lg">
              <span className="font-semibold text-gray-700">สถานะ : </span>
              <span
                className={`${
                  booking.status_booking === "APPROVE"
                    ? "text-blue-500"
                    : booking.status_booking === "CANCEL"
                    ? "text-red-500"
                    : booking.status_booking === "SUCCEED"
                    ? "text-green-500"
                    : booking.status_booking === "WAIT"
                    ? "text-yellow-500"
                    : "text-gray-500"
                } font-medium`}
              >
                {statusText}
              </span>
            </p>

            <p className="text-lg text-gray-800">
              <span className="font-semibold text-gray-700">หมายเหตุ : </span>
              <span
                className={`font-normal ${
                  booking.status_booking === "CANCEL"
                    ? "text-red-500"
                    : "text-gray-900"
                }`}
              >
                {booking.status_booking === "CANCEL"
                  ? booking.note_booking
                  : "ไม่ระบุข้อมูล"}
              </span>
            </p>
          </div>
        </div>
      ),
      showCloseButton: true,
    });
  };

  const groupByDate = (bookings) => {
    return bookings.reduce((acc, booking) => {
      const date = moment(booking.booking_datatime).format("DD/MM/YYYY");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(booking);
      return acc;
    }, {});
  };

  const statusMapping = {
    SUCCEED: "สำเร็จแล้ว",
    CANCEL: "ยกเลิกแล้ว",
    WAIT: "รออนุมัติ",
    APPROVE: "อนุมัติแล้ว",
  };

  const filteredBookings = DataBookinguser.filter((booking) => {
    const { table_name, type_table } = booking.table;
    const statusText = statusMapping[booking.status_booking] || "ไม่ทราบสถานะ";
    const bookingDate = moment(booking.booking_datatime).format("DD/MM/YYYY");

    return (
      table_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type_table.type_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      statusText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.note_booking &&
        booking.note_booking.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const groupedBookings = groupByDate(
    filteredBookings.filter((booking) => booking.userId === user.user_id)
  );

  const sortedGroupedBookings = Object.keys(groupedBookings).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="overflow-auto w-full h-screen p-10 bg-gradient-to-bl from-sky-200 to-white">
      <div className="mt-20 text-5xl font-bold text-center">
        <span className="inline-block rounded-lg px-4 py-2 text-white [text-shadow:2px_1px_5px_var(--tw-shadow-color)] shadow-gray-900">
          ประวัติการจองโต๊ะ
        </span>
      </div>
      <div className="container mx-auto py-5">
        <div className="mb-4 flex items-center space-x-4">
          <span className="text-gray-700 font-semibold text-lg">ค้นหา :</span>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="ค้นหา..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring focus:border-blue-300 w-full max-w-xs text-sm"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-4.35-4.35M10 16.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z"
              />
            </svg>
          </div>

          <select
            value={selectedDate}
            onChange={handleDateChange}
            className="px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring focus:border-blue-300 text-sm"
          >
            <option value="">เลือกวันที่</option>
            {sortedGroupedBookings.map((date, idx) => (
              <option key={idx} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b border-blue-300 bg-blue-500 text-lg font-semibold text-white uppercase tracking-wider text-center"></th>
                <th className="px-6 py-3 border-b border-blue-300 bg-blue-500 text-lg font-semibold text-white uppercase tracking-wider text-center"></th>
                <th className="px-6 py-3 border-b border-blue-300 bg-blue-500 text-sm font-semibold text-white uppercase tracking-wider text-center">
                  รหัสการจอง
                </th>
                <th className="px-6 py-3 border-b border-blue-300 bg-blue-500 text-sm font-semibold text-white uppercase tracking-wider text-center">
                  วันที่/เวลาจอง
                </th>
                <th className="px-6 py-3 border-b border-blue-300 bg-blue-500 text-sm font-semibold text-white uppercase tracking-wider text-center">
                  ชื่อโต๊ะ
                </th>
                <th className="px-6 py-3 border-b border-blue-300 bg-blue-500 text-sm font-semibold text-white uppercase tracking-wider text-center">
                  ประเภทโต๊ะ
                </th>
                <th className="px-6 py-3 border-b border-blue-300 bg-blue-500 text-sm font-semibold text-white uppercase tracking-wider text-center">
                  จำนวนที่นั่ง
                </th>
                <th className="px-6 py-3 border-b border-blue-300 bg-blue-500 text-sm font-semibold text-white uppercase tracking-wider text-center">
                  ราคาโต๊ะ
                </th>
                <th className="px-6 py-3 border-b border-blue-300 bg-blue-500 text-sm font-semibold text-white uppercase tracking-wider text-center">
                  สถานะ
                </th>
                <th className="px-6 py-3 border-b border-blue-300 bg-blue-500 text-sm font-semibold text-white uppercase tracking-wider text-center">
                  หมายเหตุ
                </th>
                <th className="px-6 py-3 border-b border-blue-300 bg-blue-500 text-sm font-semibold text-white uppercase tracking-wider text-center">
                  ดูรายละเอียด
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedGroupedBookings.map(
                (date, idx) =>
                  (selectedDate === "" || selectedDate === date) && (
                    <React.Fragment key={idx}>
                      <tr>
                        <td
                          colSpan="11"
                          className="px-5 py-1 border border-gray-200 text-lg font-bold bg-gray-100 mb-4"
                        >
                          {date}
                        </td>
                      </tr>
                      {groupedBookings[date]
                        .sort(
                          (a, b) =>
                            new Date(b.booking_datatime) -
                            new Date(a.booking_datatime)
                        )
                        .map((booking, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition duration-300 ease-in-out"
                          >
                            <td className="px-6 py-4 border-b border-gray-200 text-sm text-center"></td>
                            <td className="px-6 py-4 border-b border-gray-200 text-sm text-center"></td>
                            <td className="px-6 py-4 border-b border-gray-200 text-sm text-center">
                              {booking.booking_id}
                            </td>

                            <td className="px-6 py-4 border-b border-gray-200 text-sm text-center">
                              {moment(booking.booking_datatime).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </td>
                            <td className="px-6 py-4 border-b border-gray-200 text-sm text-center">
                              {booking.table.table_name}
                            </td>
                            <td className="px-6 py-4 border-b border-gray-200 text-sm text-center">
                              {booking.table.type_table.type_name}
                            </td>
                            <td className="px-6 py-4 border-b border-gray-200 text-sm text-center">
                              {booking.table.table_seat}
                            </td>
                            <td className="px-6 py-4 border-b border-gray-200 text-sm text-center">
                              {booking.table.table_price}
                            </td>
                            <td
                              className={`px-6 py-4 border-b border-gray-200 text-sm font-medium text-center ${
                                booking.status_booking === "APPROVE"
                                  ? "text-blue-500"
                                  : booking.status_booking === "CANCEL"
                                  ? "text-red-500"
                                  : booking.status_booking === "SUCCEED"
                                  ? "text-green-500"
                                  : booking.status_booking === "WAIT"
                                  ? "text-yellow-500"
                                  : ""
                              }`}
                            >
                              {booking.status_booking === "APPROVE" && (
                                <i className="fas fa-stamp mr-2"></i>
                              )}
                              {booking.status_booking === "CANCEL" && (
                                <i className="fas fa-times-circle mr-2"></i>
                              )}
                              {booking.status_booking === "SUCCEED" && (
                                <i className="fas fa-check-circle mr-2"></i>
                              )}
                              {booking.status_booking === "WAIT" && (
                                <i className="fas fa-clock mr-2"></i>
                              )}
                              {booking.status_booking === "APPROVE"
                                ? "อนุมัติ"
                                : booking.status_booking === "CANCEL"
                                ? "ยกเลิก"
                                : booking.status_booking === "SUCCEED"
                                ? "สำเร็จ"
                                : booking.status_booking === "WAIT"
                                ? "รออนุมัติ"
                                : ""}
                            </td>

                            <td className="px-6 py-4 border-b border-gray-200 text-sm text-center">
                              {booking.status_booking === "CANCEL" ? (
                                <span className="text-red-500">
                                  {booking.note_booking || "ไม่มีข้อมูล"}
                                </span>
                              ) : (
                                <span>-</span>
                              )}
                            </td>

                            <td className="px-6 py-4 border-b border-gray-200 text-sm text-center">
                              <button
                                onClick={() => showBookingDetails(booking)}
                                className="flex justify-center items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 mx-auto"
                              >
                                <i className="fas fa-eye mr-2"></i>
                                <span className="font-medium">
                                  ดูรายละเอียด
                                </span>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
