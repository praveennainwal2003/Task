import { useState } from "react";
import API from "../services/api";
import PDFCard from "../components/PDFCard";
import "../styles/pdf.css";

const SearchPDF = () => {
  const [filters, setFilters] = useState({
    subjectName: "",
    className: "",
    schoolName: "",
  });
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    try {
      setLoading(true);

      const res = await API.get("/pdfs", {
        params: filters,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setPdfs(res.data);
    } catch (err) {
      alert("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <h2>Search Study PDFs</h2>

      <div className="search-bar">
        <input
          placeholder="Subject (e.g maths)"
          value={filters.subjectName}
          onChange={(e) =>
            setFilters({ ...filters, subjectName: e.target.value })
          }
        />

        <input
          placeholder="Class (e.g ten)"
          value={filters.className}
          onChange={(e) =>
            setFilters({ ...filters, className: e.target.value })
          }
        />

        <input
          placeholder="School (e.g gk)"
          value={filters.schoolName}
          onChange={(e) =>
            setFilters({ ...filters, schoolName: e.target.value })
          }
        />

        <button onClick={search}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && pdfs.length === 0 && <p>No PDFs found</p>}

      <div className="pdf-grid">
        {pdfs.map((pdf) => (
          <PDFCard key={pdf._id} pdf={pdf} />
        ))}
      </div>
    </div>
  );
};

export default SearchPDF;
