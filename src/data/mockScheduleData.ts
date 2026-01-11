// Mock Data สำหรับระบบ DSS จัดตารางสอน

export interface ScheduleCell {
  subject: string;
  code: string;
  teacher: string;
  room: string;
  color: string;
}

export interface ScheduleOption {
  id: string;
  name: string;
  score: number;
  level: "ดีมาก" | "ดี" | "ปานกลาง";
  schedule: Record<string, ScheduleCell[]>; // day -> periods
  pros: string[];
  cons: string[];
  suggestions: string[];
  scoreBreakdown: {
    noConflicts: number;
    teacherWorkload: number;
    studentWorkload: number;
    roomEfficiency: number;
    constraintRespect: number;
  };
}

export interface SubjectDetail {
  id: string; // Internal unique ID for React keys
  name: string;
  code: string;
  credits: number;
  teacher: string;
}

export interface Constraints {
  classrooms: number;
  teachers: number;
  subjectsCount: number; // Renamed from subjects to subjectsCount
  subjectList: SubjectDetail[];
  periodsPerDay: number;
  daysPerWeek: number;
  maxTeacherPeriodsPerDay: number;
  maxStudentPeriodsPerDay: number;
  avoidMorning: boolean;
  avoidLastPeriod: boolean;
  noHeavySubjectsConsecutive: boolean;
  maxTeacherConsecutivePeriods: boolean;
  optimizeRoomUsage: boolean;
}

export const days = [
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
  "เสาร์",
  "อาทิตย์",
];

const subjects = [
  {
    name: "คณิตศาสตร์",
    color: "bg-edu-blue-light text-foreground border-l-4 border-edu-blue",
  },
  {
    name: "วิทยาศาสตร์",
    color: "bg-edu-mint-light text-foreground border-l-4 border-edu-mint",
  },
  {
    name: "ภาษาอังกฤษ",
    color: "bg-edu-orange-light text-foreground border-l-4 border-edu-orange",
  },
  {
    name: "ภาษาไทย",
    color: "bg-purple-100 text-foreground border-l-4 border-purple-500",
  },
  {
    name: "สังคมศึกษา",
    color: "bg-yellow-100 text-foreground border-l-4 border-yellow-500",
  },
  {
    name: "พลศึกษา",
    color: "bg-green-100 text-foreground border-l-4 border-green-500",
  },
  {
    name: "ศิลปะ",
    color: "bg-pink-100 text-foreground border-l-4 border-pink-500",
  },
  {
    name: "คอมพิวเตอร์",
    color: "bg-cyan-100 text-foreground border-l-4 border-cyan-500",
  },
];

const teachers = [
  "อ.สมชาย",
  "อ.สมหญิง",
  "อ.วิชัย",
  "อ.พิมพ์",
  "อ.ประยุทธ์",
  "อ.สุดา",
  "อ.มานะ",
  "อ.รัตนา",
  "อ.วีระ",
  "อ.จันทร์",
];

const rooms = [
  "101",
  "102",
  "103",
  "104",
  "105",
  "201",
  "202",
  "203",
  "LAB1",
  "LAB2",
];

export const commonTeachers = teachers;
export const commonSubjectCodes = [
  "MA101",
  "MA102",
  "SC101",
  "SC102",
  "EN101",
  "EN102",
  "TH101",
  "SO101",
  "PE101",
  "AR101",
  "CO101",
  "SC201",
  "MA201",
];

