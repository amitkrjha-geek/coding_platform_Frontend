'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Editor from '@monaco-editor/react'
import Split from 'react-split'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Maximize2, RotateCcw, Code2, Minimize2, History } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button'
import DescriptionTab from '@/components/home/code/DescriptionTab'
import LogsTab from '@/components/home/code/LogsTab'
import SubmissionsTab from '@/components/home/code/SubmissionsTab'
import AcceptedTab from '@/components/home/code/AcceptedTab'
import { generateCodeTemplate } from '@/lib/utils'
import { questionsData } from '@/constants'
import { storeCode, triggerSubmission } from '@/API/codeRunner'
import toast from 'react-hot-toast'


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
    { id: 'csharp', name: 'C#' }
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
    
    // Static question data
    const questionData = {
        "id": "1",
        "title": "Making A Large Island",
        "difficulty": "Hard",
        "description": "You are given an n x n binary matrix grid. You are allowed to change at most one 0 to be 1. Return the size of the largest island in grid after applying this operation.",
        "examples": [
            {
                "input": "grid = [[1,0],[0,1]]",
                "output": "3",
                "explanation": "Change one 0 to 1 and connect two 1s, then we get an island with area = 3."
            },
            {
                "input": "grid = [[1,1],[1,0]]",
                "output": "4",
                "explanation": "Change the 0 to 1 and make the island bigger, only one island with area = 4."
            }
        ],
        "constraints": [
            "n == grid.length",
            "n == grid[i].length",
            "1 <= n <= 500",
            "grid[i][j] is either 0 or 1"
        ]
    };

    // Generate initial code template
    const [code, setCode] = useState(() => {
        const templates = generateCodeTemplate(questionData);
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

    const handleSubmitCompile = async() => {
        console.log("Submitted code:", { code, q_id ,selectedLanguage})
        const codeData = {
            // challengeId: q_id,
            challengeId: "68050aa58da36fb6b89c37cb",
            code: code,
            language: selectedLanguage
        }
        try {
          const submissionId = await storeCode(codeData)
          console.log("submissionId", submissionId)
          
          // Store the submissionId in localStorage
          if (submissionId) {
            localStorage.setItem('submissionId', submissionId)
          }

        } catch (error:any) {
          toast.error(error || "Error submitting code")
          console.log("error", error)
        }
    }

    const handleSubmitCode = async() => {
      const submissionId = localStorage.getItem('submissionId')
      if (!submissionId) {
        toast.error("No submission found")
        console.log("No submissionId found")
        return
      }
      try {
        const submissionResult = await triggerSubmission(submissionId)
        console.log("submissionResult", submissionResult)
        if (submissionId) {
          localStorage.removeItem('submissionId')
        }

      } catch (error:any) {
        toast.error(error?.error || "Error submitting code")
        console.log("error", error)
      }
  }

    const handleLanguageChange = (newLanguage: string) => {
        setSelectedLanguage(newLanguage as ProgrammingLanguage['id']);
        const templates = generateCodeTemplate(questionData);
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
                    const  trimmedLine = line.trim();
                
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
                            <TabsTrigger
                                value="submissions"
                                className="tabs-trigger-active"
                            >
                                Submissions
                            </TabsTrigger>
                            <TabsTrigger
                                value="logs"
                                className="tabs-trigger-active"
                            >
                                Logs
                            </TabsTrigger>
                            <TabsTrigger
                                value="accepted"
                                className="tabs-trigger-active"
                            >
                                <div className="flex items-center">
                                    <History className="size-3.5 mr-1 -mb-[1.75px]" />
                                    <span>Accepted</span>
                                </div>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Tab content with scrollable area */}
                <div className="px-6 pb-6 pt-3 overflow-y-auto">
                    {activeTab === "description" && <DescriptionTab questionData={questionsData} />}
                    {activeTab === "submissions" && <SubmissionsTab />}
                    {activeTab === "logs" && <LogsTab />}
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
                >
                  {/* Run Malware */}
                  Compile
                </Button>
              </div>
              <div className="flex justify-end">
                <Button
                  className="bg-purple h-8 text-white rounded-lg hover:bg-purple/90 transition-colors"
                  onClick={handleSubmitCode}
                  size="sm"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        );
      }
    }      
export default QuestionPage