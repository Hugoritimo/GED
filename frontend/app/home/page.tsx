"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaBook, FaBullseye, FaCalendarAlt, FaClipboardCheck } from "react-icons/fa";

export default function HomeDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              New Training
              <span className="text-sm bg-red-500 text-white rounded-full px-2">3</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Leadership Skills</span>
              <div className="space-x-1">
                <Button size="sm" variant="secondary">View</Button>
                <Button size="sm">Enroll</Button>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Department Head</span>
              <div className="space-x-1">
                <Button size="sm" variant="secondary">View</Button>
                <Button size="sm">Enroll</Button>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Safety Training</span>
              <div className="space-x-1">
                <Button size="sm" variant="secondary">View</Button>
                <Button size="sm">Enroll</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Sales Team completed goals</span>
              <Button size="sm" variant="ghost">View</Button>
            </div>
            <div className="flex justify-between">
              <span>HR updated materials</span>
              <Button size="sm" variant="ghost">View</Button>
            </div>
            <div className="flex justify-between">
              <span>New sessions available</span>
              <Button size="sm" variant="ghost">Explore</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Leadership</span>
              <div className="space-x-1">
                <Button size="sm">Join</Button>
                <Button size="sm" variant="destructive">Cancel</Button>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Effective</span>
              <div className="space-x-1">
                <Button size="sm">Join</Button>
                <Button size="sm" variant="destructive">Cancel</Button>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Project</span>
              <div className="space-x-1">
                <Button size="sm">Join</Button>
                <Button size="sm" variant="destructive">Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-red-600 text-4xl">15/20</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Training Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <FaClipboardCheck className="text-blue-600 text-xl" />
            <div>
              <p className="font-medium">Progress</p>
              <p className="text-sm text-muted-foreground">10 sessions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <FaBook className="text-green-600 text-xl" />
            <div>
              <p className="font-medium">Feedback</p>
              <p className="text-sm text-muted-foreground">4.5 rating</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <FaBullseye className="text-purple-600 text-xl" />
            <div>
              <p className="font-medium">Goals</p>
              <p className="text-sm text-muted-foreground">9.0 reached</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
