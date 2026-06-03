import type { Update } from "@/lib/data";
import { Avatar } from "@/components/shared/avatar";

/** A single "update from the watch" entry. */
export function UpdateCard({ update }: { update: Update }) {
  return (
    <article className="update">
      <div className="update-head">
        <Avatar person={update.author} size={30} />
        <b>{update.author.name}</b>
        <span className="dim">· {update.at}</span>
      </div>
      <h3 className="update-title">{update.title}</h3>
      <p className="update-body">{update.body}</p>
    </article>
  );
}
