import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  FileText, 
  Settings, 
  Gamepad2,
  Command
} from "lucide-react";
import type { MonroeCommand } from "@shared/schema";

const categoryIcons = {
  moderation: Shield,
  roblox: Gamepad2,
  applications: FileText,
  utils: Command,
  admin: Settings,
};

const categoryColors = {
  moderation: "destructive",
  roblox: "secondary",
  applications: "default", 
  utils: "outline",
  admin: "destructive",
} as const;

export default function CommandsOverview() {
  const { data: commandsData, isLoading } = useQuery<{ commands: MonroeCommand[] }>({
    queryKey: ["/api/bot/commands"],
  });

  const commands = commandsData?.commands || [];
  
  // Group commands by category
  const commandsByCategory = commands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, MonroeCommand[]>);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Monroe Bot Commands</h2>
        <p className="text-slate-600">
          Overview of all available bot commands organized by category
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(commandsByCategory).map(([category, categoryCommands]) => {
          const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Command;
          
          return (
            <Card key={category} className="command-card hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-discord/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-discord" />
                  </div>
                  <div>
                    <h3 className="capitalize font-semibold text-slate-900">{category}</h3>
                    <p className="text-sm text-slate-500 font-normal">
                      {categoryCommands.length} command{categoryCommands.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {categoryCommands.map((command) => (
                    <div key={command.name} className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
                            /{command.name}
                          </code>
                          <Badge variant={categoryColors[command.category]}>
                            {command.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          {command.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {commands.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Command className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Commands Available</h3>
            <p className="text-slate-600">
              Bot commands will appear here when the bot is online and connected.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}