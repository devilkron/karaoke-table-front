import userAuth from "./hooks/userAuth";
import LoginForm from "./layout/LoginForm";
import RegisterForm from "./layout/RegisterForm";
import AppRouter from "./routes/AppRouter";

function App() {

  const {loading} = userAuth()

  if(loading) {
    return (
      <p className="text-3xl text-primary">กำลังโหลด...</p>
    )
  }
  return (
    <div data-theme="light" className="">
      <AppRouter/>
    </div>
  );
  
}

export default App;