import { useState } from "react";
import BaseModal from "../../modals/BaseModal";
import { addEducation } from "../../../services/ProfileService";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import toast from "react-hot-toast";

interface AddEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEducationAdded: () => void; // Consider renaming this to onEducationAdded
}

export default function AddEducationModal({
  isOpen,
  onClose,
  onEducationAdded,
}: AddEducationModalProps) {
  const { id } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    institutionName: "",
    degree: "",
    fieldOfStudy: "",
    grade: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addEducation(id, formData);
      toast.success("Add education successfully");
      onEducationAdded(); // Again, consider renaming for clarity
      onClose();
      setFormData({
        institutionName: "",
        degree: "",
        fieldOfStudy: "",
        grade: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    } catch (error) {
      toast.error("failed to add education");
      console.error("Failed to submit form:", error);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Add Education">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="institutionName"
          placeholder="Institution Name"
          value={formData.institutionName}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="degree"
          placeholder="Degree"
          value={formData.degree}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="fieldOfStudy"
          placeholder="Field of Study"
          value={formData.fieldOfStudy}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="grade"
          placeholder="Grade (optional)"
          value={formData.grade}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Add Education
        </button>
      </form>
    </BaseModal>
  );
}
