import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import Select from "react-select";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { toast, Toaster } from "react-hot-toast";
import api from "../utils/Url";

const MedicalRecords = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    RecordID: null,
    PatientID: null,
    Diagnosis: "",
    Treatment: "",
    Notes: "",
    Date: "",
  });

  const [formErrors, setFormErrors] = useState<any>({});
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      await fetchPatients();
      fetchRecords();
    };
    load();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await api.post("MedicalRecordDetails", { Type: 4 });
      const data = res.data.data.map((item: any, index: number) => ({
        ...item,
        srno: index + 1,
        Date: item.Date?.split("T")[0],
      }));
      setRecords(data);
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  const fetchPatients = async () => {
    const res = await api.post("PatientDetails", { Type: 4 });
    const options = res.data.data.map((p: any) => ({
      value: p.PatientID,
      label: p.Name,
    }));
    setPatients(options);
  };

  const resetForm = () => {
    setFormErrors({});
    setFormData({
      RecordID: null,
      PatientID: null,
      Diagnosis: "",
      Treatment: "",
      Notes: "",
      Date: "",
    });
  };

  const validateForm = () => {
    const errors: any = {};
    if (!formData.PatientID) errors.PatientID = "Patient is required";
    if (!formData.Diagnosis.trim()) errors.Diagnosis = "Diagnosis is required";
    if (!formData.Date) errors.Date = "Date is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddOrUpdate = async () => {
    if (!validateForm()) return;

    const payload = {
      ...formData,
      Type: formData.RecordID ? 2 : 1,
    };

    try {
      const res = await api.post("MedicalRecordDetails", payload);
      if (res.data.success) {
        toast.success(`Record ${formData.RecordID ? "updated" : "added"} successfully!`);
        fetchRecords();
        setIsModalOpen(false);
        resetForm();
      } else {
        toast.error("Failed to save record.");
      }
    } catch (err) {
      toast.error("Error saving record.");
    }
  };

  const handleEdit = (record: any) => {
    setFormErrors({});
    setFormData({ ...record });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Delete Medical Record?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await api.post("MedicalRecordDetails", { Type: 5, RecordID: id });
        if (res.data.success) {
          toast.success("Deleted successfully.");
          fetchRecords();
        } else {
          toast.error("Failed to delete.");
        }
      } catch (err) {
        toast.error("Error deleting record.");
      }
    }
  };

  return (
    <div className="p-6 font-sans bg-gray-100 min-h-screen">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">Medical Records</h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" /> Add Record
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-700 text-white text-sm font-semibold">
            <tr>
              <th className="px-6 py-4 text-left">Sr No.</th>
              <th className="px-6 py-4 text-left">Patient</th>
              <th className="px-6 py-4 text-left">Diagnosis</th>
              <th className="px-6 py-4 text-left">Treatment</th>
              <th className="px-6 py-4 text-left">Notes</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.length > 0 ? (
              records.map((r, index) => (
                <tr key={r.RecordID} className="hover:bg-blue-50">
                  <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm">{patients.find(p => p.value === r.PatientID)?.label}</td>
                  <td className="px-6 py-4 text-sm">{r.Diagnosis}</td>
                  <td className="px-6 py-4 text-sm">{r.Treatment}</td>
                  <td className="px-6 py-4 text-sm">{r.Notes}</td>
                  <td className="px-6 py-4 text-sm">{r.Date}</td>
                  <td className="px-6 py-4 text-sm flex gap-3">
                    <button onClick={() => handleEdit(r)} className="text-blue-600 hover:text-blue-800">
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(r.RecordID)} className="text-red-600 hover:text-red-800">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-sm text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed z-50 inset-0">
        <div className="flex items-center justify-center min-h-screen bg-black/50">
          <Dialog.Panel className="bg-white rounded-xl p-6 w-[90%] sm:w-[500px] max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
              <XMarkIcon className="h-6 w-6" />
            </button>
            <Dialog.Title className="text-xl font-bold text-blue-700 mb-4">
              {formData.RecordID ? "Edit Medical Record" : "Add Medical Record"}
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Patient</label>
                <Select
                  options={patients}
                  value={patients.find(p => p.value === formData.PatientID)}
                  onChange={(val) => setFormData({ ...formData, PatientID: val?.value })}
                />
                {formErrors.PatientID && <p className="text-red-500 text-sm mt-1">{formErrors.PatientID}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm">Diagnosis</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded-md"
                  value={formData.Diagnosis}
                  onChange={(e) => setFormData({ ...formData, Diagnosis: e.target.value })}
                />
                {formErrors.Diagnosis && <p className="text-red-500 text-sm mt-1">{formErrors.Diagnosis}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm">Treatment</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded-md"
                  value={formData.Treatment}
                  onChange={(e) => setFormData({ ...formData, Treatment: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Notes</label>
                <textarea
                  className="w-full border px-3 py-2 rounded-md"
                  value={formData.Notes}
                  onChange={(e) => setFormData({ ...formData, Notes: e.target.value })}
                ></textarea>
              </div>

              <div>
                <label className="block mb-1 text-sm">Date</label>
                <input
                  type="date"
                  className="w-full border px-3 py-2 rounded-md"
                  value={formData.Date}
                  onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
                />
                {formErrors.Date && <p className="text-red-500 text-sm mt-1">{formErrors.Date}</p>}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {formData.RecordID ? "Update" : "Add"} Record
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default MedicalRecords;
