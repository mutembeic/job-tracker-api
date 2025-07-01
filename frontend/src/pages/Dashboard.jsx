import { useEffect, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';


export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '' });
  const [editJob, setEditJob] = useState(null); // null or job object
  const [search, setSearch] = useState('');



  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/jobs/');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Delete this job?')) return;
    toast.success('Job deleted!');
    try {
      await axios.delete(`/jobs/${jobId}`);
      fetchJobs(); // refresh list
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };


  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/jobs/', { ...newJob });
      toast.success('Job created!');
      setShowForm(false);
      setNewJob({ title: '', company: '', location: '' });
      fetchJobs(); // refresh list
    } catch (err) {toast.success('Job updated!');
      console.error(err);
      toast.error('Failed to ...')
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Jobs</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            + New Job
          </button>
        </div>

        <input
            type="text"
            placeholder="Search jobs..."
            className="border p-2 mb-4 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-4">
            <input
              type="text"
              placeholder="Job Title"
              className="border p-2 mb-2 w-full"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Company"
              className="border p-2 mb-2 w-full"
              value={newJob.company}
              onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Location"
              className="border p-2 mb-2 w-full"
              value={newJob.location}
              onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
            />
            <div className="flex space-x-2">
              <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {editJob && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await axios.put(`/jobs/${editJob.id}`, {
                  title: editJob.title,
                  company: editJob.company,
                  location: editJob.location
                });
                toast.success('Job updated!');
                setEditJob(null);
                fetchJobs();
              } catch (err) {
                console.error(err);
                toast.error('Failed to update')
              }
            }}
            className="bg-white p-4 rounded shadow mb-4"
          >
            <h3 className="font-bold mb-2">Edit Job</h3>
            <input
              type="text"
              className="border p-2 mb-2 w-full"
              value={editJob.title}
              onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
            />
            <input
              type="text"
              className="border p-2 mb-2 w-full"
              value={editJob.company}
              onChange={(e) => setEditJob({ ...editJob, company: e.target.value })}
            />
            <input
              type="text"
              className="border p-2 mb-2 w-full"
              value={editJob.location}
              onChange={(e) => setEditJob({ ...editJob, location: e.target.value })}
            />
            <div className="flex space-x-2">
              <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">
                Update
              </button>
              <button
                type="button"
                onClick={() => setEditJob(null)}
                className="bg-gray-500 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}


        <div className="grid gap-4">
          {jobs.length === 0 ? (
            <p className="text-gray-500">No jobs found.</p>
          ) : (
            jobs
            .filter((job) =>
              job.title.toLowerCase().includes(search.toLowerCase()) ||
              job.company.toLowerCase().includes(search.toLowerCase())
            )
            .map((job) => (
              <div key={job.id} className="border p-4 rounded shadow bg-white relative">
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
                <p>Location: {job.location}</p>
                <p className="text-sm text-gray-400">
                  Added: {new Date(job.created_at).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  🗑
                </button>
                <button
                  onClick={() => setEditJob(job)}
                  className="absolute top-2 right-10 text-blue-500 hover:text-blue-700"
                >
                  ✏️
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

