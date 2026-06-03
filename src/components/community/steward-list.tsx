import type { Person } from "@/lib/data";
import { Avatar } from "@/components/shared/avatar";

export interface StewardListProps {
  stewards: Person[];
  onSelect: (handle: string) => void;
}

/** The community's stewards. */
export function StewardList({ stewards, onSelect }: StewardListProps) {
  return (
    <div className="steward-list">
      {stewards.map((p) => (
        <button key={p.id} className="steward" onClick={() => onSelect(p.handle)}>
          <Avatar person={p} size={40} ring />
          <div>
            <b>{p.name}</b>
            <span className="dim">{p.role}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
