import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useLogout } from "@/app/login/hooks/use-logout";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { mutate: logout } = useLogout()

  const handleLogout = () => {
    logout();
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={20}>
        <div className="p-4 flex flex-col justify-between h-screen">
          <div>
            <h1 className="text-2xl font-bold text-foreground">MCQ Star Admin</h1>
            <nav className="mt-8">
              <ul>
                <li>
                  <Link
                    href="/purposes"
                    className="block p-2 hover:bg-gray-200 rounded-md hover:text-background"
                  >
                    Purposes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="block p-2 hover:bg-gray-200 rounded-md hover:text-background"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sets"
                    className="block p-2 hover:bg-gray-200 rounded-md hover:text-background"
                  >
                    Sets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/questions"
                    className="block p-2 hover:bg-gray-200 rounded-md hover:text-background"
                  >
                    Questions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/previous-papers"
                    className="block p-2 hover:bg-gray-200 rounded-md hover:text-background"
                  >
                    Previous Papers
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={80}>
        <main className="p-8">{children}</main>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
