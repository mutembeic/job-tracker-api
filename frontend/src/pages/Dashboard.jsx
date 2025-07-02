// import { useEffect, useState } from 'react';
// import axios from '../api/axios';
// import Navbar from '../components/Navbar';
// import Pagination from '../components/Pagination';
// import { toast } from 'react-toastify';

// export default function Dashboard() {
//   // State management for jobs and UI
//   const [jobs, setJobs] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [newJob, setNewJob] = useState({ title: '', company: '', location: '' });
//   const [editJob, setEditJob] = useState(null);
//   const [search, setSearch] = useState('');
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const jobsPerPage = 5;

//   // Fetch jobs on component mount
//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   // API call to fetch all jobs
//   const fetchJobs = async () => {
//     try {
//       const res = await axios.get('/jobs/');
//       setJobs(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Handle job deletion with confirmation
//   const handleDelete = async (jobId) => {
//     if (!confirm('Delete this job?')) return;
    
//     try {
//       await axios.delete(`/jobs/${jobId}`);
//       toast.success('Job deleted!');
//       fetchJobs(); // Refresh the jobs list
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to delete');
//     }
//   };

//   // Handle new job creation
//   const handleCreate = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('/jobs/', { ...newJob });
//       toast.success('Job created!');
//       setShowForm(false);
//       setNewJob({ title: '', company: '', location: '' }); // Reset form
//       fetchJobs(); // Refresh the jobs list
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to create job');
//     }
//   };

//   // Calculate dashboard statistics
//   const totalJobs = jobs.length;
//   const activeJobs = jobs.filter((j) => j.is_active).length;
//   const deletedJobs = jobs.filter((j) => j.is_deleted).length;
//   // Add more if your model has statuses like 'applied', 'interview' etc.

//   // Filter jobs based on search input
//   const filteredJobs = jobs.filter((job) =>
//     job.title.toLowerCase().includes(search.toLowerCase()) ||
//     job.company.toLowerCase().includes(search.toLowerCase())
//   );

//   // Reset pagination to page 1 when search changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search]);

//   // Calculate pagination - get jobs for current page
//   const startIndex = (currentPage - 1) * jobsPerPage;
//   const paginatedJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

//   return (
//     <div>
//       <Navbar />
//       <div className="max-w-4xl mx-auto mt-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">My Jobs</h2>
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-blue-500 text-white px-3 py-1 rounded"
//           >
//             + New Job
//           </button>
//         </div>

//         <input
//           type="text"
//           placeholder="Search jobs..."
//           className="border p-2 mb-4 w-full"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         {showForm && (
//           <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-4">
//             <input
//               type="text"
//               placeholder="Job Title"
//               className="border p-2 mb-2 w-full"
//               value={newJob.title}
//               onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
//               required
//             />
//             <input
//               type="text"
//               placeholder="Company"
//               className="border p-2 mb-2 w-full"
//               value={newJob.company}
//               onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
//               required
//             />
//             <input
//               type="text"
//               placeholder="Location"
//               className="border p-2 mb-2 w-full"
//               value={newJob.location}
//               onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
//             />
//             <div className="flex space-x-2">
//               <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">
//                 Create
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setShowForm(false)}
//                 className="bg-gray-500 text-white px-3 py-1 rounded"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         )}

