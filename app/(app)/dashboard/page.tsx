import { GreetingHeader } from '@/components/dashboard/GreetingHeader'
import { TasksPreview } from '@/components/dashboard/TasksPreview'
import { AttendanceRiskCards } from '@/components/dashboard/AttendanceRiskCards'
import { TimelinePreview } from '@/components/dashboard/TimelinePreview'

export default function DashboardPage() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <GreetingHeader />

      <div className="grid gap-8">
        <TasksPreview />
        <AttendanceRiskCards />
        <TimelinePreview />
      </div>
    </div>
  )
}
