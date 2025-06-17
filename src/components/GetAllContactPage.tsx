"use client";
import {
  Contact,
  Search,
  User,
  Key,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  UserPlus,
  UserMinus,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useContact } from "@/context/ContactContext";
import { Input } from "./ui/input";
import { useSearch } from "@/hooks/useSearch";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

type ContactProps = {
  id: string;
  username: string;
  PublicKey: string;
  createdAt: string;
  addedById: string;
};

const CONTACTS_PER_PAGE = 7;

const GetAllContactPage = () => {
  const { user } = useUser();
  const userId = user?.id;
  const router = useRouter();
  const { setSelectedContact } = useContact();
  const [allContacts, setAllContacts] = useState<ContactProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const {
    searchQuery,
    setSearchQuery,
    isSearching,
    searchResults,
    error,
    clearSearch,
  } = useSearch<ContactProps>({
    debounceDelay: 500,
    minSearchLength: 2,
    onSearch: async (query) => {
      const response = await fetch(
        `/api/users/search?query=${encodeURIComponent(
          query
        )}&page=${currentPage}&limit=${CONTACTS_PER_PAGE}`
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Search failed");
      }
      const data = await response.json();
      return Array.isArray(data.contacts) ? data.contacts : [];
    },
  });

  useEffect(() => {
    const gettingContact = async () => {
      if (!userId) return;

      try {
        const response = await fetch(
          `/api/users/allContactFetch?clerkId=${userId}`
        );
        const data = await response.json();
        setAllContacts(Array.isArray(data) ? data : []);

        if (Array.isArray(data) && data.length > 0) {
          toast({
            variant: "info",
            //@ts-expect-error - Type definition for toast title
            title: (
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-500" />
                <span>Contacts Loaded</span>
              </div>
            ),
            description: `Successfully loaded ${data.length} contact${
              data.length === 1 ? "" : "s"
            }.`,
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setAllContacts([]);
        toast({
          variant: "destructive",
          //@ts-expect-error - Type definition for toast title
          title: (
            <div className="flex items-center gap-2">
              <UserMinus className="h-5 w-5 text-red-500" />
              <span>Error Loading Contacts</span>
            </div>
          ),
          description: "Failed to load your contacts. Please try again later.",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    gettingContact();
  }, [userId, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-50"></div>
      </div>
    );
  }

  const handleContactClick = (contact: ContactProps) => {
    setSelectedContact({
      publicKey: contact.PublicKey,
      username: contact.username,
    });
    toast({
      variant: "success",
      //@ts-expect-error - Type definition for toast title
      title: (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span>Contact Selected</span>
        </div>
      ),
      description: `You've selected ${contact.username} as your contact.`,
      duration: 3000,
    });
    router.push("/");
  };

  // Ensure displayContacts is always an array
  const displayContacts = Array.isArray(
    searchQuery ? searchResults : allContacts
  )
    ? searchQuery
      ? searchResults
      : allContacts
    : [];

  // Pagination
  const totalPages = Math.ceil(displayContacts.length / CONTACTS_PER_PAGE);
  const startIndex = (currentPage - 1) * CONTACTS_PER_PAGE;
  const endIndex = startIndex + CONTACTS_PER_PAGE;
  const currentContacts = displayContacts.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (allContacts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-500 dark:text-zinc-400">
          No contacts found. Add some contacts to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
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
                "transition-all duration-200",
                "rounded-xl"
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

        <div className="space-y-3">
          {currentContacts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                No contacts found
              </div>
              {searchQuery && (
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                  Try searching with a different term
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {currentContacts.map((contact) => (
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
                    "hover:scale-[1.01] hover:shadow-md",
                    "hover:border-zinc-300/50 dark:hover:border-zinc-700/50",
                    "cursor-pointer group w-full"
                  )}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-400/10 dark:to-blue-500/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-blue-600/20 dark:group-hover:from-blue-400/20 dark:group-hover:to-blue-500/20 transition-all duration-200">
                    <Contact className="w-5 h-5 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-200" />
                  </div>
                  <div className="flex-1 min-w-0 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                      <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-200 truncate">
                        {contact.username}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-200 truncate font-mono">
                        {contact.PublicKey.slice(0, 6)}...
                        {contact.PublicKey.slice(-6)}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-200">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {searchQuery && totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetAllContactPage;
