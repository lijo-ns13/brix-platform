import { useState } from "react";
import BaseModal from "../../modals/BaseModal";
import { addExperience } from "../../../services/ProfileService";
import { useAppSelector } from "../../../../../hooks/useAppSelector";

interface AddExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExperienceAdded: () => void;
}

export default function AddExperienceModal({
  isOpen,
  onClose,
  onExperienceAdded,
}: AddExperienceModalProps) {
  const { id } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
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
      await addExperience(id, formData);
      onExperienceAdded();
      onClose();
      setFormData({
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Add Experience">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
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
          Add Experience
        </button>
      </form>
    </BaseModal>
  );
}
