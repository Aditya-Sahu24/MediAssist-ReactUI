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

const Billing = () => {
  const [bills, setBills] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    BillID: null,
    PatientID: null,
    AppointmentID: null,
    Amount: "",
    PaymentStatus: "Paid",
  });

  const [formErrors, setFormErrors] = useState<any>({});
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchAppointments(), fetchPatients()]);
      fetchBills();
    };
    load();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await api.post("BillingDetails", { "Type": 4 });
      const data = res.data.data.map((item: any, index: number) => ({
        ...item,
        srno: index + 1,
      }));
      setBills(data);
    } catch (err) {
      console.error("Error fetching bills:", err);
    }
  };

  const fetchAppointments = async () => {
    const res = await api.post("AppointmentDetails", { Type: 4 });
    const options = res.data.data.map((a: any) => ({
      value: a.AppointmentID,
      label: `Appt #${a.AppointmentID} - ${a.PatientName}`,
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

  const resetForm = () => {
    setFormErrors({});
    setFormData({
      BillID: null,
      PatientID: null,
      AppointmentID: null,
      Amount: "",
      PaymentStatus: "Paid",
    });
  };

  const validateForm = () => {
    const errors: any = {};
    if (!formData.AppointmentID) errors.AppointmentID = "Appointment is required";
    if (!formData.PatientID) errors.PatientID = "Patient is required";
    if (!formData.Amount) errors.Amount = "Amount is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddOrUpdate = async () => {
    if (!validateForm()) return;

    const payload = {
      ...formData,
      Type: formData.BillID ? 2 : 1,
    };

    try {
      const res = await api.post("BillingDetails", payload);
      if (res.data.success) {
        toast.success(`Bill ${formData.BillID ? "updated" : "added"} successfully!`);
        fetchBills();
        setIsModalOpen(false);
        resetForm();
      } else {
        toast.error("Failed to save bill.");
      }
    } catch (err) {
      toast.error("Error saving bill.");
    }
  };

  const handleEdit = (bill: any) => {
    setFormErrors({});
    setFormData({ ...bill });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Delete Bill?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await api.post("BillingDetails", { Type: 5, BillID: id });
        if (res.data.success) {
          toast.success("Deleted successfully.");
          fetchBills();
        } else {
          toast.error("Failed to delete.");
        }
      } catch (err) {
        toast.error("Error deleting bill.");
      }
    }
  };


  const handlePrint = (bill: any) => {
    const patient = patients.find(p => p.value === bill.PatientID)?.label || "Unknown";
    const appointment = `Appt #${bill.AppointmentID}`;
    const date = new Date().toLocaleDateString();

    const printWindow = window.open("", "_blank");
    printWindow?.document.write(`
      <html>
        <head>
          <title>Bill Receipt</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h1 { color: #2563eb; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td, th { padding: 10px; border: 1px solid #ccc; }
          </style>
        </head>
        <body>
          <h1>Billing Receipt</h1>
          <p><strong>Date:</strong> ${date}</p>
          <table>
            <tr><th>Patient</th><td>${patient}</td></tr>
            <tr><th>Appointment</th><td>${appointment}</td></tr>
            <tr><th>Amount</th><td>₹${bill.Amount}</td></tr>
            <tr><th>Payment Status</th><td>${bill.PaymentStatus}</td></tr>
          </table>
          <p style="margin-top: 40px;">Thank you for visiting!</p>
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
        <h2 className="text-3xl font-bold text-blue-700">Billing</h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" /> Add Bill
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-700 text-white text-sm font-semibold">
            <tr>
              <th className="px-6 py-4 text-left">Sr No.</th>
              <th className="px-6 py-4 text-left">Patient</th>
              <th className="px-6 py-4 text-left">Appointment</th>
              <th className="px-6 py-4 text-left">Amount</th>
              <th className="px-6 py-4 text-left">Payment Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bills.length > 0 ? (
              bills.map((b, index) => (
                <tr key={b.BillID} className="hover:bg-blue-50">
                  <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm">{patients.find(pt => pt.value === b.PatientID)?.label}</td>
                  <td className="px-6 py-4 text-sm">Appt #{b.AppointmentID}</td>
                  <td className="px-6 py-4 text-sm">₹{b.Amount}</td>
                  <td className="px-6 py-4 text-sm">{b.PaymentStatus}</td>
                  <td className="px-6 py-4 text-sm flex gap-3">
                    <button onClick={() => handleEdit(b)} className="text-blue-600 hover:text-blue-800">
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(b.BillID)} className="text-red-600 hover:text-red-800">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handlePrint(b)} className="text-gray-700 hover:text-black">
                      <PrinterIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-sm text-gray-500">
                  No bills found.
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
              {formData.BillID ? "Edit Bill" : "Add Bill"}
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
                      PatientID: val?.PatientID || null,
                    })
                  }
                />
                {formErrors.AppointmentID && <p className="text-red-500 text-sm mt-1">{formErrors.AppointmentID}</p>}
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
                <label className="block mb-1 text-sm">Amount</label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded-md"
                  value={formData.Amount}
                  onChange={(e) => setFormData({ ...formData, Amount: e.target.value })}
                />
                {formErrors.Amount && <p className="text-red-500 text-sm mt-1">{formErrors.Amount}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm">Payment Status</label>
                <select
                  className="w-full border px-3 py-2 rounded-md"
                  value={formData.PaymentStatus}
                  onChange={(e) => setFormData({ ...formData, PaymentStatus: e.target.value })}
                >
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Pending">Pending</option>
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
                {formData.BillID ? "Update" : "Add"} Bill
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Billing;
