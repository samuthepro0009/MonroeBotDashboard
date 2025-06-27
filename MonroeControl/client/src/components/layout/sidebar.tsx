import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Bot, Home, Megaphone, Users, LogOut, User, Shield, Gamepad2, Command, FileText, MessageCircle, Speaker, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: "dashboard" | "broadcast" | "users" | "moderation" | "roblox" | "commands" | "applications" | "qotd" | "announcement" | "config") => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-black shadow-xl border-r border-red-800/20">
      <div className="flex flex-col h-full">
        {/* Logo and Title */}
        <div className="p-6 border-b border-red-800/20">
          <div className="flex items-center space-x-3">
            <img 
              src="https://cdn.discordapp.com/attachments/1171556602436911264/1388089180198015019/New_Project97.png?ex=685fb64a&is=685e64ca&hm=1ad1da193da7e642bdc7a1d56da9e6e683db79af17be4967283a055e0ced634f&" 
              alt="Monroe Bot" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h1 className="text-xl font-bold text-white">Monroe Bot</h1>
              <p className="text-sm text-gray-400">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant={currentView === "dashboard" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start h-auto px-4 py-3 text-sm font-medium transition-all duration-200",
              currentView === "dashboard" 
                ? "bg-red-600 text-white hover:bg-red-700 shadow-lg transform scale-105" 
                : "text-gray-300 hover:bg-red-900/20 hover:text-red-400"
            )}
            onClick={() => onViewChange("dashboard")}
          >
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </Button>

          <Button
            variant={currentView === "broadcast" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start h-auto px-4 py-3 text-sm font-medium transition-all duration-200",
              currentView === "broadcast" 
                ? "bg-green-600 text-white hover:bg-green-700 shadow-lg transform scale-105" 
                : "text-gray-300 hover:bg-green-900/20 hover:text-green-400"
            )}
            onClick={() => onViewChange("broadcast")}
          >
            <Megaphone className="w-5 h-5 mr-3" />
            Broadcast
          </Button>

          <Button
            variant={currentView === "commands" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start h-auto px-4 py-3 text-sm font-medium transition-all duration-200",
              currentView === "commands" 
                ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg transform scale-105" 
                : "text-gray-300 hover:bg-purple-900/20 hover:text-purple-400"
            )}
            onClick={() => onViewChange("commands")}
          >
            <Command className="w-5 h-5 mr-3" />
            Commands
          </Button>

          <Button
            variant={currentView === "roblox" ? "default" : "ghost"}
            className={cn(
              "w-full justify-start h-auto px-4 py-3 text-sm font-medium transition-all duration-200",
              currentView === "roblox" 
                ? "bg-orange-600 text-white hover:bg-orange-700 shadow-lg transform scale-105" 
                : "text-gray-300 hover:bg-orange-900/20 hover:text-orange-400"
            )}
            onClick={() => onViewChange("roblox")}
          >
            <Gamepad2 className="w-5 h-5 mr-3" />
            Roblox
          </Button>

          {isAdmin && (
            <>
              <Button
                variant={currentView === "moderation" ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto px-4 py-3 text-sm font-medium transition-all duration-200",
                  currentView === "moderation" 
                    ? "bg-red-600 text-white hover:bg-red-700 shadow-lg transform scale-105" 
                    : "text-gray-300 hover:bg-red-900/20 hover:text-red-400"
                )}
                onClick={() => onViewChange("moderation")}
              >
                <Shield className="w-5 h-5 mr-3" />
                Moderation
              </Button>

              <Button
                variant={currentView === "applications" ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto px-4 py-3 text-sm font-medium transition-all duration-200",
                  currentView === "applications" 
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg transform scale-105" 
                    : "text-gray-300 hover:bg-indigo-900/20 hover:text-indigo-400"
                )}
                onClick={() => onViewChange("applications")}
              >
                <FileText className="w-5 h-5 mr-3" />
                Applications
              </Button>

              <Button
                variant={currentView === "users" ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto px-4 py-3 text-sm font-medium transition-all duration-200",
                  currentView === "users" 
                    ? "bg-teal-600 text-white hover:bg-teal-700 shadow-lg transform scale-105" 
                    : "text-gray-300 hover:bg-teal-900/20 hover:text-teal-400"
                )}
                onClick={() => onViewChange("users")}
              >
                <Users className="w-5 h-5 mr-3" />
                Manage Users
              </Button>

              <Button
                variant={currentView === "qotd" ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto px-4 py-3 text-sm font-medium transition-all duration-200",
                  currentView === "qotd" 
                    ? "bg-pink-600 text-white hover:bg-pink-700 shadow-lg transform scale-105" 
                    : "text-gray-300 hover:bg-pink-900/20 hover:text-pink-400"
                )}
                onClick={() => onViewChange("qotd")}
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                Question of the Day
              </Button>

              <Button
                variant={currentView === "announcement" ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto px-4 py-3 text-sm font-medium transition-all duration-200",
                  currentView === "announcement" 
                    ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg transform scale-105" 
                    : "text-gray-300 hover:bg-purple-900/20 hover:text-purple-400"
                )}
                onClick={() => onViewChange("announcement")}
              >
                <Speaker className="w-5 h-5 mr-3" />
                Announcements
              </Button>

              <Button
                  variant={currentView === "config" ? "default" : "ghost"}
                  className={cn(
                      "w-full justify-start h-auto px-4 py-3 text-sm font-medium transition-all duration-200",
                      currentView === "config"
                          ? "bg-gray-600 text-white hover:bg-gray-700 shadow-lg transform scale-105"
                          : "text-gray-300 hover:bg-gray-900/20 hover:text-gray-400"
                  )}
                  onClick={() => onViewChange("config")}
              >
                  <Settings className="w-5 h-5 mr-3" />
                  Configuration
              </Button>
            </>
          )}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-red-800/20">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <User className="text-white text-sm" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.username}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start h-auto px-3 py-2 text-sm text-gray-300 hover:bg-red-900/20 hover:text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}