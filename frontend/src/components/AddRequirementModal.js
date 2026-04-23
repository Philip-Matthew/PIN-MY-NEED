import { useState } from "react";

export default function AddRequirementModal({
  open,
  onClose,
  onSubmit,
  location,
}) {
  const [category, setCategory] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!category.trim()) return alert("Enter a category");

    onSubmit(category);
    setCategory("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>📌 Add Requirement</h2>

        <p className="coords">
          Lat: {location?.lat.toFixed(4)} | Lng: {location?.lng.toFixed(4)}
        </p>

        <input
          type="text"
          placeholder="Enter category..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <div className="modal-actions">
          <button className="create-btn" onClick={handleSubmit}>
            Create
          </button>

          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>

      <style>{`
        .modal-overlay{
          position:fixed;
          top:0;
          left:0;
          width:100%;
          height:100%;
          background:rgba(0,0,0,0.5);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:2000;
        }

        .modal-card{
          background:white;
          padding:25px;
          border-radius:12px;
          width:320px;
          animation:pop 0.2s ease;
        }

        .modal-card h2{
          margin-bottom:10px;
        }

        .coords{
          font-size:12px;
          color:#777;
          margin-bottom:15px;
        }

        input{
          width:100%;
          padding:10px;
          border-radius:6px;
          border:1px solid #ddd;
          margin-bottom:15px;
        }

        .modal-actions{
          display:flex;
          justify-content:space-between;
        }

        button{
          padding:8px 14px;
          border:none;
          border-radius:6px;
          cursor:pointer;
        }

        .create-btn{
          background:#2563eb;
          color:white;
        }

        .cancel-btn{
          background:#e5e7eb;
        }

        @keyframes pop{
          from{transform:scale(.9);opacity:0}
          to{transform:scale(1);opacity:1}
        }
      `}</style>
    </div>
  );
}
