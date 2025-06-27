import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import StatsCards from "@/components/dashboard/stats-cards";
import BroadcastForm from "@/components/dashboard/broadcast-form";
import UserManagement from "@/components/dashboard/user-management";
import CreateUserModal from "@/components/modals/create-user-modal";
import CommandsOverview from "@/components/dashboard/commands-overview";
import ModerationPanel from "@/components/dashboard/moderation-panel";
import RobloxIntegration from "@/components/dashboard/roblox-integration";
import QOTDForm from "@/components/dashboard/qotd-form";
import AnnouncementForm from "@/components/dashboard/announcement-form";
import BotConfig from "@/components/dashboard/bot-config";

type DashboardView = "dashboard" | "broadcast" | "users" | "moderation" | "roblox" | "commands" | "applications" | "qotd" | "announcement" | "config";

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [currentView, setCurrentView] = useState<DashboardView>("dashboard");
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-discord"></div>
      </div>
    );
  }

  const getPageTitle = () => {
    switch (currentView) {
      case "dashboard":
        return "Dashboard";
      case "broadcast":
        return "Broadcast Message";
      case "users":
        return "User Management";
      case "moderation":
        return "Moderation Panel";
      case "roblox":
        return "Roblox Integration";
      case "commands":
        return "Bot Commands";
      case "applications":
        return "Applications";
      case "qotd":
        return "Question of the Day";
      case "announcement":
        return "Server Announcement";
      case "config":
        return "Configuration";
      default:
        return "Dashboard";
    }
  };

  const getPageSubtitle = () => {
    switch (currentView) {
      case "dashboard":
        return "Monitor and control your Monroe Discord bot";
      case "broadcast":
        return "Send messages to all connected servers";
      case "users":
        return "Manage dashboard users and permissions";
      case "moderation":
        return "Execute moderation actions and manage server rules";
      case "roblox":
        return "Manage Roblox verification and Monroe Social Club integration";
      case "commands":
        return "Overview of all available bot commands";
      case "applications":
        return "Manage staff and security applications";
      case "qotd":
        return "Send engaging questions to the community";
      case "announcement":
        return "Post official announcements to the server";
      case "config":
        return "Configure bot settings and preferences";
      default:
        return "Monitor and control your Monroe Discord bot";
    }
  };

  return (
    <div className="min-h-screen">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <div className="ml-64">
        <Header 
          title={getPageTitle()} 
          subtitle={getPageSubtitle()} 
        />

        <main className="p-6 animate-slide-up">
          {currentView === "dashboard" && (
            <StatsCards onViewChange={setCurrentView} />
          )}
          {currentView === "broadcast" && (
            <BroadcastForm onBack={() => setCurrentView("dashboard")} />
          )}
          {currentView === "commands" && (
            <CommandsOverview />
          )}
          {currentView === "roblox" && (
            <RobloxIntegration />
          )}
          {currentView === "moderation" && (
            <ModerationPanel />
          )}
          {currentView === "qotd" && (
            <QOTDForm onBack={() => setCurrentView("dashboard")} />
          )}
          {currentView === "announcement" && (
            <AnnouncementForm onBack={() => setCurrentView("dashboard")} />
          )}
          {currentView === "config" && (
            <BotConfig onBack={() => setCurrentView("dashboard")} />
          )}
          {currentView === "applications" && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Applications Management</h2>
                <p className="text-slate-600">Application management features will be available when your Monroe bot is online and connected.</p>
              </div>
            </div>
          )}
          {currentView === "users" && (
            <UserManagement onCreateUser={() => setShowCreateUserModal(true)} />
          )}
        </main>
      </div>

      <CreateUserModal 
        open={showCreateUserModal} 
        onOpenChange={setShowCreateUserModal} 
      />
    </div>
  );
}