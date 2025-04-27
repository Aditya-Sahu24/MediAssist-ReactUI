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

const Appointment = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    AppointmentID: null,
    PatientID: null,
    DoctorID: null,
    AppointmentDate: "",
    TimeSlot: "",
    Status: "Scheduled",
  });

  const [formErrors, setFormErrors] = useState<any>({});
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchPatients(), fetchDoctors()]);
      fetchAppointments();
    };
    load();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.post("AppointmentDetails", { Type: 4 });
      const data = res.data.data.map((item: any, index: number) => {
        const date = item.AppointmentDate?.split("T")[0];
        const time = new Date(item.TimeSlot);
        const hh = String(time.getUTCHours()).padStart(2, "0");
        const mm = String(time.getUTCMinutes()).padStart(2, "0");
        return {
          ...item,
          srno: index + 1,
          AppointmentDate: date,
          TimeSlot: `${hh}:${mm}`,
        };
      });
      setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
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

  const fetchDoctors = async () => {
    const res = await api.post("DoctorDetails", { Type: 4 });
    const options = res.data.data.map((d: any) => ({
      value: d.DoctorID,
      label: d.Name,
    }));
    setDoctors(options);
  };

  const resetForm = () => {
    setFormData({
      AppointmentID: null,
      PatientID: null,
      DoctorID: null,
      AppointmentDate: "",
      TimeSlot: "",
      Status: "Scheduled",
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: any = {};
    if (!formData.PatientID) errors.PatientID = "Patient is required.";
    if (!formData.DoctorID) errors.DoctorID = "Doctor is required.";
    if (!formData.AppointmentDate) errors.AppointmentDate = "Date is required.";
    if (!formData.TimeSlot) errors.TimeSlot = "Time is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddOrUpdate = async () => {
    if (!validateForm()) return;

    const { AppointmentID, PatientID, DoctorID, AppointmentDate, TimeSlot, Status } = formData;

    const payload = {
      AppointmentID,
      PatientID,
      DoctorID,
      AppointmentDate,
      TimeSlot,
      Status,
      Type: AppointmentID ? 2 : 1,
    };

    try {
      const res = await api.post("AppointmentDetails", payload);
      if (res.data.success) {
        toast.success(`Appointment ${AppointmentID ? "updated" : "added"} successfully!`);
        fetchAppointments();
        setIsModalOpen(false);
        resetForm();
      } else {
        toast.error("Failed to save appointment.");
      }
    } catch (err) {
      console.error("Error saving appointment:", err);
      toast.error("Error saving appointment.");
    }
  };

  const handleEdit = (appt: any) => {
    setFormErrors({});
    setFormData({
      AppointmentID: appt.AppointmentID,
      PatientID: appt.PatientID,
      DoctorID: appt.DoctorID,
      AppointmentDate: appt.AppointmentDate,
      TimeSlot: `${appt.TimeSlot}:00`,
      Status: appt.Status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Delete Appointment?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await api.post("AppointmentDetails", {
          Type: 5,
          AppointmentID: id,
        });
        if (res.data.success) {
          toast.success("Deleted successfully.");
          fetchAppointments();
        } else {
          toast.error("Failed to delete.");
        }
      } catch (err) {
        toast.error("Error deleting appointment.");
      }
    }
  };

  const handlePrint = (appointment: any) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Appointment Details</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h2 { color: #1D4ED8; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              td { padding: 8px; border: 1px solid #ccc; }
            </style>
          </head>
          <body>
            <h2>Appointment Details</h2>
            <table>
              <tr><td><strong>Patient Name:</strong></td><td>${appointment.PatientName}</td></tr>
              <tr><td><strong>Doctor Name:</strong></td><td>${appointment.DoctorName}</td></tr>
              <tr><td><strong>Date:</strong></td><td>${appointment.AppointmentDate}</td></tr>
              <tr><td><strong>Time:</strong></td><td>${appointment.TimeSlot}</td></tr>
              <tr><td><strong>Status:</strong></td><td>${appointment.Status}</td></tr>
            </table>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function () {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="p-6 font-sans bg-gray-100 min-h-screen">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">Appointments</h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" /> Add Appointment
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-700 text-white text-sm font-semibold">
            <tr>
              <th className="px-6 py-4 text-left">Sr No.</th>
              <th className="px-6 py-4 text-left">Patient Name</th>
              <th className="px-6 py-4 text-left">Doctor Name</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Time</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <tr key={appointment.AppointmentID} className="hover:bg-blue-50">
                  <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm">{appointment.PatientName}</td>
                  <td className="px-6 py-4 text-sm">{appointment.DoctorName}</td>
                  <td className="px-6 py-4 text-sm">{appointment.AppointmentDate}</td>
                  <td className="px-6 py-4 text-sm">{appointment.TimeSlot}</td>
                  <td className="px-6 py-4 text-sm">{appointment.Status}</td>
                  <td className="px-6 py-4 text-sm flex gap-3">
                    <button
                      onClick={() => handleEdit(appointment)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(appointment.AppointmentID)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handlePrint(appointment)}
                      className="text-gray-700 hover:text-black"
                    >
                      <PrinterIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-sm text-gray-500">
                  No appointments found.
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
              {formData.AppointmentID ? "Edit Appointment" : "Add Appointment"}
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Patient</label>
                <Select
                  options={patients}
                  value={patients.find((p) => p.value === formData.PatientID)}
                  onChange={(val) => setFormData({ ...formData, PatientID: val?.value })}
                />
                {formErrors.PatientID && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.PatientID}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm">Doctor</label>
                <Select
                  options={doctors}
                  value={doctors.find((d) => d.value === formData.DoctorID)}
                  onChange={(val) => setFormData({ ...formData, DoctorID: val?.value })}
                />
                {formErrors.DoctorID && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.DoctorID}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm">Date</label>
                <input
                  type="date"
                  className="w-full border px-3 py-2 rounded-md"
                  value={formData.AppointmentDate}
                  onChange={(e) =>
                    setFormData({ ...formData, AppointmentDate: e.target.value })
                  }
                />
                {formErrors.AppointmentDate && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.AppointmentDate}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm">Time (HH:MM)</label>
                <input
                  type="time"
                  step="60"
                  className="w-full border px-3 py-2 rounded-md"
                  value={formData.TimeSlot}
                  onChange={(e) =>
                    setFormData({ ...formData, TimeSlot: e.target.value })
                  }
                />
                {formErrors.TimeSlot && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.TimeSlot}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm">Status</label>
                <select
                  className="w-full border px-3 py-2 rounded-md"
                  value={formData.Status}
                  onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Canceled">Canceled</option>
                </select>
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
                {formData.AppointmentID ? "Update" : "Add"} Appointment
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Appointment;

