"use client";
import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
// import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import Tiptap from "@/components/Tiptap";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus, Minus, X, Upload, Loader2, FileCheck } from "lucide-react";
import { getChallengeById, updateChallenge } from "@/API/challenges";
import { getAllPlans } from "@/API/plan";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import Loading from "@/components/Loading";
import { uploadPdfToCloudinary } from "@/lib/cloudinaryUpload";

interface EditChallengeFormProps {
  challengeId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Challenge name is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  topic: z.array(z.string()).min(1, "At least one topic is required"),
  keywords: z.array(z.string()),
  problemStatement: z.string().min(1, "Problem statement is required"),
  codeTemplate: z.string().min(1, "Code template is required"),
  status: z.string().min(1, "Status is required"),
  companies: z.array(z.string()),
  paymentMode: z.string().min(1, "Payment mode is required"),
  planId: z.string().optional(),
  answerFileUrl: z.string().optional(),
  files: z.array(z.object({
    name: z.string(),
    content: z.string(),
    type: z.string(),
    size: z.number()
  })).optional(),
  flags: z.array(
    z.object({
      question: z.string().min(1, "Question is required"),
      answer: z.string().min(1, "Answer is required"),
    })
  ).optional(),
}).refine((data) => {
  // If payment mode is paid, planId is required
  if (data.paymentMode === "paid" && !data.planId) {
    return false;
  }
  return true;
}, {
  message: "Plan selection is required for paid challenges",
  path: ["planId"],
})



const fileToBase64 = (file: File): Promise<{ name: string, content: string, type: string, size: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve({
        name: file.name,
        content: base64String.split(',')[1],
        type: file.type || 'application/octet-stream',
        size: file.size
      });
    };
    reader.onerror = (error) => reject(error);
  });
};

