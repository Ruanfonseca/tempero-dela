import { MIN_ORDER_QUANTITY, WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from '../data/menu'
import { ImageCredits } from './ImageCredits'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <h4>Tempero Dela</h4>
          <p>
            Marmitas congeladas Fitness e Low Carb, feitas com carinho para facilitar a
            sua rotina.
          </p>
        </div>
        <div>
          <h4>Pedidos</h4>
          <p>
            WhatsApp:{' '}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {WHATSAPP_DISPLAY}
            </a>
          </p>
        </div>
        <div>
          <h4>Entrega e pagamento</h4>
          <p>
            Entrega grátis. Pedido mínimo de {MIN_ORDER_QUANTITY} marmitas, com qualquer
            combinação de sabores e tamanhos. Pagamento na entrega: à vista (Pix ou dinheiro) ou
            cartão de crédito.
          </p>
        </div>
        <ImageCredits />
        <p className="footer__copy">
          © {new Date().getFullYear()} Tempero Dela. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
