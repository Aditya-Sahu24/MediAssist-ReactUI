import { FiUsers, FiCalendar } from "react-icons/fi";
import { FaMinus, FaPlus, FaUserDoctor } from "react-icons/fa6";
import StatCard from "../components/StatCard";
import HeroSection from "../components/HeroSection";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaFacebookF, FaTwitter, FaYoutube, FaPinterestP, FaRupeeSign } from "react-icons/fa";


// Import icons
import doctorsIcon from "../assets/icons/doctors.svg";
import labsIcon from "../assets/icons/labs.svg";
import hospitalsIcon from "../assets/icons/hospitals.svg";
import medicalStoreIcon from "../assets/icons/medical-store.svg";
import ambulanceIcon from "../assets/icons/ambulance.svg";
import dentistryIcon from "../assets/icons/dentistry.svg";
import primaryCareIcon from "../assets/icons/primary-care.svg";
import cardiologyIcon from "../assets/icons/cardiology.svg";
import mriIcon from "../assets/icons/mri.svg";
import bloodTestIcon from "../assets/icons/blood-test.svg";
import psychologistIcon from "../assets/icons/psychologist.svg";
import laboratoryIcon from "../assets/icons/laboratory.svg";
import xrayIcon from "../assets/icons/xray.svg";

import patientsImage1 from "../assets/images/patientCaring1.jpg";
import patientsImage2 from "../assets/images/patientCaring2.jpg";
import FAQImage from "../assets/images/patientCare3.jpg";
import Logo from "../assets/images/logo.png";

const faqs = [
  { question: "Why choose our medical for your family?", answer: "We provide top-notch medical care with experienced professionals." },
  { question: "Why we are different from others?", answer: "We prioritize patient comfort and use cutting-edge technology." },
  { question: "Trusted & experience senior care & love", answer: "Our team has extensive experience in senior healthcare services." },
  { question: "How to get appointment for emergency cases?", answer: "You can book an emergency appointment via our online portal or call us directly." },
];


const Dashboard = () => {
  const [selected, setSelected] = useState("Hospitals");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const services = [
    { name: "Doctors", icon: doctorsIcon },
    { name: "Labs", icon: labsIcon },
    { name: "Hospitals", icon: hospitalsIcon },
    { name: "Medical Store", icon: medicalStoreIcon },
    { name: "Ambulance", icon: ambulanceIcon },
  ];

  const specializations = [
    { name: "Dentistry", icon: dentistryIcon },
    { name: "Primary Care", icon: primaryCareIcon },
    { name: "Cardiology", icon: cardiologyIcon },
    { name: "MRI Resonance", icon: mriIcon },
    { name: "Blood Test", icon: bloodTestIcon },
    { name: "Psychologist", icon: psychologistIcon },
    { name: "Laboratory", icon: laboratoryIcon },
    { name: "X-Ray", icon: xrayIcon },
  ];

  return (
    <div className="">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Overview - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6 p-4 md:p-6">
        <StatCard title="Total Patients" value="1,250" icon={<FiUsers />} />
        <StatCard title="Appointments Today" value="35" icon={<FiCalendar />} />
        <StatCard title="Active Doctors" value="18" icon={<FaUserDoctor />} />
        <StatCard title="Monthly Revenue" value="₹120,000" icon={<FaRupeeSign />} />
      </div>

      {/* Services Section */}
      <section className="mt-10 bg-blue-200 p-4">
        <div className="text-center py-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
            You may be looking for
          </h2>
          {/* <h2 className="text-xl md:text-2xl font-bold mb-4">You may be looking for</h2> */}

          {/* Service Cards - Responsive Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {services.map((service) => (
              <motion.div
                key={service.name}
                onClick={() => setSelected(service.name)}
                className={`cursor-pointer p-4 md:p-6 rounded-lg shadow-md transition-all duration-300 flex flex-col items-center
                  ${selected === service.name
                    ? "bg-blue-100 border border-blue-500"
                    : "bg-gray-50 hover:bg-blue-50"
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src={service.icon} alt={service.name} className="w-8 md:w-10 h-8 md:h-10 mb-2" />
                <p
                  className={`text-xs md:text-sm font-medium ${selected === service.name ? "text-blue-600 font-semibold" : "text-gray-500"
                    }`}
                >
                  {service.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialization Section */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
            Find by Specialization
          </h2>

          {/* Specialization Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
            {specializations.map((item) => (
              <motion.div
                key={item.name}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center cursor-pointer transition-all
              hover:shadow-lg hover:bg-blue-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src={item.icon} alt={item.name} className="w-10 h-10 mb-3" />
                <p className="text-gray-600 font-medium">{item.name}</p>
              </motion.div>
            ))}
          </div>

          {/* "View All" Button */}
          <div className="mt-8">
            <motion.button
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-md 
            hover:bg-blue-700 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              View All
            </motion.button>
          </div>
        </div>
      </section>

      {/* Patient Caring */}
      <section className="bg-blue-200 py-10 px-5 md:px-10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">

          {/* Left Side - Images */}
          <div className="relative w-full md:w-1/2 flex justify-center">
            <div className="relative w-[80%] md:w-[70%]">
              {/* Main Image */}
              <img
                src={patientsImage1}
                alt="Doctor Consultation"
                className="w-full rounded-lg shadow-md"
              />

              {/* Floating Smaller Image */}
              <div className="absolute bottom-[-30px] left-[-30px] w-2/3 md:w-1/2 border-4 border-white rounded-lg shadow-md">
                <img src={patientsImage2} alt="Doctor Helping Patient" className="w-full rounded-lg" />
              </div>

            </div>
          </div>

          {/* Right Side - Text Content */}
          <div className="w-full md:w-1/2 mt-16 md:mt-0 text-center md:text-left">
            <h3 className="text-blue-600 font-semibold text-sm uppercase">
              Helping Patients From Around The Globe!!
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Patient <span className="text-blue-600">Caring</span>
            </h2>
            <p className="text-gray-600 mt-4 leading-relaxed">
              Our goal is to deliver quality care in a courteous, respectful, and compassionate manner.
              We hope you allow us to care for you and strive to be the first and best choice for healthcare.
            </p>

            {/* Bullet Points */}
            <div className="mt-6 space-y-3">
              <p className="flex items-center space-x-3 text-gray-700">
                <span className="text-blue-600">✔</span>
                <span>Stay Updated About Your Health</span>
              </p>
              <p className="flex items-center space-x-3 text-gray-700">
                <span className="text-blue-600">✔</span>
                <span>Check Your Results Online</span>
              </p>
              <p className="flex items-center space-x-3 text-gray-700">
                <span className="text-blue-600">✔</span>
                <span>Manage Your Appointments</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently asked question */}
      <section className="py-16 px-6 md:px-20 bg-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left Side - Image with Info Badge */}
          <div className="relative">
            <img src={FAQImage} alt="Doctor with Patient" className="w-full rounded-lg shadow-lg" />

            {/* Floating Happy Patients Badge */}
            <div className="absolute bottom-6 left-4 bg-white shadow-md px-4 py-2 flex items-center rounded-lg">
              <span className="text-3xl">😊</span>
              <div className="ml-3">
                <h3 className="text-lg font-bold text-gray-900">84k+</h3>
                <p className="text-gray-600 text-sm">Happy Patients</p>
              </div>
            </div>

            {/* Floating Heart Icon */}
            <div className="absolute top-1/2 -right-6 bg-white p-2 rounded-full shadow-lg">
              <span className="text-red-500 text-2xl">💖</span>
            </div>
          </div>

          {/* Right Side - FAQ Section */}
          <div>
            <p className="text-blue-600 font-semibold text-center md:text-left">Get Your Answer</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center md:text-left">Frequently Asked Questions</h2>

            <div className="mt-6 space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="border-b border-gray-300 pb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <button
                    className="w-full flex justify-between items-center text-lg font-medium text-gray-800 hover:text-blue-600 transition"
                    onClick={() => toggleFAQ(index)}
                  >
                    {faq.question}
                    {openIndex === index ? <FaMinus className="text-blue-600" /> : <FaPlus className="text-blue-600" />}
                  </button>

                  {openIndex === index && (
                    <motion.p
                      className="mt-2 text-gray-600"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-blue-900 text-white py-10 px-6 md:px-20 container-fluid">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">

          {/* Left Section - Logo & Social Media */}
          <div>
            <img src={Logo} alt="Medify Logo" className="w-32 mx-auto md:mx-0" />
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-blue-900">
                <FaFacebookF />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-blue-900">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-blue-900">
                <FaYoutube />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-blue-900">
                <FaPinterestP />
              </a>
            </div>
          </div>

          {/* Middle Section - Navigation Links */}
          <div className="grid grid-cols-2 gap-4">
            <ul className="space-y-2">
              <FooterLink text="About Us" />
              <FooterLink text="Our Pricing" />
              <FooterLink text="Our Gallery" />
              <FooterLink text="Appointment" />
              <FooterLink text="Privacy Policy" />
            </ul>
            <ul className="space-y-2">
              <FooterLink text="Orthology" />
              <FooterLink text="Neurology" />
              <FooterLink text="Dental Care" />
              <FooterLink text="Ophthalmology" />
              <FooterLink text="Cardiology" />
            </ul>
          </div>

          {/* Right Section - Duplicate Links (Optional) */}
          <div className="grid grid-cols-1">
            <ul className="space-y-2">
              <FooterLink text="About Us" />
              <FooterLink text="Our Pricing" />
              <FooterLink text="Our Gallery" />
              <FooterLink text="Appointment" />
              <FooterLink text="Privacy Policy" />
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6 border-t border-gray-600"></div>
      </footer>

    </div>
  );
};



const FooterLink = ({ text }: { text: string }) => (
  <li className="flex items-center gap-2">
    <span className="text-lg">›</span>
    <a href="#" className="hover:text-gray-300">{text}</a>
  </li>
);

export default Dashboard;
