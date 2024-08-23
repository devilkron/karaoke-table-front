import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userAuth from "../hooks/userAuth";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [types, setTypes] = useState([]);
  const [typetable, setTypeTable] = useState([]);
  const [nameType, setNameType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const { user } = userAuth();
  const navigate = useNavigate();
  const TypeTable = decodeURIComponent(location.pathname.split("/")[2]);
  const token = localStorage.getItem("token");

  const getTables = async () => {
    try {
      const response = await axios.get(`http://localhost:8889/admin/tables`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTables(response.data.tables || []);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const getTypes = async () => {
    try {
      const response = await axios.get(`http://localhost:8889/admin/types`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTypes(response.data.types || []);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const getTypeTable = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8889/user/TypeTableUser?type=${TypeTable}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTypeTable(response.data.dTpye || []);
      setNameType(response.data.type || "");
    } catch (error) {
      console.error("Error fetching type table:", error);
    }
  };

  const getTypeHome = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8889/getType?type=${TypeTable}`
      );
      setTypeTable(response.data.dTpye || []);
      setNameType(response.data.type || "");
    } catch (error) {
      console.error("Error fetching home type:", error);
    }
  };

  useEffect(() => {
    if (token) {
      getTables();
      getTypes();
      getTypeTable();
    } else {
      getTypeHome();
    }
  }, [TypeTable]);

  const hdlBooking = (id) => {
    user?.user_id ? navigate(`/BookingTable/${id}`) : navigate("/login");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = typetable.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(typetable.length / itemsPerPage);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="text-4xl font-bold shadow-lg bg-gradient-to-l from-green-400  to-sky-400 text-white p-4 mt-28 text-center w-96 rounded-br-full">
        <div className="[text-shadow:3px_2px_5px_var(--tw-shadow-color)] shadow-gray-900 animate-pulse">
          {nameType}
        </div>
      </div>

      <div className="relative my-2 w-[1450px] mt-10 mx-auto">
        <hr className="absolute top-0 left-0 w-full h-1 rounded-full animate-pulse bg-gradient-to-r from-gray-300 to-gray-600" />
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-transparent animated-gradient"></div>
      </div>

      {typetable.length === 0 ? (
        <div className="text-2xl text-gray-700 py-20 text-center">
          ไม่พบข้อมูล...
        </div>
      ) : (
        <>
          <div className="max-w-[100rem] mx-auto gap-4 grid grid-cols-4 grid-rows-1 justify-items-center flex-grow">
            {currentItems.map((item) => (
              <div
                key={item.table_id}
                className="card-body items-center text-center"
              >
                <div className="relative my-2 w-full">
                  <div className="absolute top-0 left-0 w-full h-full rounded-full border-transparent animated-gradient"></div>
                </div>
                <div className="card w-80 border-2 border-gray-500 shadow-2xl bg-white bg-[url('path-to-your-pattern.png')] bg-contain bg-no-repeat">
                  <figure className="px-10 pt-10 hover:scale-110 transition duration-300 ease-in-out">
                    <img src={item.table_img} alt="" />
                  </figure>
                  <div className="flex flex-col gap-3 mt-3">
                    <h3 className="text-xl font-bold">{item.table_name}</h3>
                    <p className="product-price font-bold text-2xl">
                      ราคา :{" "}
                      <label className="text-red-600 text-xl font-bold">
                        {item.table_price}
                      </label>{" "}
                      บาท
                    </p>
                    <p className="text-lg font-bold">
                      จำนวนที่นั่ง :{" "}
                      <span className="text-red-600 text-xl font-normal">
                        {item.table_seat}
                      </span>{" "}
                    </p>
                    <h3 className="product-category font-bold">
                      ประเภท :{" "}
                      <label className="text-base font-normal">
                        {item.type_table.type_name}
                      </label>
                    </h3>

                    <h3 className="font-bold">
                      สถานะ :{" "}
                      <label
                        className={`text-base font-normal ${
                          item.table_status === "FREE"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {item.table_status === "FREE" ? "ว่าง" : "ไม่ว่าง"}
                      </label>
                    </h3>
                    <div className="card-actions mx-auto px-20 text-center">
                      <button
                        disabled={item.table_status === "BUSY"}
                        onClick={() => hdlBooking(item.table_id)}
                        className="text-white bg-gradient-to-r from-blue-500 to-blue-400 hover:bg-gradient-to-l focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-8 disabled:opacity-50 disabled:cursor-no-drop shadow-xl"
                      >
                        จอง
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex justify-center mt-1 mb-8">
        <button
          onClick={() =>
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
          }
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg mr-2 ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={currentPage === 1}
        >
          <FaArrowLeft />
        </button>
        <span className="flex items-center">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() =>
            setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
          }
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg ml-2 ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={currentPage === totalPages}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
