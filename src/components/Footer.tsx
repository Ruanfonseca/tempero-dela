import { MIN_ORDER_QUANTITY } from "../data/menu";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <h4>Tempero Dela</h4>
          <p>
            Marmitas congeladas Fitness e Low Carb, feitas com carinho para
            facilitar a sua rotina.
          </p>
        </div>
        <div>
          <h4>Entrega e pagamento</h4>
          <p>
            Entrega grátis. Pedido mínimo de {MIN_ORDER_QUANTITY} marmitas, com
            qualquer combinação de sabores e tamanhos. Pagamento na entrega: à
            vista (Pix ou dinheiro) ou cartão de crédito.
          </p>
        </div>
        <p className="footer__copy">
          © {new Date().getFullYear()} Tempero Dela. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
