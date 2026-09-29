import { listDemoStudentItems } from "./demo-students";
import type { StudentListItem } from "@/lib/models";

export function listDemoStudents(): StudentListItem[] {
  return listDemoStudentItems();
}
