import { conicTabs } from "../constants/ui";

export function NavigationTabs({ activeTab, onTabChange }) {
  return (
    <nav className="mx-auto mt-6 flex max-w-7xl flex-wrap justify-center gap-3 px-4">
      {conicTabs.map((tab) => (
        <button
          key={tab.id}
          className={`rounded-full px-5 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
            activeTab === tab.id ? "bg-blue-900 text-white" : "bg-white text-blue-950 hover:bg-blue-50"
          }`}
          onClick={() => onTabChange(tab.id)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
