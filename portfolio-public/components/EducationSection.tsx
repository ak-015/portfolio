import { MdSchool, MdCalendarToday, MdStar, MdVerified } from "react-icons/md";
import { FaBook, FaTrophy } from "react-icons/fa";
import { Icon } from "@/lib/icons";

type EducationEntry = {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  description?: string | null;
  status: "COMPLETED" | "IN_PROGRESS";
  gpaOrPercentage?: string | null;
};
type KeySubject = { id: string; name: string };
type Achievement = { id: string; icon: string; title: string; description: string };

function StatusBadge({ status }: { status: EducationEntry["status"] }) {
  const done = status === "COMPLETED";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
        done ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
      }`}
    >
      <MdVerified /> {done ? "Completed" : "In Progress"}
    </span>
  );
}

export default function EducationSection({
  entries,
  keySubjects,
  achievements,
}: {
  entries: EducationEntry[];
  keySubjects: KeySubject[];
  achievements: Achievement[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-panel/60 p-6 md:p-8">
      <h1 className="text-2xl font-bold text-white">Education</h1>
      <p className="mb-8 text-sm text-muted">My academic background</p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-white">
            <MdCalendarToday /> Education Timeline
          </h2>
          <div className="relative pl-4">
            <div className="absolute left-[27px] top-2 bottom-2 w-px bg-border" />
            <ul className="space-y-6">
              {entries.map((e) => (
                <li key={e.id} className="grid grid-cols-[auto_1fr] gap-4">
                  <div className="flex flex-col items-center pt-1 text-xs text-accentBlue">
                    <span>{e.startDate} – {e.endDate}</span>
                    <span className="mt-2 h-3 w-3 rounded-full bg-accentPurple ring-4 ring-accentPurple/20" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{e.degree}</h3>
                    <p className="text-sm text-accentBlue">{e.institution}</p>
                    {e.description ? (
                      <p className="mt-1 text-sm text-muted">{e.description}</p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusBadge status={e.status} />
                      {e.gpaOrPercentage ? (
                        <span className="rounded-md bg-panel2 px-2 py-1 text-xs text-white/80">
                          {e.gpaOrPercentage}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-white">
            <MdSchool /> My Education
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {entries.map((e) => (
              <div key={e.id} className="rounded-xl border border-border bg-panel2 p-4">
                <div className="mb-3 grid h-11 w-11 place-items-center rounded-lg bg-bg text-accentPurple">
                  <MdSchool size={22} />
                </div>
                <h3 className="font-semibold text-white">{e.degree}</h3>
                <p className="text-sm text-accentBlue">{e.institution}</p>
                <p className="mt-2 text-xs text-muted">
                  {e.startDate} – {e.endDate}
                </p>
                {e.gpaOrPercentage ? (
                  <p className="mt-1 text-xs text-amber-400">{e.gpaOrPercentage}</p>
                ) : null}
                <div className="mt-3">
                  <StatusBadge status={e.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-white">
            <FaBook /> Key Subjects
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {keySubjects.map((s) => (
              <span
                key={s.id}
                className="rounded-lg bg-panel2 px-3 py-2 text-sm text-white/80"
              >
                • {s.name}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-white">
            <FaTrophy /> Academic Achievements
          </h2>
          <ul className="space-y-4">
            {achievements.map((a) => (
              <li key={a.id} className="flex items-start gap-3">
                <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-panel2 text-amber-400">
                  <Icon name={a.icon} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{a.title}</p>
                  <p className="text-xs text-muted">{a.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
