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
    statusColor: 'text-neon',
    runtime: '56 ms',
    memory: '42.1 MB',
    language: 'Python3',
    submitted: '2 minutes ago'
  },
  {
    status: 'Wrong Answer',
    statusColor: 'text-danger',
    runtime: '62 ms',
    memory: '41.8 MB',
    language: 'JavaScript',
    submitted: '5 minutes ago'
  },
  {
    status: 'Time Limit Exceeded',
    statusColor: 'text-warn',
    runtime: '---',
    memory: '43.2 MB',
    language: 'Java',
    submitted: '10 minutes ago'
  },
  {
    status: 'Accepted',
    statusColor: 'text-neon',
    runtime: '48 ms',
    memory: '40.9 MB',
    language: 'C++',
    submitted: '15 minutes ago'
  },
];

const SubmissionsTable = () => {
  return (
    <div className="max-w-none">
      <div className="overflow-x-auto rounded-md border border-htb-border">
        <table className="min-w-full">
          <thead className="bg-htb-bg/40 border-b border-htb-border">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest">Status</th>
              <th className="px-4 py-3 text-left text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest">Runtime</th>
              <th className="px-4 py-3 text-left text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest">Memory</th>
              <th className="px-4 py-3 text-left text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest">Language</th>
              <th className="px-4 py-3 text-left text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {DUMMY_SUBMISSIONS.map((submission, index) => (
              <tr key={index} className="border-t border-htb-border hover:bg-neon/5 cursor-pointer transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`${submission.statusColor} font-mono text-xs uppercase tracking-wider font-semibold`}>
                    {submission.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-htb-muted font-mono tabular-nums">
                  {submission.runtime}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-htb-muted font-mono tabular-nums">
                  {submission.memory}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-htb-muted font-mono">
                  {submission.language}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-htb-text-dim font-mono">
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
