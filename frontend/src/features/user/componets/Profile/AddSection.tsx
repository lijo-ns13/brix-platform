import { useState } from "react";
import BaseModal from "../modals/BaseModal";

function AddSection() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the section creation logic
    console.log("Adding section:", sectionTitle);
    setModalOpen(false);
    setSectionTitle("");
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Add Section
      </button>

      {isModalOpen && (
        <BaseModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          title="Add New Section"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="sectionTitle"
                className="block text-sm font-medium text-gray-700"
              >
                Section Title
              </label>
              <input
                type="text"
                id="sectionTitle"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Add Section
              </button>
            </div>
          </form>
        </BaseModal>
      )}
    </>
  );
}

export default AddSection;
