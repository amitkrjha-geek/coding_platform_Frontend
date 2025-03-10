"use client";
import { useState } from "react";
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
import { FileText, X } from "lucide-react";

interface EditChallengeFormProps {
  challengeId: string;
}

const challengeSchema = z.object({
  title: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  topic: z.string().min(1),
  keywords: z.array(z.string()),
  problemStatement: z.string().min(1),
  files: z.array(z.any()),
});

type FormData = z.infer<typeof challengeSchema>;

const EditChallengeForm = ({ challengeId }: EditChallengeFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: "Making A Large Island",
      difficulty: "medium",
      topic: "strings",
      keywords: ["Making A Large Island", "array"],
      problemStatement:
        '<p>You are given an n x n binary matrix grid. You are allowed to change at most one 0 to be 1. Return size of the largest island in grid after applying this operation.</p><p></p><p>Example 1:</p><p></p><pre><code>Input: grid = [[1,0],[0,1]]\n\nOutput: 3\n\nExplanation: Change one 0 to 1 and connect two 1s, then we get an island with area = 3</code></pre><p></p><h3 class="text-2xl font-bold" level="2"><strong>Example 2:</strong></h3><p></p><pre><code>Input: grid = [[1,1],[1,0]]\n\nOutput: 4\n\nExplanation: Change the 0 to 1 and make the island bigger, only one island with area = 4</code></pre><p></p><h3 class="text-2xl font-bold" level="2"><strong>Constraints:</strong></h3><p></p><ul><li class="list-disc"><p>n == grid.length</p></li><li class="list-disc"><p>n == grid[i].length</p></li><li class="list-disc"><p>1 ≤ n ≤ 500</p></li><li class="list-disc"><p>grid[i][j] is either 0 or 1</p></li></ul>',
      files: [{ name: "banner-image.jpg" }],
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/challenges/${challengeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update challenge");
      }

      // toast.success("Challenge updated successfully")
      router.push("/admin/challenges");
      router.refresh();
    } catch (error) {
      console.log(error);
      // toast.error("Something went wrong")
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
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

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value?.join(", ")}
                      onChange={(e) => {
                        const keywords = e.target.value
                          .split(",")
                          .map((keyword) => keyword.trim())
                          .filter(Boolean);
                        field.onChange(keywords);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="problemStatement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem Statement</FormLabel>
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

            {/* File Upload */}
            <FormField
              control={form.control}
              name="files"
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel>Upload Artifacts or Required Files</FormLabel>
                  <FormControl>
                    <div className="border-2 border-dashed rounded-md p-4 text-center">
                      <p className="text-gray-500">
                        Artifacts or Required Files
                      </p>

                      {/* Display uploaded files */}
                      <div className="mt-2 space-y-2">
                        {value?.map((file: File, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-1 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-red-500" />
                              <span className="text-sm">{file.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newFiles = value.filter(
                                  (_: File, i: number) => i !== index
                                );
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
                        onClick={() =>
                          document.getElementById("file-upload")?.click()
                        }
                      >
                        Choose Files
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="bg-purple text-white"
            >
              {loading ? "Updating..." : "Update Challenge"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditChallengeForm;
