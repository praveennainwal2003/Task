import { useState } from "react";
import API from "../services/api";

const UploadPDF = () => {
  const [subjectName, setSubjectName] = useState("");
  const [className, setClassName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [pdf, setPdf] = useState(null);

  const submit = async (e) => {
    e.preventDefault();

    if (!pdf) {
      alert("Please select a PDF");
      return;
    }

    const formData = new FormData();

    formData.append("subjectName", subjectName);
    formData.append("className", className);
    formData.append("schoolName", schoolName);
    formData.append("pdf", pdf); 

    try {
      await API.post(
        "/pdfs/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("PDF uploaded successfully");


      setSubjectName("");
      setClassName("");
      setSchoolName("");
      setPdf(null);

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to upload");
    }
  };

  return (
    <form className="box" onSubmit={submit}>
      <h2>Upload PDF</h2>

      <input
        placeholder="Subject Name"
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
      />

      <input
        placeholder="Class Name"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      />

      <input
        placeholder="School Name"
        value={schoolName}
        onChange={(e) => setSchoolName(e.target.value)}
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdf(e.target.files[0])}
      />

      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadPDF;
