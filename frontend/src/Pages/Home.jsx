import Mic from "../assets/Mic.png";
import Engaging from "../assets/engaging_interface.png";
import Progress from "../assets/progress_tracking.png";
import Phonic from "../assets/holistic_phonic_training.png";
import Motor from "../assets/motor_based.png";
import Visual from "../assets/visual_auditory_stimulation.png";
import Learning from "../assets/multimodal_learning.png";
import RealTIme from "../assets/RealTIme.png";
import Dimensional from "../assets/threeDimensional.png";
import Illustration from "../assets/Illustration.png";
import Contact from "../assets/Contact Us.png";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import AuthModal from "../Components/AuthModal";

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Contact form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  const getstarted = () => {
    if (isAuthenticated) {
      navigate("/learning");
    } else {
      setIsAuthModalOpen(true);
    }
  };
  const mySectionRef = useRef(null);
  const scrollToSection = () => {
    mySectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Show success notification
        setNotification({
          show: true,
          message: 'Message sent successfully!',
          type: 'success'
        });

        // Clear form fields
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          message: ''
        });

        // Hide notification after 3 seconds
        setTimeout(() => {
          setNotification({ show: false, message: '', type: '' });
        }, 3000);
      } else {
        setNotification({
          show: true,
          message: data.message || 'Failed to send message',
          type: 'error'
        });
        setTimeout(() => {
          setNotification({ show: false, message: '', type: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setNotification({
        show: true,
        message: 'An error occurred. Please try again.',
        type: 'error'
      });
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dark:bg-gray-900">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-spacegroteskmedium animate-slide-in`}>
          {notification.message}
        </div>
      )}
      
      <div className="lg:grid-cols-2 grid grid-cols-1">
        <div className="flex flex-col lg:pl-20 justify-center">
          <div>
            <div className="lg:text-6xl md:text-4xl sm:text-3xl text-2xl lg:text-left text-center flex flex-col gap-4 font-spacegrotesksemibold dark:text-white">
              <div>
                Speak.<span className="text-[#2D8CFF]"> Learn</span>. Thrive
              </div>
              <div>Bridging the gap with</div>
              <div>every word</div>
            </div>
            <div className="lg:hidden flex justify-center mt-10">
              <img src={Mic} />
            </div>
            <div className="lg:text-xl md:text-xl text-lg font-spacegroteskregular my-10 text-center lg:text-start p-1 lg:p-0 dark:text-gray-300">
              Our goal is to empower individuals with speech challenges. Unlock
              your potential through personalized speech training.
            </div>
          </div>

          <div className="flex flex-col lg:flex-row sm:flex-row lg:justify-start gap-8 sm:justify-center">
            <div onClick={getstarted} className="flex justify-center">
              <button className="border rounded-md font-spacegroteskmedium flex items-center justify-center px-12 py-4 bg-[#89D85D] text-black hover:bg-opacity-70 border-black">
                <p>Get Started</p>
              </button>
            </div>
            <div className="flex justify-center">
              <button onClick={scrollToSection} className="border flex font-spacegroteskmedium items-center justify-center rounded-md px-7 py-4 border-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
                <p>Browse Features</p>
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex justify-center">
          <img src={Mic} />
        </div>
      </div>

      <div ref={mySectionRef}>
        <div className="flex items-center justify-center lg:block">
          <div className="border-y-4 lg:mt-36 md:mt-32 sm:mt-14 mt-16 font-spacegrotesksemibold border-black dark:border-white font-medium lg:text-4xl md:text-3xl sm:text-2xl text-2xl w-fit lg:ml-20 text-center dark:text-white">
            Features
          </div>
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-center gap-8 p-10">
            <div className="bg-[#2D8CFF] rounded-3xl p-6 shadow-2xl lg:h-64 lg:w-96 md:h-64 md:w-96 sm:w-96 max-w-96">
              <div className="flex items-center justify-center lg:items-start lg:justify-start md:items-start md:justify-start">
                <img
                  src={Engaging}
                  alt="arrows"
                  className="lg:h-24 md:h-24 h-14"
                />
              </div>
              <div className="font-spacegrotesksemibold lg:text-2xl md:text-2xl text-lg text-center lg:text-start md:text-start text-white mb-2">
                Engaging Interfacing
              </div>
              <div className="text-white font-spacegrotesklight text-center lg:text-start md:text-start">
                Interactive sessions for an immersive learning experience.
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl lg:h-64 lg:w-96 md:h-64 md:w-96 max-w-96">
              <div className="flex items-center justify-center lg:items-start lg:justify-start md:items-start md:justify-start">
                <img
                  src={Progress}
                  alt=""
                  className="mb-4 lg:h-20 md:h-20 h-14"
                />
              </div>
              <div className="font-spacegrotesksemibold mb-2 lg:text-2xl md:text-2xl text-lg text-center lg:text-start md:text-start dark:text-white">
                Progress Tracking
              </div>
              <div className="font-spacegrotesklight text-center lg:text-start md:text-start dark:text-gray-300">
                Track success, analyze and celebrate milestone.
              </div>
            </div>

            <div className="bg-[#2D8CFF] rounded-3xl p-6 shadow-2xl lg:h-64 lg:w-96 md:h-64 md:w-96 max-w-96">
              <div className="flex items-center justify-center lg:items-start lg:justify-start md:items-start md:justify-start">
                <img src={Phonic} alt="" className="lg:h-24 md:h-24 h-14" />
              </div>
              <div className="font-spacegrotesksemibold text-white mb-2 lg:text-2xl md:text-2xl text-lg text-center lg:text-start md:text-start">
                Holistic Phonics Training
              </div>
              <div className="font-spacegrotesklight text-center lg:text-start md:text-start text-white">
                The software covers the sounds of Hindi in isolation and within
                different words across all word positions.
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl lg:h-64 lg:w-96 md:h-64 md:w-96 max-w-96">
              <div className="flex items-center justify-center lg:items-start lg:justify-start md:items-start md:justify-start">
                <img src={Motor} alt="" className="mb-4 lg:h-20 md:h-20 h-14" />
              </div>
              <div className="font-spacegrotesksemibold mb-2 lg:text-2xl md:text-2xl text-lg text-center lg:text-start md:text-start dark:text-white">
                Motor-Based Intervention
              </div>
              <div className=" font-spacegrotesklight text-center lg:text-start md:text-start dark:text-gray-300">
                Incorporates both perceptual and production training.
              </div>
            </div>

            <div className="bg-[#2D8CFF] rounded-3xl p-6 shadow-2xl lg:h-64 lg:w-96 md:h-64 md:w-96 max-w-96">
              <div className="flex items-center justify-center lg:items-start lg:justify-start md:items-start md:justify-start">
                <img src={Visual} alt="" className="lg:h-24 md:h-24 h-14" />
              </div>
              <div className="font-spacegrotesksemibold text-white mb-2 lg:text-2xl md:text-2xl text-lg text-center lg:text-start md:text-start">
                Visual, Auditory Stimulation
              </div>
              <div className="text-white font-spacegrotesklight text-center lg:text-start md:text-start">
                Emphasize the importance of both senses in the learning process
                for individuals with speech disorders.
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl lg:h-64 lg:w-96 md:h-64 md:w-96 max-w-96">
              <div className="flex items-center justify-center lg:items-start lg:justify-start md:items-start md:justify-start">
                <img
                  src={Learning}
                  alt=""
                  className="mb-4 lg:h-20 md:h-20 h-14"
                />
              </div>
              <div className="font-spacegrotesksemibold mb-2 lg:text-2xl md:text-2xl text-lg text-center lg:text-start md:text-start dark:text-white">
                Multimodal Learning
              </div>
              <div className="font-spacegrotesklight text-center lg:text-start md:text-start dark:text-gray-300">
                Multimodal approach with visual & cues and 3-Dimensional
                animations for effective learning.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-center lg:block">
          <div className="border-y-4 p-1 lg:mt-36 md:mt-32 sm:mt-14 mt-16 font-spacegrotesksemibold border-black dark:border-white font-medium lg:text-4xl md:text-3xl sm:text-2xl text-2xl w-fit lg:ml-20 text-center dark:text-white">
            Strengths
          </div>
        </div>

        <div>
          <div className="grid lg:grid-cols-2 grid-cols-1">
            <div className="lg:ml-20 flex flex-col gap-8 items-center justify-center">
              <div className="lg:hidden flex justify-center items-center mt-10">
                <img
                  src={RealTIme}
                  alt=""
                  className="h-[200px] md:h-[300px] sm:h-[300px]"
                />
              </div>
              <div className="lg:text-4xl md:text-3xl text-xl p-1 lg:p-0 lg:text-start text-center font-spacegrotesksemibold dark:text-white">
                Real-Time Speech Detection and Weekly Test Analysis
              </div>
              <div className="font-spacegroteskregular lg:text-xl md:text-xl text-sm lg:text-start text-center p-4 lg:p-0 dark:text-gray-300">
                Unlock the potential of your voice through cutting-edge
                technology. Our platform not only hears your words but guides
                you towards eloquence with precision.
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <img src={RealTIme} alt="" className="h-[400px]" />
            </div>
          </div>

          <div className="grid lg:grid-cols-2">
            <div className="flex justify-center mt-10 lg:mt-0 md:mt-0">
              <img
                src={Dimensional}
                alt=""
                className="lg:h-[400px] md:h-[400px] h-[200px]"
              />
            </div>
            <div className="lg:ml-20 ml-0 flex flex-col gap-8 items-center justify-center lg:mt-0 md:mt-0 mt-10">
              <div className="lg:text-4xl md:text-3xl text-xl p-1 lg:p-0 lg:text-start text-center font-spacegrotesksemibold dark:text-white">
                Real-Time Speech Detection and Weekly Test Analysis
              </div>
              <div className="font-spacegroteskregular lg:text-xl md:text-xl text-sm lg:text-start text-center p-4 lg:p-0 dark:text-gray-300">
                Unlock the potential of your voice through cutting-edge
                technology. Our platform not only hears your words but guides
                you towards eloquence with precision.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="bg-[#F3F3F3] dark:bg-gray-800 lg:my-32 md:my-32 my-10 mx-4 md:mx-32 rounded-3xl">
          <div className="grid lg:grid-cols-2">
            <div className="text-center p-10 flex flex-col lg:items-start items-center justify-center gap-6">
              <div className="lg:text-4xl md:text-3xl text-2xl font-spacegroteskmedium dark:text-white">
                Let's Make things happen!
              </div>
              <div className="font-spacegroteskregular lg:text-lg md:text-lg text-sm lg:text-start text-center dark:text-gray-300">
                To get started and gain some insights and knowledge about speech
                disorders, how to cure them and related stuff go to the articles
                section.
              </div>
              <div className="flex justify-center items-center w-full lg:justify-start">
                <button className="p-4 bg-[#89D85D] rounded-md font-spacegroteskmedium hover:bg-opacity-90">
                  Read Articles →
                </button>
              </div>
            </div>
            <div className="flex justify-center lg:p-4 order-1 ">
              <img
                src={Illustration}
                alt=""
                className="lg:w-[300px] lg:h-[320px] md:w-[300px] md:h-[320px] w-[200px] h-[220px]"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-center lg:block">
          <div className="border-y-4 p-1 lg:mt-36 md:mt-32 sm:mt-14 mt-16 font-spacegrotesksemibold border-black dark:border-white font-medium lg:text-4xl md:text-3xl sm:text-2xl text-2xl w-fit lg:ml-20 text-center dark:text-white">
            Contact Us
          </div>
        </div>

        <div>
          <div className="grid lg:grid-cols-2 lg:mt-12 md:mt-12">
            <div className="flex justify-center lg:mt-0 md:mt-0 mt-10">
              <img src={Contact} alt="" className="lg:h-4/5" />
            </div>

            <div>
              <div className="lg:p-8 md:p-8 p-2">
                <div className="flex items-center justify-center">
                  <div className="font-spacegroteskmedium lg:text-4xl md:text-3xl hidden lg:block dark:text-white">
                    Connect With Us
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col lg:flex-row md:flex-row lg:justify-between md:justify-between">
                    <input
                      className="px-4 py-3 lg:w-full md:w-full outline-none font-spacegrotesksemibold m-3 rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040] dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      name="firstName"
                      placeholder="First Name"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />

                    <input
                      className="px-4 py-3 lg:w-full md:w-full outline-none m-3 font-spacegrotesksemibold rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040] dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      name="lastName"
                      placeholder="Last Name"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <input
                      className="px-4 py-3 outline-none m-3 font-spacegrotesksemibold rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040] dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      name="email"
                      placeholder="Email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      className="px-4 py-3 outline-none m-3 font-spacegrotesksemibold rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040] dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />

                    <input
                      className="px-4 py-3 outline-none m-3  font-spacegrotesksemibold rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040] dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      name="message"
                      placeholder="Message"
                      type="text"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                    <div className="flex justify-items-center">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#89D85D] border-[#89D85D] w-full px-4 py-3 m-3 font-spacegrotesksemibold rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Sending...' : 'Send the message →'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode="signup"
      />
    </div>
  );
}
