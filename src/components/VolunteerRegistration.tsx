import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Camera,
  Calendar,
  CreditCard,
  HeartPulse,
  Activity,
  Car,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  UserPlus,
  QrCode
} from "lucide-react";

export const VolunteerRegistration: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    aadhaar: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    bloodGroup: "",
    medicalConditions: "",
    skills: [] as string[],
    languages: "",
    experience: "",
    transport: "",
    availableDays: "",
    availableTime: ""
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [credentials, setCredentials] = useState<{ id: string; pass: string } | null>(null);

  const skillOptions = [
    "First Aid", "Medical", "Nursing", "Fire Rescue", "Search & Rescue",
    "Drone Operator", "Logistics", "Driver", "Translator",
    "Food Distribution", "Civil Engineer", "Electrician", "Other"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const sendOtp = () => {
    if (formData.phone.length >= 10) {
      setOtpSent(true);
    } else {
      alert("Please enter a valid 10-digit mobile number");
    }
  };

  const verifyOtp = () => {
    if (otp === "123456" || otp.length === 6) { // Mock verification
      setOtpVerified(true);
    } else {
      alert("Invalid OTP");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpVerified) {
      alert("Please verify your mobile number first.");
      return;
    }

    // Generate credentials
    const randId = Math.floor(100000 + Math.random() * 900000);
    const volId = `VOL-${new Date().getFullYear()}-${randId}`;
    const volPass = `Rescue@${Math.floor(1000 + Math.random() * 9000)}`;

    setCredentials({ id: volId, pass: volPass });
    setRegistered(true);
  };

  if (registered && credentials) {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    return (
      <div className="flex flex-col min-h-[calc(100vh-120px)] bg-slate-50 dark:bg-[#15161B] p-4 md:p-8 rounded-3xl">
        <div className="max-w-3xl mx-auto w-full">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-8 text-center mb-8">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">
              Registration Successful
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-lg mx-auto">
              Welcome to the emergency response team. Your application has been approved and your ID is ready.
            </p>

            <div className="bg-white dark:bg-[#22252D] rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-white/10 max-w-md mx-auto text-left">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-2">
                <UserPlus className="w-5 h-5 text-[#5B7CFA]" />
                Login Credentials
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Volunteer ID (Username)</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-slate-100 dark:bg-[#1A1C21] p-3 rounded-xl font-bold text-[#5B7CFA] text-lg select-all">
                      {credentials.id}
                    </code>
                    <button className="p-3 bg-slate-100 dark:bg-[#1A1C21] hover:bg-slate-200 dark:hover:bg-white/5 rounded-xl transition-colors">
                      <Copy className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Temporary Password</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-slate-100 dark:bg-[#1A1C21] p-3 rounded-xl font-bold text-slate-700 dark:text-slate-300 text-lg select-all">
                      {credentials.pass}
                    </code>
                    <button className="p-3 bg-slate-100 dark:bg-[#1A1C21] hover:bg-slate-200 dark:hover:bg-white/5 rounded-xl transition-colors">
                      <Copy className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-4 bg-amber-500/10 p-3 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-500">
                    Please copy and save these credentials immediately. For security reasons, the password will not be shown again.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ID Card Preview */}
          <div className="bg-white dark:bg-[#22252D] rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-white/10 max-w-md mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#5B7CFA] to-purple-500" />
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="font-extrabold text-xl text-[#2D2D2D] dark:text-white uppercase tracking-tight">Emergency Responder</h3>
                <p className="text-[#5B7CFA] font-bold text-sm tracking-widest">{credentials.id}</p>
              </div>
              <div className="w-16 h-16 bg-slate-100 dark:bg-[#1A1C21] rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600">
                <Camera className="w-6 h-6 text-slate-400" />
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Name</p>
                  <p className="font-bold text-lg text-slate-800 dark:text-slate-200">{formData.fullName || "John Doe"}</p>
                </div>
                <div className="p-2 bg-white dark:bg-white rounded-lg shadow-sm">
                  <QrCode className="w-12 h-12 text-[#2D2D2D]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Blood Group</p>
                  <p className="font-bold text-red-500">{formData.bloodGroup || "O+"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">District</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{formData.district || "Central"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Primary Skills</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">{formData.skills.slice(0, 3).join(", ") || "First Aid, General"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Valid From</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Expires</p>
                  <p className="font-bold text-red-500">{expiryDate.toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <button className="w-full py-4 rounded-xl font-bold bg-[#5B7CFA] text-white hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30">
              <Download className="w-5 h-5" />
              Download Digital ID Card
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] bg-slate-50 dark:bg-[#15161B] rounded-3xl">
      <div className="px-6 py-8 md:px-12 flex-shrink-0">
        <h1 className="text-3xl font-extrabold text-[#2D2D2D] dark:text-white tracking-tight flex items-center gap-3">
          <div className="p-3 bg-[#5B7CFA]/10 text-[#5B7CFA] rounded-2xl">
            <UserPlus className="w-7 h-7" />
          </div>
          Volunteer Registration
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 font-medium text-lg">
          Join the emergency response network. Your skills can save lives.
        </p>
      </div>

      <div className="flex-1 px-6 md:px-12 pb-12">
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
          
          {/* Section 1: Personal Info */}
          <div className="bg-white dark:bg-[#22252D] p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/5">
            <h2 className="text-xl font-bold text-[#2D2D2D] dark:text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
              <User className="w-5 h-5 text-[#5B7CFA]" />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name *</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Date of Birth *</label>
                <input required type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white" placeholder="john@example.com" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Mobile Number (Requires Verification) *</label>
                <div className="flex gap-2">
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} disabled={otpVerified} className="flex-1 bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white disabled:opacity-50" placeholder="+91 9876543210" />
                  {!otpVerified ? (
                    <button type="button" onClick={sendOtp} className="px-6 bg-slate-800 dark:bg-white text-white dark:text-[#15161B] font-bold rounded-xl hover:opacity-90 transition-opacity">
                      Send OTP
                    </button>
                  ) : (
                    <div className="px-6 flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl border border-emerald-500/20">
                      <CheckCircle2 className="w-5 h-5 mr-2" /> Verified
                    </div>
                  )}
                </div>
              </div>

              {otpSent && !otpVerified && (
                <div className="md:col-span-2 bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/20 flex gap-2">
                  <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" className="flex-1 bg-white dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-center tracking-[0.5em] font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white" maxLength={6} />
                  <button type="button" onClick={verifyOtp} className="px-8 bg-[#5B7CFA] text-white font-bold rounded-xl hover:bg-blue-600 transition-colors">
                    Verify
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Address */}
          <div className="bg-white dark:bg-[#22252D] p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/5">
            <h2 className="text-xl font-bold text-[#2D2D2D] dark:text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
              <MapPin className="w-5 h-5 text-[#5B7CFA]" />
              Address Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Street Address *</label>
                <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">City/Town *</label>
                <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">District *</label>
                <input required type="text" name="district" value={formData.district} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">State *</label>
                <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">PIN Code *</label>
                <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white" />
              </div>
            </div>
          </div>

          {/* Section 3: Identity & Emergency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#22252D] p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/5">
              <h2 className="text-xl font-bold text-[#2D2D2D] dark:text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
                <CreditCard className="w-5 h-5 text-[#5B7CFA]" />
                Identity (Optional)
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Aadhaar / National ID</label>
                  <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white" placeholder="xxxx-xxxx-xxxx" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Upload ID Proof</label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-[#1A1C21] transition-colors">
                    <Camera className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <span className="text-sm text-slate-500 font-medium">Click to upload document</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Passport-size Photo</label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-[#1A1C21] transition-colors flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-[#1A1C21] rounded-full flex items-center justify-center mb-2">
                      <User className="w-8 h-8 text-slate-400" />
                    </div>
                    <span className="text-sm text-slate-500 font-medium">Click to upload photo</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#22252D] p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/5">
              <h2 className="text-xl font-bold text-[#2D2D2D] dark:text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
                <HeartPulse className="w-5 h-5 text-red-500" />
                Emergency Details
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Emergency Contact Name *</label>
                  <input required type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Emergency Contact Number *</label>
                  <input required type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Blood Group *</label>
                    <select required name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white font-bold">
                      <option value="">Select</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Medical Conditions</label>
                    <input type="text" name="medicalConditions" value={formData.medicalConditions} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white" placeholder="None" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Volunteer Skills */}
          <div className="bg-white dark:bg-[#22252D] p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-white/5">
            <h2 className="text-xl font-bold text-[#2D2D2D] dark:text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
              <Activity className="w-5 h-5 text-[#5B7CFA]" />
              Volunteer Profile
            </h2>
            
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Core Skills (Select all that apply) *</label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                        formData.skills.includes(skill)
                          ? "bg-[#5B7CFA] text-white"
                          : "bg-slate-100 dark:bg-[#1A1C21] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Languages Known</label>
                  <input type="text" name="languages" value={formData.languages} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white" placeholder="English, Hindi, etc." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Available Transport</label>
                  <input type="text" name="transport" value={formData.transport} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white" placeholder="2-Wheeler, 4-Wheeler, None" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Available Days</label>
                  <input type="text" name="availableDays" value={formData.availableDays} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white" placeholder="e.g. Weekends, Any Day" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Available Time</label>
                  <input type="text" name="availableTime" value={formData.availableTime} onChange={handleInputChange} className="w-full bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white" placeholder="e.g. 9 AM - 5 PM, Anytime" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Previous Disaster Experience (if any)</label>
                <textarea name="experience" value={formData.experience} onChange={handleInputChange} rows={3} className="w-full bg-slate-50 dark:bg-[#1A1C21] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B7CFA] text-slate-800 dark:text-white resize-none" placeholder="Briefly describe any past experience in rescue, relief, or medical camps..."></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" className="px-6 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-10 py-4 rounded-xl font-extrabold bg-[#5B7CFA] text-white hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/25 flex items-center gap-2"
            >
              Submit Registration
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
