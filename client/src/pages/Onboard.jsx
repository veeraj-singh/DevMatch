import React, { useState } from "react";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { ArrowRight, User, Sparkles, MapPin, Check } from "lucide-react";
import api from "../utils/axios_instance";

const Onboard = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    avatarUrl: "",
    bio: "",
    skills: [],
    interests: [],
    experience: null,
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (key, value) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [key]: [...prev[key], value.trim()],
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await api.put('/api/user', {
        ...formData,
        uid: auth.currentUser.uid
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    
      if (response.status === 200) {
        navigate('/dashboard');
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const removeArrayItem = (key, itemToRemove) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].filter((item) => item !== itemToRemove),
    }));
  };

  const progressSteps = [
    { icon: <Sparkles className="w-6 h-6 text-[#06c270]" />, text: "Welcome" },
    { icon: <User className="w-6 h-6 text-[#06c270]" />, text: "Profile" },
    { icon: <Sparkles className="w-6 h-6 text-[#06c270]" />, text: "Skills" },
    { icon: <MapPin className="w-6 h-6 text-[#06c270]" />, text: "Experience" },
    { icon: <Check className="w-6 h-6 text-[#06c270]" />, text: "Review" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3a3a3a] to-[#1c1c1c] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#2b2b2b] shadow-2xl rounded-2xl overflow-hidden">
        {/* Progress Indicator */}
        <div className="flex justify-between p-4 bg-[#222222]">
          {progressSteps.map((stepInfo, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                step === index + 1
                  ? "text-[#06c270] font-bold"
                  : "text-[#7d7d7d]"
              }`}
            >
              {stepInfo.icon}
              <span className="text-xs mt-1">{stepInfo.text}</span>
            </div>
          ))}
        </div>

        <div className="p-6 text-[#e1e1e1]">
          {step === 1 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                Welcome to DevMatch!
              </h2>
              <p className="mb-6">
                Create a profile that tells your unique developer story.
              </p>
              <button
                onClick={() => setStep(2)}
                className="w-full bg-[#06c270] text-white py-3 rounded-lg hover:bg-[#04a359] transition flex items-center justify-center"
              >
                Get Started <ArrowRight className="ml-2" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Basic Details
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full p-3 bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#06c270] focus:outline-none"
                  value={formData.name}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="avatarUrl"
                  placeholder="Avatar URL"
                  className="w-full p-3 bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#06c270] focus:outline-none"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                />
                <textarea
                  name="bio"
                  placeholder="Tell us about yourself"
                  className="w-full p-3 bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg h-24 focus:ring-2 focus:ring-[#06c270] focus:outline-none"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
              <button
                onClick={() => setStep(3)}
                className="w-full mt-4 bg-[#06c270] text-white py-3 rounded-lg hover:bg-[#04a359] transition flex items-center justify-center"
              >
                Next <ArrowRight className="ml-2" />
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Skills & Interests
              </h2>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Add a skill (Press Enter)"
                    className="w-full p-3 bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#06c270] focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleArrayChange("skills", e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-[#4a4a4a] text-[#e1e1e1] px-2 py-1 rounded-full text-sm flex items-center"
                      >
                        {skill}
                        <button
                          onClick={() => removeArrayItem("skills", skill)}
                          className="ml-2 text-[#e5554f] hover:text-[#cf4e49]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Add an interest (Press Enter)"
                    className="w-full p-3 bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#06c270] focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleArrayChange("interests", e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-[#4a4a4a] text-[#e1e1e1] px-2 py-1 rounded-full text-sm flex items-center"
                      >
                        {interest}
                        <button
                          onClick={() => removeArrayItem("interests", interest)}
                          className="ml-2 text-[#e5554f] hover:text-[#cf4e49]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setStep(4)}
                className="w-full mt-4 bg-[#06c270] text-white py-3 rounded-lg hover:bg-[#04a359] transition flex items-center justify-center"
              >
                Next <ArrowRight className="ml-2" />
              </button>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Experience & Location
              </h2>
              <div className="space-y-4">
                <input
                  type="number"
                  name="experience"
                  placeholder="Years of Experience"
                  className="w-full p-3 bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#06c270] focus:outline-none"
                  value={formData.experience || ""}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Your Location"
                  className="w-full p-3 bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg focus:ring-2 focus:ring-[#06c270] focus:outline-none"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              <button
                onClick={() => setStep(5)}
                className="w-full mt-4 bg-[#06c270] text-white py-3 rounded-lg hover:bg-[#04a359] transition flex items-center justify-center"
              >
                Next <ArrowRight className="ml-2" />
              </button>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Review Your Profile
              </h2>
              <div className="bg-[#292929] p-4 rounded-lg space-y-2">
                <p>
                  <strong>Name:</strong> {formData.name || "Not provided"}
                </p>
                <p>
                  <strong>Avatar:</strong> {formData.avatarUrl || "Not provided"}
                </p>
                <p>
                  <strong>Bio:</strong> {formData.bio || "Not provided"}
                </p>
                <p>
                  <strong>Skills:</strong>
                  {formData.skills.length > 0
                    ? formData.skills.join(", ")
                    : "Not provided"}
                </p>
                <p>
                  <strong>Interests:</strong>
                  {formData.interests.length > 0
                    ? formData.interests.join(", ")
                    : "Not provided"}
                </p>
                <p>
                  <strong>Experience:</strong>{" "}
                  {formData.experience ? `${formData.experience} years` : "Not provided"}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {formData.location || "Not provided"}
                </p>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full mt-4 bg-[#06c270] text-white py-3 rounded-lg hover:bg-[#04a359] transition flex items-center justify-center"
              >
                Create Profile <Check className="ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboard;