import { useEffect, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('/jobs/');
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-6">
        <h2 className="text-xl font-bold mb-4">My Jobs</h2>
        <div className="grid gap-4">
          {jobs.length === 0 ? (
            <p className="text-gray-500">No jobs found.</p>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="border p-4 rounded shadow bg-white">
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
                <p>Status: <span className="italic">{job.status}</span></p>
                <p className="text-sm text-gray-400">Added: {new Date(job.created_at).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
