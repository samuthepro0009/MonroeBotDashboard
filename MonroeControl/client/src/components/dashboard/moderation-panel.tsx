import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, Hammer, Ban, Loader2, CheckCircle } from "lucide-react";
import { moderationSchema, type ModerationRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";

const severityRules = {
  "1": [
    "1.1.1 - Caps Abuse",
    "1.1.2 - Spoilers",
    "1.1.3 - Emoji/Sticker Abuse",
    "1.1.4 - Language Violation",
    "1.1.5 - Ghost Pings",
    "1.1.6 - Backseat Moderation",
    "1.1.7 - Inappropriate Nicknames",
    "1.2.1 - Mic Spam",
    "1.2.2 - Unnecessary Soundboard Use",
    "1.3.1 - Minor Fail RP",
    "1.3.2 - Breaking Character"
  ],
  "2": [
    "2.1.1 - Spam",
    "2.1.2 - Flaming",
    "2.1.3 - Toxic Behavior",
    "2.1.4 - Malicious Links",
    "2.1.5 - Advertising",
    "2.1.6 - Fake Reports",
    "2.1.7 - Impersonation",
    "2.1.8 - Inappropriate Jokes",
    "2.2.1 - Loud Noises",
    "2.2.2 - Soundboard Misuse",
    "2.2.3 - Camera Misuse",
    "2.3.1 - Fail RP",
    "2.3.2 - Metagaming",
    "2.3.3 - Powergaming",
    "2.3.4 - ERP",
    "2.3.5 - Application Abuse",
    "2.3.6 - Late Event Entry",
    "2.3.7 - Unfair Advantage"
  ],
  "3": [
    "3.1.1 - Slurring",
    "3.1.2 - Harassment",
    "3.1.3 - Discrimination",
    "3.1.4 - NSFW Content",
    "3.1.5 - Security Threats",
    "3.1.6 - Ban Evasion",
    "3.1.7 - Leaking Internal Info",
    "3.1.8 - Staff Disrespect",
    "3.1.9 - Incitement",
    "3.1.10 - Doxxing",
    "3.2.1 - Major VC Disruption",
    "3.2.2 - Screen Sharing NSFW",
    "3.2.3 - Raiding VC",
    "3.3.1 - Major Fail RP",
    "3.3.2 - Griefing Events",
    "3.3.3 - Alt Abuse",
    "3.3.4 - ERP (Severe)",
    "3.3.5 - Raiding"
  ]
};

interface ModerationFormData extends ModerationRequest {
  severity: string;
  custom_reason?: string;
}

const moderationFormSchema = moderationSchema.extend({
  severity: z.string().optional(),
  custom_reason: z.string().optional(),
}) as any;

export default function ModerationPanel() {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [selectedSeverity, setSelectedSeverity] = useState<string>("1");

  const form = useForm<ModerationFormData>({
    resolver: zodResolver(moderationFormSchema),
    defaultValues: {
      action: "warn",
      user_id: "",
      reason: "",
      rule_violations: [],
      delete_days: 0,
      severity: "1",
      custom_reason: "",
    },
  });

  const moderationMutation = useMutation({
    mutationFn: async (data: ModerationRequest) => {
      const response = await apiRequest("POST", "/api/bot/moderation", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Moderation action completed",
        description: "The moderation action has been executed successfully.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Moderation action failed",
        description: error.message || "Failed to execute moderation action.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ModerationFormData) => {
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only administrators can perform moderation actions.",
        variant: "destructive",
      });
      return;
    }

    // Build reason from selected violations and custom reason
    let finalReason = "";
    if (data.rule_violations && data.rule_violations.length > 0) {
      finalReason = data.rule_violations.join(" | ");
    }
    if (data.custom_reason) {
      finalReason += finalReason ? ` | Other - ${data.custom_reason}` : `Other - ${data.custom_reason}`;
    }
    if (!finalReason) {
      finalReason = data.reason;
    }

    const moderationData: ModerationRequest = {
      action: data.action,
      user_id: data.user_id,
      reason: finalReason,
      rule_violations: data.rule_violations,
      delete_days: data.delete_days,
    };

    await moderationMutation.mutateAsync(moderationData);
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Access Denied</h3>
          <p className="text-slate-600">
            Only administrators can access the moderation panel.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Moderation Panel</h2>
        <p className="text-slate-600">
          Execute moderation actions following Monroe Social Club rules
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-discord" />
            Moderation Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="action"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Action Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select action" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="warn">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              Warning
                            </div>
                          </SelectItem>
                          <SelectItem value="kick">
                            <div className="flex items-center gap-2">
                              <Hammer className="w-4 h-4 text-orange-500" />
                              Kick
                            </div>
                          </SelectItem>
                          <SelectItem value="ban">
                            <div className="flex items-center gap-2">
                              <Ban className="w-4 h-4 text-red-500" />
                              Ban
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User ID</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter Discord user ID"
                          className="font-mono"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("action") === "ban" && (
                <FormField
                  control={form.control}
                  name="delete_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delete Message History (Days)</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select days" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[0, 1, 2, 3, 4, 5, 6, 7].map((days) => (
                            <SelectItem key={days} value={days.toString()}>
                              {days} {days === 1 ? 'day' : 'days'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Tabs value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="1" className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">1</Badge>
                    Minor
                  </TabsTrigger>
                  <TabsTrigger value="2" className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">2</Badge>
                    Moderate
                  </TabsTrigger>
                  <TabsTrigger value="3" className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">3</Badge>
                    Severe
                  </TabsTrigger>
                </TabsList>

                {Object.entries(severityRules).map(([severity, rules]) => (
                  <TabsContent key={severity} value={severity} className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                      {rules.map((rule) => (
                        <label key={rule} className="flex items-center space-x-2 p-2 rounded hover:bg-slate-50 cursor-pointer">
                          <input
                            type="checkbox"
                            value={rule}
                            onChange={(e) => {
                              const current = form.getValues("rule_violations") || [];
                              if (e.target.checked) {
                                form.setValue("rule_violations", [...current, rule]);
                              } else {
                                form.setValue("rule_violations", current.filter(r => r !== rule));
                              }
                            }}
                            className="rounded border-slate-300"
                          />
                          <span className="text-sm text-slate-700">{rule}</span>
                        </label>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <FormField
                control={form.control}
                name="custom_reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Reason (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter additional reason or context..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={moderationMutation.isPending}
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  disabled={moderationMutation.isPending}
                  className="bg-discord hover:bg-discord-dark text-white"
                >
                  {moderationMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Execute Action
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}