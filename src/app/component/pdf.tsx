"use client";
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExtractPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload a PDF file.");
      return;
    }

    setLoading(true);
    setError("");
    
    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await axios.post("https://test-backend-y11r.onrender.com/extract-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setExtractedData(response.data.extractedData);
      toast.success("Data extracted successfully.");
    } catch (error: unknown) {
      let errorMessage = "Error extracting data";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">PDF Data Extractor</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          className="mb-4"
        />
        <button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Extracting..." : "Extract Data"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {extractedData && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Extracted Data:</h2>
          <p><strong>Name:</strong> {extractedData.name}</p>
          <p><strong>Expiration Date:</strong> {extractedData.expirationDate}</p>
          <p><strong>Document Number:</strong> {extractedData.documentNumber}</p>
        </div>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default ExtractPdf;
