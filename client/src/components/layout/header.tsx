import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import type { BotStatus } from "@shared/schema";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { data: botStatus, isLoading } = useQuery<BotStatus>({
    queryKey: ["/api/bot/status"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/bot/status"] });
  };

  return (
    <header className="bg-black shadow-xl border-b border-red-800/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <img 
              src="https://cdn.discordapp.com/attachments/1171556602436911264/1388089180198015019/New_Project97.png?ex=685fb64a&is=685e64ca&hm=1ad1da193da7e642bdc7a1d56da9e6e683db79af17be4967283a055e0ced634f&" 
              alt="Monroe Bot" 
              className="w-12 h-12 rounded-full object-cover"
            />
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-gray-400 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              botStatus?.online ? 'bg-green-400 animate-pulse-slow' : 'bg-red-400'
            }`} />
            <span className="text-sm font-medium text-gray-300">
              {isLoading 
                ? "Checking status..." 
                : botStatus?.online 
                  ? "Bot Online" 
                  : "Bot Offline"
              }
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
    </header>
  );
}