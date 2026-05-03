export function FeatureList({ features }) {
  return (
    <div className="feature-list">
      {features.map((feature) => (
        <article className="feature-item" key={`${feature.name}-${feature.api}`}>
          <div>
            <h3>{feature.name}</h3>
            <code>{feature.api}</code>
          </div>
          <p>{feature.note}</p>
        </article>
      ))}
    </div>
  );
}
