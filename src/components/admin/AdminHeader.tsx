import { Menu } from "lucide-react";

const AdminHeader = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <header className="sticky top-0 z-40 bg-background border-b px-4 h-14 flex items-center justify-between lg:hidden">
      <div>
        <p className="font-semibold text-sm">Dr. Ramachandran</p>
        <p className="text-xs text-muted-foreground">Management Panel</p>
      </div>

      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-muted"
      >
        <Menu className="w-5 h-5" />
      </button>
    </header>
  );
};

export default AdminHeader;
