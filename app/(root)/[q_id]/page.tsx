'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Editor from '@monaco-editor/react'
import Split from 'react-split'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Maximize2, RotateCcw, Code2, Minimize2, Loader2, Webcam } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button'
import DescriptionTab from '@/components/home/code/DescriptionTab'
import LogsTab from '@/components/home/code/LogsTab'
import SubmissionsTab from '@/components/home/code/SubmissionsTab'
import AcceptedTab from '@/components/home/code/AcceptedTab'
import { generateCodeTemplate } from '@/lib/utils'
// import { questionsData } from '@/constants'
import { storeCode, triggerSubmission } from '@/API/codeRunner'
import toast from 'react-hot-toast'
import { getToken } from '@/config/token'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchChallenges, getCompanyStats, getTopicStats, selectChallengeById } from '@/redux/features/challengeSlice'
import { triggerRunAgent } from '../../../API/codeRunner'


type ProgrammingLanguage = {
  id: 'c' | 'cpp' | 'csharp';
  name: string;
};

type CodeTemplates = {
  [K in ProgrammingLanguage['id']]: string;
};

const languages: ProgrammingLanguage[] = [
  { id: 'c', name: 'C' },
  { id: 'cpp', name: 'C++' },
  // { id: 'csharp', name: 'C#' }
];

const defaultCode: CodeTemplates = {
  c: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    // Write your C code here\n    \n    return 0;\n}\n',
  cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    \n    return 0;\n}\n',
  csharp: 'using System;\nusing System.Collections.Generic;\n\npublic class Solution {\n    public static void Main(string[] args) {\n        // Write your C# code here\n        \n    }\n}\n'
};

type TabValue = "description" | "submissions" | "logs" | "accepted";

