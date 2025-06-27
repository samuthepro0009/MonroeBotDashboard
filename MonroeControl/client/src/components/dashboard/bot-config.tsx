
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Settings, Loader2, Save } from "lucide-react";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const configSchema = z.object({
  qotd_channels: z.string(),
  announcement_channels: z.string(),
  qotd_message_style: z.string(),
  announcement_style: z.string(),
});

type ConfigRequest = z.infer<typeof configSchema>;

interface BotConfigProps {
  onBack: () => void;
}

export default function BotConfig({ onBack }: BotConfigProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ["bot-config"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/bot/config");
      return response.json();
    },
  });

  const form = useForm<ConfigRequest>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      qotd_channels: "",
      announcement_channels: "",
      qotd_message_style: "",
      announcement_style: "",
    },
  });

  // Update form when config loads
  React.useEffect(() => {
    if (config) {
      form.setValue("qotd_channels", config.qotd_channels?.join(", ") || "");
      form.setValue("announcement_channels", config.announcement_channels?.join(", ") || "");
      form.setValue("qotd_message_style", config.qotd_message_style || "");
      form.setValue("announcement_style", config.announcement_style || "");
    }
  }, [config, form]);

  const configMutation = useMutation({
    mutationFn: async (data: ConfigRequest) => {
      const payload = {
        qotd_channels: data.qotd_channels.split(",").map(s => s.trim()).filter(s => s),
        announcement_channels: data.announcement_channels.split(",").map(s => s.trim()).filter(s => s),
        qotd_message_style: data.qotd_message_style,
        announcement_style: data.announcement_style,
      };
      const response = await apiRequest("POST", "/api/bot/config", payload);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Configuration updated!",
        description: "Bot settings have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["bot-config"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update configuration",
        description: error.message || "An error occurred while saving settings.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ConfigRequest) => {
    await configMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-discord" />
            Bot Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Monroe Bot Settings</h3>
            <p className="text-slate-600 mb-4">
              Configure channel preferences and message styles for QOTD and announcements
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="qotd_channels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">QOTD Channel Names</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="qotd, question-of-the-day, general"
                      />
                    </FormControl>
                    <p className="text-sm text-slate-500">
                      Comma-separated list of channel names to search for QOTD (in priority order)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="announcement_channels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">Announcement Channel Names</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="announcements, news, updates, general"
                      />
                    </FormControl>
                    <p className="text-sm text-slate-500">
                      Comma-separated list of channel names to search for announcements (in priority order)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qotd_message_style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">QOTD Message Style</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="80s Beach Vibes"
                      />
                    </FormControl>
                    <p className="text-sm text-slate-500">
                      Style theme for Question of the Day messages
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="announcement_style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">Announcement Style</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Official Monroe"
                      />
                    </FormControl>
                    <p className="text-sm text-slate-500">
                      Style theme for official announcements
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-4 pt-4">
                <Button
                  type="submit"
                  disabled={configMutation.isPending}
                  className="flex-1 bg-discord hover:bg-discord-dark text-white font-semibold"
                >
                  {configMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Configuration
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={configMutation.isPending}
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