//         {/* Edit Job Form - Shows when editJob is not null */}
//         {editJob && (
//           <form
//             onSubmit={async (e) => {
//               e.preventDefault();
//               try {
//                 await axios.put(`/jobs/${editJob.id}`, {
//                   title: editJob.title,
//                   company: editJob.company,
//                   location: editJob.location
//                 });
//                 toast.success('Job updated!');
//                 setEditJob(null);
//                 fetchJobs(); // Refresh jobs list
//               } catch (err) {
//                 console.error(err);
//                 toast.error('Failed to update');
//               }
//             }}
//             className="bg-white p-4 rounded shadow mb-4"
//           >
//             <h3 className="font-bold mb-2">Edit Job</h3>
//             <input
//               type="text"
//               className="border p-2 mb-2 w-full"
//               value={editJob.title}
//               onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
//             />
//             <input
//               type="text"
//               className="border p-2 mb-2 w-full"
//               value={editJob.company}
//               onChange={(e) => setEditJob({ ...editJob, company: e.target.value })}
//             />
//             <input
//               type="text"
//               className="border p-2 mb-2 w-full"
//               value={editJob.location}
//               onChange={(e) => setEditJob({ ...editJob, location: e.target.value })}
//             />
//             <div className="flex space-x-2">
//               <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">
//                 Update
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setEditJob(null)}
//                 className="bg-gray-500 text-white px-3 py-1 rounded"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         )}

//         {/* Jobs List */}
//         <div className="grid gap-4">
//           {filteredJobs.length === 0 ? (
//             <p className="text-gray-500">No jobs found.</p>
//           ) : (
//             <>
//               {/* Job Cards */}
//               {paginatedJobs.map((job) => (
//                 <div 
//                   key={job.id} 
//                   className="border p-4 rounded shadow bg-white relative hover:shadow-md transition duration-200"
//                 >
//                   <h3 className="font-semibold">{job.title}</h3>
                  
//                   {/* Job Status Badge */}
//                   <span
//                     className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${
//                       job.status === 'applied'
//                         ? 'bg-blue-100 text-blue-700'
//                         : job.status === 'interview'
//                         ? 'bg-yellow-100 text-yellow-700'
//                         : job.status === 'offer'
//                         ? 'bg-green-100 text-green-700'
//                         : 'bg-gray-100 text-gray-700'
//                     }`}
//                   >
//                     {job.status || 'Not set'}
//                   </span>
                  
//                   <p className="text-gray-600 mt-2">{job.company}</p>
//                   <p>Location: {job.location}</p>
//                   <p className="text-sm text-gray-400">
//                     Added: {new Date(job.created_at).toLocaleDateString()}
//                   </p>
                  
//                   {/* Action Buttons */}
//                   <button
//                     onClick={() => handleDelete(job.id)}
//                     className="absolute top-2 right-2 text-red-500 hover:text-red-700"
//                   >
//                     🗑
//                   </button>
//                   <button
//                     onClick={() => setEditJob(job)}
//                     className="absolute top-2 right-10 text-blue-500 hover:text-blue-700"
//                   >
//                     ✏️
//                   </button>
//                 </div>
//               ))}
              
//               {/* Pagination Component */}
//               <div className="flex justify-center space-x-2 mt-4">
//                 <button
//                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
//                 >
//                   Prev
//                 </button>
//                 <span className="px-2">Page {currentPage}</span>
//                 <button
//                   onClick={() =>
//                     setCurrentPage((prev) =>
//                       prev < Math.ceil(filteredJobs.length / jobsPerPage) ? prev + 1 : prev
//                     )
//                   }
//                   disabled={currentPage >= Math.ceil(filteredJobs.length / jobsPerPage)}
//                   className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
//                 >
//                   Next
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

