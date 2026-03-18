"use client";

import Image from "next/image";
import Link from "next/link";
import type { ScheduleEvent } from "@/types/schedule";
import { formatTime, getSourceTypeBadgeColor, getSourceTypeLabel } from "./calendar-utils";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  BellIcon,
  UsersIcon,
  UserIcon,
  FolderIcon,
  FileTextIcon,
  ExternalLinkIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  BuildingIcon,
  PercentIcon,
} from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface EventDetailPanelProps {
  event: ScheduleEvent;
  onClose?: () => void;
}

export function EventDetailPanel({ event }: EventDetailPanelProps) {
  const eventDate = new Date(event.startDate);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Get time range
  const timeRange =
    event.startTime && event.endTime
      ? `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`
      : event.startTime
        ? formatTime(event.startTime)
        : "All day";

  // Format currency
  const formatCurrency = (amount: number, currency?: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency || "BRL",
    }).format(amount);
  };

  const isExternalCalendar =
    event.sourceType === "google-calendar" || event.sourceType === "outlook-calendar";

  // Get link to source
  const getSourceLink = (): string | null => {
    switch (event.sourceType) {
      case "project":
        return `/projects/${event.sourceId}`;
      case "budget":
        return `/budgets/${event.sourceId}`;
      case "transaction":
        return `/finance`;
      case "task":
        return `/kanban`;
      default:
        return null;
    }
  };

  const sourceLink = getSourceLink();

  // Get status badge for different source types
  const renderStatusBadge = () => {
    if (event.sourceType === "project" && event.projectStatus) {
      const statusColors: Record<string, string> = {
        planning: "bg-blue-100 text-blue-700",
        "in-progress": "bg-amber-100 text-amber-700",
        completed: "bg-green-100 text-green-700",
      };
      return (
        <span
          className={cn(
            "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium",
            statusColors[event.projectStatus],
          )}
        >
          {event.projectStatus === "in-progress"
            ? "Em Progresso"
            : event.projectStatus.charAt(0).toUpperCase() + event.projectStatus.slice(1)}
        </span>
      );
    }

    if (event.sourceType === "budget" && event.budgetStatus) {
      const statusColors: Record<string, string> = {
        draft: "bg-gray-100 text-gray-700",
        sent: "bg-blue-100 text-blue-700",
        approved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
        expired: "bg-amber-100 text-amber-700",
      };
      return (
        <span
          className={cn(
            "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium",
            statusColors[event.budgetStatus],
          )}
        >
          {event.budgetStatus.charAt(0).toUpperCase() + event.budgetStatus.slice(1)}
        </span>
      );
    }

    if (event.sourceType === "task" && event.taskStatus) {
      const statusColors: Record<string, string> = {
        todo: "bg-gray-100 text-gray-700",
        "in-progress": "bg-blue-100 text-blue-700",
        review: "bg-purple-100 text-purple-700",
        done: "bg-green-100 text-green-700",
        blocked: "bg-red-100 text-red-700",
      };
      return (
        <span
          className={cn(
            "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium",
            statusColors[event.taskStatus],
          )}
        >
          {event.taskStatus === "in-progress"
            ? "Em Progresso"
            : event.taskStatus.charAt(0).toUpperCase() + event.taskStatus.slice(1)}
        </span>
      );
    }

    return null;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with source type badge and title */}
      <div className="mb-2">
        <div className="flex items-center gap-1.5 mb-1">
          <span
            className={cn(
              "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium",
              getSourceTypeBadgeColor(event.sourceType, event.transactionType),
            )}
          >
            {getSourceTypeLabel(event.sourceType)}
          </span>
          {renderStatusBadge()}
        </div>
        <h3 className="text-sm font-semibold text-foreground">{event.title}</h3>
      </div>

      {/* Event details */}
      <div className="space-y-2.5 flex-1">
        {/* Date */}
        <div className="flex items-start gap-2">
          <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-xs text-foreground">{formattedDate}</p>
          </div>
        </div>

        {/* Time - show for events and external calendar */}
        {(event.sourceType === "event" || isExternalCalendar) && (
          <>
            <div className="flex items-start gap-2">
              <ClockIcon className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
              <p className="text-xs text-foreground">{timeRange}</p>
            </div>

            {event.sourceType === "event" && (
              <div className="flex items-start gap-2">
                <BellIcon className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                <p className="text-xs text-foreground">10 min antes</p>
              </div>
            )}
          </>
        )}

        {/* External calendar account info */}
        {isExternalCalendar && event.calendarAccountEmail && (
          <div className="flex items-start gap-2">
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
            <p className="text-xs text-muted-foreground">{event.calendarAccountEmail}</p>
          </div>
        )}

        {/* Location - only for events */}
        {event.location && (
          <div className="flex items-start gap-2">
            <MapPinIcon className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
            <p className="text-xs text-foreground">{event.location}</p>
          </div>
        )}

        {/* Client - for projects, budgets, and some transactions */}
        {event.client && (
          <div className="flex items-start gap-2">
            <BuildingIcon className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
            <p className="text-xs text-foreground">{event.client}</p>
          </div>
        )}

        {/* Responsible person - for projects and tasks */}
        {event.responsible && (
          <div className="pt-1">
            <div className="flex items-center gap-1.5 mb-2">
              <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">Responsável</span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src={event.responsible.imageUrl}
                alt={event.responsible.name}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full border-2 border-card object-cover"
              />
              <span className="text-xs text-foreground">{event.responsible.name}</span>
            </div>
          </div>
        )}

        {/* Attendees - for events */}
        {event.attendees && event.attendees.length > 0 && (
          <div className="pt-1">
            <div className="flex items-center gap-1.5 mb-2">
              <UsersIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">
                {event.attendees.length} convidados
              </span>
            </div>

            {/* Attendee avatars */}
            <div className="flex items-center -space-x-1.5">
              {event.attendees.slice(0, 4).map((attendee, index) => (
                <div
                  key={attendee.id}
                  className="relative"
                  style={{ zIndex: event.attendees!.length - index }}
                >
                  <Image
                    src={attendee.imageUrl}
                    alt={attendee.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full border-2 border-card object-cover"
                  />
                </div>
              ))}
              {event.attendees.length > 4 && (
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                  <span className="text-[9px] font-medium text-muted-foreground">
                    +{event.attendees.length - 4}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team members - for projects */}
        {event.team && event.team.length > 0 && (
          <div className="pt-1">
            <div className="flex items-center gap-1.5 mb-2">
              <UsersIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">
                {event.team.length} membros da equipe
              </span>
            </div>

            {/* Team avatars */}
            <div className="flex items-center -space-x-1.5">
              {event.team.slice(0, 4).map((member, index) => (
                <div
                  key={member.id}
                  className="relative"
                  style={{ zIndex: event.team!.length - index }}
                >
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full border-2 border-card object-cover"
                  />
                </div>
              ))}
              {event.team.length > 4 && (
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                  <span className="text-[9px] font-medium text-muted-foreground">
                    +{event.team.length - 4}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Project progress - for projects */}
        {event.sourceType === "project" && event.projectProgress !== undefined && (
          <div className="flex items-start gap-2">
            <PercentIcon className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-foreground mb-1">{event.projectProgress}% completo</p>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className="bg-purple-500 h-1.5 rounded-full"
                  style={{ width: `${event.projectProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Budget amount - for budgets */}
        {event.sourceType === "budget" && event.budgetAmount !== undefined && (
          <div className="flex items-start gap-2">
            <FileTextIcon className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
            <p className="text-xs text-foreground font-medium">
              {formatCurrency(event.budgetAmount, event.budgetCurrency)}
            </p>
          </div>
        )}

        {/* Transaction amount - for transactions */}
        {event.sourceType === "transaction" && event.transactionAmount !== undefined && (
          <div className="flex items-start gap-2">
            {event.transactionType === "income" ? (
              <TrendingUpIcon className="h-3.5 w-3.5 text-emerald-500 mt-0.5" />
            ) : (
              <TrendingDownIcon className="h-3.5 w-3.5 text-red-500 mt-0.5" />
            )}
            <div>
              <p
                className={cn(
                  "text-xs font-medium",
                  event.transactionType === "income" ? "text-emerald-600" : "text-red-600",
                )}
              >
                {event.transactionType === "income" ? "+" : "-"}
                {formatCurrency(event.transactionAmount)}
              </p>
              {event.transactionCategory && (
                <p className="text-[10px] text-muted-foreground">{event.transactionCategory}</p>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <div className="pt-2 border-t border-border">
            <h4 className="text-xs font-medium text-foreground mb-1">Sobre</h4>
            <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-3">
              {event.description}
            </p>
          </div>
        )}

        {/* Project badge - when item is linked to a project */}
        {event.projectName && event.sourceType !== "project" && (
          <div className="pt-1">
            <Link href={`/projects/${event.projectId}`}>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted text-[10px] text-muted-foreground hover:bg-muted/80 cursor-pointer">
                <FolderIcon className="h-2.5 w-2.5" />
                {event.projectName}
              </span>
            </Link>
          </div>
        )}

        {/* View source link */}
        {sourceLink && (
          <div className="pt-2">
            <Link href={sourceLink}>
              <Button variant="outline" size="sm" className="w-full h-7 text-xs rounded-lg">
                <ExternalLinkIcon className="h-3 w-3 mr-1" />
                Visualizar {getSourceTypeLabel(event.sourceType)}
              </Button>
            </Link>
          </div>
        )}

        {/* External calendar link */}
        {isExternalCalendar && event.calendarEventLink && (
          <div className="pt-2">
            <a href={event.calendarEventLink} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="w-full h-7 text-xs rounded-lg">
                <ExternalLinkIcon className="h-3 w-3 mr-1" />
                Abrir no {event.sourceType === "google-calendar" ? "Google Calendar" : "Outlook"}
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
