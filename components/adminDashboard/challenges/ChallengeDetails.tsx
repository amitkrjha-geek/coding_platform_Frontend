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
    <div className="prose max-w-none">
      {/* Challenge Title and Difficulty */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <span className={`px-3 py-1 rounded-full text-sm ${
          difficulty === 'easy' ? 'bg-green-100 text-green-600' :
          difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' :
          'bg-red-100 text-red-600'
        }`}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
      </div>

      {/* Payment Information */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <h3 className="font-medium mb-3 text-gray-800">Payment Information</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Payment Mode:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              challenge.paymentMode === "free" 
                ? "bg-green-100 text-green-700" 
                : "bg-blue-100 text-blue-700"
            }`}>
              {challenge.paymentMode?.toUpperCase() || "FREE"}
            </span>
          </div>
          {challenge.paymentMode === "paid" && challenge.planId && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Plan:</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                {challenge.planId.name}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
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
          <h3 className="font-medium mb-2">Topics:</h3>
          <div className="flex flex-wrap gap-2">
            {challenge.topic.map((topic, index) => (
              <span key={index} className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Keywords */}
      {challenge.keywords && challenge.keywords.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2">Keywords:</h3>
          <div className="flex flex-wrap gap-2">
            {challenge.keywords.map((keyword, index) => (
              <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Companies */}
      {challenge.companies && challenge.companies.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2">Companies:</h3>
          <div className="flex flex-wrap gap-2">
            {challenge.companies.map((company, index) => (
              <span key={index} className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-sm">
                {company}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Problem Statement */}
      <div className="mb-4 mt-4">
        <h3 className="font-medium mb-2">Problem Statement:</h3>
        <div 
          className="text-gray-700 prose max-w-none [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mt-4 [&>h2]:mb-2 [&>p]:mb-2 [&>pre]:bg-gray-100 [&>pre]:p-3 [&>pre]:rounded [&>pre]:overflow-x-auto [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-1 [&>code]:bg-gray-100 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm"
          dangerouslySetInnerHTML={{ __html: challenge.problemStatement }}
        />
      </div>


      {/* Files Section */}
      {challenge.files && challenge.files.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-3 text-gray-800">Required Files & Resources</h3>
          <div className="grid gap-3">
            {challenge.files.map((file, index) => (
              <div key={file._id || index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <File className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500">
                        {file.type || 'Unknown type'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button 
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                    onClick={() => {
                      // Create download link
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeDetails;