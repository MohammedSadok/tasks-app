// import { authOptions } from "@/lib/auth";
// import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/header";
import { PostCreateButton } from "@/components/post-create-button";
import { DashboardShell } from "@/components/shell";
import TaskForm from "@/components/task-form";
// import PostsList from "@/components/posts-list";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  // const user = await getCurrentUser();

  // if (!user) {
  //   redirect(authOptions?.pages?.signIn || "/login");
  // }
  return (
    <DashboardShell>
      <DashboardHeader heading="Posts" text="Create and manage posts.">
        <PostCreateButton />
      </DashboardHeader>
      {/* <PostsList userId={user.id}/> */}
    </DashboardShell>
  );
}
