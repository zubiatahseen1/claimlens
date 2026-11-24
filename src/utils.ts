export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatMonth(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
  });
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
