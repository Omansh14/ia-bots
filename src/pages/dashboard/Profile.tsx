import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProfileForm } from '@/components/forms/profile/ProfileForm';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
const Profile = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    <div>
      <Card>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="flex gap-4 items-center">
              <div>
                <ArrowLeft
                  className="h-5 w-5 text-secondary font-bold cursor-pointer"
                  onClick={handleBackClick}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary">Settings</h1>
                <p className="text-sm text-gray-500">Fine tune your audit preferences</p>
              </div>
            </div>
          </div>
          <Tabs defaultValue="profile" className="w-full">
            <div className="flex gap-6">
              <TabsList className="flex flex-col h-fit w-60 bg-transparent p-2 space-y-1">
                <TabsTrigger
                  value="profile"
                  className="w-full justify-start px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-l-2 hover:bg-gray-50 rounded-md"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="addon"
                  className="w-full justify-start px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-l-2 hover:bg-gray-50 rounded-md"
                >
                  Add-On Features
                </TabsTrigger>
              </TabsList>

              <div className="flex-1">
                <TabsContent value="profile" className="mt-0">
                  <div className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="h-28 w-28">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>KC</AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer hover:bg-gray-50">
                          <Camera className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                      <ProfileForm />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="addon" className="mt-0">
                  <div className="space-y-4">
                    {/* Ai Integration */}
                    <div className="flex">
                      <div className="flex w-2/5 items-center">
                        <div className="flex gap-3 items-center">
                          <img src="/assets/sparkle.svg" className="h-8 w-8" />
                        </div>
                        <div className="ml-2">
                          <h2 className="text-lg font-semibold">AI Integration</h2>
                          <p className="text-xs">
                            Uses advanced algorithms to detect suspicious activity.
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-center items-center w-2/5">
                        <Badge className="bg-red-100 text-red-800 py-1 px-8 rounded-full text-xs">
                          Subscription Ending
                        </Badge>
                      </div>
                      <div className="flex w-1/5 justify-center items-center">
                        <Switch />
                      </div>
                    </div>
                    {/* API Integration */}
                    <div className="flex">
                      <div className="flex w-2/5 items-center">
                        <div className="flex gap-3 items-center">
                          <img src="/src/assets/apiLogo.svg" className="h-8 w-8" />
                        </div>
                        <div className="ml-2">
                          <h2 className="text-lg font-semibold">API Integration</h2>
                          <p className="text-xs">
                            Uses advanced algorithms to detect suspicious activity.
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-center items-center w-2/5">
                        <Badge className="bg-green-100 text-green-800 py-1 px-8 rounded-full text-xs">
                          Active
                        </Badge>
                      </div>
                      <div className="flex w-1/5 justify-center items-center">
                        <Switch />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
