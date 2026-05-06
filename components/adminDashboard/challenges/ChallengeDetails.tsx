import { Download, File } from "lucide-react";

interface FileObject {
  name: string;
  content: string;
  type: string;
  size: number;
  _id: string;
}

interface Challenge {
  _id: string;
  title: string;
  difficulty: string;
  topic: string[];
  keywords: string[];
  problemStatement: string;
  constraints: string[];
  files: FileObject[];
  status: string;
  acceptanceRate: number;
  submissions: number;
  isFeatured: boolean;
  companies: string[];
  paymentMode?: string;
  planId?: {
    _id: string;
    name: string;
    price: number;
    priceMode: string;
  } | null;
  createdAt: string;
  __v: number;
}

interface ChallengeDetailsProps {
  title: string;
  difficulty: string;
  stats: {
    Accepted: string;
    Submissions: string;
    acceptanceRate: string;
  };
  challenge: Challenge;
}

const ChallengeDetails = ({ title, difficulty, stats, challenge }: ChallengeDetailsProps) => {
  // console.log("challenge", challenge);
  return (
    <div className="max-w-none">
      {/* Challenge Title and Difficulty */}
      <div className="flex justify-between items-center mb-5 gap-3 flex-wrap">
        <h2 className="heading-display text-2xl text-htb-text">{title}</h2>
        <span className={`inline-flex items-center px-2.5 py-1 rounded font-mono text-[11px] font-semibold uppercase tracking-widest border ${
          difficulty === 'easy' ? 'border-neon/30 bg-neon/10 text-neon' :
          difficulty === 'medium' ? 'border-warn/30 bg-warn/10 text-warn' :
          'border-danger/30 bg-danger/10 text-danger'
        }`}>
          {difficulty}
        </span>
      </div>

      {/* Payment Information */}
      <div className="mb-6 p-4 rounded-md border border-htb-border bg-htb-bg/40">
        <span className="terminal-eyebrow">payment.info</span>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-htb-muted">Mode:</span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded font-mono text-[10px] font-semibold uppercase tracking-widest border ${
              challenge.paymentMode === "free"
                ? "border-neon/30 bg-neon/10 text-neon"
                : "border-purple-500/30 bg-purple-500/10 text-purple-300"
            }`}>
              {challenge.paymentMode?.toUpperCase() || "FREE"}
            </span>
          </div>
          {challenge.paymentMode === "paid" && challenge.planId && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono uppercase tracking-widest text-htb-muted">Plan:</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded font-mono text-[10px] font-semibold uppercase tracking-widest border border-purple-500/30 bg-purple-500/10 text-purple-300">
                {challenge.planId.name}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded font-mono text-[10px] font-semibold uppercase tracking-widest border border-warn/30 bg-warn/10 text-warn">
                ₹{challenge.planId.price}/{challenge.planId.priceMode}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      {/* <div className="flex gap-8 mb-6 text-sm text-gray-600 border-b pb-4">
        <div className="flex items-center gap-2">
          <span>✓ Accepted</span>
          <span className="font-medium">{stats.Accepted}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>✓ Submissions</span>
          <span className="font-medium">{stats.Submissions}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Acceptance Rate:</span>
          <span className="font-medium">{stats.acceptanceRate}</span>
        </div>
      </div> */}

      {/* Topics */}
      {challenge.topic && challenge.topic.length > 0 && (
        <div className="mb-4">
          <h3 className="text-[11px] font-mono uppercase tracking-widest font-semibold text-htb-muted mb-2">Topics</h3>
          <div className="flex flex-wrap gap-2">
            {challenge.topic.map((topic, index) => (
              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded border border-sky-400/30 bg-sky-400/10 text-sky-300 font-mono text-[11px] uppercase tracking-wider">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Keywords */}
      {challenge.keywords && challenge.keywords.length > 0 && (
        <div className="mb-4">
          <h3 className="text-[11px] font-mono uppercase tracking-widest font-semibold text-htb-muted mb-2">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {challenge.keywords.map((keyword, index) => (
              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded border border-htb-border bg-htb-panel-2 text-htb-muted font-mono text-[11px] uppercase tracking-wider">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Companies */}
      {challenge.companies && challenge.companies.length > 0 && (
        <div className="mb-4">
          <h3 className="text-[11px] font-mono uppercase tracking-widest font-semibold text-htb-muted mb-2">Companies</h3>
          <div className="flex flex-wrap gap-2">
            {challenge.companies.map((company, index) => (
              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 text-purple-300 font-mono text-[11px] uppercase tracking-wider">
                {company}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Problem Statement */}
      <div className="mb-4 mt-6">
        <h3 className="text-[11px] font-mono uppercase tracking-widest font-semibold text-htb-muted mb-2">Problem Statement</h3>
        <div
          className="text-htb-muted max-w-none [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-htb-text [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:font-mono [&_h2]:uppercase [&_h2]:tracking-wider [&_p]:mb-2 [&_p]:leading-relaxed [&_pre]:bg-htb-bg-deep [&_pre]:border [&_pre]:border-htb-border [&_pre]:p-3 [&_pre]:rounded-md [&_pre]:text-neon [&_pre]:overflow-x-auto [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:marker:text-neon [&_code]:bg-neon/10 [&_code]:text-neon [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_strong]:text-htb-text"
          dangerouslySetInnerHTML={{ __html: challenge.problemStatement }}
        />
      </div>

      {/* Files Section */}
      {challenge.files && challenge.files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-[11px] font-mono uppercase tracking-widest font-semibold text-htb-muted mb-3">Required Files & Resources</h3>
          <div className="grid gap-2">
            {challenge.files.map((file, index) => (
              <div key={file._id || index} className="flex items-center justify-between rounded-md border border-htb-border bg-htb-bg/40 p-3 hover:border-neon/30 transition-colors gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 w-9 h-9 rounded-md border border-neon/30 bg-neon/10 flex items-center justify-center">
                    <File className="w-4 h-4 text-neon" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-htb-text truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-htb-text-dim">
                        {file.type || 'Unknown type'}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-htb-text-dim tabular-nums">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-neon/30 bg-neon/10 text-neon hover:bg-neon/15 hover:border-neon/40 font-mono text-[11px] uppercase tracking-widest font-semibold transition-colors"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = `data:${file.type};base64,${file.content}`;
                    link.download = file.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download className="w-3 h-3" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeDetails;