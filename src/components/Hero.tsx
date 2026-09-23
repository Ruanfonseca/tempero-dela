import { CATEGORIES, MIN_ORDER_QUANTITY } from "../data/menu";
import type { CategoryId, Size } from "../types";
import { formatCurrency } from "../utils/format";
import { BoxIcon, MixIcon, TruckIcon } from "./Icons";

interface HeroProps {
  activeCategory: CategoryId;
}

const SIZES: Size[] = ["350g", "400g"];

export function Hero({ activeCategory }: HeroProps) {
  const category =
    CATEGORIES.find((c) => c.id === activeCategory) ?? CATEGORIES[0];

  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div>
          <span className="hero__kicker">Congeladas • Prontas em minutos</span>
          <h1>
            Monte seu combo, <em>do seu jeito</em>.
          </h1>
          <p>
            Escolha qualquer combinação de sabores e tamanhos dos cardápios
            Fitness e Low Carb. Pedido mínimo de {MIN_ORDER_QUANTITY} marmitas e
            entrega grátis.
          </p>
          <ul className="hero__badges" aria-label="Condições do pedido">
            <li>
              <TruckIcon /> Frete grátis (Rio de Janeiro - RJ capital )
            </li>
            <li>
              <BoxIcon /> Mínimo de {MIN_ORDER_QUANTITY} marmitas
            </li>
            <li>
              <MixIcon /> Misture sabores e tamanhos
            </li>
          </ul>
          <ol className="hero__steps" aria-label="Como pedir">
            <li>
              <span>1</span> Monte seu combo
            </li>
            <li>
              <span>2</span> Informe seus dados
            </li>
            <li>
              <span>3</span> Envie pelo WhatsApp
            </li>
          </ol>
        </div>

        <div
          className="price-cards"
          aria-label={`Tabela de preços - ${category.name}`}
        >
          {SIZES.map((size) => (
            <div className="price-card" key={size}>
              <div className="price-card__size">{size}</div>
              <div className="price-card__row">
                <div className="price-card__value">
                  {formatCurrency(category.prices[size].avista)}
                </div>
                <div className="price-card__label">À vista</div>
              </div>
              <div className="price-card__row">
                <div className="price-card__value">
                  {formatCurrency(category.prices[size].credito)}
                </div>
                <div className="price-card__label">Crédito</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
