'use client';

import { Separator } from "@/components/ui/separator";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { 
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger 
} from "@/components/ui/tabs";

export default function Login() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Tabs defaultValue="signin" className="w-full flex flex-col items-center justify-center gap-3">
        <TabsList className="bg-transparent shadow-none">
          <TabsTrigger
            value="signin"
            className="
              hover:cursor-pointer bg-transparent border-none
              data-[state=active]:shadow-none data-[state=inactive]:text-gray-400
            "
          >
            Sign In
          </TabsTrigger>
          <Separator orientation="vertical" className="mx-2" />
          <TabsTrigger
            value="signup"
            className="
              hover:cursor-pointer bg-transparent border-none
              data-[state=active]:shadow-none data-[state=inactive]:text-gray-400
            "
          >
            Sign Up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signin" className="w-full flex justify-center">
          <SignInForm />
        </TabsContent>
        <TabsContent value="signup" className="w-full flex justify-center">
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

