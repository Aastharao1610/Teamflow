"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  FolderKanban,
  Plus,
  Search,
  User,
  X,
} from "lucide-react";

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  type: "project" | "task" | "member";
};

const searchItems: SearchItem[] = [
  {
    id: "project-1",
    title: "Teamflow Backend",
    subtitle: "Project",
    type: "project",
  },
  {
    id: "project-2",
    title: "Teamflow Frontend",
    subtitle: "Project",
    type: "project",
  },
  {
    id: "project-3",
    title: "Marketing",
    subtitle: "Project",
    type: "project",
  },
  {
    id: "project-4",
    title: "Mobile App",
    subtitle: "Project",
    type: "project",
  },
  {
    id: "task-1",
    title: "Create Task API",
    subtitle: "TF-101 · Todo",
    type: "task",
  },
  {
    id: "task-2",
    title: "Implement authentication",
    subtitle: "TF-102 · Todo",
    type: "task",
  },
  {
    id: "task-3",
    title: "Workspace testing",
    subtitle: "TF-103 · In Progress",
    type: "task",
  },
  {
    id: "task-4",
    title: "Project module",
    subtitle: "TF-104 · Review",
    type: "task",
  },
  {
    id: "member-1",
    title: "Astha",
    subtitle: "Member · Engineering",
    type: "member",
  },
  {
    id: "member-2",
    title: "Sarah Wilson",
    subtitle: "Admin · Engineering",
    type: "member",
  },
  {
    id: "member-3",
    title: "Alex Johnson",
    subtitle: "Member · Engineering",
    type: "member",
  },
];

function getIcon(type: SearchItem["type"]) {
  if (type === "project") {
    return <FolderKanban size={16} />;
  }

  if (type === "task") {
    return <ClipboardList size={16} />;
  }

  return <User size={16} />;
}

function getIconBackground(type: SearchItem["type"]) {
  if (type === "project") {
    return "bg-blue-50 text-blue-600";
  }

  if (type === "task") {
    return "bg-zinc-100 text-zinc-600";
  }

  return "bg-purple-50 text-purple-600";
}

export default function Topbar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return [];
    }

    return searchItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(value) ||
          item.subtitle.toLowerCase().includes(value),
      )
      .slice(0, 7);
  }, [query]);

  useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }

      if (event.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyboard);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSearchChange(value: string) {
    setQuery(value);
    setOpen(true);
  }

  function clearSearch() {
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6">
      {/* Search */}
      <div ref={searchRef} className="relative w-full max-w-[360px]">
        <Search
          size={16}
          strokeWidth={1.8}
          className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-zinc-400"
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => handleSearchChange(event.target.value)}
          onFocus={() => {
            if (query.trim()) {
              setOpen(true);
            }
          }}
          placeholder="Search anything..."
          className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-20 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white"
        />

        {/* Keyboard shortcut / clear */}
        {query ? (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-700"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        ) : (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] text-zinc-400">
            ⌘ K
          </span>
        )}

        {/* Search dropdown */}
        {open && query.trim() && (
          <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50">
            {results.length > 0 ? (
              <>
                <div className="border-b border-zinc-100 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Search results
                  </p>
                </div>

                <div className="max-h-[360px] overflow-y-auto p-1.5">
                  {results.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setQuery(item.title);
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition hover:bg-zinc-50"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getIconBackground(
                          item.type,
                        )}`}
                      >
                        {getIcon(item.type)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-zinc-900">
                          {item.title}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-zinc-400">
                          {item.subtitle}
                        </p>
                      </div>

                      <span className="text-[10px] text-zinc-300">↵</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-zinc-100 px-3 py-2">
                  <span className="text-[10px] text-zinc-400">
                    {results.length} result
                    {results.length === 1 ? "" : "s"}
                  </span>

                  <span className="text-[10px] text-zinc-400">
                    Press Esc to close
                  </span>
                </div>
              </>
            ) : (
              /* No results */
              <div className="flex flex-col items-center px-6 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400">
                  <Search size={21} strokeWidth={1.7} />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-zinc-900">
                  No results found
                </h3>

                <p className="mt-1 max-w-[240px] text-xs leading-5 text-zinc-500">
                  We couldn't find anything matching{" "}
                  <span className="font-medium text-zinc-700">"{query}"</span>.
                </p>

                <button
                  type="button"
                  onClick={clearSearch}
                  className="mt-4 text-xs font-medium text-zinc-700 hover:text-zinc-950"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="ml-4 flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="hidden h-9 items-center gap-2 rounded-lg bg-zinc-950 px-3.5 text-sm font-medium text-white transition hover:bg-zinc-800 sm:flex"
        >
          <Plus size={15} />
          New Task
        </button>

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
          aria-label="Notifications"
        >
          <Bell size={18} strokeWidth={1.8} />

          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-zinc-900" />
        </button>

        <div className="hidden items-center border-l border-zinc-200 pl-3 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
