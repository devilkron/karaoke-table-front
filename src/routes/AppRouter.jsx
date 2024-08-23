import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import LoginForm from "../layout/LoginForm";
import userAuth from "../hooks/userAuth";
import RegisterForm from "../layout/RegisterForm";
import Header from "../layout/Header";
import UserHome from "../layout/UserHome";
import HeaderAdmin from "../layout/HeaderAdmin";
import Dashboard from "../layout/Dashboard";
import Tables from "../layout/Tables";
import DataUser from "../layout/DataUser";
import DataType from "../layout/DataType";
import DataTable from "../layout/DataTable";
import DataBooking from "../layout/DataBooking";
import Contact from "../layout/Contact";
import CreateType from "../layout/CreateType";
import CreateTable from "../layout/CreateTable";
import BookingTable from "../layout/BookingTable";
import UpdateProfile from "../layout/updeteProfile";
import Profile from "../layout/Profile";
import Succeed from "../layout/Succeed";
import DataBookingUser from "../layout/DataBookingUser";
import Type_table from "../layout/TypeTableUser";
import TypeTableUser from "../layout/TypeTableUser";
import ProfileAdmin from "../layout/ProfileAdmin";
import DataBooing_Approval from "../layout/DataBooing_Approval";

const guesRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <Outlet />
      </>
    ),
    children: [
      { index: true, element: <UserHome /> },
      { path: "/Tables", element: <Tables /> },
      { path: "/login", element: <LoginForm /> },
      { path: "/register", element: <RegisterForm /> },
      { path: "/BookingTable/*", element: <BookingTable /> },
      { path: "/UserHome", element: <UserHome /> },
      { path: "/Contact", element: <Contact /> },
      { path: "/Tables/*", element: <TypeTableUser /> },
    ],
  },
]);
const userRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <hr />
        <Outlet />
      </>
    ),
    children: [
      { index: true, element: <UserHome /> },
      { path: "/login", element: <LoginForm /> },
      { path: "/Tables", element: <Tables /> },
      { path: "/Tables/*", element: <TypeTableUser /> },
      { path: "/UserHome", element: <UserHome /> },
      { path: "/Contact", element: <Contact /> },
      { path: "/Profile", element: <Profile /> },
      { path: "/updateProfile", element: <UpdateProfile /> },
      // { path: "/BookingTable", element: <BookingTable/> },
      { path: "/BookingTable/*", element: <BookingTable /> },
      { path: "/Succeed", element: <Succeed /> },
      { path: "/DataBookingUser", element: <DataBookingUser /> },
    ],
  },
]);

const adminRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <HeaderAdmin />
        <hr />
        <Outlet />
      </>
    ),

    children: [
      { index: true, element: <Dashboard/> },
      { path: "/Dashboard", element: <Dashboard /> },
      { path: "/DataUser", element: <DataUser /> },
      { path: "/DataType", element: <DataType /> },
      { path: "/DataTable", element: <DataTable /> },
      { path: "/DataBooing_Approval", element: <DataBooing_Approval />},
      { path: "/DataBooking", element: <DataBooking /> },
      { path: "/CreateType", element: <CreateType /> },
      { path: "/CreateTable", element: <CreateTable /> },
      { path: "/ProfileAdmin", element: <ProfileAdmin /> },
    ],
  },
]);

export default function AppRouter() {
  const { user } = userAuth();
  const finalRouter = user?.user_id
    ? user.role === "ADMIN"
      ? adminRouter
      : userRouter
    : guesRouter;
  return <RouterProvider router={finalRouter} />;
}
