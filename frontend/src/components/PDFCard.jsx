const PDFCard = ({ pdf }) => {
  return (
    <div className="pdf-card">
      <h4>{pdf.subjectName}</h4>
      <p>Class: {pdf.className}</p>
      <p>School: {pdf.schoolName}</p>

      <iframe
        src={`http://localhost:5000/${pdf.pdfUrl}`}
        width="100%"
        height="200"
        title="PDF Preview"
      />

      <a
        href={`http://localhost:5000/${pdf.pdfUrl}`}
        target="_blank"
        rel="noreferrer"
      >
        Open Full PDF
      </a>
    </div>
  );
};

export default PDFCard;
