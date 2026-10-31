"use client";

import React, { useState } from "react";
import { Plus, Trash2, Calculator, Award, RotateCcw, BookOpen } from "lucide-react";

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

const GRADE_SCALE: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
};

export default function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "Computer Science 101", credits: 3, grade: "A" },
    { id: "2", name: "Calculus I", credits: 4, grade: "B+" },
    { id: "3", name: "Physics & Lab", credits: 4, grade: "A-" },
  ]);

  // Optional Prior Cumulative GPA
  const [priorGpa, setPriorGpa] = useState<string>("");
  const [priorCredits, setPriorCredits] = useState<string>("");

  const addCourse = () => {
    setCourses([
      ...courses,
      { id: Date.now().toString(), name: "", credits: 3, grade: "A" },
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter((course) => course.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(
      courses.map((c) => {
        if (c.id === id) {
          return { ...c, [field]: value };
        }
        return c;
      })
    );
  };

  const resetAll = () => {
    setCourses([{ id: "1", name: "", credits: 3, grade: "A" }]);
    setPriorGpa("");
    setPriorCredits("");
  };

  // Calculations
  const semesterTotalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
  const semesterTotalPoints = courses.reduce(
    (sum, c) => sum + (GRADE_SCALE[c.grade] ?? 0) * (c.credits || 0),
    0
  );
  const semesterGpa = semesterTotalCredits > 0 ? semesterTotalPoints / semesterTotalCredits : 0;

  // Cumulative calculation
  const parsedPriorGpa = parseFloat(priorGpa) || 0;
  const parsedPriorCredits = parseFloat(priorCredits) || 0;
  const cumulativeTotalCredits = semesterTotalCredits + parsedPriorCredits;
  const cumulativeTotalPoints =
    semesterTotalPoints + parsedPriorGpa * parsedPriorCredits;
  const cumulativeGpa =
    cumulativeTotalCredits > 0 ? cumulativeTotalPoints / cumulativeTotalCredits : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-semibold text-white">Semester & Cumulative GPA Calculator</h2>
        </div>
        <button
          onClick={resetAll}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Course Inputs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-400" /> Current Semester Courses
              </h3>
              <span className="text-xs text-slate-500">{courses.length} Courses</span>
            </div>

            {/* Course Table Header */}
            <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-400 px-1">
              <div className="col-span-6">Course Name</div>
              <div className="col-span-3">Credits</div>
              <div className="col-span-3">Grade</div>
            </div>

            {/* Course Rows */}
            <div className="space-y-2">
              {courses.map((course) => (
                <div key={course.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-6 flex items-center gap-2">
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors shrink-0"
                      title="Remove Course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="text"
                      placeholder="Course Name"
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={course.credits}
                      onChange={(e) =>
                        updateCourse(course.id, "credits", Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-xs text-center text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <select
                      value={course.grade}
                      onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {Object.keys(GRADE_SCALE).map((g) => (
                        <option key={g} value={g}>
                          {g} ({GRADE_SCALE[g].toFixed(1)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addCourse}
              className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium pt-2 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Course
            </button>
          </div>

          {/* Optional Prior GPA */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Prior Cumulative GPA (Optional)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Previous GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  placeholder="e.g. 3.50"
                  value={priorGpa}
                  onChange={(e) => setPriorGpa(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Previous Credits</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 45"
                  value={priorCredits}
                  onChange={(e) => setPriorCredits(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Score Summary Card */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 mb-1">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Semester GPA
              </span>
              <span className="text-4xl font-extrabold text-white font-mono">
                {semesterGpa.toFixed(2)}
              </span>
            </div>

            {priorGpa && priorCredits && (
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block">
                  Overall Cumulative GPA
                </span>
                <span className="text-3xl font-extrabold text-purple-300 font-mono">
                  {cumulativeGpa.toFixed(2)}
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800 pt-4 text-slate-400">
              <div className="bg-slate-950 p-2.5 rounded-lg">
                <div className="text-[10px] text-slate-500 uppercase">Total Credits</div>
                <div className="text-sm font-bold text-white font-mono">{semesterTotalCredits}</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg">
                <div className="text-[10px] text-slate-500 uppercase">Grade Points</div>
                <div className="text-sm font-bold text-white font-mono">{semesterTotalPoints.toFixed(1)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
