import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { toast, Toaster } from "react-hot-toast";
import api from "../utils/Url";

const Patients = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    PatientID: null,
    Name: "",
    Age: "",
    Gender: "",
    ContactNumber: "",
    Email: "",
    Address: "",
  });

  const [formErrors, setFormErrors] = useState({
    Name: "",
    Age: "",
    Gender: "",
    ContactNumber: "",
    Email: "",
    Address: "",
  });

  useEffect(() => {
    getPatientDetails();
  }, []);

  const getPatientDetails = async () => {
    try {
      const response = await api.post("PatientDetails", { Type: 4 });
      const data = response?.data?.data.map((item: any, index: number) => ({
        ...item,
        id: item.PatientID,
        srno: index + 1,
      }));
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const validateFields = () => {
    const errors: any = {};
    if (!formData.Name.trim()) errors.Name = "Name is required.";
    if (!formData.Age || isNaN(Number(formData.Age))) errors.Age = "Valid age is required.";
    if (!formData.Gender.trim()) errors.Gender = "Gender is required.";
    if (!/^\d{10}$/.test(formData.ContactNumber)) errors.ContactNumber = "Must be 10 digits.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) errors.Email = "Enter a valid email.";
    if (!formData.Address.trim()) errors.Address = "Address is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddOrUpdate = async () => {
    if (!validateFields()) return;
    const type = formData.PatientID ? 2 : 1;
    try {
      const response = await api.post("PatientDetails", { ...formData, Type: type });
      if (response?.data?.success) {
        toast.success(formData.PatientID ? "Patient updated!" : "Patient added!");
        getPatientDetails();
        setIsModalOpen(false);
        resetForm();
      } else {
        toast.error(response?.data?.message || "Failed to save patient.");
      }
    } catch (error) {
      console.error("Error saving patient:", error);
      toast.error("Something went wrong!");
    }
  };

  const resetForm = () => {
    setFormData({ PatientID: null, Name: "", Age: "", Gender: "", ContactNumber: "", Email: "", Address: "" });
    setFormErrors({ Name: "", Age: "", Gender: "", ContactNumber: "", Email: "", Address: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleEdit = (patient: any) => {
    setFormData(patient);
    setIsModalOpen(true);
  };

  const handleDelete = async (patientId: number) => {
    const result = await Swal.fire({
      title: "Delete Patient?",
      text: "Are you sure you want to delete this patient?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;

    try {
      const response = await api.post("PatientDetails", { Type: 5, PatientID: patientId });
      if (response?.data?.success) {
        toast.success("Patient deleted successfully!");
        getPatientDetails();
      } else {
        toast.error("Failed to delete patient.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error while deleting patient.");
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 font-sans bg-gray-100 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-3xl font-bold text-blue-800">Patient List</h2>
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
          >
            <PlusIcon className="w-5 h-5" /> Add Patient
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-700 text-white text-sm font-semibold">
            <tr>
              <th className="px-6 py-4 text-left">Sr No.</th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Age</th>
              <th className="px-6 py-4 text-left">Gender</th>
              <th className="px-6 py-4 text-left">Contact</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Address</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <tr key={patient.PatientID} className="hover:bg-blue-50">
                  <td className="px-6 py-4 text-sm">{patient.srno}</td>
                  <td className="px-6 py-4 text-sm">{patient.Name}</td>
                  <td className="px-6 py-4 text-sm">{patient.Age}</td>
                  <td className="px-6 py-4 text-sm">{patient.Gender}</td>
                  <td className="px-6 py-4 text-sm">{patient.ContactNumber}</td>
                  <td className="px-6 py-4 text-sm">{patient.Email}</td>
                  <td className="px-6 py-4 text-sm">{patient.Address}</td>
                  <td className="px-6 py-4 text-sm flex gap-3">
                    <button onClick={() => handleEdit(patient)} className="text-blue-600 hover:text-blue-800">
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(patient.PatientID)} className="text-red-600 hover:text-red-800">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4 text-sm text-gray-500">No patients found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} className="fixed z-50 inset-0">
        <div className="flex items-center justify-center min-h-screen bg-black/40 backdrop-blur-sm">
          <Dialog.Panel className="bg-white rounded-2xl p-8 w-[95%] sm:w-[90%] md:w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl border border-blue-100 relative">
            <button
              onClick={() => { setIsModalOpen(false); resetForm(); }}
              className="absolute top-4 right-4 text-gray-500 hover:text-blue-600 transition"
              aria-label="Close"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <Dialog.Title className="text-2xl font-extrabold text-blue-700 mb-6">
              {formData.PatientID ? 'Edit Patient' : 'Add New Patient'}
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  name="Name"
                  type="text"
                  value={formData.Name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${formErrors.Name ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter Name"
                />
                {formErrors.Name && <p className="text-sm text-red-500 mt-1">{formErrors.Name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  name="Age"
                  type="text"
                  value={formData.Age}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${formErrors.Age ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter Age"
                />
                {formErrors.Age && <p className="text-sm text-red-500 mt-1">{formErrors.Age}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${formErrors.Gender ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.Gender && <p className="text-sm text-red-500 mt-1">{formErrors.Gender}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  name="ContactNumber"
                  type="text"
                  value={formData.ContactNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${formErrors.ContactNumber ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter Contact Number"
                />
                {formErrors.ContactNumber && <p className="text-sm text-red-500 mt-1">{formErrors.ContactNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  name="Email"
                  type="text"
                  value={formData.Email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${formErrors.Email ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter Email"
                />
                {formErrors.Email && <p className="text-sm text-red-500 mt-1">{formErrors.Email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  name="Address"
                  type="text"
                  value={formData.Address}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${formErrors.Address ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter Address"
                />
                {formErrors.Address && <p className="text-sm text-red-500 mt-1">{formErrors.Address}</p>}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdate}
                className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                {formData.PatientID ? 'Update' : 'Add'} Patient
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Patients;
