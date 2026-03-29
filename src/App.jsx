import { Routes, Route } from "react-router-dom";
import CreationForm from "../pages/CreationForm";
import Preview from "../pages/Preview";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <CreationForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/preview"
        element={
          <ProtectedRoute>
            <Preview />
          </ProtectedRoute>
        }
      />
    </Routes>
    </>
  );
}

export default App;