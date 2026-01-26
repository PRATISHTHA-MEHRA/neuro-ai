import { useEffect, useState } from "react";
import RecordButton from "../Components/RecordButton";
import Mic from "../Components/Mic";
import NavButton from "../Components/NavButton";
import RecordingLoader from "../Components/RecordingLoader";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:5000";

const Overalltest = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [letter, setLetter] = useState("A");
  const [attempts, setAttempts] = useState([]);
  const [word, setWord] = useState("Apple");
  const [pronounciation, setPronounciation] = useState("/ˈæp.əl/");
  const [averageAccuracy, setAverageAccuracy] = useState(0);
  const [image, setImage] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userStats, setUserStats] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Get user name for personalization
  useEffect(() => {
    if (isAuthenticated && user) {
      setUserName(user.name || "User");
      fetchUserStatistics();
    }
  }, [isAuthenticated, user]);

  // Fetch user statistics for personalization
  const fetchUserStatistics = async () => {
    if (!isAuthenticated) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/api/test/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    async function letterCall() {
      setLoading(true);
      setAttempts([]);
      setAverageAccuracy(0);
      
      try {
        // Fetch word from backend
        const wordResponse = await fetch(`${baseUrl}/api/test/word/${letter}`);
        const wordData = await wordResponse.json();
        
        if (wordData.success) {
          setImage(wordData.data.image_link || "");
          setWord(wordData.data.word1 || "");
          setPronounciation(wordData.data.pronunciation || "");
        }
        
        // If user is authenticated, fetch their progress for this letter
        if (isAuthenticated) {
          const token = localStorage.getItem('token');
          const progressResponse = await fetch(`${baseUrl}/api/test/progress/${letter}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            if (progressData.success && progressData.data.attempts) {
              setAttempts(progressData.data.attempts.map(a => a.accuracy));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching letter data:', error);
        showNotification('Failed to load test data', 'error');
      } finally {
        setLoading(false);
      }
    }

    letterCall();
  }, [letter, isAuthenticated]);

  useEffect(() => {
    let average = 0;
    for (let i = 0; i < attempts.length; i++) {
      average += attempts[i];
    }

    if (average == 0) {
      setAverageAccuracy(0);
    } else {
      setAverageAccuracy((average / attempts.length).toFixed(2));
    }
  }, [attempts]);

  const nextLetter = () => {
    setLetter((prevLetter) => {
      if (prevLetter === "A") return "B";
      if (prevLetter === "B") return "Z";
      return "A";
    });
  };

  const previousLetter = () => {
    setLetter((prevLetter) => {
      if (prevLetter === "A") return "Z";
      if (prevLetter === "Z") return "B";
      return "A";
    });
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const recordButtonHandler = async () => {
    setRecording(true);
    try {
      const url = baseUrl + "/api/test/record";
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        const accuracy = data.data.percentage || 0;
        
        // Add to local state
        setAttempts((prev) => {
          return [...prev, accuracy];
        });
        
        // Save to database if user is authenticated
        if (isAuthenticated) {
          const token = localStorage.getItem('token');
          await fetch(`${baseUrl}/api/test/attempt`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              letter,
              word,
              pronunciation: pronounciation,
              accuracy
            })
          });
          
          // Refresh statistics
          fetchUserStatistics();
          showNotification(`Attempt ${attempts.length + 1} saved! Accuracy: ${accuracy}%`, 'success');
        } else {
          showNotification(`Accuracy: ${accuracy}%`, 'success');
        }
      }
    } catch (error) {
      console.error('Error recording:', error);
      showNotification('Recording failed. Please try again.', 'error');
    } finally {
      setTimeout(() => {
        setRecording(false);
      }, 1000);
    }
  };

  const stopRecordHandler = () => {
    setRecording(false);
  };

  const resetAttemptsHandler = async () => {
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${baseUrl}/api/test/reset/${letter}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        showNotification('Test reset successfully!', 'success');
      } catch (error) {
        console.error('Error resetting test:', error);
      }
    }
    setAttempts([]);
    setAverageAccuracy(0);
  };

  return (
    <div className="md:px-[9rem] pb-[4rem] font-spacegroteskmedium dark:bg-gray-900 dark:text-white min-h-screen">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-spacegroteskmedium animate-slide-in`}>
          {notification.message}
        </div>
      )}
      
      {/* Personalized Header */}
      {isAuthenticated && userName && (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg text-white">
          <h2 className="text-2xl font-spacegrotesksemibold mb-2">
            Hello, {userName}! 👋
          </h2>
          <p className="font-spacegroteskregular">
            Let's practice your speech skills together!
          </p>
          {userStats && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="text-sm opacity-90">Completed Tests</div>
                <div className="text-2xl font-bold">{userStats.completedTests}</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="text-sm opacity-90">Total Attempts</div>
                <div className="text-2xl font-bold">{userStats.totalAttempts}</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="text-sm opacity-90">Avg Accuracy</div>
                <div className="text-2xl font-bold">{userStats.averageOverallAccuracy}%</div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="text-md font-semibold mb-6 dark:text-white">Letter : {letter}</div>

      <div className="flex justify-between text-md font-semibold mb-5">
        <span className="">
          Word to be spelled : {word.charAt(0).toUpperCase() + word.slice(1)}
        </span>
        <span className="me-[4rem]">
          Average Correct Percentage -{" "}
          {attempts.length != 0 ? averageAccuracy : averageAccuracy} %
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center my-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <center className="text-2xl">
            <div className="mb-1">{word}</div>
            <div className="mb-8">{pronounciation}</div>
            {image.length != 0 ? (
              <img src={image} className="h-[12rem] my-8 rounded-xl" alt={word} />
            ) : null}
            {!recording ? <Mic /> : <RecordingLoader />}
          </center>

          <div className="flex w-[75%] mx-auto justify-center mt-5 gap-4">
            {!recording ? (
              <RecordButton
                bgColor="#89D85D"
                text="Start Recording"
                onClickHandler={recordButtonHandler}
              />
            ) : (
              <RecordButton
                bgColor="#E3E2E7"
                textColor="black"
                text="Recording..."
              />
            )}
            <RecordButton
              bgColor="#D86C5D"
              text="Stop Recording"
              onClickHandler={stopRecordHandler}
            />
            <RecordButton
              bgColor="#0984E3"
              text="Reset all tries"
              onClickHandler={resetAttemptsHandler}
            />
          </div>

          <div className="my-[5rem]">
            <div className="text-[#2D8CFF] font-medium mb-2">Attempts :</div>
            {!isAuthenticated && (
              <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg text-sm">
                💡 <span className="font-semibold">Tip:</span> Sign in to save your progress and track your improvement over time!
              </div>
            )}

            <div className="flex justify-center gap-x-[4rem] mt-5">
              <div
                className="h-[7rem] w-[14rem] rounded-lg flex flex-col justify-center items-center text-white font-semibold text-md gap-y-3 text-center drop-shadow-[3px_4px_2px_rgba(0,0,0,0.7)]"
                style={
                  typeof attempts[0] != "undefined"
                    ? attempts[0] >= 50
                      ? { backgroundColor: "#89D85D" }
                      : { backgroundColor: "#D86C5D" }
                    : { backgroundColor: "#E3E2E7", color: "black" }
                }
              >
                <div>Attempt 1</div>
                {attempts[0] && <div>Accuracy {attempts[0]}%</div>}
              </div>

              <div
                className="h-[7rem] w-[14rem] rounded-lg flex flex-col justify-center items-center text-white font-semibold text-md gap-y-3 text-center drop-shadow-[3px_4px_2px_rgba(0,0,0,0.7)]"
                style={
                  typeof attempts[1] != "undefined"
                    ? attempts[1] >= 50
                      ? { backgroundColor: "#89D85D" }
                      : { backgroundColor: "#D86C5D" }
                    : { backgroundColor: "#E3E2E7", color: "black" }
                }
              >
                <div>Attempt 2</div>
                {attempts[1] && <div>Accuracy {attempts[1]}%</div>}
              </div>

              <div
                className="h-[7rem] w-[14rem] rounded-lg flex flex-col justify-center items-center text-white font-semibold text-md gap-y-3 text-center drop-shadow-[3px_4px_2px_rgba(0,0,0,0.7)]"
                style={
                  typeof attempts[2] != "undefined"
                    ? attempts[2] >= 50
                      ? { backgroundColor: "#89D85D" }
                      : { backgroundColor: "#D86C5D" }
                    : { backgroundColor: "#E3E2E7", color: "black" }
                }
              >
                <div>Attempt 3</div>
                {attempts[2] && <div>Accuracy {attempts[2]}%</div>}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-x-[4rem] mt-[7rem]">
            {letter != "A" && (
              <NavButton
                text="Previous"
                currLetter={letter}
                onClickHandler={previousLetter}
              />
            )}
            {attempts.length == 3 && letter != "Z" && (
              <NavButton
                text="Next"
                currLetter={letter}
                onClickHandler={nextLetter}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Overalltest;
