import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MessageCircle, Loader2, Send } from "lucide-react";
import { qotdSchema, type QOTDRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const sampleQuestions = [
  "What's your favorite 80s movie and why?",
  "If you could have dinner with any celebrity from the 80s, who would it be?",
  "What's your go-to karaoke song from the 80s?",
  "Describe your dream 80s beach party!",
  "What's the most iconic 80s fashion trend in your opinion?",
  "If you could time travel to the 80s, what would you do first?",
  "What's your favorite 80s song to dance to?",
  "Which 80s TV show would you want to be in?",
  "What's the best 80s snack or drink?",
  "If you owned a beach club in the 80s, what would you name it?"
];

interface QOTDFormProps {
  onBack: () => void;
}

export default function QOTDForm({ onBack }: QOTDFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<QOTDRequest>({
    resolver: zodResolver(qotdSchema),
    defaultValues: {
      question: "",
      channel_id: "",
    },
  });

  const qotdMutation = useMutation({
    mutationFn: async (data: QOTDRequest) => {
      const response = await apiRequest("POST", "/api/bot/qotd", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "QOTD sent successfully!",
        description: `Question posted to ${data.channel || 'default channel'}`,
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send QOTD",
        description: error.message || "An error occurred while sending the question.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: QOTDRequest) => {
    await qotdMutation.mutateAsync(data);
  };

  const useRandomQuestion = () => {
    const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
    form.setValue("question", randomQuestion);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-discord" />
              Question of the Day
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
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Send QOTD to Monroe Social Club</h3>
            <p className="text-slate-600 mb-4">
              Engage the community with thought-provoking questions about 80s culture and beach life
            </p>
            
            <div className="inspiration-card rounded-lg p-4 mb-6">
              <h4 className="font-medium text-white mb-2">💡 Need inspiration?</h4>
              <p className="text-sm text-gray-300 mb-3">
                Click below for a random 80s-themed question
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={useRandomQuestion}
                className="text-discord border-discord hover:bg-discord hover:text-white"
              >
                Get Random Question
              </Button>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">Question</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        placeholder="Enter your question of the day..."
                        className="resize-none"
                      />
                    </FormControl>
                    <p className="text-sm text-slate-500">
                      This will be posted with 80s beach vibes styling and engagement reactions
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-4 pt-4">
                <Button
                  type="submit"
                  disabled={qotdMutation.isPending}
                  className="flex-1 bg-discord hover:bg-discord-dark text-white font-semibold"
                >
                  {qotdMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send QOTD
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={qotdMutation.isPending}
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