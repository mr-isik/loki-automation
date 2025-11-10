import { AppHeader } from "@/components/shared/AppHeader";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WorkspaceHandler } from "@/features/workspace/components/WorkspaceHandler";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <WorkspaceHandler>
        <main className="flex-1 w-full flex flex-col relative">
          <AppHeader />
          <div className="flex-1 overflow-auto pt-16">{children}</div>
        </main>
      </WorkspaceHandler>
    </SidebarProvider>
  );
};

export default layout;
