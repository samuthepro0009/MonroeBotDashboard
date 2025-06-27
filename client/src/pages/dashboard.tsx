import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
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
import PageLoader from "@/components/ui/page-loader";

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <PageLoader 
          size="lg" 
          text="Loading Monroe Bot Dashboard..." 
          variant="bot" 
        />
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

  const pageVariants = {
    initial: { opacity: 0, x: 20, scale: 0.95 },
    in: { opacity: 1, x: 0, scale: 1 },
    out: { opacity: 0, x: -20, scale: 0.95 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  return (
    <motion.div 
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <div className="ml-64">
        <Header 
          title={getPageTitle()} 
          subtitle={getPageSubtitle()} 
        />

        <main className="p-6 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="w-full"
            >
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
                <motion.div 
                  className="max-w-4xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-center py-12 modern-card">
                    <motion.h2 
                      className="text-2xl font-bold mb-4"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Applications Management
                    </motion.h2>
                    <motion.p 
                      className="text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Application management features will be available when your Monroe bot is online and connected.
                    </motion.p>
                  </div>
                </motion.div>
              )}
              {currentView === "users" && (
                <UserManagement onCreateUser={() => setShowCreateUserModal(true)} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CreateUserModal 
        open={showCreateUserModal} 
        onOpenChange={setShowCreateUserModal} 
      />
    </motion.div>
  );
}