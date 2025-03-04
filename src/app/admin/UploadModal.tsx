import { useState } from "react";

const UploadModal = ({ categories, addImage, closeModal }: { categories: string[], addImage: (category: string, url: string) => void, closeModal: () => void }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (selectedCategory && imagePreview) {
      addImage(selectedCategory, imagePreview);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Upload Image</h2>

        {/* Category Selection */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        {/* File Input */}
        <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border rounded-md mb-4" />

        {/* Image Preview */}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 w-12 h-12 object-cover rounded-md mx-auto"
          />
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Upload</button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