function calculateScore(
  schedule: Record<string, ScheduleCell[]>,
  constraints: Constraints,
  seed: number,
  optionType: "balanced" | "teacher" | "student"
) {
  const {
    maxTeacherPeriodsPerDay,
    maxStudentPeriodsPerDay,
    avoidMorning,
    avoidLastPeriod,
  } = constraints;

  let teacherViolations = 0;
  let studentViolations = 0;
  let constraintPoints = 15;
  let totalSlots = 0;
  let usedSlots = 0;

  days.forEach((day) => {
    const daySchedule = schedule[day] || [];
    const teacherLoads: Record<string, number> = {};

    daySchedule.forEach((cell, idx) => {
      totalSlots++;
      if (cell) {
        usedSlots++;
        teacherLoads[cell.teacher] = (teacherLoads[cell.teacher] || 0) + 1;

        // Constraint: Avoid Morning (Period 1)
        if (
          avoidMorning &&
          idx === 0 &&
          (cell.subject.includes("คณิต") || cell.subject.includes("วิทย์"))
        ) {
          constraintPoints -= 2;
        }

        // Constraint: Avoid Last Period
        if (avoidLastPeriod && idx === daySchedule.length - 1) {
          constraintPoints -= 1;
        }
      }
    });

    Object.values(teacherLoads).forEach((load) => {
      if (load > maxTeacherPeriodsPerDay) teacherViolations++;
    });

    if (daySchedule.filter((c) => !!c).length > maxStudentPeriodsPerDay) {
      studentViolations++;
    }
  });

  // Base scores
  let teacherWorkload = Math.max(0, 20 - teacherViolations * 5);
  let studentWorkload = Math.max(0, 20 - studentViolations * 5);
  const noConflicts = 30;

  // Option-specific weighting to create variety
  if (optionType === "teacher") {
    teacherWorkload = Math.min(20, teacherWorkload + 2); // Slightly favor teacher schedule
    studentWorkload = Math.max(0, studentWorkload - 3);
  } else if (optionType === "student") {
    studentWorkload = Math.min(20, studentWorkload + 2); // Slightly favor student schedule
    teacherWorkload = Math.max(0, teacherWorkload - 3);
  }

  // Add small random noise based on seed to ensure they aren't exactly the same
  const noise = Math.sin(seed) * 3;
  const roomEfficiency = Math.round((usedSlots / totalSlots) * 15);
  const constraintRespect = Math.max(0, constraintPoints);

  const total =
    noConflicts +
    teacherWorkload +
    studentWorkload +
    roomEfficiency +
    constraintRespect +
    noise;

  return {
    total: Math.min(100, Math.max(0, Math.round(total))),
    breakdown: {
      noConflicts,
      teacherWorkload: Math.round(teacherWorkload),
      studentWorkload: Math.round(studentWorkload),
      roomEfficiency,
      constraintRespect,
    },
  };
}

function generateSchedule(
  constraints: Constraints,
  seed: number
): Record<string, ScheduleCell[]> {
  const schedule: Record<string, ScheduleCell[]> = {};
  const { subjectList, periodsPerDay, daysPerWeek, maxTeacherPeriodsPerDay } =
    constraints;

  // 1. Prepare pool of "slots" based on subjects and their credits
  // Each credit = 1 period per week
  const periodPool: { subject: string; code: string; teacher: string }[] = [];
  subjectList.forEach((sub) => {
    for (let i = 0; i < sub.credits; i++) {
      periodPool.push({
        subject: sub.name,
        code: sub.code,
        teacher: sub.teacher,
      });
    }
  });

  // Shuffle pool using seed-based randomization
  const shuffledPool = [...periodPool].sort((a, b) => {
    const pseudoRandom =
      Math.sin(seed + a.code.length + b.code.charCodeAt(0)) * 10000;
    return pseudoRandom - Math.floor(pseudoRandom) - 0.5;
  });

  // 2. Distribute into daily schedules
  const currentTeacherLoads: Record<string, Record<string, number>> = {}; // day -> teacher -> count

  // Use seed to skip some items in the pool to start differently
  const initialSkip = seed % Math.max(1, shuffledPool.length);
  for (let i = 0; i < initialSkip; i++) {
    const item = shuffledPool.shift();
    if (item) shuffledPool.push(item);
  }

  days.slice(0, daysPerWeek).forEach((day, dayIdx) => {
    const daySchedule: ScheduleCell[] = [];
    currentTeacherLoads[day] = {};

    for (let i = 0; i < periodsPerDay; i++) {
      if (shuffledPool.length === 0) {
        daySchedule.push(null as unknown as ScheduleCell);
        continue;
      }

      // Find a subject that doesn't violate teacher workload for today
      let foundIndex = -1;
      for (let j = 0; j < shuffledPool.length; j++) {
        const potential = shuffledPool[j];
        const teacherLoad = currentTeacherLoads[day][potential.teacher] || 0;

        if (teacherLoad < maxTeacherPeriodsPerDay) {
          foundIndex = j;
          break;
        }
      }

      if (foundIndex !== -1) {
        const item = shuffledPool.splice(foundIndex, 1)[0];

        // Track teacher load
        currentTeacherLoads[day][item.teacher] =
          (currentTeacherLoads[day][item.teacher] || 0) + 1;

        // Map subject name to a color
        const colorRef =
          subjects.find((s) => s.name === item.subject) ||
          subjects[Math.abs(seed % subjects.length)];

        daySchedule.push({
          subject: item.subject,
          code: item.code,
          teacher: item.teacher,
          room: rooms[(seed + i) % rooms.length],
          color: colorRef.color,
        });
      } else {
        daySchedule.push(null as unknown as ScheduleCell);
      }
    }
    schedule[day] = daySchedule;
  });

  return schedule;
}

