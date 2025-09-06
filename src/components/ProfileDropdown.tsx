import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  History, 
  Settings, 
  LogOut, 
  MessageCircle, 
  Clock,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  full_name: string;
  email: string;
  avatar_url?: string;
}

interface ProfileDropdownProps {
  onSelectSession: (sessionId: string) => void;
}

export const ProfileDropdown = ({ onSelectSession }: ProfileDropdownProps) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    soundEnabled: true,
    darkMode: false,
    autoSave: true
  });
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      fetchChatHistory();
      fetchProfile();
    }
  }, [user, isOpen]);

  const fetchChatHistory = async () => {
    if (!user) return;
    
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setChatHistory(data || []);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive"
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      const profileData = data || {
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
        avatar_url: user.user_metadata?.avatar_url
      };
      
      setProfile(profileData);
      setEditedProfile(profileData);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !editedProfile) return;
    
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: editedProfile.full_name,
          email: editedProfile.email,
          avatar_url: editedProfile.avatar_url
        });

      if (error) throw error;
      
      setProfile(editedProfile);
      setIsEditingProfile(false);
      toast({
        description: "Profile updated successfully!"
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        description: "Logged out successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive"
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-12 w-12 rounded-full hover-glow">
            <Avatar className="h-12 w-12 border-2 border-white/20">
              <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
              <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                {profile?.full_name ? getInitials(profile.full_name) : <User className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 glass border border-white/20" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-white">
                {profile?.full_name || 'Anonymous User'}
              </p>
              <p className="text-xs leading-none text-white/70">
                {profile?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/20" />
          <DropdownMenuItem onClick={() => setIsOpen(true)} className="hover:bg-white/10">
            <History className="mr-2 h-4 w-4" />
            <span>Chat History</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpen(true)} className="hover:bg-white/10">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/20" />
          <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-500/20 text-red-400">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] glass border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Profile & Settings
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black/20">
              <TabsTrigger value="history" className="data-[state=active]:bg-primary">
                <History className="mr-2 h-4 w-4" />
                Chat History
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-primary">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-primary">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Chat History Tab */}
            <TabsContent value="history" className="space-y-4">
              <ScrollArea className="h-[400px] pr-4">
                {loadingHistory ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : chatHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-white/50" />
                    <p className="text-white/70">No chat history yet</p>
                    <p className="text-sm text-white/50">Start a conversation to see your history here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chatHistory.map((session) => (
                      <div
                        key={session.id}
                        className="p-4 glass border border-white/10 rounded-xl hover:border-primary/50 cursor-pointer transition-all duration-200 hover-glow"
                        onClick={() => {
                          onSelectSession(session.id);
                          setIsOpen(false);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-white truncate">
                              {session.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="h-3 w-3 text-white/50" />
                              <span className="text-xs text-white/70">
                                {new Date(session.updated_at).toLocaleDateString()} at{' '}
                                {new Date(session.updated_at).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-primary/20 text-primary">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Chat
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <div className="flex items-center space-x-4 p-4 glass border border-white/10 rounded-xl">
                <Avatar className="h-16 w-16 border-2 border-primary/50">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                  <AvatarFallback className="bg-gradient-primary text-white text-lg">
                    {profile?.full_name ? getInitials(profile.full_name) : <User className="h-8 w-8" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {profile?.full_name || 'Anonymous User'}
                  </h3>
                  <p className="text-white/70">{profile?.email}</p>
                </div>
                <Button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/10"
                >
                  {isEditingProfile ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                </Button>
              </div>

              {isEditingProfile && editedProfile && (
                <div className="space-y-4 p-4 glass border border-white/10 rounded-xl">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white">Full Name</Label>
                    <Input
                      id="fullName"
                      value={editedProfile.full_name}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        full_name: e.target.value
                      })}
                      className="bg-black/20 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        email: e.target.value
                      })}
                      className="bg-black/20 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar" className="text-white">Avatar URL</Label>
                    <Input
                      id="avatar"
                      value={editedProfile.avatar_url || ''}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        avatar_url: e.target.value
                      })}
                      className="bg-black/20 border-white/20 text-white"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="w-full bg-gradient-primary hover:shadow-elevated"
                  >
                    {savingProfile ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4 p-4 glass border border-white/10 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Email Notifications</Label>
                      <p className="text-sm text-white/70">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        emailNotifications: checked
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Sound Effects</Label>
                      <p className="text-sm text-white/70">Play sounds for interactions</p>
                    </div>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        soundEnabled: checked
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Auto-save Chats</Label>
                      <p className="text-sm text-white/70">Automatically save chat sessions</p>
                    </div>
                    <Switch
                      checked={settings.autoSave}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        autoSave: checked
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 glass border border-red-500/20 rounded-xl">
                <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};