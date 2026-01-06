import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadPDF from "./pages/UploadPDF";
import SearchPDF from "./pages/SearchPDF";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/upload" element={
          <ProtectedRoute role="academy">
            <UploadPDF />
          </ProtectedRoute>
        } />

        <Route path="/search" element={
          <ProtectedRoute role="student">
            <SearchPDF />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
