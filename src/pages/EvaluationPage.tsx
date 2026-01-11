import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Constraints,
  ScheduleOption,
  periodLabels,
  ScheduleCell,
  days,
} from "@/data/mockScheduleData";
import {
  Calendar,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Info,
  User,
  DoorOpen,
  Clock3,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Remove hardcoded days

export default function EvaluationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const option = location.state?.option as ScheduleOption | null;
  const constraints = location.state?.constraints as Constraints | null;
  const [selectedCell, setSelectedCell] = useState<{
    cell: ScheduleCell;
    periodIndex: number;
  } | null>(null);

  if (!option || !constraints) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">ไม่พบข้อมูลตาราง</p>
          <Button onClick={() => navigate("/")}>กลับหน้าแรก</Button>
        </Card>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "ดีมาก":
        return "bg-edu-success text-white";
      case "ดี":
        return "bg-primary text-white";
      case "ปานกลาง":
        return "bg-edu-warning text-white";
      default:
        return "bg-muted text-foreground";
    }
  };

  const scoreFactors = [
    { name: "ไม่มีคาบชน", score: option.scoreBreakdown.noConflicts, max: 30 },
    {
      name: "ภาระครูเหมาะสม",
      score: option.scoreBreakdown.teacherWorkload,
      max: 20,
    },
    {
      name: "ภาระนักเรียนเหมาะสม",
      score: option.scoreBreakdown.studentWorkload,
      max: 20,
    },
    {
      name: "ใช้ห้องเรียนมีประสิทธิภาพ",
      score: option.scoreBreakdown.roomEfficiency,
      max: 15,
    },
    {
      name: "เคารพเงื่อนไขที่กำหนด",
      score: option.scoreBreakdown.constraintRespect,
      max: 15,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 px-4 shadow-lg">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">
                ระบบสนับสนุนการตัดสินใจจัดตารางสอน
              </h1>
              <p className="text-primary-foreground/80 text-sm">
                Decision Support System for Class Scheduling
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto py-8 px-4">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full">
            <span className="w-6 h-6 bg-white text-secondary rounded-full flex items-center justify-center text-sm font-bold">
              ✓
            </span>
            <span className="font-medium">กำหนดเงื่อนไข</span>
          </div>
          <div className="w-8 h-0.5 bg-secondary"></div>
          <div className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full">
            <span className="w-6 h-6 bg-white text-secondary rounded-full flex items-center justify-center text-sm font-bold">
              ✓
            </span>
            <span className="font-medium">ดูทางเลือก</span>
          </div>
          <div className="w-8 h-0.5 bg-primary"></div>
          <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full">
            <span className="w-6 h-6 bg-white text-primary rounded-full flex items-center justify-center text-sm font-bold">
              3
            </span>
            <span className="font-medium">ประเมินผล</span>
          </div>
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/options", { state: { constraints } })}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          กลับไปดูทางเลือกอื่น
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Score Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Overall Score Card */}
            <Card className="shadow-xl border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="text-xl">{option.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {option.score}
                  </div>
                  <div className="text-muted-foreground mb-3">/100 คะแนน</div>
                  <Badge
                    className={`text-lg px-4 py-1 ${getLevelColor(
                      option.level
                    )}`}
                  >
                    ระดับ{option.level}
                  </Badge>
                </div>
                <Progress value={option.score} className="h-4" />
              </CardContent>
            </Card>

            {/* Score Breakdown */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">รายละเอียดคะแนน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scoreFactors.map((factor) => (
                  <div key={factor.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {factor.name}
                      </span>
                      <span className="font-medium">
                        {factor.score}/{factor.max}
                      </span>
                    </div>
                    <Progress
                      value={(factor.score / factor.max) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Schedule & Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Full Schedule */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">ตารางเรียนฉบับเต็ม</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-2 text-left font-medium">
                          คาบเรียน
                        </th>
                        {days.slice(0, constraints.daysPerWeek).map((day) => (
                          <th
                            key={day}
                            className="border p-2 text-center font-medium"
                          >
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: constraints.periodsPerDay }).map(
                        (_, periodIndex) => (
                          <tr key={periodIndex}>
                            <td className="border p-2 bg-muted/50 font-medium text-xs">
                              {periodLabels[periodIndex] ||
                                `คาบ ${periodIndex + 1}`}
                            </td>
                            {days
                              .slice(0, constraints.daysPerWeek)
                              .map((day) => {
                                const cell =
                                  option.schedule[day]?.[periodIndex];
                                return (
                                  <td key={day} className="border p-1">
                                    {cell && (
                                      <div
                                        className={`p-2 rounded cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all ${cell.color}`}
                                        onClick={() =>
                                          setSelectedCell({ cell, periodIndex })
                                        }
                                      >
                                        <div className="font-medium text-sm">
                                          {cell.subject}
                                        </div>
                                        <div className="text-xs opacity-80">
                                          {cell.teacher}
                                        </div>
                                        <div className="text-xs opacity-60">
                                          ห้อง {cell.room}
                                        </div>
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pros */}
            <Card className="shadow-lg border-l-4 border-l-edu-success">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-edu-success">
                  <CheckCircle className="h-5 w-5" />
                  ข้อดี
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {option.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-edu-success mt-1">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Cons */}
            <Card className="shadow-lg border-l-4 border-l-edu-warning">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-edu-warning">
                  <AlertCircle className="h-5 w-5" />
                  ข้อจำกัด
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {option.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-edu-warning mt-1">⚠</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card className="shadow-lg border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                  <Lightbulb className="h-5 w-5" />
                  ข้อเสนอแนะ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {option.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">💡</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-8 p-6 bg-edu-blue-light rounded-xl border border-primary/20">
          <div className="flex items-start gap-4">
            <Info className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                ข้อความสำคัญ
              </h3>
              <p className="text-foreground">
                AI ทำหน้าที่เสนอทางเลือกเพื่อสนับสนุนการตัดสินใจ
                ผู้ใช้งานยังเป็นผู้ตัดสินใจเลือกตารางสุดท้าย
                ระบบนี้ออกแบบมาเพื่อช่วยลดภาระและเพิ่มความโปร่งใสในกระบวนการจัดตารางเรียน
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/options", { state: { constraints } })}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับไปดูทางเลือกอื่น
          </Button>
          <Button
            size="lg"
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            เริ่มต้นใหม่
          </Button>
        </div>

        {/* Class Detail Modal */}
        <Dialog
          open={!!selectedCell}
          onOpenChange={(open) => !open && setSelectedCell(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <div
                  className={`w-3 h-8 rounded-full ${
                    selectedCell?.cell.color.split(" ")[0]
                  }`}
                ></div>
                รายละเอียดวิชาเรียน
              </DialogTitle>
            </DialogHeader>
            {selectedCell && (
              <div className="space-y-6 py-4">
                <div className="text-center pb-4 border-b">
                  <h2 className="text-3xl font-bold text-primary">
                    {selectedCell.cell.subject}
                  </h2>
                  <Badge variant="outline" className="mt-2">
                    รหัสวิชา: {selectedCell.cell.code}
                  </Badge>
                </div>

                <div className="grid gap-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        ครูผู้สอน
                      </p>
                      <p className="text-lg font-semibold">
                        {selectedCell.cell.teacher}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-secondary/10 p-3 rounded-full text-secondary">
                      <DoorOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        ห้องเรียน
                      </p>
                      <p className="text-lg font-semibold">
                        ห้อง {selectedCell.cell.room}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-accent/10 p-3 rounded-full text-accent">
                      <Clock3 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        เวลาเรียน
                      </p>
                      <p className="text-lg font-semibold">
                        {periodLabels[selectedCell.periodIndex]}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg flex items-start gap-2">
                  <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    วิชานี้เป็นส่วนหนึ่งของตารางเรียนทางเลือกที่ AI แนะนำ
                    โดยพิจารณาจากเงื่อนไขความเหมาะสมสูงสุด
                  </p>
                </div>
              </div>
            )}
            <div className="flex justify-center">
              <Button onClick={() => setSelectedCell(null)} className="w-full">
                ปิดหน้าต่าง
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
