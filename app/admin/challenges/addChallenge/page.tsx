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

const formSchema = z.object({
  title: z.string().min(1, "Challenge name is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  topic: z.string().min(1, "Topic is required"),
  keywords: z.array(z.string()),
  problemStatement: z.string().min(1, "Problem statement is required"),
  files: z.array(z.any()).optional(),
})

const AddChallenge = () => {
  const [newTag, setNewTag] = React.useState("")
  const [formData, setFormData] = React.useState({
    tags: [] as string[]
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      difficulty: "",
      topic: "",
      keywords: [],
      problemStatement: "",
      files: [],
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
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values)
      // Add your API call here to save the challenge
    } catch (error) {
      console.error("Error creating challenge:", error)
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

                {/* Topic */}
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="arrays">Arrays</SelectItem>
                          <SelectItem value="strings">Strings</SelectItem>
                          <SelectItem value="dp">Dynamic Programming</SelectItem>
                          {/* Add more categories as needed */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Upload Artifacts or Required Files</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed rounded-md p-4 text-center">
                        <p className="text-gray-500">Artifacts or Required Files</p>
                        
                        {/* Display uploaded files */}
                        <div className="mt-2 space-y-2">
                          {value?.map((file: File, index: number) => (
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
                                  const newFiles = value.filter((_: File, i: number) => i !== index);
                                  onChange(newFiles);
                                }}
                              >
                                <X size={16} className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>

                        <input
                          type="file"
                          onChange={(e) => {
                            const newFiles = Array.from(e.target.files || []);
                            onChange([...(value || []), ...newFiles]);
                          }}
                          className="hidden"
                          id="file-upload"
                          multiple
                        />
                        <Button 
                          variant="secondary" 
                          className="mt-4" 
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          Choose Files
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
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