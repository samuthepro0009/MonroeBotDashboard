import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Gamepad2, Users, ExternalLink, Search, User, Crown } from "lucide-react";
import type { RobloxProfile } from "@shared/schema";

export default function RobloxIntegration() {
  const [searchUserId, setSearchUserId] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  const { data: robloxData, isLoading, error } = useQuery<RobloxProfile>({
    queryKey: ["/api/bot/roblox", searchUserId],
    enabled: searchActive && !!searchUserId,
  });

  const handleSearch = () => {
    if (searchUserId.trim()) {
      setSearchActive(true);
    }
  };

  const resetSearch = () => {
    setSearchUserId("");
    setSearchActive(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Roblox Integration</h2>
        <p className="text-slate-600">
          Manage Roblox account verification and Monroe Social Club group integration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-discord" />
              User Lookup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Discord User ID</label>
              <Input
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                placeholder="Enter Discord user ID"
                className="font-mono"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleSearch}
                disabled={!searchUserId.trim() || isLoading}
                className="flex-1 bg-discord hover:bg-discord-dark text-white"
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
              <Button 
                variant="outline" 
                onClick={resetSearch}
                disabled={!searchActive}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-discord" />
              Roblox Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!searchActive ? (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Search for a User</h3>
                <p className="text-slate-600">
                  Enter a Discord user ID to view their linked Roblox profile
                </p>
              </div>
            ) : isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-discord mx-auto mb-4"></div>
                <p className="text-slate-600">Loading Roblox profile...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Profile Not Found</h3>
                <p className="text-slate-600">
                  This user hasn't linked their Roblox account or doesn't exist
                </p>
              </div>
            ) : robloxData ? (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={robloxData.avatar} alt={robloxData.displayName} />
                    <AvatarFallback className="bg-discord/10 text-discord font-semibold">
                      {robloxData.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900">{robloxData.displayName}</h3>
                    <p className="text-slate-600">@{robloxData.username}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        ID: {robloxData.robloxId}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1 text-blue-600 hover:text-blue-800"
                        onClick={() => window.open(`https://www.roblox.com/users/${robloxData.robloxId}/profile`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Monroe Social Club Status */}
                <div className="border rounded-lg p-4 bg-gradient-to-r from-pink-50 to-blue-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-discord rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-900">Monroe Social Club</h4>
                  </div>
                  
                  {robloxData.groupRole ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Group Role:</span>
                        <Badge variant="default" className="bg-discord text-white">
                          <Crown className="w-3 h-3 mr-1" />
                          {robloxData.groupRole}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Rank:</span>
                        <span className="font-semibold text-slate-900">{robloxData.groupRank}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open('https://www.roblox.com/groups/35828136', '_blank')}
                        >
                          View Group
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open('https://www.roblox.com/games/80340506584377/Monroe-Social-Club', '_blank')}
                        >
                          Play Game
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-slate-600 mb-3">Not a member of Monroe Social Club</p>
                      <Button
                        size="sm"
                        className="bg-discord hover:bg-discord-dark text-white"
                        onClick={() => window.open('https://www.roblox.com/groups/35828136', '_blank')}
                      >
                        Join Group
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Monroe Social Club Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-discord" />
            Monroe Social Club - Roblox Group
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gamepad2 className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">80s Beach Experience</h3>
              <p className="text-sm text-slate-600">
                Immerse yourself in the ultimate retro beach party experience
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Exclusive Community</h3>
              <p className="text-sm text-slate-600">
                Join our growing community of 80s enthusiasts and beach lovers
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Member Perks</h3>
              <p className="text-sm text-slate-600">
                Get special roles, access to events, and exclusive content
              </p>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-6 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => window.open('https://www.roblox.com/groups/35828136', '_blank')}
            >
              View Group
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <Button
              className="bg-discord hover:bg-discord-dark text-white"
              onClick={() => window.open('https://www.roblox.com/games/80340506584377/Monroe-Social-Club', '_blank')}
            >
              Play Monroe Social Club
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}