const EditChallengeForm = ({ challengeId }: EditChallengeFormProps) => { 
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [flags, setFlags] = useState<{ question: string; answer: string }[]>([]);
  const [answerFileUploading, setAnswerFileUploading] = useState(false);
  const [answerFileName, setAnswerFileName] = useState<string | null>(null);
  const answerFileInputRef = React.useRef<HTMLInputElement>(null);
  const [newTag, setNewTag] = React.useState("")
  const [newCompany, setNewCompany] = React.useState("")
  const [newTopic, setNewTopic] = React.useState("")
  const [plans, setPlans] = React.useState<any[]>([]);
  const [formData, setFormData] = React.useState({
    tags: [] as string[],
    companies: [] as string[],
    topics: [] as string[]
  })


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      difficulty: "",
      topic: [],
      keywords: [],
      problemStatement: "",
      codeTemplate: "",
      status: "active",
      companies: [],
      paymentMode: "",
      planId: "",
      answerFileUrl: "",
      files: [],
      flags: [],
    },
  })

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      form.setValue('keywords', [...formData.tags, tag]);
      setNewTag("");
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    const newTags = formData.tags.filter(tag => tag !== tagToRemove);
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }));
    form.setValue('keywords', newTags);
  };

  const addCompany = (company: string) => {
    if (company && !formData.companies.includes(company)) {
      setFormData(prev => ({
        ...prev,
        companies: [...prev.companies, company]
      }));
      form.setValue('companies', [...formData.companies, company]);
      setNewCompany("");
    }
  };
  
  const removeCompany = (companyToRemove: string) => {
    const newCompanies = formData.companies.filter(company => company !== companyToRemove);
    setFormData(prev => ({
      ...prev,
      companies: newCompanies
    }));
    form.setValue('companies', newCompanies);
  };

  const addTopic = (topic: string) => {
    if (topic && !formData.topics.includes(topic)) {
      setFormData(prev => ({
        ...prev,
        topics: [...prev.topics, topic]
      }));
      form.setValue('topic', [...formData.topics, topic]);
      setNewTopic("");
    }
  };
  
  const removeTopic = (topicToRemove: string) => {
    const newTopics = formData.topics.filter(topic => topic !== topicToRemove);
    setFormData(prev => ({
      ...prev,
      topics: newTopics
    }));
    form.setValue('topic', newTopics);
  };

  const addFlag = () => {
    const newFlags = [...flags, { question: "", answer: "" }];
    setFlags(newFlags);
    form.setValue("flags", newFlags);
  };

  const removeFlag = (index: number) => {
    const newFlags = flags.filter((_, i) => i !== index);
    setFlags(newFlags);
    form.setValue("flags", newFlags);
  };

  const updateFlag = (index: number, field: "question" | "answer", value: string) => {
    const newFlags = flags.map((flag, i) =>
      i === index ? { ...flag, [field]: value } : flag
    );
    setFlags(newFlags);
    form.setValue("flags", newFlags);
  };

  const handleAnswerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed for answer file");
      if (answerFileInputRef.current) answerFileInputRef.current.value = "";
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size must be less than 20MB");
      if (answerFileInputRef.current) answerFileInputRef.current.value = "";
      return;
    }

    setAnswerFileUploading(true);
    try {
      const result = await uploadPdfToCloudinary(file);
      if (result.success && result.url) {
        form.setValue("answerFileUrl", result.url);
        setAnswerFileName(file.name);
        toast.success("Answer file uploaded successfully");
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Answer file upload error:", error);
      toast.error("Failed to upload answer file. Please try again.");
    } finally {
      setAnswerFileUploading(false);
      if (answerFileInputRef.current) answerFileInputRef.current.value = "";
    }
  };

  const removeAnswerFile = () => {
    form.setValue("answerFileUrl", "");
    setAnswerFileName(null);
    if (answerFileInputRef.current) answerFileInputRef.current.value = "";
  };

  useEffect(() => {
    const getChallenge = async () => {
      try {
        setLoading(true);
        const res = await getChallengeById(challengeId);
        console.log({res});
        
        if (res?.data) {
          const challenge = res?.data;
          
          // Set form values
          const existingFlags = challenge?.flags || [];
          form.reset({
            title: challenge?.title,
            difficulty: challenge?.difficulty,
            topic: challenge?.topic || [],
            keywords: challenge?.keywords || [],
            problemStatement: challenge?.problemStatement || '',
            codeTemplate: challenge?.codeTemplate || '',
            status: challenge?.status || 'active',
            companies: challenge?.companies || [],
            paymentMode: challenge?.paymentMode || "",
            planId: challenge?.planId?._id || "",
            answerFileUrl: challenge?.answerFileUrl || "",
            files: challenge?.files || [],
            flags: existingFlags,
          });

          // Set answer file name if URL exists
          if (challenge?.answerFileUrl) {
            setAnswerFileName("Answer File (uploaded)");
          }

          // Set local state for tags, companies, topics, and flags
          setFormData({
            tags: challenge.keywords || [],
            companies: challenge.companies || [],
            topics: challenge.topic || []
          });
          setFlags(existingFlags);
        }
      } catch (error) {
        console.error('Error fetching challenge:', error);
        toast.error('Failed to load challenge data');
      } finally {
        setLoading(false);
      }
    };

    const getPlans = async () => {
      try {
        const res = await getAllPlans();
        // Filter plans to show only "Per Challenge" price mode
        const filteredPlans = res?.filter((plan: any) => plan.priceMode === "Per Challenge");
        const formattedData = filteredPlans?.map((plan: any) => ({
          id: plan._id,
          name: plan.name,
          priceMode: plan.priceMode,
          price: plan.price,
        }));
        setPlans(formattedData);
      } catch (error) {
        console.log(error);
      }
    };
    
    if (challengeId) {
      getChallenge();
    }
    getPlans();
  }, [challengeId, form]);

  const handleCancel = () => {
    router.push("/admin/challenges");
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      
      // Log form values for debugging
      console.log('Form values:', {
        ...values,
        files: values.files?.map(f => ({
          name: f.name,
          contentLength: f.content.length,
          size: f.size
        }))
      });

      // Clean up the data before sending to backend
      const cleanedValues = { ...values };
      
      // Remove planId if payment mode is free or if planId is empty
      if (values.paymentMode === "free" || !values.planId) {
        delete cleanedValues.planId;
      }

      const res = await updateChallenge(challengeId, cleanedValues)
      console.log({res})
      
      if (res) {
        toast.success("Challenge updated successfully")
        router.push("/admin/challenges")
      }
      
    } catch (error) {
      console.error("Error updating challenge:", error)
      toast.error(error as string)
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Card>
    <CardContent className="pt-6">
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Challenge Name */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Challenge Name <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Challenge Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-6">
            {/* Difficulty */}
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Difficulty Level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Payment Mode */}
            <FormField
              control={form.control}
              name="paymentMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Mode <span className="text-red-500">*</span></FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset planId when switching payment modes
                      if (value === "free") {
                        form.setValue("planId", "");
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Payment Mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Plans - Only show when payment mode is paid */}
            {form.watch("paymentMode") === "paid" && (
              <FormField
                control={form.control}
                name="planId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Plan <span className="text-red-500">*</span></FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Plan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} - ₹{plan.price} ({plan.priceMode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Topics */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Topics <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.topics.map((topic) => (
                <Badge key={topic} variant="secondary" className="px-3 py-1">
                  {topic}
                  <button
                    type="button"
                    onClick={() => removeTopic(topic)}
                    className="ml-2 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTopic(newTopic);
                  }
                }}
                placeholder="Add Topics (e.g., Arrays, Strings, Dynamic Programming)"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addTopic(newTopic)}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Keywords and Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Keywords and Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="px-3 py-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(newTag);
                  }
                }}
                placeholder="Add Tags"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addTag(newTag)}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Companies */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Companies</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.companies.map((company) => (
                <Badge key={company} variant="secondary" className="px-3 py-1">
                  {company}
                  <button
                    type="button"
                    onClick={() => removeCompany(company)}
                    className="ml-2 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCompany(newCompany);
                  }
                }}
                placeholder="Add Companies"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addCompany(newCompany)}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Problem Statement */}
          <FormField
            control={form.control}
            name="problemStatement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Problem Statement <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                
                <Tiptap
                      problemStatement={field.value}
                      onChange={field.onChange}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Code Template */}
          <FormField
            control={form.control}
            name="codeTemplate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code Template <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <textarea
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Paste your code template here..."
                    rows={12}
                    className="w-full border rounded-md px-3 py-2 text-sm font-mono resize-vertical focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Upload */}
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Files <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <div className="border-2 border-dashed rounded-md p-4 text-center">
                    <p className="text-gray-500">Upload any type of file</p>
                    
                    {/* Display uploaded files */}
                    <div className="mt-2 space-y-2">
                      {(field.value || []).map((file: any, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-1 rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const currentFiles = field.value || [];
                              const newFiles = [...currentFiles];
                              newFiles.splice(index, 1);
                              field.onChange(newFiles);
                            }}
                          >
                            <X size={16} className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <input
                      type="file"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);

                        try {
                          // Process all files without filtering by type
                          const processedFiles = await Promise.all(
                            files.map(fileToBase64)
                          );

                          const currentFiles = field.value || [];
                          field.onChange([...currentFiles, ...processedFiles]);

                          console.log(
                            'Processed files:',
                            processedFiles.map(f => ({ name: f.name, size: f.size, contentLength: f.content.length }))
                          );
                        } catch (error) {
                          console.error('Error processing files:', error);
                          toast.error('Error processing files');
                        }
                      }}
                      className="hidden"
                      id="file-upload"
                      multiple
                    />
                    <Button 
                      type="button"
                      variant="secondary" 
                      className="mt-4" 
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      Choose Files
                    </Button>

                    <p className="text-sm text-gray-500 mt-2">Any file type is allowed</p>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Answer File Upload (PDF) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Add Answer File{" "}
              <span className="text-gray-400 font-normal">(PDF only)</span>
            </label>

            {/* Hidden file input */}
            <input
              ref={answerFileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleAnswerFileUpload}
              className="hidden"
              id="answer-file-upload-edit"
            />

            {form.watch("answerFileUrl") ? (
              /* Uploaded state */
              <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <FileCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        {answerFileName || "Answer File"}
                      </p>
                      <a
                        href={form.watch("answerFileUrl")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-600 hover:underline"
                      >
                        View uploaded PDF
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-gray-500 hover:text-purple-600 border-gray-200"
                      onClick={() => answerFileInputRef.current?.click()}
                      disabled={answerFileUploading}
                    >
                      <Upload size={14} className="mr-1" />
                      Replace
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={removeAnswerFile}
                      disabled={answerFileUploading}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ) : answerFileUploading ? (
              /* Uploading state */
              <div className="border-2 border-dashed border-purple-300 bg-purple-50 rounded-lg p-6 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-2" />
                <p className="text-sm font-medium text-purple-600">
                  Uploading answer file...
                </p>
                <p className="text-xs text-purple-400 mt-1">
                  Please wait while the file is being uploaded
                </p>
              </div>
            ) : (
              /* Empty / upload state */
              <div
                className="border-2 border-dashed border-gray-200 hover:border-purple-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group"
                onClick={() => answerFileInputRef.current?.click()}
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center mb-3 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                </div>
                <p className="text-sm font-medium text-gray-600 group-hover:text-purple-600 transition-colors">
                  Click to upload answer file
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PDF format only, max 20MB
                </p>
              </div>
            )}
          </div>

          {/* Flags */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Add Flag</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFlag}
                className="flex items-center gap-1"
              >
                <Plus size={14} /> Add Flag
              </Button>
            </div>
            {flags.map((flag, index) => (
              <div key={index} className="border rounded-md p-4 space-y-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Flag {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFlag(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Minus size={14} />
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500">Question</label>
                  <textarea
                    value={flag.question}
                    onChange={(e) => updateFlag(index, "question", e.target.value)}
                    placeholder="Enter flag question"
                    rows={2}
                    className="w-full border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500">Answer</label>
                  <textarea
                    value={flag.answer}
                    onChange={(e) => updateFlag(index, "answer", e.target.value)}
                    placeholder="Enter flag answer"
                    rows={2}
                    className="w-full border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-purple-600 text-white"
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </Button>
            <Button 
              variant="outline" 
              type="button" 
              className="bg-orange-100 border-orange-200" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </CardContent>
  </Card>
  );
};

export default EditChallengeForm;
