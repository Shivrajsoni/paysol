"use client";
import React from "react";
import { Input } from "./ui/input";
import { useSearch } from "@/hooks/useSearch";
import { Contact, Search } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useContact } from "@/context/ContactContext";

interface ContactData {
  id: string;
  username: string;
  PublicKey: string;
  createdAt: string;
  addedById: string;
}

const SearchContacts = () => {
  const router = useRouter();
  const { setSelectedContact } = useContact();

  const {
    searchQuery,
    setSearchQuery,
    isSearching,
    searchResults,
    error,
    clearSearch,
  } = useSearch<ContactData>({
    debounceDelay: 500,
    minSearchLength: 2,
    onSearch: async (query) => {
      const response = await fetch(
        `/api/users/search?query=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Search failed");
      return response.json();
    },
  });

  const handleContactClick = (contact: ContactData) => {
    setSelectedContact({
      publicKey: contact.PublicKey,
      username: contact.username,
    });
    router.push("/");
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="space-y-6">
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            <Input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-10 pr-10",
                "bg-white/50 dark:bg-zinc-900/50",
                "border-zinc-200/50 dark:border-zinc-800/50",
                "focus:border-zinc-300/50 dark:focus:border-zinc-700/50",
                "text-zinc-900 dark:text-zinc-100",
                "placeholder:text-zinc-500 dark:placeholder:text-zinc-400",
                "transition-all duration-200"
              )}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors duration-200"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {isSearching && (
          <div className="text-sm text-zinc-500 dark:text-zinc-400 animate-pulse text-center">
            Searching contacts...
          </div>
        )}

        {error && (
          <div className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {searchResults.length > 0 ? (
            searchResults.map((contact) => (
              <Button
                key={contact.id}
                onClick={() => handleContactClick(contact)}
                size="lg"
                variant="ghost"
                className={cn(
                  "flex items-center gap-4 p-4",
                  "bg-white/50 dark:bg-zinc-900/50",
                  "rounded-xl border border-zinc-200/50 dark:border-zinc-800/50",
                  "transition-all duration-200",
                  "hover:scale-[1.02] hover:shadow-lg",
                  "hover:border-zinc-300/50 dark:hover:border-zinc-700/50",
                  "cursor-pointer group w-full"
                )}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors duration-200">
                  <Contact className="w-5 h-5 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors duration-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-200 truncate">
                    {contact.username}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-200 truncate">
                    {contact.PublicKey.slice(0, 4)}...
                    {contact.PublicKey.slice(-4)}
                  </p>
                </div>
                <div className="flex-shrink-0 text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-200">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </div>
              </Button>
            ))
          ) : !isSearching && searchQuery ? (
            <div className="text-center py-8">
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                No contacts found
              </div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                Try searching with a different term
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchContacts;
