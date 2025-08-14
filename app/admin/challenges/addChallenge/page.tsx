'use client'
import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Badge } from '@/components/ui/badge'
import { FileText, X } from 'lucide-react'
import Tiptap from '@/components/Tiptap'
import { createChallenge } from '@/API/challenges'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

// First, update the formSchema to properly handle file validation
const formSchema = z.object({
  title: z.string().min(1, "Challenge name is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  topic: z.array(z.string()).min(1, "At least one topic is required"),
  keywords: z.array(z.string()),
  problemStatement: z.string().min(1, "Problem statement is required"),
  status: z.string().min(1, "Status is required"),
  companies: z.array(z.string()),
  files: z.array(z.object({
    name: z.string(),
    content: z.string(),
    type: z.string(),
    size: z.number() // Added to track file size
  })).optional()
})

const AddChallenge = () => {
  const router = useRouter()
  const [newTag, setNewTag] = React.useState("")
  const [newCompany, setNewCompany] = React.useState("")
  const [newTopic, setNewTopic] = React.useState("")
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
      status: "active",
      companies: [],
      files: [], // Initialize as empty array, not undefined
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

  const fileToBase64 = (file: File): Promise<{ name: string, content: string, type: string, size: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve({
          name: file.name,
          content: base64String.split(',')[1], // Remove data URL prefix
          type: file.type || 'application/octet-stream',
          size: file.size
        });
      };
      reader.onerror = (error) => reject(error);
    });
  };


  // Update the onSubmit function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('Submitting form with values:', {
        ...values,
        files: values.files?.map(f => ({
          name: f.name,
          contentLength: f.content.length,
          size: f.size
        }))
      });

      const res = await createChallenge(values); // values already contains processed files
      console.log('API Response:', res);
      
      // if (res) {
      //   toast.success("Challenge created successfully");
      //   router.push("/admin/challenges");
      //   form.reset();
      //   setFormData({ tags: [], companies: [], topics: [] });
      // }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create challenge");
    }
  }

  return (
    <section className="bg-white min-h-screen p-7">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/challenges">Challenges</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Add Challenge</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="text-2xl font-bold mt-6 mb-4">Create New Challenge</h1>

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
                    <FormLabel>Challenge Name</FormLabel>
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
                      <FormLabel>Difficulty</FormLabel>
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
                      <FormLabel>Status</FormLabel>
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

              {/* Topics */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Topics</label>
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
                    <FormLabel>Problem Statement</FormLabel>
                    <FormControl>
                    
                      <Tiptap problemStatement={field.value} onChange={field.onChange} />
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
                    <FormLabel>Upload DLL Files</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed rounded-md p-4 text-center">
                        <p className="text-gray-500">Upload DLL files only</p>
                        
                        {/* Display uploaded files */}
                        <div className="mt-2 space-y-2">
                          {(field.value || []).map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-1 rounded">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-red-500" />
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

    // only .dll files
    const dllFiles = files.filter(file => {
      if (!file.name.toLowerCase().endsWith('.dll')) {
        toast.error(`${file.name} is not a DLL file`);
        return false;
      }
      return true;
    });

    try {
      // ✅ Use your helper – it includes size and a safe default for type
      const processedFiles = await Promise.all(
        dllFiles.map(fileToBase64) // returns { name, content, type, size }
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
  accept=".dll"
  multiple
/>

                        <Button 
                          type="button"
                          variant="secondary" 
                          className="mt-4" 
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          Choose DLL Files
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-gray-500 mt-2">Only .dll files are allowed</p>
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit" className="bg-purple-600 text-white">
                  Save Change
                </Button>
                <Button variant="outline" type="button" className="bg-orange-100 border-orange-200">
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  )
}

export default AddChallenge