const PDFCard = ({ pdf }) => {
  const pdfUrl = `http://localhost:5000${pdf.pdfUrl}`;

  return (
    <div className="pdf-card">
      <h4>{pdf.subjectName}</h4>
      <p>Class: {pdf.className}</p>
      <p>School: {pdf.schoolName}</p>

      <a href={pdfUrl} target="_blank" rel="noreferrer">
        Open / Download PDF
      </a>
    </div>
  );
};

export default PDFCard;