export function generateMockOptions(
  constraints: Constraints
): ScheduleOption[] {
  const seeds = [10, 42, 99];
  const names = [
    "ทางเลือก A (สมดุลที่สุด)",
    "ทางเลือก B (เน้นตารางครู)",
    "ทางเลือก C (เน้นตารางนักเรียน)",
  ];
  const types: ("balanced" | "teacher" | "student")[] = [
    "balanced",
    "teacher",
    "student",
  ];

  const options: ScheduleOption[] = seeds.map((seed, index) => {
    const schedule = generateSchedule(constraints, seed);
    const scoreData = calculateScore(schedule, constraints, seed, types[index]);

    let level: "ดีมาก" | "ดี" | "ปานกลาง" = "ปานกลาง";
    if (scoreData.total >= 85) level = "ดีมาก";
    else if (scoreData.total >= 70) level = "ดี";

    return {
      id: String.fromCharCode(65 + index),
      name: names[index],
      score: scoreData.total,
      level: level,
      schedule,
      pros: [
        index === 0
          ? "กระจายรายวิชาได้สม่ำเสมอที่สุด"
          : index === 1
          ? "ครูมีเวลาเตรียมการสอนเพิ่มขึ้น"
          : "นักเรียนไม่มีวิชาหนักติดต่อกัน",
        "เคารพเงื่อนไขพื้นฐานครบถ้วน",
        `ประสิทธิภาพการใช้ห้อง ${scoreData.breakdown.roomEfficiency * 6}%`,
      ],
      cons: [
        scoreData.total < 80
          ? "มีบางเงื่อนไขที่อาจปรับปรุงได้"
          : "ไม่มีข้อจำกัดร้ายแรง",
        index === 2 ? "ครูบางท่านอาจมีคาบว่างมากเกินไป" : "",
      ].filter(Boolean),
      suggestions: [
        "สามารถนำไปใช้งานประจำปีการศึกษาได้ทันที",
        "ควรตรวจสอบความพร้อมของห้องเรียนเพิ่มเติม",
      ],
      scoreBreakdown: scoreData.breakdown,
    };
  });

  return options.sort((a, b) => b.score - a.score);
}

export const defaultConstraints: Constraints = {
  classrooms: 10,
  teachers: 15,
  subjectsCount: 8,
  subjectList: [
    {
      id: "1",
      name: "คณิตศาสตร์",
      code: "MA101",
      credits: 3,
      teacher: "อ.สมชาย",
    },
    {
      id: "2",
      name: "วิทยาศาสตร์",
      code: "SC101",
      credits: 3,
      teacher: "อ.สมหญิง",
    },
    {
      id: "3",
      name: "ภาษาอังกฤษ",
      code: "EN101",
      credits: 2,
      teacher: "อ.วิชัย",
    },
    { id: "4", name: "ภาษาไทย", code: "TH101", credits: 2, teacher: "อ.พิมพ์" },
    {
      id: "5",
      name: "สังคมศึกษา",
      code: "SO101",
      credits: 2,
      teacher: "อ.ประยุทธ์",
    },
    { id: "6", name: "พลศึกษา", code: "PE101", credits: 1, teacher: "อ.สุดา" },
    { id: "7", name: "ศิลปะ", code: "AR101", credits: 1, teacher: "อ.มานะ" },
    {
      id: "8",
      name: "คอมพิวเตอร์",
      code: "CO101",
      credits: 2,
      teacher: "อ.รัตนา",
    },
  ],
  periodsPerDay: 7,
  daysPerWeek: 5,
  maxTeacherPeriodsPerDay: 4,
  maxStudentPeriodsPerDay: 6,
  avoidMorning: false,
  avoidLastPeriod: false,
  noHeavySubjectsConsecutive: true,
  maxTeacherConsecutivePeriods: true,
  optimizeRoomUsage: true,
};

export const periodLabels = [
  "คาบ 1 (08:30-09:20)",
  "คาบ 2 (09:20-10:10)",
  "คาบ 3 (10:30-11:20)",
  "คาบ 4 (11:20-12:10)",
  "คาบ 5 (13:00-13:50)",
  "คาบ 6 (13:50-14:40)",
  "คาบ 7 (14:50-15:40)",
  "คาบ 8 (15:40-16:30)",
];
