import { useEffect, useState } from "react";
import JobProgressChart from "../components/JobProgressChart";
import api from "../api/axios";

const Profile = () => {
  const [chartData, setChartData] = useState([]);
  const [dailyTarget, setDailyTarget] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/profile/daily-stats");
        setChartData(res.data);

        const profileRes = await api.get("/users/me");
        setDailyTarget(profileRes.data.daily_target || 5);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Profile & Progress</h2>
      <JobProgressChart data={chartData || []} dailyTarget={dailyTarget} />
    </div>
  );
};

export default Profile;