export default function Dashboard() {
  // State management for jobs and UI
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', status: 'applied' });
  const [editJob, setEditJob] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  // Job status options
  const statusOptions = [
    { value: 'applied', label: 'Applied', color: 'bg-blue-500', lightColor: 'bg-blue-50 border-blue-200 text-blue-700' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-500', lightColor: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
    { value: 'accepted', label: 'Accepted', color: 'bg-green-500', lightColor: 'bg-green-50 border-green-200 text-green-700' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-500', lightColor: 'bg-red-50 border-red-200 text-red-700' }
  ];

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // API call to fetch all jobs
  const fetchJobs = async () => {
    try {
      const res = await axios.get('/jobs/');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch jobs');
    }
  };

  // Handle job deletion with confirmation
  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await axios.delete(`/jobs/${jobId}`);
      toast.success('Job deleted successfully!');
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete job');
    }
  };

  // Handle new job creation
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/jobs/', { ...newJob });
      toast.success('Job created successfully!');
      setShowForm(false);
      setNewJob({ title: '', company: '', location: '', status: 'applied' });
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create job');
    }
  };

  // Handle job status update
  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      const jobToUpdate = jobs.find(job => job.id === jobId);
      await axios.put(`/jobs/${jobId}`, {
        ...jobToUpdate,
        status: newStatus
      });
      toast.success('Status updated successfully!');
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  // Calculate dashboard statistics
  const totalJobs = jobs.length;
  const appliedJobs = jobs.filter(j => j.status === 'applied').length;
  const pendingJobs = jobs.filter(j => j.status === 'pending').length;
  const acceptedJobs = jobs.filter(j => j.status === 'accepted').length;
  const rejectedJobs = jobs.filter(j => j.status === 'rejected').length;

  // Filter jobs based on search input and status filter
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
                         job.company.toLowerCase().includes(search.toLowerCase()) ||
                         job.location.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Reset pagination to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Calculate pagination - get jobs for current page
  const startIndex = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Get status styling
  const getStatusStyle = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.lightColor : 'bg-gray-50 border-gray-200 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Job Application Dashboard
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Track, manage, and succeed in your job search journey
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">{totalJobs}</p>
                </div>
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Applied</p>
                  <p className="text-3xl font-bold text-blue-600">{appliedJobs}</p>
                </div>
                <div className="bg-blue-500 rounded-full p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingJobs}</p>
                </div>
                <div className="bg-yellow-500 rounded-full p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Accepted</p>
                  <p className="text-3xl font-bold text-green-600">{acceptedJobs}</p>
                </div>
                <div className="bg-green-500 rounded-full p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{rejectedJobs}</p>
                </div>
                <div className="bg-red-500 rounded-full p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="flex-1 w-full lg:w-auto">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search jobs by title, company, or location..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="all">All Status</option>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  + Add New Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* New Job Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Job Application</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Developer"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Google"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newJob.status}
                    onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                  >
                    Create Job
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Job Form */}
        {editJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Job Application</h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await axios.put(`/jobs/${editJob.id}`, {
                      title: editJob.title,
                      company: editJob.company,
                      location: editJob.location,
                      status: editJob.status
                    });
                    toast.success('Job updated successfully!');
                    setEditJob(null);
                    fetchJobs();
                  } catch (err) {
                    console.error(err);
                    toast.error('Failed to update job');
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    value={editJob.title}
                    onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    value={editJob.company}
                    onChange={(e) => setEditJob({ ...editJob, company: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    value={editJob.location}
                    onChange={(e) => setEditJob({ ...editJob, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editJob.status}
                    onChange={(e) => setEditJob({ ...editJob, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                  >
                    Update Job
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditJob(null)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-xl text-gray-500">No jobs found</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            paginatedJobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-200">
                        {job.title}
                      </h3>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(job.status)}`}>
                        {job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : 'Not set'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditJob(job)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-medium">{job.company}</span>
                    </div>
                    
                    {job.location && (
                      <div className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{job.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-gray-500 text-sm">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Added {new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Quick Status Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Quick Actions:</p>
                    <div className="flex gap-2 flex-wrap">
                      {statusOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleStatusUpdate(job.id, option.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                            job.status === option.value 
                              ? `${option.lightColor} ring-2 ring-offset-1` 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
               <div className="flex justify-center space-x-2 mt-4">
                 <button
                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                   disabled={currentPage === 1}
                   className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                 >
                   Prev
                 </button>
                <span className="px-2">Page {currentPage}</span>
                 <button
                   onClick={() =>
                     setCurrentPage((prev) =>
                       prev < Math.ceil(filteredJobs.length / jobsPerPage) ? prev + 1 : prev
                     )
                   }
                   disabled={currentPage >= Math.ceil(filteredJobs.length / jobsPerPage)}
                   className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                 >
                   Next
                 </button>
               </div>
            </div>
        </div>
      );
    }
