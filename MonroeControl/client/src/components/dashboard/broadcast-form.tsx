import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Megaphone, Loader2 } from "lucide-react";
import { broadcastSchema, type BroadcastRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BroadcastFormProps {
  onBack: () => void;
}

export default function BroadcastForm({ onBack }: BroadcastFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BroadcastRequest>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      message: "",
    },
  });

  const broadcastMutation = useMutation({
    mutationFn: async (data: BroadcastRequest) => {
      const response = await apiRequest("POST", "/api/bot/broadcast", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Broadcast sent successfully!",
        description: "Your message has been sent to all connected servers.",
      });
      form.reset();
      // Refresh bot status after broadcast
      queryClient.invalidateQueries({ queryKey: ["/api/bot/status"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send broadcast",
        description: error.message || "An error occurred while sending the message.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: BroadcastRequest) => {
    await broadcastMutation.mutateAsync(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-discord/10 rounded-full flex items-center justify-center">
                <Megaphone className="text-discord text-2xl" />
              </div>
              <img 
                src="https://i.imgur.com/yes-r0qgXZT.png" 
                alt="Monroe Bot" 
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Send Broadcast Message</h2>
            <p className="text-slate-600 mt-2">Send a message to all connected Discord servers</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        placeholder="Enter your broadcast message..."
                        className="resize-none"
                      />
                    </FormControl>
                    <p className="text-sm text-slate-500">
                      This message will be sent to all configured channels
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-4 pt-4">
                <Button
                  type="submit"
                  disabled={broadcastMutation.isPending}
                  className="flex-1 bg-discord hover:bg-discord-dark text-white font-semibold"
                >
                  {broadcastMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Broadcast"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={broadcastMutation.isPending}
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
