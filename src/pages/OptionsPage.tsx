import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Constraints,
  generateMockOptions,
  ScheduleOption,
  periodLabels,
  days,
} from "@/data/mockScheduleData";
import {
  Calendar,
  ArrowLeft,
  Eye,
  Trophy,
  Medal,
  Award,
  CheckCircle2,
} from "lucide-react";

// Remove hardcoded days

const rankIcons = [
  { icon: Trophy, color: "text-yellow-500" },
  { icon: Medal, color: "text-gray-400" },
  { icon: Award, color: "text-amber-600" },
];

export default function OptionsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const constraints = (location.state?.constraints as Constraints) || null;
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  if (!constraints) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">ไม่พบข้อมูลเงื่อนไข</p>
          <Button onClick={() => navigate("/")}>กลับหน้าแรก</Button>
        </Card>
      </div>
    );
  }

  const options = generateMockOptions(constraints);

  const handleViewDetails = (option: ScheduleOption) => {
    navigate("/evaluation", { state: { option, constraints } });
  };

  const handleConfirm = () => {
    const selectedOption = options.find((o) => o.id === selectedOptionId);
    if (selectedOption) {
      navigate("/evaluation", {
        state: { option: selectedOption, constraints },
      });
    }
  };

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
          <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full">
            <span className="w-6 h-6 bg-white text-primary rounded-full flex items-center justify-center text-sm font-bold">
              2
            </span>
            <span className="font-medium">ดูทางเลือก</span>
          </div>
          <div className="w-8 h-0.5 bg-border"></div>
          <div className="flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-full">
            <span className="w-6 h-6 bg-muted-foreground/20 rounded-full flex items-center justify-center text-sm">
              3
            </span>
            <span>ประเมินผล</span>
          </div>
        </div>

        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          แก้ไขเงื่อนไข
        </Button>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            ผลลัพธ์ทางเลือกจาก AI
          </h2>
          <p className="text-muted-foreground">
            ระบบเสนอตารางเรียน 3 ทางเลือก เรียงตามคะแนนความเหมาะสม
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {options.map((option, index) => {
            const RankIcon = rankIcons[index].icon;
            return (
              <Card
                key={option.id}
                onClick={() => setSelectedOptionId(option.id)}
                className={`shadow-xl transition-all hover:shadow-2xl cursor-pointer relative ${
                  selectedOptionId === option.id
                    ? "border-2 border-primary ring-4 ring-primary/20"
                    : index === 0
                    ? "border border-primary/30"
                    : ""
                }`}
              >
                {selectedOptionId === option.id && (
                  <div className="absolute top-2 right-2 z-10">
                    <CheckCircle2 className="h-6 w-6 text-primary fill-white" />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RankIcon
                        className={`h-6 w-6 ${rankIcons[index].color}`}
                      />
                      <CardTitle className="text-xl">{option.name}</CardTitle>
                    </div>
                    {index === 0 && (
                      <Badge className="bg-accent text-accent-foreground">
                        แนะนำ
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Score */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        คะแนนความเหมาะสม
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">
                          {option.score}
                        </span>
                        <span className="text-muted-foreground">/100</span>
                      </div>
                    </div>
                    <Progress value={option.score} className="h-3" />
                    <Badge className={getLevelColor(option.level)}>
                      {option.level}
                    </Badge>
                  </div>

                  {/* Mini Schedule Preview */}
                  <div className="bg-muted/50 rounded-lg p-3">
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                      ตัวอย่างตารางเรียน
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr>
                            <th className="p-1 text-left text-muted-foreground">
                              คาบ
                            </th>
                            {days.slice(0, 3).map((day) => (
                              <th
                                key={day}
                                className="p-1 text-center text-muted-foreground"
                              >
                                {day.slice(0, 2)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[0, 1, 2].map((periodIndex) => (
                            <tr key={periodIndex}>
                              <td className="p-1 text-muted-foreground">
                                {periodIndex + 1}
                              </td>
                              {days.slice(0, 3).map((day) => {
                                const cell =
                                  option.schedule[day]?.[periodIndex];
                                return (
                                  <td key={day} className="p-1">
                                    {cell && (
                                      <div
                                        className={`px-1 py-0.5 rounded text-center truncate ${cell.color}`}
                                      >
                                        {cell.subject.slice(0, 4)}
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      แสดงบางส่วน...
                    </p>
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-1">
                    <p className="text-sm text-edu-success flex items-center gap-1">
                      ✓ {option.pros[0]}
                    </p>
                    {option.cons[0] && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        ⚠ {option.cons[0]}
                      </p>
                    )}
                  </div>

                  {/* View Details Button */}
                  <Button
                    onClick={() => handleViewDetails(option)}
                    className="w-full"
                    variant={index === 0 ? "default" : "outline"}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    ดูรายละเอียด
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Confirmation Button */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <Button
            size="lg"
            onClick={handleConfirm}
            disabled={!selectedOptionId}
            className="w-full max-w-md h-16 text-xl font-bold bg-gradient-to-r from-primary to-secondary shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            ยืนยันเลือกตารางนี้เพื่อประเมินผล
          </Button>
          <p className="text-sm text-muted-foreground italic">
            {selectedOptionId
              ? "กดปุ่มด้านบนเพื่อไปหน้าประเมินผล"
              : "กรุณาคลิกเลือกตารางที่ท่านสนใจก่อนดำเนินการต่อ"}
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-edu-mint-light rounded-lg border border-secondary/20">
          <p className="text-sm text-foreground flex items-start gap-2">
            <span className="text-secondary">🤖</span>
            <span>
              <strong>หมายเหตุ:</strong> คะแนนความเหมาะสมคำนวณจากหลายปัจจัย
              ได้แก่ การไม่มีคาบชน ภาระครู ภาระนักเรียน การใช้ห้องเรียน
              และการเคารพเงื่อนไขที่กำหนด กดดูรายละเอียดเพื่อดูเหตุผลแบบละเอียด
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
