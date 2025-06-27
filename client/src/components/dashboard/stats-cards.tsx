import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Server, 
  Users, 
  TrendingUp, 
  Megaphone, 
  RefreshCw,
  UserPlus,
  Shield,
  Gamepad2,
  Command,
  FileText,
  MessageCircle,
  Speaker,
  AlertCircle,
  Info,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { BotStatus } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Zap, ZapOff, Activity } from 'lucide-react';

interface StatsCardsProps {
  onViewChange: (view: "broadcast" | "users" | "moderation" | "roblox" | "commands" | "applications" | "qotd" | "announcement") => void;
}

export default function StatsCards({ onViewChange }: StatsCardsProps) {
  const { isAdmin } = useAuth();
  const { data: botStatus, isLoading } = useQuery<BotStatus>({
    queryKey: ["/api/bot/status"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: recentActivity = [] } = useQuery({
    queryKey: ["/api/activity"],
    refetchInterval: 60000, // Refresh every minute
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return CheckCircle2;
      case "warning":
        return AlertCircle;
      case "error":
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="stat-card-80s relative overflow-hidden group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-neon-cyan">Bot Status</p>
                <div className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  botStatus?.online 
                    ? "bg-green-500 shadow-lg shadow-green-500/50 animate-pulse" 
                    : "bg-red-500 shadow-lg shadow-red-500/50"
                )} />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold neon-text">
                  {isLoading ? "Checking..." : botStatus?.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <div className={cn(
              "p-3 rounded-full neon-border transition-all duration-300",
              botStatus?.online ? "bg-neon-green/10 text-neon-green" : "bg-red-500/10 text-red-500"
            )}>
              {botStatus?.online ? <Zap className="w-6 h-6" /> : <ZapOff className="w-6 h-6" />}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="stat-card-80s relative overflow-hidden group cursor-pointer" onClick={() => onViewChange("broadcast")}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neon-purple">Server Count</p>
              <p className="text-2xl font-bold mt-1 neon-text">{botStatus?.serverCount || 0}</p>
            </div>
            <div className="p-3 rounded-full bg-neon-purple/10 text-neon-purple neon-border">
              <Server className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="stat-card-80s relative overflow-hidden group cursor-pointer" onClick={() => onViewChange("users")}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neon-yellow">Total Users</p>
              <p className="text-2xl font-bold mt-1 neon-text">{botStatus?.userCount || 0}</p>
            </div>
            <div className="p-3 rounded-full bg-neon-yellow/10 text-neon-yellow neon-border">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="stat-card-80s relative overflow-hidden group cursor-pointer" onClick={() => onViewChange("commands")}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neon-green">Uptime</p>
              <p className="text-2xl font-bold mt-1 neon-text">{botStatus?.uptime || "0%"}</p>
            </div>
            <div className="p-3 rounded-full bg-neon-green/10 text-neon-green neon-border">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.reload()}
                className="text-slate-500 hover:text-slate-700"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-slate-500">No recent activity</p>
                </div>
              ) : (
                recentActivity.slice(0, 5).map((activity: any, index: number) => {
                  const IconComponent = getActivityIcon(activity.type);
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={cn(
                        "p-1 rounded-full mt-0.5",
                        getActivityColor(activity.type)
                      )}>
                        <IconComponent className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {activity.message}
                        </p>
                        <p className="text-xs text-slate-500">
                          {activity.time || new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                className="w-full justify-between bg-discord hover:bg-discord-dark text-white"
                onClick={() => onViewChange("broadcast")}
              >
                <span className="font-medium">Send Broadcast</span>
                <Megaphone className="h-5 w-5" />
              </Button>

              <Button
                className="w-full justify-between bg-pink-600 hover:bg-pink-700 text-white"
                onClick={() => onViewChange("qotd")}
              >
                <span className="font-medium">Send QOTD</span>
                <MessageCircle className="h-5 w-5" />
              </Button>

              <Button
                className="w-full justify-between bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => onViewChange("announcement")}
              >
                <span className="font-medium">Announcement</span>
                <Megaphone className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => window.location.reload()}
              >
                <span className="font-medium">Refresh Status</span>
                <RefreshCw className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => onViewChange("commands")}
              >
                <span className="font-medium">View Commands</span>
                <Command className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => onViewChange("roblox")}
              >
                <span className="font-medium">Roblox Integration</span>
                <Gamepad2 className="h-5 w-5" />
              </Button>

              {isAdmin && (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => onViewChange("moderation")}
                  >
                    <span className="font-medium">Moderation Panel</span>
                    <Shield className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => onViewChange("applications")}
                  >
                    <span className="font-medium">Applications</span>
                    <FileText className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between bg-pink-50 border-pink-200 hover:bg-pink-100 text-pink-700"
                    onClick={() => onViewChange("qotd")}
                  >
                    <span className="font-medium">Send QOTD</span>
                    <MessageCircle className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700"
                    onClick={() => onViewChange("announcement")}
                  >
                    <span className="font-medium">Send Announcement</span>
                    <Speaker className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}