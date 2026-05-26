"use client";

import React from "react";

import {
    Building2,
    BedDouble,
    Users,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    ArrowLeftRight,
} from "lucide-react";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { StatCard } from "@/components/shared/stat-card";

import {
    useHostels,
    useRooms,
} from "@/services/hooks/use-hostel";

import { useStudents } from "@/services/hooks/use-student";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import {
    getOccupancyPercent,
    getOccupancyColor,
    cn,
    formatDate,
} from "@/lib/utils";

import { useAuthStore } from "@/store/auth.store";

const occupancyTrend = [
    { month: "Jan", occupancy: 62 },
    { month: "Feb", occupancy: 70 },
    { month: "Mar", occupancy: 75 },
    { month: "Apr", occupancy: 68 },
    { month: "May", occupancy: 80 },
    { month: "Jun", occupancy: 85 },
    { month: "Jul", occupancy: 78 },
];

export function DashboardOverview() {
    const { user } = useAuthStore();

    const {
        data: hostelsData,
        isLoading: hostelsLoading,
    } = useHostels({
        limit: 100,
    });

    const {
        data: roomsData,
        isLoading: roomsLoading,
    } = useRooms({
        limit: 500,
    });

    const {
        data: studentsData,
        isLoading: studentsLoading,
    } = useStudents({
        limit: 1,
    });

    const hostels = hostelsData?.data || [];
    const rooms = roomsData?.data || [];

    const totalStudents =
        studentsData?.pagination?.total || 0;

    const totalBeds = rooms.reduce(
        (acc, r) => acc + r.capacity,
        0
    );

    const occupiedBeds = rooms.reduce(
        (acc, r) => acc + r.occupiedBeds,
        0
    );

    const availableBeds = totalBeds - occupiedBeds;

    const overallOccupancy = getOccupancyPercent(
        occupiedBeds,
        totalBeds
    );

    const criticalRooms = rooms.filter(
        (r) =>
            getOccupancyPercent(
                r.occupiedBeds,
                r.capacity
            ) >= 90
    );

    const availableRooms = rooms.filter(
        (r) => r.occupiedBeds < r.capacity
    ).length;

    const isLoading =
        hostelsLoading ||
        roomsLoading ||
        studentsLoading;

    const getGreeting = () => {
        const h = new Date().getHours();

        if (h < 12) return "Good morning";

        if (h < 17) return "Good afternoon";

        return "Good evening";
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="font-display text-2xl font-bold">
                        {getGreeting()},{" "}
                        {user?.name?.split(" ")[0]} 👋
                    </h2>

                    <p className="text-muted-foreground text-sm mt-0.5">
                        Here&apos;s what&apos;s happening
                        across your hostels today.
                    </p>
                </div>

                <div className="text-right text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">
                        {formatDate(new Date())}
                    </p>

                    <p className="text-xs">
                        {new Date().toLocaleTimeString(
                            "en-IN",
                            {
                                hour: "2-digit",
                                minute: "2-digit",
                            }
                        )}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Hostels"
                    value={hostels.length}
                    subtitle={`${hostels.filter(
                        (h) =>
                            h.hostelType === "male"
                    ).length} male · ${
                        hostels.filter(
                            (h) =>
                                h.hostelType ===
                                "female"
                        ).length
                    } female`}
                    icon={Building2}
                    loading={isLoading}
                />

                <StatCard
                    title="Total Beds"
                    value={totalBeds}
                    subtitle={`${availableBeds} available`}
                    icon={BedDouble}
                    loading={isLoading}
                />

                <StatCard
                    title="Active Students"
                    value={totalStudents}
                    subtitle="Currently enrolled"
                    icon={Users}
                    loading={isLoading}
                />

                <StatCard
                    title="Occupancy Rate"
                    value={`${overallOccupancy}%`}
                    subtitle={`${occupiedBeds} of ${totalBeds} beds`}
                    icon={TrendingUp}
                    loading={isLoading}
                    trend={{
                        value: 5,
                        label: "vs last month",
                    }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                            Occupancy Trend
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <ResponsiveContainer
                            width="100%"
                            height={200}
                        >
                            <AreaChart
                                data={occupancyTrend}
                                margin={{
                                    top: 5,
                                    right: 5,
                                    bottom: 0,
                                    left: -20,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="occGrad"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#f97316"
                                            stopOpacity={0.2}
                                        />

                                        <stop
                                            offset="95%"
                                            stopColor="#f97316"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="hsl(var(--border))"
                                />

                                <XAxis
                                    dataKey="month"
                                    tick={{
                                        fontSize: 11,
                                        fill: "hsl(var(--muted-foreground))",
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    tick={{
                                        fontSize: 11,
                                        fill: "hsl(var(--muted-foreground))",
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                    unit="%"
                                />

                                <Tooltip
                                    contentStyle={{
                                        background:
                                            "hsl(var(--card))",
                                        border:
                                            "1px solid hsl(var(--border))",
                                        borderRadius:
                                            "12px",
                                        fontSize:
                                            "12px",
                                    }}
                                    formatter={(v) => [
                                        `${v}%`,
                                        "Occupancy",
                                    ]}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="occupancy"
                                    stroke="#f97316"
                                    strokeWidth={2}
                                    fill="url(#occGrad)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                            Quick Overview
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Overall Occupancy
                                </span>

                                <span
                                    className={cn(
                                        "font-semibold",
                                        getOccupancyColor(
                                            overallOccupancy
                                        )
                                    )}
                                >
                                    {overallOccupancy}%
                                </span>
                            </div>

                            <Progress
                                value={
                                    overallOccupancy
                                }
                                occupancy
                                className="h-2"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />

                                    <span className="text-muted-foreground">
                                        Available rooms
                                    </span>
                                </div>

                                <Badge variant="active">
                                    {availableRooms}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-orange-500" />

                                    <span className="text-muted-foreground">
                                        Near capacity
                                    </span>
                                </div>

                                <Badge variant="pending">
                                    {
                                        criticalRooms.length
                                    }
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <ArrowLeftRight className="h-4 w-4 text-blue-500" />

                                    <span className="text-muted-foreground">
                                        Active allocs
                                    </span>
                                </div>

                                <Badge variant="default">
                                    {occupiedBeds}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {hostels.length > 0 && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                            Hostel Occupancy
                            Breakdown
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-4">
                            {isLoading
                                ? Array.from({
                                      length: 3,
                                  }).map((_, i) => (
                                      <div
                                          key={i}
                                          className="space-y-1.5"
                                      >
                                          <div className="flex justify-between">
                                              <div className="h-4 w-32 shimmer rounded" />

                                              <div className="h-4 w-16 shimmer rounded" />
                                          </div>

                                          <div className="h-2 w-full shimmer rounded-full" />
                                      </div>
                                  ))
                                : hostels.map(
                                      (hostel) => {
                                          const hostelRooms =
                                              rooms.filter(
                                                  (
                                                      r
                                                  ) =>
                                                      (typeof r.hostel ===
                                                      "string"
                                                          ? r.hostel
                                                          : r
                                                                .hostel
                                                                ._id) ===
                                                      hostel._id
                                              );

                                          const cap =
                                              hostelRooms.reduce(
                                                  (
                                                      a,
                                                      r
                                                  ) =>
                                                      a +
                                                      r.capacity,
                                                  0
                                              );

                                          const occ =
                                              hostelRooms.reduce(
                                                  (
                                                      a,
                                                      r
                                                  ) =>
                                                      a +
                                                      r.occupiedBeds,
                                                  0
                                              );

                                          const pct =
                                              getOccupancyPercent(
                                                  occ,
                                                  cap
                                              );

                                          return (
                                              <div
                                                  key={
                                                      hostel._id
                                                  }
                                                  className="space-y-1.5"
                                              >
                                                  <div className="flex items-center justify-between text-sm">
                                                      <div className="flex items-center gap-2">
                                                          <span className="font-medium">
                                                              {
                                                                  hostel.name
                                                              }
                                                          </span>

                                                          <Badge
                                                              variant={
                                                                  hostel.hostelType ===
                                                                  "male"
                                                                      ? "male"
                                                                      : "female"
                                                              }
                                                          >
                                                              {
                                                                  hostel.hostelType
                                                              }
                                                          </Badge>
                                                      </div>

                                                      <span
                                                          className={cn(
                                                              "font-semibold text-xs",
                                                              getOccupancyColor(
                                                                  pct
                                                              )
                                                          )}
                                                      >
                                                          {occ}/
                                                          {
                                                              cap
                                                          }{" "}
                                                          ·{" "}
                                                          {
                                                              pct
                                                          }
                                                          %
                                                      </span>
                                                  </div>

                                                  <Progress
                                                      value={
                                                          pct
                                                      }
                                                      occupancy
                                                      className="h-2"
                                                  />
                                              </div>
                                          );
                                      }
                                  )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}