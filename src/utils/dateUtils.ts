
/**
 * Format a date to display in a user-friendly format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format a time to display in a user-friendly format
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format a date range to display as "Date, StartTime - EndTime"
 */
export function formatDateTimeRange(startDateString: string, endDateString: string): string {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  
  const datePart = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  
  const startTimePart = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const endTimePart = endDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return `${datePart}, ${startTimePart} - ${endTimePart}`;
}

/**
 * Group slots by date
 */
export function groupSlotsByDate(slots: any[]): Record<string, any[]> {
  return slots.reduce((acc, slot) => {
    const date = new Date(slot.startTime).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    
    if (!acc[date]) {
      acc[date] = [];
    }
    
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, any[]>);
}
