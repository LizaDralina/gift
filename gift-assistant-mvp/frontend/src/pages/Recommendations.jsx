import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import ProductCard from "../components/ProductCard";

function parseCategories(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function Recommendations() {
  const { recipientId } = useParams();

  const [recipient, setRecipient] = useState(null);
  const [form, setForm] = useState({
    budget_min: 1000,
    budget_max: 5000,
    categories: "",
    top_k: 10
  });
  const [items, setItems] = useState([]);
  const [loadingRecipient, setLoadingRecipient] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRecipient = async () => {
      try {
        const data = await api.getRecipient(recipientId);
        setRecipient(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingRecipient(false);
      }
    };

    loadRecipient();
  }, [recipientId]);

  const onChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingRecommendations(true);

    try {
      const data = await api.generateRecommendations({
        recipient_id: Number(recipientId),
        budget_min: Number(form.budget_min),
        budget_max: Number(form.budget_max),
        categories: parseCategories(form.categories),
        top_k: Number(form.top_k)
      });
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  if (loadingRecipient) {
    return <div className="card">Загрузка...</div>;
  }

  return (
    <div className="recommendations-page">
      <div className="card">
        <div className="row between">
          <h1>Подбор подарка</h1>
          <Link to="/dashboard" className="btn btn-secondary">
            Назад
          </Link>
        </div>

        {recipient && (
          <div className="recipient-summary">
            <p><strong>Возраст:</strong> {recipient.age}</p>
            <p><strong>Повод:</strong> {recipient.occasion}</p>
            <p><strong>Отношения:</strong> {recipient.relationship_type || "—"}</p>
            <p><strong>Интересы:</strong> {recipient.interests?.join(", ") || "—"}</p>
            <p><strong>Исключения:</strong> {recipient.exclusions?.join(", ") || "—"}</p>
          </div>
        )}
      </div>

      <form className="card form-card wide" onSubmit={onSubmit}>
        <h2>Параметры подбора</h2>

        <label>Минимальный бюджет</label>
        <input
          type="number"
          name="budget_min"
          value={form.budget_min}
          onChange={onChange}
          min="0"
          required
        />

        <label>Максимальный бюджет</label>
        <input
          type="number"
          name="budget_max"
          value={form.budget_max}
          onChange={onChange}
          min="1"
          required
        />

        <label>Категории (через запятую)</label>
        <input
          type="text"
          name="categories"
          value={form.categories}
          onChange={onChange}
          placeholder="книги, техника"
        />

        <label>Количество рекомендаций</label>
        <input
          type="number"
          name="top_k"
          value={form.top_k}
          onChange={onChange}
          min="1"
          max="20"
          required
        />

        {error && <div className="error">{error}</div>}

        <button className="btn btn-primary" disabled={loadingRecommendations}>
          {loadingRecommendations ? "Подбираем..." : "Получить рекомендации"}
        </button>
      </form>

      <div className="recommendations-grid">
        {items.length === 0 ? (
          <div className="card">
            <p className="muted">Рекомендации пока не сгенерированы.</p>
          </div>
        ) : (
          items.map((item) => <ProductCard key={item.product_id} item={item} />)
        )}
      </div>
    </div>
  );
}