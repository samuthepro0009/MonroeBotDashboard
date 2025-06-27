import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Megaphone, Loader2, Send } from "lucide-react";
import { announcementSchema, type AnnouncementRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AnnouncementFormProps {
  onBack: () => void;
}

export default function AnnouncementForm({ onBack }: AnnouncementFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AnnouncementRequest>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
      channel_id: "",
    },
  });

  const announcementMutation = useMutation({
    mutationFn: async (data: AnnouncementRequest) => {
      const response = await apiRequest("POST", "/api/bot/announcement", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Announcement sent successfully!",
        description: `Posted to ${data.channel || 'announcement channel'}`,
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send announcement",
        description: error.message || "An error occurred while sending the announcement.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: AnnouncementRequest) => {
    await announcementMutation.mutateAsync(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-discord" />
              Server Announcement
            </div>
            <img 
              src="https://i.imgur.com/yes-r0qgXZT.png" 
              alt="Monroe Bot" 
              className="w-12 h-12 rounded-full object-cover"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Official Monroe Social Club Announcement</h3>
            <p className="text-slate-600 mb-4">
              Send important announcements to the community with professional formatting
            </p>
            
            <div className="guidelines-card rounded-lg p-4 mb-6">
              <h4 className="font-medium text-white mb-2">📢 Announcement Guidelines</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Keep titles clear and concise</li>
                <li>• Include important details in the content</li>
                <li>• Announcements will be styled with Monroe branding</li>
                <li>• Will be posted to the official announcement channel</li>
              </ul>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">Announcement Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter announcement title..."
                        className="font-medium"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">Content</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={6}
                        placeholder="Enter announcement content..."
                        className="resize-none"
                      />
                    </FormControl>
                    <p className="text-sm text-slate-500">
                      Provide detailed information about the announcement
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-4 pt-4">
                <Button
                  type="submit"
                  disabled={announcementMutation.isPending}
                  className="flex-1 bg-discord hover:bg-discord-dark text-white font-semibold"
                >
                  {announcementMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Announcement
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={announcementMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}