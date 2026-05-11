'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Editor from '@monaco-editor/react'
import Split from 'react-split'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Maximize2, RotateCcw, Code2, Minimize2, Loader2, Webcam } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

import DescriptionTab from '@/components/home/code/DescriptionTab'
import LogsTab from '@/components/home/code/LogsTab'
import SubmissionsTab from '@/components/home/code/SubmissionsTab'
import AcceptedTab from '@/components/home/code/AcceptedTab'
import SolutionHintTab from '@/components/home/code/SolutionHintTab'

import { generateCodeTemplate } from '@/lib/utils'
import { getToken } from '@/config/token'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchChallenges, getCompanyStats, getTopicStats, selectChallengeById } from '@/redux/features/challengeSlice'

import { storeCode, triggerSubmission, triggerRunAgent } from '@/API/codeRunner'
import { verifyChallengeFlags } from '@/API/submission'

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
  
  cpp: `#include <windows.h>
#include <string>
#include "MinHook.h"
#include "logger.h"

// Step 1: Define the original function pointer type
// typedef <return> (WINAPI* <FuncName>_t)(<params>);
// <FuncName>_t Original<FuncName> = nullptr;

// Step 2: Write your hook function
// <return> WINAPI Hooked<FuncName>(<params>) {
//     Logger::Log("HOOK SUCCESS: <FuncName> intercepted!");
//     return Original<FuncName>(<params>);  // or block by returning early
// }

// Step 3: Worker thread — runs OUTSIDE DllMain (avoids loader lock)
DWORD WINAPI InitThread(LPVOID) {
    Sleep(100); // wait for process to fully initialize

    if (MH_Initialize() != MH_OK) return 1;

    // TODO: MH_CreateHookApi(L"<dll>", "<FuncName>", &Hooked<FuncName>,
    //                         reinterpret_cast<LPVOID*>(&Original<FuncName>));

    MH_EnableHook(MH_ALL_HOOKS);

    Logger::Log("HOOK SUCCESS: hook installed!");
    return 0;
}

// DllMain — only spawns the thread, never does I/O here
BOOL WINAPI DllMain(HINSTANCE hinst, DWORD dwReason, LPVOID reserved) {
    if (dwReason == DLL_PROCESS_ATTACH) {
        DisableThreadLibraryCalls(hinst);
        CreateThread(NULL, 0, InitThread, NULL, 0, NULL);
    }
    else if (dwReason == DLL_PROCESS_DETACH) {
        MH_DisableHook(MH_ALL_HOOKS);
        MH_Uninitialize();
    }
    return TRUE;
}`,

  csharp: 'using System;\nusing System.Collections.Generic;\n\npublic class Solution {\n    public static void Main(string[] args) {\n        // Write your C# code here\n        \n    }\n}\n'
};

type TabValue = "description" | "submissions" | "logs" | "accepted" | "solution-hint";

