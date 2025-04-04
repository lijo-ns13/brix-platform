import { useState } from "react";
import BaseModal from "../modals/BaseModal";

interface Certificate {
  id?: string; // Added optional id for editing
  title: string;
  issuer: string;
  issueDate: string; // Changed from Date to string for easier input handling
  expirationDate: string;
  certificateUrl: string;
  certificateImageUrl: string;
  description?: string; // Added optional description
}

function CertificateSection() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCertificate, setCurrentCertificate] =
    useState<Certificate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddNew = () => {
    setCurrentCertificate({
      title: "",
      issuer: "",
      issueDate: "",
      expirationDate: "",
      certificateUrl: "",
      certificateImageUrl: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (certificate: Certificate) => {
    setCurrentCertificate(certificate);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Certificates</h2>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Add New
        </button>
      </div>

      {certificates.length === 0 ? (
        <p className="text-gray-500">No certificates added yet.</p>
      ) : (
        <div className="space-y-4">
          {certificates.map((certificate, index) => (
            <div
              key={certificate.id || index}
              className="border-b border-gray-200 pb-4 last:border-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{certificate.title}</h3>
                  <p className="text-gray-600">{certificate.issuer}</p>
                  <p className="text-sm text-gray-500">
                    {certificate.issueDate} - {certificate.expirationDate}
                  </p>
                  {certificate.description && (
                    <p className="mt-2 text-gray-700">
                      {certificate.description}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(certificate)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Certificate Modal */}
      <BaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? "Edit Certificate" : "Add New Certificate"}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title*
            </label>
            <input
              type="text"
              value={currentCertificate?.title || ""}
              onChange={(e) =>
                setCurrentCertificate((prev) =>
                  prev ? { ...prev, title: e.target.value } : null
                )
              }
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issuer*
            </label>
            <input
              type="text"
              value={currentCertificate?.issuer || ""}
              onChange={(e) =>
                setCurrentCertificate((prev) =>
                  prev ? { ...prev, issuer: e.target.value } : null
                )
              }
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date*
              </label>
              <input
                type="date"
                value={currentCertificate?.issueDate || ""}
                onChange={(e) =>
                  setCurrentCertificate((prev) =>
                    prev ? { ...prev, issueDate: e.target.value } : null
                  )
                }
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date
              </label>
              <input
                type="date"
                value={currentCertificate?.expirationDate || ""}
                onChange={(e) =>
                  setCurrentCertificate((prev) =>
                    prev ? { ...prev, expirationDate: e.target.value } : null
                  )
                }
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certificate URL
            </label>
            <input
              type="url"
              value={currentCertificate?.certificateUrl || ""}
              onChange={(e) =>
                setCurrentCertificate((prev) =>
                  prev ? { ...prev, certificateUrl: e.target.value } : null
                )
              }
              className="w-full border rounded p-2"
              placeholder="https://example.com/certificate"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isEditing ? "Update" : "Add"} Certificate
            </button>
          </div>
        </form>
      </BaseModal>
    </div>
  );
}

export default CertificateSection;
