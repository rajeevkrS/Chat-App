import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./style.scss";
import { AuthContext } from "./context API/AuthContext";
import { useContext } from "react";

function App() {
  // const { currentUser } = useContext(AuthContext);
  // console.log(currentUser);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
