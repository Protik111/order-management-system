import "antd/dist/reset.css";
import "react-loading-skeleton/dist/skeleton.css";

import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Promotion from "./pages/Promotion";
import Order from "./pages/Order";
import Product from "./pages/Product";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/promotion"
        element={<PrivateRoute element={<Promotion />} />}
      />
      <Route path="/order" element={<PrivateRoute element={<Order />} />} />
      <Route path="/product" element={<PrivateRoute element={<Product />} />} />
    </Routes>
  );
};

export default App;
