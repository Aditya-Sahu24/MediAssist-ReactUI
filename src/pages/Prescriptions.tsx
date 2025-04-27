import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import Select from "react-select";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { toast, Toaster } from "react-hot-toast";
import api from "../utils/Url";

const Prescription = () => {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    PrescriptionID: null,
    AppointmentID: null,
    DoctorID: null,
    PatientID: null,
    MedicineDetails: "",
    Dosage: "",
    Instructions: "",
    DateIssued: "",
  });

  const [formErrors, setFormErrors] = useState<any>({});
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchAppointments(), fetchPatients(), fetchDoctors()]);
      fetchPrescriptions();
    };
    load();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await api.post("PrescriptionDetails", { Type: 4 });
      const data = res.data.data.map((item: any, index: number) => ({
        ...item,
        srno: index + 1,
        DateIssued: item.DateIssued?.split("T")[0],
      }));
      setPrescriptions(data);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
    }
  };

  const fetchAppointments = async () => {
    const res = await api.post("AppointmentDetails", { Type: 4 });
    const options = res.data.data.map((a: any) => ({
      value: a.AppointmentID,
      label: `Appt #${a.AppointmentID} - ${a.PatientName}`,
      DoctorID: a.DoctorID,
      PatientID: a.PatientID,
    }));
    setAppointments(options);
  };

  const fetchPatients = async () => {
    const res = await api.post("PatientDetails", { Type: 4 });
    const options = res.data.data.map((p: any) => ({
      value: p.PatientID,
      label: p.Name,
    }));
    setPatients(options);
  };

  const fetchDoctors = async () => {
    const res = await api.post("DoctorDetails", { Type: 4 });
    const options = res.data.data.map((d: any) => ({
      value: d.DoctorID,
      label: d.Name,
    }));
    setDoctors(options);
  };

  const resetForm = () => {
    setFormErrors({});
    setFormData({
      PrescriptionID: null,
      AppointmentID: null,
      DoctorID: null,
      PatientID: null,
      MedicineDetails: "",
      Dosage: "",
      Instructions: "",
      DateIssued: "",
    });
  };

  const validateForm = () => {
    const errors: any = {};
    if (!formData.AppointmentID) errors.AppointmentID = "Appointment is required";
    if (!formData.DoctorID) errors.DoctorID = "Doctor is required";
    if (!formData.PatientID) errors.PatientID = "Patient is required";
    if (!formData.MedicineDetails.trim()) errors.MedicineDetails = "Medicine details required";
    if (!formData.DateIssued) errors.DateIssued = "Date is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddOrUpdate = async () => {
    if (!validateForm()) return;

    const payload = {
      ...formData,
      Type: formData.PrescriptionID ? 2 : 1,
    };

    try {
      const res = await api.post("PrescriptionDetails", payload);
      if (res.data.success) {
        toast.success(`Prescription ${formData.PrescriptionID ? "updated" : "added"} successfully!`);
        fetchPrescriptions();
        setIsModalOpen(false);
        resetForm();
      } else {
        toast.error("Failed to save prescription.");
      }
    } catch (err) {
      toast.error("Error saving prescription.");
    }
  };

  const handleEdit = (presc: any) => {
    setFormErrors({});
    setFormData({ ...presc });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Delete Prescription?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await api.post("PrescriptionDetails", { Type: 5, PrescriptionID: id });
        if (res.data.success) {
          toast.success("Deleted successfully.");
          fetchPrescriptions();
        } else {
          toast.error("Failed to delete.");
        }
      } catch (err) {
        toast.error("Error deleting prescription.");
      }
    }
  };

  const handlePrint = (presc: any) => {
    const printWindow = window.open("", "_blank");
    const doctor = doctors.find((d) => d.value === presc.DoctorID)?.label || "";
    const patient = patients.find((p) => p.value === presc.PatientID)?.label || "";
    printWindow?.document.write(`
      <html>
        <head>
          <title>Prescription</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h1 { text-align: center; color: #1e3a8a; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td { padding: 8px; border: 1px solid #ccc; }
          </style>
        </head>
        <body>
          <h1>Prescription Details</h1>
          <table>
            <tr><td><strong>Doctor</strong></td><td>${doctor}</td></tr>
            <tr><td><strong>Patient</strong></td><td>${patient}</td></tr>
            <tr><td><strong>Medicine</strong></td><td>${presc.MedicineDetails}</td></tr>
            <tr><td><strong>Dosage</strong></td><td>${presc.Dosage}</td></tr>
            <tr><td><strong>Instructions</strong></td><td>${presc.Instructions}</td></tr>
            <tr><td><strong>Date Issued</strong></td><td>${presc.DateIssued}</td></tr>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow?.document.close();
  };

  return (
    <div className="p-6 font-sans bg-gray-100 min-h-screen">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">Prescriptions</h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" /> Add Prescription
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-700 text-white text-sm font-semibold">
            <tr>
              <th className="px-6 py-4 text-left">Sr No.</th>
              <th className="px-6 py-4 text-left">Patient</th>
              <th className="px-6 py-4 text-left">Doctor</th>
              <th className="px-6 py-4 text-left">Medicine</th>
              <th className="px-6 py-4 text-left">Dosage</th>
              <th className="px-6 py-4 text-left">Instructions</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {prescriptions.length > 0 ? (
              prescriptions.map((p, index) => (
                <tr key={p.PrescriptionID} className="hover:bg-blue-50">
                  <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm">{patients.find(pt => pt.value === p.PatientID)?.label}</td>
                  <td className="px-6 py-4 text-sm">{doctors.find(doc => doc.value === p.DoctorID)?.label}</td>
                  <td className="px-6 py-4 text-sm">{p.MedicineDetails}</td>
                  <td className="px-6 py-4 text-sm">{p.Dosage}</td>
                  <td className="px-6 py-4 text-sm">{p.Instructions}</td>
                  <td className="px-6 py-4 text-sm">{p.DateIssued}</td>
                  <td className="px-6 py-4 text-sm flex gap-3">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800">
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(p.PrescriptionID)} className="text-red-600 hover:text-red-800">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handlePrint(p)} className="text-gray-700 hover:text-black">
                      <PrinterIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4 text-sm text-gray-500">
                  No prescriptions found.
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
              {formData.PrescriptionID ? "Edit Prescription" : "Add Prescription"}
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Appointment</label>
                <Select
                  options={appointments}
                  value={appointments.find(a => a.value === formData.AppointmentID)}
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      AppointmentID: val?.value || null,
                      DoctorID: val?.DoctorID || null,
                      PatientID: val?.PatientID || null,
                    })
                  }
                />
                {formErrors.AppointmentID && <p className="text-red-500 text-sm mt-1">{formErrors.AppointmentID}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm">Doctor</label>
                <Select
                  options={doctors}
                  value={doctors.find(d => d.value === formData.DoctorID)}
                  onChange={(val) => setFormData({ ...formData, DoctorID: val?.value })}
                />
                {formErrors.DoctorID && <p className="text-red-500 text-sm mt-1">{formErrors.DoctorID}</p>}
              </div>

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
                <label className="block mb-1 text-sm">Medicine Details</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded-md"
                  value={formData.MedicineDetails}
                  onChange={(e) =>
                    setFormData({ ...formData, MedicineDetails: e.target.value })
                  }
                />
                {formErrors.MedicineDetails && <p className="text-red-500 text-sm mt-1">{formErrors.MedicineDetails}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm">Dosage</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded-md"
                  value={formData.Dosage}
                  onChange={(e) =>
                    setFormData({ ...formData, Dosage: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Instructions</label>
                <textarea
                  className="w-full border px-3 py-2 rounded-md"
                  value={formData.Instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, Instructions: e.target.value })
                  }
                ></textarea>
              </div>

              <div>
                <label className="block mb-1 text-sm">Date Issued</label>
                <input
                  type="date"
                  className="w-full border px-3 py-2 rounded-md"
                  value={formData.DateIssued}
                  onChange={(e) =>
                    setFormData({ ...formData, DateIssued: e.target.value })
                  }
                />
                {formErrors.DateIssued && <p className="text-red-500 text-sm mt-1">{formErrors.DateIssued}</p>}
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
                {formData.PrescriptionID ? "Update" : "Add"} Prescription
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Prescription;