const QuestionPage = () => {
  const { q_id } = useParams()
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage['id']>('c')
  const token = getToken()
  const [isRunningAgent, setIsRunningAgent] = useState(false)
  const [isCompiling, setIsCompiling] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)


  const dispatch = useAppDispatch()

  const { status: challengesStatus } = useAppSelector((state) => state.challenge);

  // Normalize q_id to string
  const normalizedQId = Array.isArray(q_id) ? q_id[0] : q_id || '';
  const challenge = useAppSelector(state => selectChallengeById(state, normalizedQId));

  // Generate initial code template
  const [code, setCode] = useState(() => {
    const templates = generateCodeTemplate();
    return templates[selectedLanguage];
  });

  // console.log("code", code)

  const [activeTab, setActiveTab] = useState<TabValue>("description")
  const [isFullscreen, setIsFullscreen] = useState(false)


  // Add fullscreen change event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (challengesStatus === 'idle') {
      dispatch(fetchChallenges());
      dispatch(getCompanyStats());
      dispatch(getTopicStats());
    }
  }, [dispatch, challengesStatus]);


  // Updated fullscreen handler
  const handleFullScreen = async (element: HTMLDivElement | null) => {
    if (!element) return;

    try {
      if (!document.fullscreenElement) {
        await element.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Error attempting to enable fullscreen:", err);
    }
  };

  const handleSubmitCompile = async () => {
    console.log("Submitted code:", { code, q_id, selectedLanguage })
    if (!token) {
      toast.error("Please login to compile code")
      return
    }
    // Prevent compiling if code is unchanged from the template
    const templatesForCheck = generateCodeTemplate();
    const isTemplateCode = (code?.trim() || '') === (templatesForCheck[selectedLanguage]?.trim() || '');
    if (isTemplateCode) {
      toast.error("Please write some code before compiling");
      return;
    }
    const codeData = {
      challengeId: q_id,
      code: code,
      language: selectedLanguage
    }
    setIsCompiling(true)
    try {
      const res = await storeCode(codeData)
      console.log("res", res)

      // Store the submissionId in localStorage
      if (res?.success) {
        localStorage.setItem('submissionId', res?.submissionId)
        toast.success("Code submitted successfully")
      }else {
        toast.error(res?.error || "Error submitting code")
      }

    } catch (error: any) {
      toast.error(error || "Error submitting code")
      console.log("error", error)
    } finally {
      setIsCompiling(false)
    }
  }

  const handleSubmitCode = async () => {
    if (!token) {
      toast.error("Please login to submit challenge")
      return
    }
    const submissionId = localStorage.getItem('submissionId')
    if (!submissionId) {
      toast.error("No submission found! Please compile the code first")
      console.log("No submissionId found")
      return
    }
    if (!isRunningAgent) {
      toast.error("Please Run Agent First")
      console.log("Agent is already running")
      return
    }
    setIsSubmitting(true)
    try {
      const submissionResult = await triggerSubmission(submissionId ?? '')
      console.log("submissionResult", submissionResult)
      if (submissionId) {
        localStorage.removeItem('submissionId')
      }
      toast.success("Code submitted successfully")
    } catch (error: any) {
      toast.error(error || "Error submitting code")
      console.log("error", error)
    } finally {
      setIsSubmitting(false)
    }
  }


  const handleRunAgent = async () => {
    if (!token) {
      toast.error("Please login to run agent")
      return
    }
    const submissionId = localStorage.getItem('submissionId')
    if (!submissionId) {
      toast.error("No submission found! Please compile the code first")
      console.log("No submissionId found")
      return
    }
    setIsRunning(true)
    try {
      const submissionResult = await triggerRunAgent(submissionId ?? '')
      if (submissionResult.success) {
        setIsRunningAgent(true)
        // Capture sessionId for log streaming and start socket immediately
        if (submissionResult.sessionId) {
          console.log("📱 Session ID received, starting socket connection:", submissionResult.sessionId)
          setSessionId(submissionResult.sessionId)
          // Switch to logs tab to show real-time logs
          setActiveTab("logs")
        }
      }
      console.log("submissionResult", submissionResult)
      toast.success("Code run agent successfully")
    } catch (error: any) {
      toast.error(error || "Error running agent")
      console.log("error", error)
      setIsRunningAgent(false)
    } finally {
      setIsRunning(false)
    }
  }

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage as ProgrammingLanguage['id']);
    const templates = generateCodeTemplate();
    setCode(templates[newLanguage as ProgrammingLanguage['id']]);
  }


  const handleReset = () => {
    setCode(defaultCode[selectedLanguage]);
  };

  const handleFormat = () => {
    const formatCode = (code: string): string => {
      let indentLevel = 0;
      const lines = code.split('\n');
      const formattedLines = lines.map(line => {
        const trimmedLine = line.trim();

        // Decrease indent for closing braces
        if (trimmedLine.startsWith('}')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        // Add proper indentation
        const formattedLine = '    '.repeat(indentLevel) + trimmedLine;

        // Increase indent after opening braces
        if (trimmedLine.endsWith('{')) {
          indentLevel++;
        }

        return formattedLine;
      });

      return formattedLines.join('\n');
    };

    setCode(formatCode(code));
  };
  return (
    <div className="h-[calc(100vh-56px)] max-w-8xl mx-auto px-4 md:px-7 py-2">
      {/* Mobile Layout */}
      <div className="flex lg:hidden flex-col gap-4 h-full">
        <div className="bg-white rounded-lg shadow-sm overflow-y-auto">
          {renderTabContent()}
        </div>
        <div className="bg-white rounded-lg shadow-sm flex-1">
          {renderEditor()}
        </div>
      </div>

      {/* Desktop Layout */}
      <Split
        sizes={[45, 55]}
        minSize={[400, 500]}
        gutterSize={8}
        className="hidden lg:flex h-full"
      >
        <div className="bg-white rounded-lg shadow-sm overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          {renderTabContent()}
        </div>
        <div
          className="bg-white rounded-lg shadow-sm flex flex-col"
          id="editor-container"
        >
          {renderEditor()}
        </div>
      </Split>
    </div>
  )

  function renderTabContent() {
    return (
      <div className="h-full">
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as TabValue)}>
            <TabsList className="bg-transparent p-2">
              <TabsTrigger
                value="description"
                className="tabs-trigger-active"
              >
                Description
              </TabsTrigger>
              {/* <TabsTrigger
                value="submissions"
                className="tabs-trigger-active"
              >
                Submissions
              </TabsTrigger> */}
              <TabsTrigger
                value="logs"
                className="tabs-trigger-active"
              >
                Logs
              </TabsTrigger>
              {/* <TabsTrigger
                value="accepted"
                className="tabs-trigger-active"
              >
                <div className="flex items-center">
                  <History className="size-3.5 mr-1 -mb-[1.75px]" />
                  <span>Accepted</span>
                </div>
              </TabsTrigger> */}
            </TabsList>
          </Tabs>
        </div>          {/* Tab content with scrollable area */}
        <div className="px-6 pb-6 pt-3 overflow-y-auto">
          {activeTab === "description" && (
            challengesStatus === 'loading' ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            ) : (
              <DescriptionTab challenge={challenge} />
            )
          )}
          {activeTab === "submissions" && <SubmissionsTab />}
          {activeTab === "logs" && <LogsTab sessionId={sessionId || undefined} />}
          {activeTab === "accepted" && <AcceptedTab />}
        </div>
      </div>
    )
  }

  function renderEditor() {
    return (
      <div className="flex flex-col h-full">
        {/* Top toolbar: language dropdown & icon buttons */}
        <div className="border-b border-gray-200 p-2">
          <div className="flex items-center justify-between">
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px] h-8">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.id} value={language.id}>
                    {language.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <TooltipProvider>
              <div className="flex items-center gap-2">
              <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      // onClick={handleFormat}
                      className='h-8 w-8'
                    >
                      <Webcam   className= {`size-6 ${isRunningAgent ? "text-green-500" : "text-red-500"}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isRunningAgent ? "Agent is running" : "Agent is not running"}</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      onClick={handleReset}
                      className='h-8 w-8'
                    >
                      <RotateCcw className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset Code</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      onClick={handleFormat}
                      className='h-8 w-8'
                    >
                      <Code2 className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Format Code</p>
                  </TooltipContent>
                </Tooltip>

                {/* Fullscreen toggle (desktop) */}
                <div className="hidden lg:block">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() =>
                          handleFullScreen(
                            document.getElementById('editor-container') as HTMLDivElement
                          )
                        }
                        className='h-8 w-8'
                      >
                        {isFullscreen ? (
                          <Minimize2 className="size-4" />
                        ) : (
                          <Maximize2 className="size-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </TooltipProvider>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 relative min-h-[23rem] md:min-h-[29rem] lg:min-h-[auto]">
          <Editor
            height="100%"
            defaultLanguage={selectedLanguage}
            language={selectedLanguage}
            theme="vs-light"
            className="pt-1"
            value={code}
            onChange={(value) => setCode(value ?? '')}
            options={{
              fontSize: 14,
              lineNumbers: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              renderValidationDecorations: 'on',
              minimap: {
                enabled: true,
                showSlider: 'mouseover',
              },
              formatOnPaste: true,
              formatOnType: true,
              autoClosingBrackets: 'always',
              autoClosingQuotes: 'always',
              matchBrackets: 'always',
              wordWrap: 'on',
              lineHeight: 21,
            }}
            loading={
              <div className="flex items-center justify-center h-full">
                Loading editor...
              </div>
            }
            beforeMount={(monaco) => {
              // If you're not using JS/TS in the editor, these defaults won't matter much:
              try {
                monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                  noSemanticValidation: true,
                  noSyntaxValidation: false,
                });
              } catch (error) {
                console.error('Error configuring editor:', error);
              }
            }}
          />
        </div>

        {/* Bottom toolbar: submission buttons */}
        <div className="flex justify-between !p-2 border-t">
          <div className="flex gap-x-3">
            {/* <Button
                  onClick={handleSubmit}
                  size="sm"
                  variant={"outline"}
                  className='h-8'
                >
                  Start Agent
                </Button> */}
            <Button
              className="bg-purple h-8 text-white rounded-lg hover:bg-purple/90 transition-colors"
              onClick={handleSubmitCompile}
              size="sm"
              disabled={(() => { const t = generateCodeTemplate(); return isCompiling || (code?.trim() || '') === (t[selectedLanguage]?.trim() || ''); })()}
            >
              {isCompiling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                </>
              ) : (
                "Compile"
              )}
            </Button>
          </div>
          <div className="flex justify-end">
            <div className="flex gap-x-1 sm:gap-x-2 lg:gap-x-3">
            <Button
              className="bg-purple h-8 text-white rounded-lg hover:bg-purple/90 transition-colors"
              onClick={handleRunAgent}
              size="sm"
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                </>
              ) : (
                "Run Agent"
              )}
            </Button>
            <Button
              className="bg-purple h-8 text-white rounded-lg hover:bg-purple/90 transition-colors"
              onClick={handleSubmitCode}
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                </>
              ) : (
                "Submit Challenge"
              )}
            </Button>
            </div>
            
          </div>
        </div>
      </div>
    );
  }
}
export default QuestionPage