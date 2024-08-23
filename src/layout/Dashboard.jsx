import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faTable,
  faClipboardList,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns-tz";
import useAuth from "../hooks/userAuth"; 

export default function Dashboard() {
  const { user } = useAuth(); 
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTableTypes, setTotalTableTypes] = useState(0);
  const [totalTables, setTotalTables] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalWaitingBookings, setTotalWaitingBookings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const token = localStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersResponse, typesResponse, tablesResponse, bookingsResponse] =
          await Promise.all([
            axios.get("http://localhost:8889/admin/users", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:8889/admin/types", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:8889/user/tables", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:8889/admin/bookings", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setTotalUsers(usersResponse.data.users.length);
        setTotalTableTypes(typesResponse.data.types.length);
        setTotalTables(tablesResponse.data.tables.length);
        setTotalBookings(bookingsResponse.data.bookings.length);

        const waitingBookings = bookingsResponse.data.bookings.filter(
          (booking) => booking.status_booking === "WAIT"
        );
        setTotalWaitingBookings(waitingBookings.length);
      } catch (error) {
        setError(error.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Bangkok",
      });
      setCurrentTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen p-8 mt-20">
      <div className="border-4 border-sky-300 p-12 rounded-xl bg-sky-50">
        <div className="mt-10 text-start">
          <p className="text-5xl font-bold mb-6">
            สวัสดีผู้ดูแลระบบ คุณ{" "}
            <spen className="text-5xl text-yellow-500">{user?.username}</spen>
          </p>{" "}
          <div className="mt-12">
          <Link
            to="/DataUser"
            className="text-center p-3 bg-sky-100 text-black rounded-lg shadow-lg flex items-center space-x-2 border-2 border-sky-300 w-48 hover:underline"
          >
            ดูข้อมูล
          </Link>
          </div>
        </div>
      </div>

      <div className="text-right mt-6 text-gray-600 p-4">
        <p className="text-xl text-black font-bold">
          <span className="block text-3xl mb-2">เวลาปัจจุบัน</span>
          <span className="block text-gray-600">{currentTime}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-8">
        <Link
          to="/DataUser"
          className="p-6 bg-white rounded-lg shadow-lg flex justify-center items-center space-x-4 cursor-pointer hover:bg-blue-50 transition"
        >
          <div className="p-6 bg-blue-100 rounded-lg shadow-lg flex items-center space-x-4 border border-sky-200">
            <FontAwesomeIcon icon={faUser} className="text-blue-500 text-4xl" />
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                จำนวนผู้ใช้งานทั้งหมด
              </h2>
              <p className="text-4xl font-bold text-blue-600">{totalUsers}</p>
            </div>
          </div>
        </Link>

        <Link
          to="/DataType"
          className="p-6 bg-white rounded-lg shadow-lg flex justify-center items-center space-x-4 cursor-pointer hover:bg-green-50 transition"
        >
          <div className="p-6 bg-green-100 rounded-lg shadow-lg flex items-center space-x-4 border border-green-200">
            <FontAwesomeIcon
              icon={faTable}
              className="text-green-500 text-4xl"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                จำนวนประเภทโต๊ะทั้งหมด
              </h2>
              <p className="text-4xl font-bold text-green-600">
                {totalTableTypes}
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/DataTable"
          className="p-6 bg-white rounded-lg shadow-lg flex justify-center items-center space-x-4 cursor-pointer hover:bg-yellow-50 transition"
        >
          <div className="p-6 bg-yellow-100 rounded-lg shadow-lg flex items-center space-x-4 border border-yellow-200">
            <FontAwesomeIcon
              icon={faClipboardList}
              className="text-yellow-500 text-4xl"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                จำนวนโต๊ะทั้งหมด
              </h2>
              <p className="text-4xl font-bold text-yellow-600">
                {totalTables}
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/DataBooing_Approval"
          className="p-6 bg-white rounded-lg shadow-lg flex justify-center items-center space-x-4 cursor-pointer hover:bg-purple-50 transition"
        >
          <div className="p-6 bg-purple-100 rounded-lg shadow-lg flex items-center space-x-4 border border-purple-200">
            <FontAwesomeIcon
              icon={faCalendarCheck}
              className="text-purple-500 text-4xl"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                การจองที่รออนุมัติทั้งหมด
              </h2>
              <p className="text-4xl font-bold text-purple-600">
                {totalWaitingBookings}
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/DataBooking"
          className="p-6 bg-white rounded-lg shadow-lg flex justify-center items-center space-x-4 cursor-pointer hover:bg-red-50 transition"
        >
          <div className="p-6 bg-red-100 rounded-lg shadow-lg flex items-center space-x-4 border border-red-200">
            <FontAwesomeIcon
              icon={faCalendarCheck}
              className="text-red-500 text-4xl"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                จำนวนการจองทั้งหมด
              </h2>
              <p className="text-4xl font-bold text-red-600">{totalBookings}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}