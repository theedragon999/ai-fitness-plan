import { useMobile } from "@/hooks/use-mobile";
import { useLocation, Link } from "wouter";

export default function Sidebar() {
  const isMobile = useMobile();
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const menuItems = [
    { name: "Dashboard", path: "/", icon: "dashboard" },
    { name: "Workout Plans", path: "/workouts", icon: "fitness_center" },
    { name: "Meal Plans", path: "/meals", icon: "restaurant_menu" },
    { name: "Progress", path: "/progress", icon: "assessment" },
    { name: "History", path: "/history", icon: "history" },
    { name: "Profile", path: "/profile", icon: "account_circle" },
  ];

  const renderDesktopSidebar = () => (
    <aside className="sidebar w-full md:w-64 bg-white md:bg-transparent md:pr-4">
      <nav className="md:py-8 md:pl-0 hidden md:block">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`flex items-center px-4 py-3 rounded-md ${
                  isActive(item.path) 
                    ? "text-primary-500 bg-primary-50" 
                    : "text-neutral-400 hover:text-primary-500 hover:bg-primary-50"
                }`}
              >
                <span className="material-icons mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );

  const renderMobileNavigation = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
      <div className="flex justify-around">
        {menuItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`flex flex-col items-center py-2 ${
              isActive(item.path) ? "text-primary-500" : "text-neutral-400"
            }`}
          >
            <span className="material-icons">{item.icon}</span>
            <span className="text-xs">{item.name.length > 8 ? item.name.substring(0, 7) + '...' : item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {renderDesktopSidebar()}
      {renderMobileNavigation()}
    </>
  );
}
