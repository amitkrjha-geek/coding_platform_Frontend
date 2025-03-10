interface Submission {
    status: string;
    statusColor: string;
    runtime: string;
    memory: string;
    language: string;
    submitted: string;
  }
  
  const DUMMY_SUBMISSIONS: Submission[] = [
    {
      status: 'Accepted',
      statusColor: 'text-green-600',
      runtime: '56 ms',
      memory: '42.1 MB',
      language: 'Python3',
      submitted: '2 minutes ago'
    },
    {
      status: 'Wrong Answer',
      statusColor: 'text-red-600',
      runtime: '62 ms',
      memory: '41.8 MB',
      language: 'JavaScript',
      submitted: '5 minutes ago'
    },
    {
      status: 'Time Limit Exceeded',
      statusColor: 'text-yellow-600',
      runtime: '---',
      memory: '43.2 MB',
      language: 'Java',
      submitted: '10 minutes ago'
    },
    {
      status: 'Accepted',
      statusColor: 'text-green-600',
      runtime: '48 ms',
      memory: '40.9 MB',
      language: 'C++',
      submitted: '15 minutes ago'
    },
  ];
  
  const SubmissionsTable = () => {
    return (
      <div className="prose max-w-none">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Runtime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {DUMMY_SUBMISSIONS.map((submission, index) => (
                <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`${submission.statusColor} font-medium`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.runtime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.memory}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.language}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.submitted}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default SubmissionsTable; 