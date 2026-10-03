/** Only the RPC-approved public shop name is passed to this component. */
export function BrandRibbon({ name }: { name?: string | undefined }) {
  if (!name) return null;
  return (
    <aside className="brand-ribbon" aria-label={name}>
      <div className="brand-ribbon-track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div className="brand-ribbon-copy" key={copy}>
            {[0, 1, 2, 3].map((item) => (
              <span key={item}>
                {name} <span className="mx-8">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}
