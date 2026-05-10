"use client";

import { useState } from "react";
import { Bell, Shield, Moon, Monitor, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";

export default function UserSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [marketingNotifs, setMarketingNotifs] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and application settings.
        </p>
      </div>

      {/* Appearance Settings */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/30">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Monitor className="w-5 h-5 text-primary" />
            Appearance
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setTheme("light")}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                theme === "light" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <Sun className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">Light</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <Moon className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">Dark</span>
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                theme === "system" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <Monitor className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">System</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Settings */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/30">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Order Updates</p>
              <p className="text-sm text-muted-foreground">Receive emails about your order status and shipping.</p>
            </div>
            <button 
              onClick={() => setEmailNotifs(!emailNotifs)}
              className={`w-11 h-6 rounded-full transition-colors relative ${emailNotifs ? 'bg-primary' : 'bg-muted'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${emailNotifs ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Marketing & Promotions</p>
              <p className="text-sm text-muted-foreground">Receive emails about new products and special deals.</p>
            </div>
            <button 
              onClick={() => setMarketingNotifs(!marketingNotifs)}
              className={`w-11 h-6 rounded-full transition-colors relative ${marketingNotifs ? 'bg-primary' : 'bg-muted'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${marketingNotifs ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/30">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Security
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
            </div>
            <button 
              onClick={() => {
                setTwoFactor(!twoFactor);
                toast.success(twoFactor ? "2FA Disabled" : "2FA Enabled for demo");
              }}
              className={`w-11 h-6 rounded-full transition-colors relative ${twoFactor ? 'bg-primary' : 'bg-muted'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${twoFactor ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