const QuestionPage = () => {
  const { q_id } = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const token = getToken()
  
  // Normalize q_id to string
  const normalizedQId = Array.isArray(q_id) ? q_id[0] : q_id || '';
  const challenge = useAppSelector(state => selectChallengeById(state, normalizedQId));
  const { status: challengesStatus } = useAppSelector((state) => state.challenge);

  // States
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage['id']>('c')
  const [activeTab, setActiveTab] = useState<TabValue>("description")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [code, setCode] = useState(() => {
    if (challenge?.codeTemplate) return challenge.codeTemplate;
    return generateCodeTemplate()[selectedLanguage];
  });

  // Action States
  const [isRunningAgent, setIsRunningAgent] = useState(false)
  const [isCompiling, setIsCompiling] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  // CTF States
  const [showFlagModal, setShowFlagModal] = useState(false)
  const [flagAnswers, setFlagAnswers] = useState<{[key: string]: string}>({})
  const [isVerifyingFlags, setIsVerifyingFlags] = useState(false)

  // Clean extracted logic to check if code is empty/default
  const isCodePristineTemplate = useMemo(() => {
    const templatesForCheck = generateCodeTemplate();
    return (code?.trim() || '') === (templatesForCheck[selectedLanguage]?.trim() || '');
  }, [code, selectedLanguage]);

  // Handle Fullscreen Event Listener
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Fetch Challenges
  useEffect(() => {
    if (challengesStatus === 'idle') {
      dispatch(fetchChallenges());
      dispatch(getCompanyStats());
      dispatch(getTopicStats());
    }
  }, [dispatch, challengesStatus]);

  // Update code when challenge data loads
  useEffect(() => {
    if (challenge?.codeTemplate) {
      setCode(challenge.codeTemplate);
    }
  }, [challenge?.codeTemplate]);

  // Dynamic fullscreen target handling
  const handleFullScreen = async (containerId: string) => {
    const element = document.getElementById(containerId) as HTMLDivElement | null;
    if (!element) return;

    try {
      if (!document.fullscreenElement) {
        await element.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Error attempting to enable fullscreen:", err);
    }
  };

  const handleSubmitCompile = async () => {
    if (!token) return toast.error("Please login to compile code")

    if (isCodePristineTemplate) {
      toast.error("Please write some code before compiling");
      return;
    }

    const codeData = { challengeId: q_id, code, language: selectedLanguage }

    setIsCompiling(true)
    try {
      const res = await storeCode(codeData)
      if (res?.success) {
        localStorage.setItem('submissionId', res?.submissionId)
        toast.success("Code compiled successfully")
      } else {
        toast.error(res?.error || "Error compiling code")
      }
    } catch (error: any) {
      toast.error(error || "Error compiling code")
      if(error === "Invalid Token Please login Again"){
        router.push('/sign-in')
      }
    } finally {
      setIsCompiling(false)
    }
  }

  const handleSubmitCode = async () => {
    if (!token) return toast.error("Please login to submit challenge");
    
    const submissionId = localStorage.getItem('submissionId')
    if (!submissionId) return toast.error("No submission found! Please compile the code first");
    
    if (!isRunningAgent) return toast.error("Please Run Agent First");

    if (challenge?.flags && challenge.flags.length > 0) {
      setShowFlagModal(true);
      return; 
    }

    setIsSubmitting(true)
    try {
      await triggerSubmission(submissionId ?? '')
      localStorage.removeItem('submissionId')
      toast.success("Code submitted successfully")
    } catch (error: any) {
      toast.error(error || "Error submitting code")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyFlags = async () => {
    const submissionId = localStorage.getItem('submissionId');
    if (!submissionId) return;

    const formattedAnswers = Object.keys(flagAnswers).map(questionId => ({
      questionId,
      answer: flagAnswers[questionId]
    }));

    setIsVerifyingFlags(true);
    try {
      const res = await verifyChallengeFlags({
        submissionId,
        challengeId: normalizedQId,
        userAnswers: formattedAnswers
      });

      toast.success(res.message || "Challenge Passed!");
      setShowFlagModal(false);
      localStorage.removeItem('submissionId');
    } catch (error: any) {
      toast.error(error.message || "Incorrect flags. Check your logs!");
    } finally {
      setIsVerifyingFlags(false);
    }
  };

  const handleRunAgent = async () => {
    if (isRunning) return;
    if (!token) return toast.error("Please login to run agent");
    
    const submissionId = localStorage.getItem('submissionId')
    if (!submissionId) return toast.error("No submission found! Please compile the code first");

    setActiveTab("logs")
    setIsRunning(true)

    try {
      const submissionResult = await triggerRunAgent(submissionId ?? '')
      if (submissionResult.success) {
        setIsRunningAgent(true)
        if (submissionResult.sessionId) {
          setSessionId(submissionResult.sessionId)
        }
      }
      toast.success("Agent started")
    } catch (error: any) {
      toast.error(error || "Error running agent")
      setIsRunningAgent(false)
      setActiveTab("description") // revert on failure
    } finally {
      setIsRunning(false)
    }
  }

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage as ProgrammingLanguage['id']);
    if (challenge?.codeTemplate) {
      setCode(challenge.codeTemplate);
    } else {
      setCode(generateCodeTemplate()[newLanguage as ProgrammingLanguage['id']]);
    }
  }

  const handleReset = () => setCode(defaultCode[selectedLanguage]);

  const handleFormat = () => {
    const formatCode = (code: string): string => {
      let indentLevel = 0;
      const lines = code.split('\n');
      const formattedLines = lines.map(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('}')) indentLevel = Math.max(0, indentLevel - 1);
        const formattedLine = '    '.repeat(indentLevel) + trimmedLine;
        if (trimmedLine.endsWith('{')) indentLevel++;
        return formattedLine;
      });
      return formattedLines.join('\n');
    };
    setCode(formatCode(code));
  };

  return (
    <div className="h-[calc(100vh-64px)] max-w-8xl mx-auto px-4 md:px-6 py-3 bg-htb-bg">
      {/* Mobile Layout */}
      <div className="flex lg:hidden flex-col gap-3 h-full">
        <div className="panel overflow-y-auto">
          {renderTabContent()}
        </div>
        <div className="panel flex-1 flex flex-col" id="mobile-editor-container">
          {renderEditor("mobile-editor-container")}
        </div>
      </div>

      {/* Desktop Layout */}
      <Split
        sizes={[45, 55]}
        minSize={[400, 500]}
        gutterSize={8}
        className="hidden lg:flex h-full"
      >
        <div className="panel overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          {renderTabContent()}
        </div>
        <div className="panel flex flex-col" id="desktop-editor-container">
          {renderEditor("desktop-editor-container")}
        </div>
      </Split>

      {/* CTF FLAG SUBMISSION MODAL */}
      {showFlagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-htb-bg-deep/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md panel shadow-panel-lg overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/60 to-transparent" />
            <div className="p-6">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <span className="terminal-eyebrow">capture.the.flag</span>
                  <h2 className="text-xl font-semibold text-htb-text mt-1">
                    Submit Your Flags
                  </h2>
                </div>
                <button
                  onClick={() => setShowFlagModal(false)}
                  aria-label="Close"
                  className="text-htb-text-dim hover:text-neon transition-colors w-8 h-8 flex items-center justify-center rounded-md hover:bg-neon/5"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-htb-muted mb-5 leading-relaxed">
                Review your execution logs. Based on the data you intercepted,
                answer the following security questions to prove your exploit
                worked.
              </p>

              <div className="space-y-4">
                {challenge?.flags?.map((flag: any) => (
                  <div key={flag._id} className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-htb-muted">
                      {flag.question}
                    </label>
                    <input
                      type="text"
                      placeholder="Enter the captured flag..."
                      className="w-full px-3 py-2.5 rounded-md border border-htb-border bg-htb-bg text-htb-text font-mono text-sm placeholder:text-htb-text-dim hover:border-htb-border-hover focus:border-neon/60 focus:ring-1 focus:ring-neon/40 outline-none transition-all"
                      value={flagAnswers[flag._id] || ''}
                      onChange={(e) =>
                        setFlagAnswers({ ...flagAnswers, [flag._id]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline-dim"
                  className="flex-1"
                  onClick={() => setShowFlagModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="neon"
                  className="flex-1"
                  onClick={handleVerifyFlags}
                  disabled={
                    isVerifyingFlags ||
                    Object.keys(flagAnswers).length !== challenge?.flags?.length
                  }
                >
                  {isVerifyingFlags ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Verify Flags"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  function renderTabContent() {
    return (
      <div className="h-full flex flex-col">
        <div className="sticky top-0 z-10 bg-htb-panel/95 backdrop-blur border-b border-htb-border">
          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as TabValue)}>
            <TabsList className="bg-transparent border-0 rounded-none p-0 px-2 h-11">
              <TabsTrigger
                value="description"
                className="rounded-none px-4 h-11 font-mono text-[11px] uppercase tracking-widest text-htb-muted hover:text-htb-text border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:text-neon data-[state=active]:border-neon data-[state=active]:shadow-none"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="logs"
                className="rounded-none px-4 h-11 font-mono text-[11px] uppercase tracking-widest text-htb-muted hover:text-htb-text border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:text-neon data-[state=active]:border-neon data-[state=active]:shadow-none"
              >
                Logs
              </TabsTrigger>
              {challenge?.answerFileUrl && (
                <TabsTrigger
                  value="solution-hint"
                  className="rounded-none px-4 h-11 font-mono text-[11px] uppercase tracking-widest text-htb-muted hover:text-htb-text border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:text-neon data-[state=active]:border-neon data-[state=active]:shadow-none"
                >
                  Solution Hint
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        </div>
        <div className="px-6 pb-6 pt-4 overflow-y-auto flex-1">
          {activeTab === "description" && (
            challengesStatus === 'loading' ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-htb-panel-2 rounded w-3/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-htb-panel-2 rounded"></div>
                  <div className="h-4 bg-htb-panel-2 rounded w-5/6"></div>
                  <div className="h-4 bg-htb-panel-2 rounded w-4/6"></div>
                </div>
              </div>
            ) : (
              <DescriptionTab challenge={challenge} />
            )
          )}
          {activeTab === "submissions" && <SubmissionsTab />}
          {activeTab === "logs" && <LogsTab sessionId={sessionId || undefined} />}
          {activeTab === "accepted" && <AcceptedTab />}
          {activeTab === "solution-hint" && challenge?.answerFileUrl && (
            <SolutionHintTab
              answerFileUrl={challenge.answerFileUrl}
              challengeId={normalizedQId}
            />
          )}
        </div>
      </div>
    )
  }

  function renderEditor(containerId: string) {
    return (
      <div className="flex flex-col h-full">
        {/* Top toolbar */}
        <div className="border-b border-htb-border bg-htb-panel/60 px-2 py-1.5 h-11 flex items-center">
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded border border-htb-border bg-htb-bg/40 text-[10px] font-mono uppercase tracking-widest text-htb-text-dim">
                <span className={`w-1.5 h-1.5 rounded-full ${isRunningAgent ? 'bg-neon shadow-neon-sm animate-glow-pulse' : 'bg-htb-text-dim'}`} />
                {isRunningAgent ? 'Agent Live' : 'Agent Idle'}
              </span>
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[140px] h-8 font-mono text-xs uppercase tracking-wider">
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
            </div>

            <TooltipProvider>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={"ghost"} size={"icon"} className="h-8 w-8 text-htb-muted hover:text-neon hover:bg-neon/5">
                      <Webcam className={`size-4 ${isRunningAgent ? "text-neon" : "text-danger"}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isRunningAgent ? "Agent is running" : "Agent is not running"}</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={"ghost"} size={"icon"} onClick={handleReset} className="h-8 w-8 text-htb-muted hover:text-neon hover:bg-neon/5">
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
                      className="h-8 w-8 text-htb-muted hover:text-neon hover:bg-neon/5"
                    >
                      <Code2 className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Format Code</p>
                  </TooltipContent>
                </Tooltip>

                <div className="hidden lg:block">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => handleFullScreen(containerId)}
                        className="h-8 w-8 text-htb-muted hover:text-neon hover:bg-neon/5"
                      >
                        {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
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
        <div className="flex-1 relative min-h-[23rem] md:min-h-[29rem] lg:min-h-[auto] bg-htb-bg-deep">
          <Editor
            height="100%"
            defaultLanguage={selectedLanguage}
            language={selectedLanguage}
            theme="vs-dark"
            className="pt-1"
            value={code}
            onChange={(value) => setCode(value ?? '')}
            options={{
              fontSize: 14,
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              lineNumbers: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              renderValidationDecorations: 'on',
              minimap: { enabled: true, showSlider: 'mouseover' },
              formatOnPaste: true,
              formatOnType: true,
              autoClosingBrackets: 'always',
              autoClosingQuotes: 'always',
              matchBrackets: 'always',
              wordWrap: 'on',
              lineHeight: 21,
            }}
            loading={
              <div className="flex items-center justify-center h-full text-htb-muted font-mono text-sm">
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading editor...
              </div>
            }
          />
        </div>

        {/* Bottom toolbar */}
        <div className="flex justify-between p-2 border-t border-htb-border bg-htb-panel/60">
          <div className="flex gap-x-2">
            <Button
              variant="outline-dim"
              className="h-8 font-mono text-[11px] uppercase tracking-widest"
              onClick={handleSubmitCompile}
              size="sm"
              disabled={isCompiling || isCodePristineTemplate}
            >
              {isCompiling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Compile"}
            </Button>
          </div>
          <div className="flex justify-end">
            <div className="flex gap-x-2">
              <Button
                variant="ghost-neon"
                className="h-8 font-mono text-[11px] uppercase tracking-widest"
                onClick={handleRunAgent}
                size="sm"
                disabled={isRunning}
              >
                {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Run"}
              </Button>
              <Button
                variant="neon"
                className="h-8 font-mono text-[11px] uppercase tracking-widest"
                onClick={handleSubmitCode}
                size="sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default QuestionPage;