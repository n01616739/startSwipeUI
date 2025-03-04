"use client";

import { useState } from "react";
import UploadModal from "./UploadModal";

const categories = ["Nature", "Technology", "Art", "Food"];

const AdminDashboard = () => {
  const [images, setImages] = useState<{ id: number; category: string; url: string }[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const addImage = (category: string, url: string) => {
    setImages([...images, { id: Date.now(), category, url }]);
    setModalOpen(false);
  };

  const deleteImage = (id: number) => {
    setImages(images.filter(img => img.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="bg-blue-900 text-white w-64 p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <ul>
          <li className="mb-4">
            <a href="#" className="hover:text-gray-300">Dashboard</a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:text-gray-300">Images</a>
          </li>
          {/* Add more sidebar items here */}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-semibold mb-6">Manage Images</h1>

          {/* Button to Add Image */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Add New Image
            </button>
          </div>

          {/* Image List Table */}
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border rounded-md">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-4 text-left">Category</th>
                  <th className="border p-4 text-left">Image</th>
                  <th className="border p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {images.map((img) => (
                  <tr key={img.id} className="border-b hover:bg-gray-50">
                    <td className="border p-4">{img.category}</td>
                    <td className="border p-4 text-center">
                      <img
                        src={img.url}
                        alt="Uploaded"
                        className="w-16 h-16 object-cover rounded-md mx-auto"
                      />
                    </td>
                    <td className="border p-4 text-center">
                      <button
                        onClick={() => deleteImage(img.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalOpen && <UploadModal categories={categories} addImage={addImage} closeModal={() => setModalOpen(false)} />}
    </div>
  );
};

export default AdminDashboard;
