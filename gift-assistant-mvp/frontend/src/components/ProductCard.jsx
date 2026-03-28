export default function ProductCard({ item }) {
  return (
    <div className="card product-card">
      <div className="product-card__top">
        <div>
          <h3>{item.name}</h3>
          <p className="muted">{item.category}</p>
        </div>
        <div className="price">{item.price} ₽</div>
      </div>

      <p>{item.description}</p>

      {item.brand && <p className="muted">Бренд: {item.brand}</p>}
      <p className="muted">Score: {item.score}</p>

      <div className="reasons">
        <strong>Почему рекомендовано:</strong>
        <ul>
          {item.reasons.map((reason, index) => (
            <li key={index}>{reason}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}