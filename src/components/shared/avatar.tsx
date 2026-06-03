import type { Person } from "@/lib/data";

export interface AvatarProps {
  person: Person;
  size?: number;
  ring?: boolean;
}

/** Initials avatar tinted by the person's hue. */
export function Avatar({ person, size = 36, ring = false }: AvatarProps) {
  const initials = person.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className="avatar"
      title={person.name}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: `linear-gradient(150deg, oklch(0.74 0.13 ${person.hue}), oklch(0.5 0.13 ${person.hue + 18}))`,
        boxShadow: ring
          ? `0 0 0 2px var(--bg), 0 0 0 3.5px oklch(0.74 0.13 ${person.hue})`
          : "none",
      }}
    >
      {initials}
    </div>
  );
}
